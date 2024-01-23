<?php 
/**
 * Log ,write file
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-26
 * @package Bingo
 *
 */
require_once 'Bingo/Log.php';
class Bingo_Log_File
{
	protected $_strNormalFile = '';
	
	protected $_strWarningFile = '';
	
	protected $_intOutputLevel = 0xFF;
	
	protected $_strSep = ' ';
	
	protected $_strSepOfLine = "\n";
	
	protected $_arrLogData = array(
		'normal'	=> '',
		'warning'	=> '',
	);

        protected $_strModule = '';

	public function __construct($strFilePath, $intOutputLevel=0xFF, $_strModule='')
	{
		$this->_setFilePath($strFilePath);
		$this->_intOutputLevel = intval($intOutputLevel);
                $this->_strModule = $_strModule;
	}	
	
	public function setOptions($arrConfig)
	{
		if (isset($arrConfig['sep'])) {
			$this->_strSep = $arrConfig['sep'];
		}
		if (isset($arrConfig['sepOfLine'])) {
			$this->_strSepOfLine = $arrConfig['sepOfLine'];
		}
		return $this;
	}
	
	public function check($intLogLevel)
	{
		return (bool)($intLogLevel & $this->_intOutputLevel);
	}
	
	public function log($intLogLevel, $strLog, $strFile, $intLine, $intLogId, $extra)
	{
		if (! ($intLogLevel & $this->_intOutputLevel) ) {
			//不需要记录
			return $this;
		}
		$strLogType = 'NOTICE';
		if (isset(Bingo_Log::$arrLogNames[$intLogLevel])) {
			$strLogType = Bingo_Log::$arrLogNames[$intLogLevel];
		}
		$str = $strLogType . $this->_strSep . $intLogId . $this->_strSep . 
				date('Ymd H:i:s') . $this->_strSep . $strFile . ':' . $intLine . $this->_strSep .
                                $strLog . $this->_strSepOfLine;
                // for ub_log & MyLog compatible
                if(isset($extra['compat']) && $extra['compat']){
                    $level_name_map = array(
                        'DEBUG' => 'DEBUG',
                        'NOTICE' => 'NOTIC',
                        'WARNING' => 'WARNI',
                        'FATAL' => 'ERROR',
                    );
                    $strLogType = $level_name_map[$strLogType];
                    $errno = isset($extra['errno']) ? $extra['errno'] : 0;
                    $arrTimes = isset($extra['arrTimes']) ? $extra['arrTimes'] : array();
                    $arrArgs = isset($extra['arrArgs']) ? $extra['arrArgs'] : array();
                    $timesStr = '';
                    if (is_array($arrTimes) && ($cnt = count($arrTimes)) > 0) {                                                      
                        $i = 0; 
                        foreach ($arrTimes as $key => $value) {                                                                  
                            if ($i == $cnt - 1) {
                                $timesStr .= $key.':'.$value;                                                            
                            } else {
                                $timesStr .= $key.':'.$value.$this->paramSep;                                            
                            }
                            $i ++;                                                                                           
                        }                                                                                                        
                    }                                                                                                                

                    $argsStr = '';
                    if (is_array($arrArgs) && ($cnt = count($arrArgs)) > 0) {                                                        
                        $i = 0; 
                        foreach ($arrArgs as $key => $value) {                                                                   
                            if ($i == $cnt - 1) {   
                                $argsStr .= $key.':'.$value;                                                             
                            } else {
                                $argsStr .= $key.':'.$value.$this->paramSep;                                             
                            }
                            $i ++;                                                                                           
                        }                                                                                                        
                    } 
                    $str = $strLogType . $this->_strSep . $intLogId . $this->_strSep . 
                        date('Ymd H:i:s') . $this->_strSep . $errno . $this->_strSep  . $strFile . ':' . $intLine . $this->_strSep .
                        $timesStr . $this->_strSep . $argsStr . $this->_strSep . $strLog . $this->_strSepOfLine;
                }
		if ( ($intLogLevel & Bingo_Log::LOG_WARNING) || ($intLogLevel & Bingo_Log::LOG_FATAL)) {
			$this->_arrLogData['warning'] .= $str;
		} else {
			$this->_arrLogData['normal'] .= $str;
		}
		return $this;
	}
	/**
	 * 把数据写入文件
	 */
	public function flush()
	{
		if (! empty($this->_arrLogData['warning'])) {
			file_put_contents($this->_strWarningFile, $this->_arrLogData['warning'], FILE_APPEND);
		}
		if (! empty($this->_arrLogData['normal'])) {
			file_put_contents($this->_strNormalFile, $this->_arrLogData['normal'], FILE_APPEND);
		}
		$this->clean();
		return $this;
	}
	
	public function clean()
	{
		$this->_arrLogData['warning'] = '';
		$this->_arrLogData['normal'] = '';
		return $this;
	}
	
	public function __destruct()
	{
		$this->flush();
	}
	
	protected function _setFilePath($strFilePath)
	{
		$strDir = dirname($strFilePath);
		if (! is_dir($strDir)) {
			@mkdir($strDir, 0755, true);
		}
		$this->_strNormalFile = $strFilePath;
		$this->_strWarningFile = $strFilePath . '.wf';
	}

        // 兼容直接调用 Log 对象方法的使用方法
        public function __call($name,$arg){
            $allow_method = array('debug','trace','notice','warning','fatal');
            if('error' == $name){
                $name = 'fatal';
            }
            if(in_array($name,$allow_method)){
                $str = $arg[0];
                $file = $arg[1];
                $line = $arg[2];
                $extra = array(
                        'errno' => isset($arg[3]) ? $arg[3] : null,
                        'arrArgs' => isset($arg[4]) ? $arg[4] : null,
                        'arrTimes' => isset($arg[5]) ? $arg[5] : null,
                        'compat' => true,
                        );
                Bingo_Log::$name($str,$this->_strModule,$file,$line,0,$extra);
            }
        }
}
