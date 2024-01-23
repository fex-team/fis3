<?php
/**
 * Xml解析库，采用了simplexml，由于simplexml只能输入UTF-8，所以在获取的时候做了编码转化。
 * 另外在调用simpleXml之前需要把不同编码转化成UTF-8，以免避免不可预知的问题。
 * @author xuliqiang <xuliqiang@baidu.com>
 *
 */
require_once 'Bingo/Encode.php';
class Bingo_Xml
{
    protected $_strInputEncode = 'GBK';
    
    protected $_strOutputEncode = 'GBK';
    
    protected $_arrData = array();
    
    public function __construct($arrConfig=array())
    {
        if (! empty($arrConfig)) {
            $this->setOptions($arrConfig);
        }
    }
    
    public function setOptions($arrConfig)
    {
        if (isset($arrConfig['inputEncode'])) {
            $this->_strInputEncode = $arrConfig['inputEncode'];
        }
        if (isset($arrConfig['outputEncode'])) {
            $this->_strOutputEncode = $arrConfig['outputEncode'];
        }
    }
    
    public function parseFile($strFile)
    {
        //TODO cache
        return $this->parseString(file_get_contents($strFile));
    }
    /**
     * 后面加强处理
     * @param unknown_type $strXml
     */
    public function parseString($strXml)
    {
        /**
         * TODO simpleXml依赖的是libxml2，simpleXml解析之前都会采用iconv类似的编码转化方法转，
         * 这种转会有bad case
         * 1、strXml转化成utf-8编码
         * 2、识别<?xml version="1.0" encoding="gbk"?>之类的，同样转化成utf-8。
         * 
         */
        $array = simplexml_load_string($strXml, null, LIBXML_NOCDATA);
        if (false == $array) {
            return false;
        }
        $array = (array) $array;
        foreach ($array as $key => $item) {
            $array[$key] = $this->_toArray((array)$item);
        }
        if (strtolower($this->_strOutputEncode) != strtolower(Bingo_Encode::ENCODE_UTF8)) {
            //需要编码转化
            $array = Bingo_Encode::convert($array, $this->_strOutputEncode, Bingo_Encode::ENCODE_UTF8);
        }
        $this->_arrData = $array;
        return $array;
    }
    
    public function getData()
    {
        return $this->_arrData;
    }
    /**
     * 获取节点
     * @param string $strKey
     */    
    public function get($strKey, $mixDefaultValue='')
	{
		if (empty($this->_arrData)) {
			return $mixDefaultValue;
		}
		if (empty($strKey)) {
			return $this->_arrData;
		}
		$arrKeys = explode('.', $strKey);
		if (! empty($arrKeys)) {
			$_value = $this->_getItemFromArray($arrKeys, $this->_arrData);
			if (false === $_value) {
				
			} else {
			    return $_value;
			}
		}
		return $mixDefaultValue;
	}
	/**
	 * 获取节点属性
	 * @param unknown_type $item
	 */
	public function getAttrs($strPath, $strKey='', $mixDefaultValue='')
	{
	    $arrRet = $this->get($strPath);
	    if ($arrRet && isset($arrRet['@attributes'])) {
	        if (isset($arrRet['@attributes'][$strKey])) {
	            return $arrRet['@attributes'][$strKey];
	        }
	    }
	    return $mixDefaultValue;
	}
    
    protected function _toArray($item)
    {
        if (! is_string($item)) {
            $item = (array) $item;
            foreach ($item as $key => $val) {
                $item[$key] = $this->_toArray($val);
            }
        }
        return $item;
    }
    
    protected function _getItemFromArray($arrKeys, $arrData)
	{
		if (is_array($arrKeys) && is_array($arrData) ) {			
			$_tmpVar = $arrData;
			foreach ($arrKeys as $key) {
				if (array_key_exists($key, $_tmpVar)) {
					$_tmpVar = $_tmpVar[$key];
				} else  {
					//can not find
					return false;
				}
			}
			return $_tmpVar;
		}
		return false;
	}
}