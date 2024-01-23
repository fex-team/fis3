<?php
/**
 * ini的配置文件统一访问接口
 * @author xuliqiang@baidu.com
 * @since 2009-10-21
 * @package config
 *
 */
require_once 'Bingo/Config/Abstract.php';
class Bingo_Config_Ini extends Bingo_Config_Abstract  
{
	public function __construct($arrConfig=array())
	{
		$this->setOptions($arrConfig);
	}
	
	public function setOptions($arrConfig)
	{
	    if (isset($arrConfig['fileName']))
	    {
	        $this->setFileName($arrConfig['fileName']);
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
	    set_error_handler(array($this,'_parseIniErrorHandle'));
	    $this->_arrData = parse_ini_file($strFileName, true);
	    restore_error_handler();	   
	}
	/**
	 * TODO
	 *
	 */
	public function save($strFileName=NULL)
	{
	    
	}
	
	public function _parseIniErrorHandle($errno, $errstr, $errfile, $errline)
	{
	    trigger_error('Config parse_ini_file failure!fileName['.$this->_strFileName.']', E_USER_WARNING);
	}
}