<?php
/**
 * 对JSON格式配置文件的支持。
 * 对标准的JSON配置方式都支持。支持中文。
 * 注释之间不支持嵌套
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2011-03-04
 */
require_once 'Bingo/Config/Abstract.php';
class Bingo_Config_Json extends Bingo_Config_Abstract
{
    /**
     * json配置文件的编码格式
     * @var string
     */
    protected $_strFromEncode     = 'GBK';
    /**
     * 输出数据的编码格式
     * @var string
     */
    protected $_strToEncode       = 'GBK';
    /**
     * 默认的编码转化方式
     * @var unknown_type
     */
    protected $_strEncodeEngine   = 'uconv';
    /**
     * 是否允许单行注释，主要是对"//","#"等注释的支持，但这需要Json配置中不能含有//和#文件
     * @var bool
     */
    protected $_bolSingleLineComment = true;
    
    public function __construct($arrConfig=array())
	{
		$this->setOptions($arrConfig);
	}
    
	public function setOptions($arrConfig)
    {
        if (isset($arrConfig['fileName'])) {
	        $this->setFileName($arrConfig['fileName']);
	    }
	    if (isset($arrConfig['fromEncode'])) {
	        $this->_strFromEncode = trim($arrConfig['fromEncode']);
	    }
        if (isset($arrConfig['toEncode'])) {
	        $this->_strToEncode = trim($arrConfig['toEncode']);
	    }
        if (isset($arrConfig['encodeEngine'])) {
	        $this->_strEncodeEngine = $arrConfig['encodeEngine'];
	    }
	    if (isset($arrConfig['singleLineComment'])) {
	        $this->_bolSingleLineComment = (bool) $arrConfig['singleLineComment'];
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
        $this->_arrData = null;
        $strJson = file_get_contents($strFileName);
        if ($strJson === false) {
            trigger_error('Config parse json failure[file_get_contents]!fileName['.
                $this->_strFileName.']', E_USER_WARNING);
            return true;
        }
        //相关处理，处理掉注释等等
        $strJson = preg_replace('/(\/\*)([\s\S]*?)(\*\/)/', '', $strJson);
        if ($this->_bolSingleLineComment) {
            $strJson = preg_replace("/\/\/(.*)\r/", '', $strJson);
            $strJson = preg_replace("/#(.*)\r/", '', $strJson);
        }
        //编码转化 
        if (strcasecmp($this->_strFromEncode, Bingo_Encode::ENCODE_UTF8) != 0) {
            $strJson = Bingo_Encode::convert($strJson, Bingo_Encode::ENCODE_UTF8, 
                $this->_strFromEncode, $this->_strEncodeEngine);
        }
        //Json输出
        $arrRet = Bingo_String::json2array($strJson, Bingo_Encode::ENCODE_UTF8, true);
        if ($arrRet === NULL || $arrRet == false) {
            trigger_error('Config parse json failure[Bingo_String::json2array]!fileName['.
                $this->_strFileName.']', E_USER_WARNING);
            return true;
        }
        //输出编码转化
        if (strcasecmp($this->_strToEncode, Bingo_Encode::ENCODE_UTF8) != 0 ) {
            $arrRet = Bingo_Encode::convert($arrRet, $this->_strToEncode, 
                Bingo_Encode::ENCODE_UTF8, $this->_strEncodeEngine);
        }
        $this->_arrData = $arrRet;
        return true;
    }
    /**
     * TODO
     */
    public function save($fileName=NULL)
    {
        
    }
}