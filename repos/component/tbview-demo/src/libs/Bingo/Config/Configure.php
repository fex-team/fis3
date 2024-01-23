<?php 
/**
 * configure配置文件的解析类。基于comconfig extension
 * @author xuliqiang@baidu.com
 * @since 2009-10-21
 * @package config
 *
 */
require_once 'Bingo/Config/Abstract.php';
class Bingo_Config_Configure extends Bingo_Config_Abstract 
{
    private $_strDir = './';
    
    private $_strConfFileName = '';
    
    private $_strRangeFileName = '';
    
    public function __construct($arrConfig=array())
    {        
    	if (!extension_loaded('comconfig'))
        {
            throw new Exception('The comcofig extension must be loaded for using Bingo_Config_Configure!');
        }
        $this->setOptions($arrConfig);
    }
    
    public function setOptions($arrConfig)
    {
        if (isset($arrConfig['dir']))
        {
            if ( is_dir($arrConfig['dir']) && file_exists($arrConfig['dir']) )
            {
                $this->_strDir = rtrim($arrConfig['dir'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;        
            }
        }
        if (isset($arrConfig['conf_file_name']))
        {
            $this->_strConfFileName = $arrConfig['conf_file_name'];
        }
        if (isset($arrConfig['confFileName']))
        {
            $this->_strConfFileName = $arrConfig['confFileName'];
        }
        if (isset($arrConfig['range_file_name']))
        {
            $this->_strRangeFileName = $arrConfig['range_file_name'];
        }
        if (isset($arrConfig['rangeFileName']))
        {
            $this->_strRangeFileName = $arrConfig['rangeFileName'];
        }
        $this->_setOptions($arrConfig);
    }
	
	public function load($strFileName=NULL)
	{	    
        $strKey = sprintf('%s_%s_%s',$this->_strDir, $this->_strConfFileName,$this->_strRangeFileName);
        parent::_cacheLoad($this->_strDir . DIRECTORY_SEPARATOR . $this->_strConfFileName, array($this,'parseConfigure'), $strKey);
        return $this->_arrData;
	}
	
	public function parseConfigure()
	{
	    set_error_handler(array($this, '__parseConfigureErrorHanlder'));
        if (empty($this->_strRangeFileName))
        {
            $this->_arrData = config_load($this->_strDir, $this->_strConfFileName);
        }
        else 
        {
            $this->_arrData = config_load($this->_strDir, $this->_strConfFileName, $this->_strRangeFileName);
        }
        if ( false === $this->_arrData) {
            $this->__parseConfigureErrorHanlder(config_errno(), config_errno_string(), __FILE__, __LINE__);
        }
        restore_error_handler();
        return true;
	}
	/**
	 * TODO
	 *
	 * @param unknown_type $fileName
	 */
	public function save($fileName=NULL)
	{
	    
	}
	
	public function __parseConfigureErrorHanlder($errno, $errstr, $errfile, $errline)
	{
	    trigger_error('Config parse configure error!errno['.
	        config_errno().'],error_message['.config_error_message().']', E_USER_WARNING);
	}
}