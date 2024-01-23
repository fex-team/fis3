<?php
/**
 * http rpc
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package baidu
 * @since 2010-06-01
 */
require_once 'Bd/Rpc/Abstract.php';
require_once 'Bingo/Http/Request.php';
require_once 'Bingo/Timer.php';
class Bd_Rpc_Http extends Bd_Rpc_Abstract
{
    protected $_resConn = null;
    
    protected $_intConnectTimeout = 200;
    
    protected $_intTimeout = 500;
    
    protected $_objBalance = null;
    
    protected $_arrServers = array();
    
    protected $_arrNowServer = array();
    
    public function __construct($strServerName, $arrServers=array())
    {
        if (! function_exists('curl_init')) {
            throw new Exception('curl extension must be loaded for using Bd_Rpc_Http!');
        }
        $this->_strServerName = $strServerName;
        $this->_arrServers = $arrServers;
        //$this->_init();
    }
    /**
     * 设置选项
     * @param array $arrConfig
     * {
     * 		connect_timeout   连接超时，ms级别
     * 		read_timeout	    交互擦后是，ms级别
     * 		balance           负载均衡算法。默认轮询
     * }
     */
    public function setOptions($arrConfig)
    {
        if (isset($arrConfig['connect_timeout'])) 
            $this->_intConnectTimeout = intval($arrConfig['connect_timeout']);
        if (isset($arrConfig['read_timeout'])) 
            $this->_intTimeout = intval($arrConfig['read_timeout']);
        if (isset($arrConfig['balance'])) {
            $objBalance = $arrConfig['balance'];
            if (is_object($objBalance) && is_subclass_of($objBalance, 'Bingo_Balance_Abstract')) {
                $this->_objBalance = $objBalance;
            }
        }
    }
    /**
     * 进行HTTP交互
     * @param array $arrInput
     * {
     * 		URL : string
     * 		method : POST / GET
     * 		post_vars : array()
     * 		curl_opts : array()
     * 		cookie : array()
     * }
     */
    public function call($arrInput, $intRetry=1)
    {
        $this->_init();
        if (isset($arrInput['curl_opts'])) {
            curl_setopt_array($this->_resConn, $arrInput['curl_opts']);
        }
        if (isset($arrInput['cookie']) && !empty($arrInput['cookie']) ) {
            $strCookie = ''; 
            foreach( $arrInput['cookie'] as $key => $value ) {
                $strCookie .= sprintf('%s=%s;', $key, $value);
            }
            curl_setopt($this->_resConn, CURLOPT_COOKIE, $strCookie);
        }
        if (isset($arrInput['method']) && (strtolower($arrInput['method']) == 'post') ) {
            curl_setopt($this->_resConn, CURLOPT_POST, 1);
            if(isset($arrInput['post_vars'])) {
                curl_setopt($this->_resConn, CURLOPT_POSTFIELDS, $arrInput['post_vars']);
            }
        }
        $strUrl = '/index.html';
        if (isset($arrInput['url'])) $strUrl = $arrInput['url'];
        $arrOutput = false;
        while ($intRetry -- ) {
        	$this->connect();
        	$arrNowServer = $this->_arrNowServer;
        	if (! $arrNowServer) {
        	    //connect error, 
        	    Bingo_Log::warning('get connect server failure!server='.$this->_strServerName);
        	    continue;
        	}        	
        	if (isset($arrNowServer['port'])) {
        	    curl_setopt($this->_resConn, CURLOPT_URL, 
        	        $arrNowServer['host'] . ':' . $arrNowServer['port'] . $strUrl);
        	    curl_setopt($this->_resConn, CURLOPT_PORT, intval($arrNowServer['port']));
        	} else {
        	    curl_setopt($this->_resConn, CURLOPT_URL, $arrNowServer['host'] . $strUrl);
        	}
        	$intStart = gettimeofday();
        	$arrOutput = curl_exec($this->_resConn);
        	$intEnd = gettimeofday();
		    $intTime = Bingo_Timer::getUtime($intStart, $intEnd);
		    Bingo_Log::debug('http call '.$this->_strServerName.', time ' . 
		        $intTime . ' us', $this->_strLogModule); 
        	$intErrno  = curl_errno($this->_resConn);
        	if ($arrOutput === false && $intErrno != 0) {
        	    Bingo_Log::warning(sprintf('http request %s:%s failed,errno[%d],errmsg[%s]',
        	        $this->_strServerName, $strUrl, $intErrno, curl_error($this->_resConn)), 
        	        $this->_strLogModule);
        	} else {
        	    break;
        	}
        }
        if ($arrOutput === false) {
            return curl_errno($this->_resConn);
        } 
        return $arrOutput;
    }
    
    public function getConnectInfo(){
        if (!is_null($this->_resConn)) {
            return curl_getinfo($this->_resConn);
        }
        return array();
    }
    public function getErrno()
    {
        if (!is_null($this->_resConn)) {
            return curl_errno($this->_resConn);
        }
        return 0;
    }
    
    public function getError()
    {
        if (!is_null($this->_resConn)) {
            return curl_error($this->_resConn);
        }
        return '';
    }
    
    protected function _init()
    {
        $this->_resConn = curl_init();
        $strUserAgent = Bingo_Http_Request::getServer('HTTP_USER_AGENT');
        if (! empty($strUserAgent)) {
            curl_setopt($this->_resConn, CURLOPT_USERAGENT, $strUserAgent);
        }
        curl_setopt($this->_resConn, CURLOPT_HEADER, 0);
        curl_setopt($this->_resConn, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($this->_resConn, CURLOPT_RETURNTRANSFER, 1);
        if (defined('CURLOPT_CONNECTTIMEOUT_MS')) {
            //支持ms超时
            curl_setopt($this->_resConn, CURLOPT_NOSIGNAL, 1);
            if (! is_null($this->_intConnectTimeout)) {
                curl_setopt($this->_resConn, CURLOPT_CONNECTTIMEOUT_MS, $this->_intConnectTimeout);
            }
            if (! is_null($this->_intTimeout)) {
                curl_setopt($this->_resConn, CURLOPT_TIMEOUT_MS, $this->_intTimeout);
            } 
        } else {
            //不支持ms超时
            if (! is_null($this->_intConnectTimeout)) {
                $intTimeout = ceil($this->_intConnectTimeout / 1000);
                if ($intTimeout <1) $intTimeout = 1;
                curl_setopt($this->_resConn, CURLOPT_CONNECTTIMEOUT, $intTimeout);
            }
            if (! is_null($this->_intTimeout)) {
                $intTimeout = ceil($this->_intTimeout / 1000);
                if ($intTimeout <1) $intTimeout = 1;
                curl_setopt($this->_resConn, CURLOPT_TIMEOUT, $intTimeout);
            }
        }
    }
    
    protected function _getBalance()
    {
        if (is_null($this->_objBalance)) {
            require_once 'Bingo/Balance/RoundRobin.php';
            $this->_objBalance = new Bingo_Balance_RoundRobin();
        }
        return $this->_objBalance;
    }
    
    public function realConnect($arrServer)
	{
	    $this->_arrNowServer = $arrServer;
	    return true;
	}	
	
	public function connect()
	{
	    $objBalance = $this->_getBalance();
		$objBalance->setServers($this, $this->_arrServers);
		return $objBalance->getConnection();
	}
	
	public function __destruct()
	{
	    if (! is_null($this->_resConn)) {
	        curl_close($this->_resConn);
	    }
	}
}