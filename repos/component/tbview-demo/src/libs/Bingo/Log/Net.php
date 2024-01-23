<?php
class Bingo_Log_Net
{
    /**
     *     
    'path' => 'stat-log',
    'filename' => 'ui',
    'ip' => '10.81.47.216',
    'port' => 9898,
    'level' => 16, 
    'compress' => 0,
    'auth' => 'tieba',
    'connectlife' => -1, 
    'read_timeout' => 500,
    'connect_timeout' => 10, 
     * @var unknown_type
     */
    
    protected $_arrConfig  = array();
    
    protected $_intWriteMs = 500;//Ð´³¬Ê±Ê±¼ä
    
    protected $_resConn    = NULL;
    
    public function __construct($arrConfig=array())
    {
        if (! get_loaded_extensions('netcomlog')) {
            throw new Exception('The netcomlog extension must be loaded for using Bingo_Log_Net!');
        }
        if (! empty($arrConfig)) {
            $this->setOptions($arrConfig);
        }
    }
    
    public function setOptions($arrConfig)
    {
        $this->_arrConfig = (array) $arrConfig;
        if (isset($arrConfig['write_timeout'])) {
            $this->_intWriteMs = intval($arrConfig['write_timeout']);
        }
    }
    
    public function connect()
    {
        if (is_null($this->_resConn)) {
            $this->_resConn = netcomlog_open($this->_arrConfig, $this->_intWriteMs);
            if (! $this->_resConn) {
                trigger_error('netcomlog_open error!', E_USER_WARNING);
		$this->_resConn = NULL;
                return false;
            }
        }
        return true;
    }
    
    public function check($intLevel)
    {
        return true;
    }
	
	public function log($intLogLevel, $strLog, $strFile='', $intLine='', $intLogId='')
	{
	    return netcomlog_write($intLogLevel, "%s", $strLog);
	}
	
    public function getErrno()
	{
		return netcomlog_errno();
	}
	
	public function getErrmsg()
	{
		if (netcomlog_errno() != 0) {
			return netcomlog_error_message();
		}
		return '';
	}
	
	public function flush()
	{
	    netcomlog_flush();
	}
	
	public function __destruct()
	{
	    if (! is_null($this->_resConn) && ($this->_arrConfig['connectlife'] != -1) ) {
	        netcomlog_close($this->_arrConfig['ip'], $this->_arrConfig['port'], $this->_arrConfig['path'],
				$this->_arrConfig['filename'], $this->_arrConfig['auth']);
	    }
	}
}
