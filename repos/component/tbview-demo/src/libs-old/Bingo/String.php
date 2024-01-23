<?php
/**
 * �ַ���������װ����Ҫ�Ǹ�ģ��ʹ�á�
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-07
 * @package bingo
 *
 */
require_once 'Bingo/Encode.php';
if (! defined('BINGO_ENCODE_LANG')) define('BINGO_ENCODE_LANG', 'GBK');
class Bingo_String
{
	// ����Ҫת��İ����������� Bingo_View ��ʼ����ʱ��ֵ
	public static $_arrWhiteList = array();
   	/**
     * ����ת����json���
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
	 * JSONת��������
	 * @param string $strJson
	 * @param string $strToEncode
	 */	
	public static function json2array($strJson, $strToEncode=BINGO_ENCODE_LANG/*UTF8DIFF*/, $bolAssoc=true, $intDepth=NULL)
	{
		if (! function_exists('json_decode')) {
			throw new Exception('function json_decode is not found!');
		}
		if (is_null($intDepth)) {
		    //ע�⣬ֻ��5.3���ϵ�PHP�汾��֧�ֵ�3������
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
	 * �µ� json ����������xssdecode����array2json
	 */
	public static function newJson($arrVar, $strEncode=BINGO_ENCODE_LANG/*UTF8DIFF*/) {
		$arrVar = self::xssDecode($arrVar);
		return self::array2json($arrVar,$strEncode);
	}
	/**
     * �ַ�����ȡ
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
	 * �µ��ַ�����ȡ����
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
	 * �µ��ַ������ȼ��㺯��,����ʲô����һ�����ְ�����2���㣬Ӣ�İ�����1����
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
	 * HTML���밲ȫת����ֻת��& ' " < >
	 * @param $strVar
	 * @param $strEncode
	 */
	public static function escapeHtml($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/, $double_encode = true)
	{
	    if ($strEncode == 'GBK' || $strEncode == 'GB18030') $strEncode = 'ISO-8859-1';  /*�ú�����֧��GBK��GB18030*/
		return htmlspecialchars($strVar, ENT_QUOTES, $strEncode, $double_encode);
	}
	/**
	 * HTMLת����ת�����е�HTML��ǩ�Ͳ��Ϸ��ı����ַ�
	 * @param string $strVar
	 * @param string $strEncode
	 */
	public static function escapeHtmlAll($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/, $double_encode = true)
	{
	    if ($strEncode == 'GBK' || $strEncode == 'GB18030') $strEncode = 'ISO-8859-1';  /*�ú�����֧��GBK��GB18030*/
		return htmlentities($strVar, ENT_QUOTES, $strEncode, $double_encode);
	}
	/**
	 * ת��JS����ȫ�ַ�
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
	 * �µ�JSת�庯����ֻ����'\' �� '/'
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
	 * URLת��
	 * @param string $strVar
	 */
	public static function escapeUrl($strVar)
	{
		return rawurlencode($strVar);
	}
	/**
	 * �µ�url��ת�巽�����Ƚ���XSS��ת�壬�ٽ���url����
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
     * ����JS��һЩ����ȫ���ַ���ֻ֧��GBK�ַ�
     * �԰�����ֵĴ���������⡣
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
     * �µĹ���JS��һЩ����ȫ���ַ�������ֻ֧��GBK�ַ�
     * �԰�����ֵĴ���������⡣
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
	 * ��һ��XSS��ȫ������ת����ԭ��������
	 * 
	 * @param mixed $mixValue Ҫ���з�ת�������
	 * @return mixed	ת���Ľ��
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
     * ��һ�����ݱ�ΪXss��ȫ��
     * 
     * @param $mixData
     */
    public static function xssSafe(&$mixVal,$strKey) {
        if (! in_array($strKey, self::$_arrWhiteList) && is_string($mixVal)) {
        	$double_encode = (BINGO_ENCODE_LANG == 'UTF-8')? true : false;  /*������Ȼ��Ҫ����ת��*/
            $mixVal = self::escapeHtml($mixVal, BINGO_ENCODE_LANG, $double_encode);
        }
    }
    
}    
