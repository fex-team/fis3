<?php
/**
 * Callback配置文件统一访问接口
 * @author xuliqiang@baidu.com
 * @since 2009-10-21
 * @package Bingo
 *
 */
require_once 'Bingo/Config/Abstract.php';
class Bingo_Config_Callback extends Bingo_Config_Abstract  
{
    protected $_cbkParse = null;
	public function __construct($arrConfig=array())
	{
		$this->setOptions($arrConfig);
	}
	
	public function setOptions($arrConfig)
	{
	    if (isset($arrConfig['fileName'])) {
	        $this->setFileName($arrConfig['fileName']);
	    }
	    if (isset($arrConfig['parseCallback']) && is_callable($arrConfig['parseCallback'])) {
	        $this->_cbkParse = $arrConfig['parseCallback'];
	    }
	    $this->_setOptions($arrConfig);
	}	
	public function load($strFileName=NULL)
	{
	    if (is_null($strFileName))
	    {
	        $strFileName = $this->_strFileName;
	    }
	    parent::_cacheLoad($strFileName, array($this, 'parseFile'));
	    return $this->_arrData;
	}
	
    public function parseFile($strFileName)
	{
	    if (! empty($this->_cbkParse)) {
	        set_error_handler(array($this,'_parseErrorHandle'));
	        $this->_arrData = call_user_func_array($this->_cbkParse, array($strFileName));
	        restore_error_handler();	   
	    }
	}
	/**
	 * TODO
	 *
	 */
	public function save($strFileName=NULL)
	{
	    
	}
	
	public function _parseErrorHandle($errno, $errstr, $errfile, $errline)
	{
	    trigger_error('Config parse_file failure!fileName['.$this->_strFileName.']', E_USER_WARNING);
	}
}