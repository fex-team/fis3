<?php
/**
 * Xml�����⣬������simplexml������simplexmlֻ������UTF-8�������ڻ�ȡ��ʱ�����˱���ת����
 * �����ڵ���simpleXml֮ǰ��Ҫ�Ѳ�ͬ����ת����UTF-8��������ⲻ��Ԥ֪�����⡣
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
     * �����ǿ����
     * @param unknown_type $strXml
     */
    public function parseString($strXml)
    {
        /**
         * TODO simpleXml��������libxml2��simpleXml����֮ǰ�������iconv���Ƶı���ת������ת��
         * ����ת����bad case
         * 1��strXmlת����utf-8����
         * 2��ʶ��<?xml version="1.0" encoding="gbk"?>֮��ģ�ͬ��ת����utf-8��
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
            //��Ҫ����ת��
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
     * ��ȡ�ڵ�
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
	 * ��ȡ�ڵ�����
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