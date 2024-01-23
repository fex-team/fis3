<?php
/**
 * 字符串函数封装，主要是给模板使用。
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-07
 * @package bingo
 *
 */
require_once 'Bingo/Encode.php';
if (! defined('BINGO_ENCODE_LANG')) define('BINGO_ENCODE_LANG', 'GBK');
class Bingo_String
{
	// 不需要转义的白名单，会在 Bingo_View 初始化的时候赋值
	public static $_arrWhiteList = array();
   	/**
     * 数组转换成json输出
     *
     * @param array $arrVar
     * @param string $strEncode
     * @return string
     */
	public static function array2json($arrVar, $strFromEncode=BINGO_ENCODE_LANG/*UTF8DIFF*/)
	{
		if (! function_exists('json_encode')) {
            throw new Exception('function json_encode is not found!');
        }
        if ($strFromEncode != Bingo_Encode::ENCODE_UTF8) {
            $arrVar = Bingo_Encode::convert($arrVar, Bingo_Encode::ENCODE_UTF8, $strFromEncode, Bingo_Encode::ENCODE_TYPE_MB_STRING);
            return Bingo_Encode::convert(json_encode($arrVar), $strFromEncode, Bingo_Encode::ENCODE_UTF8, Bingo_Encode::ENCODE_TYPE_MB_STRING);
        } else {
            return json_encode($arrVar);
        }
	}
	/**
	 * JSON转化成数组
	 * @param string $strJson
	 * @param string $strToEncode
	 */	
	public static function json2array($strJson, $strToEncode=BINGO_ENCODE_LANG/*UTF8DIFF*/, $bolAssoc=true, $intDepth=NULL)
	{
		if (! function_exists('json_decode')) {
			throw new Exception('function json_decode is not found!');
		}
		if (is_null($intDepth)) {
		    //注意，只有5.3以上的PHP版本才支持第3个参数
		    $arrVar = json_decode($strJson, $bolAssoc);
		} else {
		    $arrVar = json_decode($strJson, $bolAssoc, $intDepth);
		}
		if ($arrVar === NULL ) {
			return false;
		}
		if ($strToEncode != Bingo_Encode::ENCODE_UTF8) {
			$arrVar = Bingo_Encode::convert($arrVar, $strToEncode, Bingo_Encode::ENCODE_UTF8, Bingo_Encode::ENCODE_TYPE_MB_STRING);
		}
		return $arrVar;
	}
	/**
	 * 新的 json 方案，先做xssdecode再做array2json
	 */
	public static function newJson($arrVar, $strEncode=BINGO_ENCODE_LANG/*UTF8DIFF*/) {
		$arrVar = self::xssDecode($arrVar);
		return self::array2json($arrVar,$strEncode);
	}
	/**
     * 字符串截取
     *
     * @param string $string
     * @param int $intLen
     * @param string $strEtc
     * @param string $strEncode
     * @return string
     */
	public static function truncate($string, $intLen = 80, $strEtc = '...', $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
	{
		if ( $strEncode != Bingo_Encode::ENCODE_GBK && function_exists('mb_strimwidth')) {
            return self::_mbCutStr($string, $intLen, $strEtc, $strEncode);
        } else {
            return self::_cutStrForGbk($string, $intLen, $strEtc);
        }
	}
	/**
	 * 新的字符串截取函数
	 * 
	 * @param unknown_type $string
	 * @param unknown_type $intLen
	 * @param unknown_type $strEtc
	 * @param unknown_type $strEncode
	 */
	public static function newTruncate($string, $intLen = 80, $strEtc = '...', $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/) {
	    $string = self::xssDecode($string);
	    $string = self::truncate($string, $intLen, $strEtc, $strEncode);
	    self::xssSafe($string,'');
	    return $string;
	}
	/**
	 * 新的字符串长度计算函数,无论什么编码一个汉字按长度2计算，英文按长度1计算
	 * 
	 * @param $strVar
	 * @param $strEncode
	 */
	public static function newLenth($strVar,$strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/) {
	    $strVar = self::xssDecode($strVar);
	    $intCnt = 0;
	    $intLen = strlen($strVar);
	    $i = 0;
	    if ( $strEncode == Bingo_Encode::ENCODE_GB2312 || $strEncode == Bingo_Encode::ENCODE_GBK ) {
			// GBK
			while($i<$intLen) {
			    if(ord($strVar{$i}) > 0x80){
			        $i += 2;
			    }
			    else {
			        $i++;
			    }
			    $intCnt++;
			}
			return $intCnt;
		} else {
			// utf8
			return mb_strlen($strVar);
    	}
    	
 	}
	/**
	 * HTML代码安全转换，只转换& ' " < >
	 * @param $strVar
	 * @param $strEncode
	 */
	public static function escapeHtml($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/, $double_encode = true)
	{
	    if ($strEncode == 'GBK' || $strEncode == 'GB18030') $strEncode = 'ISO-8859-1';  /*该函数不支持GBK和GB18030*/
		return htmlspecialchars($strVar, ENT_QUOTES, $strEncode, $double_encode);
	}
	/**
	 * HTML转换，转换所有的HTML标签和不合法的编码字符
	 * @param string $strVar
	 * @param string $strEncode
	 */
	public static function escapeHtmlAll($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/, $double_encode = true)
	{
	    if ($strEncode == 'GBK' || $strEncode == 'GB18030') $strEncode = 'ISO-8859-1';  /*该函数不支持GBK和GB18030*/
		return htmlentities($strVar, ENT_QUOTES, $strEncode, $double_encode);
	}
	/**
	 * 转换JS不安全字符
	 * @param string $strVar
	 * @param string $strEncode
	 */
	public static function escapeJs($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
	{
		if ( $strEncode == Bingo_Encode::ENCODE_GB2312 || $strEncode == Bingo_Encode::ENCODE_GBK ) {
			return self::_escapeJsForGbk($strVar);
		} else {
			return strtr($strVar, array('\\'=>'\\\\',"'"=>"\\'",'"'=>'\\"',"\r"=>'\\r',"\n"=>'\\n','</'=>'<\/', '/'=>'\/'));
    	}
	}
	/**
	 * 新的JS转义函数，只处理'\' 和 '/'
	 * @param string $strVar
	 * @param string $strEncode
	 */
    public static function newEscapeJs($strVar,$strEncode=BINGO_ENCODE_LANG/*UTF8DIFF*/) {
        if ( $strEncode == Bingo_Encode::ENCODE_GB2312 || $strEncode == Bingo_Encode::ENCODE_GBK ) {
			return self::_newEscapeJsForGbk($strVar);
		} else {
		    return strtr($strVar,array('/'=>'\/','\\'=>'\\\\'));		    
		}
    }
	/**
	 * URL转换
	 * @param string $strVar
	 */
	public static function escapeUrl($strVar)
	{
		return rawurlencode($strVar);
	}
	/**
	 * 新的url反转义方法，先进行XSS反转义，再进行url编码
	 * 
	 * @param unknown_type $strVar
	 */
	public static function newEscapeUrl($strVar) {
	    $strVar = self::xssDecode($strVar);
		return self::escapeUrl($strVar);
	}
	
	private static function _cutStrForGbk($string, $len = 100, $etc = '...')
    {        
    	$string = strval($string);
        if (strlen($string) <= $len) {
            return $string;
        }
        $strCut = '';
        for ($i=0; $i < $len; $i++) {
            if ( ord($string{$i}) > 0x80 ) {
                ++ $i;
                if ($i >= $len) break;
                $strCut .= $string{$i - 1} . $string{$i};
            } else {
                $strCut .= $string{$i};
            }
        }
        return $strCut . $etc;
    }
    
    private static function _mbCutStr($string, $length = 100, $etc = '...', $encoding = BINGO_ENCODE_LANG/*UTF8DIFF*/)
    {
        if(mb_strwidth($string,$encoding)> $length){
            return mb_strimwidth($string, 0, ($length + strlen($etc)), $etc, $encoding);
        } 
        else {
            return $string;    
        }
    }
    
	/**
     * 过滤JS中一些不安全的字符，只支持GBK字符
     * 对半个汉字的处理会有问题。
     *
     * @param string $str
     * @return string
     */
    private static function _escapeJsForGbk($str)
    {
    	$str = strval($str);
        $_intStrlen = strlen($str);
        $_intPos = 0;
        $_strRet = ''; 
        $_arrEscapeChrs = array(
        	"'"    => "\'",
        	'"'    => '\"',
        	"\\"   => "\\\\",
        	"\n"   => "\\n",
        	"\r"   => "\\r",
        	'</'   => '<\/',
            '/'	   => '\/',
        );  
        while($_intPos < $_intStrlen){
            if(ord($str{$_intPos}) > 0x80){
                $_strRet .= $str{$_intPos++} . $str{$_intPos++};
            } else {
                if(! empty($_arrEscapeChrs[$str{$_intPos}])){
                    $_strRet .= $_arrEscapeChrs[$str{$_intPos++}];
                } else {
                    $_strRet .= $str{$_intPos++};
                }
            } 
        }
        return $_strRet;
    }
	/**
     * 新的过滤JS中一些不安全的字符函数，只支持GBK字符
     * 对半个汉字的处理会有问题。
     *
     * @param string $str
     * @return string
     */
    private static function _newEscapeJsForGbk($str)
    {
    	$str = strval($str);
        $_intStrlen = strlen($str);
        $_intPos = 0;
        $_strRet = '';
        $_arrEscapeChrs = array(
        	"\\"   => "\\\\",
        	'/'	   => '\/',
        );  
        while($_intPos < $_intStrlen){
            if(ord($str{$_intPos}) > 0x80){
                $_strRet .= $str{$_intPos++} . $str{$_intPos++};
            } else {
                if(! empty($_arrEscapeChrs[$str{$_intPos}])){
                    $_strRet .= $_arrEscapeChrs[$str{$_intPos++}];
                } else {
                    $_strRet .= $str{$_intPos++};
                }
            } 
        }
        return $_strRet;
    }

    /**
	 * 将一个XSS安全的数据转换回原来的数据
	 * 
	 * @param mixed $mixValue 要进行反转义的数据
	 * @return mixed	转义后的结果
	 */
    public static function xssDecode($mixValue) {
        if(is_array($mixValue)) {
            if(empty($mixValue)) {
                return array();
            }
            $arrRet = array();
            foreach ($mixValue as $_key => $_val) {
                $arrRet[$_key] = self::xssDecode($_val);
            }
            return $arrRet;           
        }
        if(is_string($mixValue)) {
            return htmlspecialchars_decode($mixValue,ENT_QUOTES);
        }
        return $mixValue;
    }
    /**
     * 将一个数据变为Xss安全的
     * 
     * @param $mixData
     */
    public static function xssSafe(&$mixVal,$strKey) {
        if (! in_array($strKey, self::$_arrWhiteList) && is_string($mixVal)) {
        	$double_encode = (BINGO_ENCODE_LANG == 'UTF-8')? true : false;  /*无线仍然需要两次转义*/
            $mixVal = self::escapeHtml($mixVal, BINGO_ENCODE_LANG, $double_encode);
        }
    }
    
}    
