<?php
/**
 * 采用php的关联数组做配置文件
 * @author xuliqiang@baidu.com
 * @since 2009-10-21
 * @package config
 *
 */
require_once 'Bingo/Config/Abstract.php';
class Bingo_Config_Array extends Bingo_Config_Abstract  
{
	public function __construct($arrConfig=array())
	{
	    if (!empty($arrConfig))
	    {
	        $this->setOptions($arrConfig);
	    }
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
	    parent::_cacheLoad($strFileName, array($this,'parseFile'));
	    return $this->_arrData;
	}
	
	public function parseFile($strFileName)
	{
	    set_error_handler(array($this, '_includeErrorHandle'));
	    $this->_arrData = include($strFileName);
	    restore_error_handler();	   
	    return true;
	}
	
	public function save($strFileName=NULL)
	{
	    //TODO
	}
	
	public function _includeErrorHandle()
	{
		trigger_error('Config : include file failure! fileName[' . $this->_strFileName . ']', E_USER_WARNING);
	}
}