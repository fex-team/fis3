<?php
/**
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package bingo
 * @since 2010-04-07
 */
require_once 'Bingo/Encode/Abstract.php';
class Bingo_Encode
{
	const ENCODE_UTF8 = 'UTF-8';	
	
	const ENCODE_GBK = 'GBK';
	
	const ENCODE_GB18030 = 'GB18030';
	
	const ENCODE_GB2312 = 'GB2312';
	
	const ENCODE_TYPE_MB_STRING = 'mb_string';
	
	const ENCODE_TYPE_UCONV = 'uconv';
	
	protected static $_arrEnableTypes = array('uconv', 'mb_string');
	
	protected static $_arrEngines = array();
	
	public static function convertGet($mixVar, $strToEncode, $strFromEncode, $strType='mb_string')
	{
		if (is_array($mixVar)) {
            if (empty($mixVar)) return array();
            $arrRet = array();
            foreach ($mixVar as $_key => $_value) {
                $_key = self::convertGet($_key, $strToEncode, $strFromEncode, $strType);
                $arrRet[$_key] = self::convertGet($_value, $strToEncode, $strFromEncode, $strType);
            }
            return $arrRet;
        } elseif (is_string($mixVar)) {
        	return self::getEngine($strType)->convertGet($mixVar, $strToEncode, $strFromEncode);
        }
        return $mixVar;
	}
	
	public static function convertPost($mixVar, $strToEncode, $strFromEncode, $strType='mb_string')
	{
		if (is_array($mixVar)) {
            if (empty($mixVar)) return array();
            $arrRet = array();
            foreach ($mixVar as $_key => $_value) {
                $_key = self::convertPost($_key, $strToEncode, $strFromEncode, $strType);
                $arrRet[$_key] = self::convertPost($_value, $strToEncode, $strFromEncode, $strType);
            }
            return $arrRet;
        } elseif (is_string($mixVar)) {
        	return self::getEngine($strType)->convertPost($mixVar, $strToEncode, $strFromEncode);
        }
        return $mixVar;
	}
	
	public static function convert($mixVar, $strToEncode, $strFromEncode, $strType='mb_string')
	{
		if (is_array($mixVar)) {
            if (empty($mixVar)) return array();
            $arrRet = array();
            foreach ($mixVar as $_key => $_value) {
                $_key = self::convert($_key, $strToEncode, $strFromEncode, $strType);
                $arrRet[$_key] = self::convert($_value, $strToEncode, $strFromEncode, $strType);
            }
            return $arrRet;
        } elseif (is_string($mixVar)) {
        	return self::getEngine($strType)->convert($mixVar, $strToEncode, $strFromEncode);
        }
        return $mixVar;
	}
	
	public static function getEngine($strEngineName)
	{
		if (isset(self::$_arrEngines[$strEngineName])) {
			return self::$_arrEngines[$strEngineName];
		}
		if (! in_array($strEngineName, self::$_arrEnableTypes)) {
			$strEngineName = 'mb_string';
		}
		if (isset(self::$_arrEngines[$strEngineName])) {
			return self::$_arrEngines[$strEngineName];
		}
		$obj = null;
		switch ($strEngineName)
		{
			case 'uconv' : 
				require_once 'Bingo/Encode/Uconv.php';
				$obj = new Bingo_Encode_Uconv();
				break;
			case 'mb_string' :
				require_once 'Bingo/Encode/Mbstring.php';
				$obj = new Bingo_Encode_Mbstring();
				break;
		}
		self::$_arrEngines[$strEngineName] = $obj;
		return $obj;
	}
}