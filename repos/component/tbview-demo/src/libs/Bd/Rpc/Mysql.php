<?php
/**
 * 基于Bd_DB库类，提供负载均衡的支持
 * 试用demo
 * require_once 'Bd/Rpc/Mysql.php';
 * $objRpc = new Bd_Rpc_Mysql('test', array(
 * 		array('host'=>'127.0.0.1', 'port'=>3306)
 * ));
 * $objRpc->setOptions(array(
 * 		'database' => 'test',
 * 		'user'	   => 'root',
 * 		'pass'	   => 'root',
 * 		'connect_timeout' => 1000,
 * ));
 * $objMysql = $objRpc->getDb();
 * if (! $objRpc->isConnected) {
 * 		//没有连接，或者连接失败
 * }
 * $arrRet = $objMysql -> query('select * from aaaa');
 * 
 * @author xuliqiang@baidu.com
 */
require_once 'Bd/Rpc/Abstract.php';
require_once 'Bingo/Timer.php';
class Bd_Rpc_Mysql extends Bd_Rpc_Abstract
{
    protected $_intConnectTimeout = 1000;
    
    protected $_arrServers        = array();
    
    protected $_strUser           = 'root';
    
    protected $_strPass           = '';
    
    protected $_strDatabase       = 'test';
    
    protected $_strSocket         = NULL;
    
    protected $_intMysqlFlag      = 0;
    
    protected $_objDb             = NULL;
    /**
     * 负载均衡算法
     * @var Bingo_Balance_Abstrack
     */
    protected $_objBalance        = null;
    /**
     * 是否已经连接上数据库
     * @var bool
     */
    protected $_bolConnected      = false;
    
    public function __construct($strServerName, $arrServers = array(), $enableProfiling=false)
    {
        $this->_strServerName = (string)$strServerName;
        if (! empty($arrServers)) {
            $this->setServers($arrServers);
        }
        //require_once 'Bd/DB.php';
        $this->_objDb = new Bd_DB($enableProfiling);
    }
    public function setOptions($arrConfig)
    {
        if (isset($arrConfig['socket'])) {
            $this->_strSocket = (string) $arrConfig['socket'];
        }
        if (isset($arrConfig['mysql_flag'])) {
            $this->_intMysqlFlag = intval($arrConfig['mysql_flag']);
        }
        if (isset($arrConfig['user'])) {
            $this->_strUser = (string) $arrConfig['user'];
        }
        if (isset($arrConfig['pass'])) {
            $this->_strPass = (string) $arrConfig['pass'];
        }
        if (isset($arrConfig['database'])) {
            $this->_strDatabase = (string) $arrConfig['database'];
        }
        if (isset($arrConfig['connect_timeout'])) {
            $this->setConnectTimeout($arrConfig['connect_timeout']);
        }
        if (isset($arrConfig['balance'])) {
            $this->setBalance($arrConfig['balance']);
        }
        return $this;
    }
    public function setUser($strUser, $strPass) 
    {
        $this->_strUser = (string) $strUser;
        $this->_strPass = (string) $strPass;
        return $this;
    }
    public function setDatabase($strDb) 
    {
        $this->_strDatabase = (string) $strDb;
        return $this;
    }
    public function setConnectTimeout($intMs)
    {
        $this->_intConnectTimeout = intval($intMs);
        $this->_objDb->setConnectTimeOut(ceil($this->_intConnectTimeout/1000));
        return $this;
    }
    public function setBalance($objBalance)
    {
        if (is_object($objBalance) && is_subclass_of($objBalance, 'Bingo_Balance_Abstract')) {
            $this->_objBalance = $objBalance;
        } else {
            trigger_error('Bd_Rpc_Mysql::setBalance error!', E_USER_WARNING);
        }
        return $this;
    }
    /**
     * 设置服务器信息
     * @param array $arrServers
     */
    public function setServers($arrServers)
    {
        $arrServers    = (array)$arrServers;
        if (empty($arrServers) ||!isset($arrServers[0]['host'])) {
            trigger_error('Bd_Rpc_Mysql::setServers error! servers invalid!');
            return false;
        }
        $this->_arrServers = $arrServers;
    }
    /**
     * 负载均衡算法会调用该函数
     * @param array $arrServer
     */
    public function realConnect($arrServer)
    {
        if (! isset($arrServer['host'])) return false;
        $intPort = (isset($arrServer['port']))?intval($arrServer['port']):3306;
        $bolRet = $this->_objDb->connect($arrServer['host'], $this->_strUser, $this->_strPass,
            $this->_strDatabase, $intPort, $this->_strSocket, $this->_intMysqlFlag);
        if (! $bolRet) {
            //log
            Bingo_Log::warning('connect to '.$this->_strServerName.' error!' . 
                $arrServer['host'].':'.$intPort, $this->_strLogModule);
        }
        return $bolRet;
    }
    
    protected function _getBalance()
    {
        if (is_null($this->_objBalance)) {
            require_once 'Bingo/Balance/RoundRobin.php';
            $this->_objBalance = new Bingo_Balance_RoundRobin();
        }
        return $this->_objBalance;
    }
    /**
     * 负载均衡连接
     */
	public function connect($intConnectRetry = 0)
    {   
        if (!$this->_bolConnected) {
            if ($intConnectRetry <= 0 ) $intConnectRetry = count($this->_arrServers);
            $intStart = gettimeofday();
            $objBalance = $this->_getBalance();
            $objBalance->setServers($this, $this->_arrServers);
            ++ $intConnectRetry;
            while (-- $intConnectRetry) {
                $this->_bolConnected = $objBalance->getConnection();
                if ($this->_bolConnected) {
                    $objBalance->connectSuccess();
                    break;
                } else {
                    Bingo_Log::warning('connect to '. $this->_strServerName . ' fail! retry=' . $intConnectRetry);
                    $objBalance->connectFailure();
                }   
            }   
            $intEnd = gettimeofday();
            $intTime = Bingo_Timer::getUtime($intStart, $intEnd);
            Bingo_Log::debug('connect to '.$this->_strServerName.' time ' . 
                $intTime . ' us', $this->_strLogModule); 
        }   
        return $this->_objDb;
    }   
	/**
	 * 获取一个连接对象，注意返回的对象有可能是连接失败的
	 */
	public function getDb()
	{
	    return $this->connect();
	}
	/**
	 * 判定当前连接是否已经连接上
	 */
	public function isConnected()
	{
	    if (! $this->_bolConnected) {
	        $this->connect();
	    }
	    return $this->_bolConnected;
	}
	
	public function __destruct()
	{
	    if (!is_null($this->_objDb) && method_exists($this->_objDb, 'close')) {
	        $this->_objDb->close();
	    }
	}
	
	public function call($arrInput, $intRetry = 1)
	{
	    //nothing TODO
	}
}