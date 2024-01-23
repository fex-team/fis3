<?php
/**
 * Text 类型的配置文件，一行一个
 * 注意采用get方法获取的时候，可能只支持数字
 * @author xuliqiang@baidu.com
 * @since 2010-06-04
 * @package config
 *
 */
require_once 'Bingo/Config/Abstract.php';
class Bingo_Config_Text extends Bingo_Config_Abstract  
{
    protected $_bolFilterEmpty = false;
    
    protected $_bolHashData = false;
    
    protected $_cbkHash = '';
    
    protected $_arrFilterPrefix = array('#');
    
	public function __construct($arrConfig=array())
	{
		$this->setOptions($arrConfig);
	}
	
	public function setOptions($arrConfig)
	{
	    if (isset($arrConfig['fileName'])) {
	        $this->setFileName($arrConfig['fileName']);
	    }
	    if (isset($arrConfig['filterEmpty'])) {
	        $this->_bolFilterEmpty = (bool)$arrConfig['filterEmpty'];
	    }
	    if (isset($arrConfig['hashData'])) {
	        $this->_bolHashData = (bool)$arrConfig['hashData'];
	        if (isset($arrConfig['hash']) && is_callable($arrConfig['hash']) ) {
	            $this->_cbkHash = $arrConfig['hash'];
	        } 
	    }
	    if (isset($arrConfig['filterPrefix'])) {
	        if (is_array($arrConfig['filterPrefix'])) {
	            $this->_arrFilterPrefix = $arrConfig['filterPrefix'];
	        } else {
	            $this->_arrFilterPrefix = array($arrConfig['filterPrefix']);
	        }
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
	    set_error_handler(array($this,'_parseTextErrorHandle'));
	    $arrLines = file($strFileName);
	    $arrRet = array();
	    if ($arrLines) {
	        foreach ($arrLines as $strLine) {
	            $strLine = strip_tags(trim($strLine));
	            if ($this->_bolFilterEmpty && $strLine === '' ) continue;
	            if ($this->_bolHashData) {
	                if (empty($this->_cbkHash)) {
	                    $arrRet[$strLine] = $strLine;
	                } else {
	                    $strLine = call_user_func_array($this->_cbkHash, array($strLine));
	                    $arrRet[$strLine] = $strLine;
	                }
	            } else {
	                $arrRet[] = $strLine;
	            }
	        }
        }
	    $this->_arrData = $arrRet;
	    restore_error_handler();
	}
	/**
	 * TODO
	 *
	 */
	public function save($strFileName=NULL)
	{
	    
	}
	
	public function _parseTextErrorHandle($errno, $errstr, $errfile, $errline)
	{
	    trigger_error('Config parse text failure!fileName['.$this->_strFileName.']', E_USER_WARNING);
	}
}