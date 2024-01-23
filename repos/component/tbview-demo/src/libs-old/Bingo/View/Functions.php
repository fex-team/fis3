<?php
if (! defined('BINGO_ENCODE_LANG')) define('BINGO_ENCODE_LANG', 'GBK');
require_once 'Bingo/String.php';
require_once 'Bingo/View/Script.php';
require_once 'Bingo/Http/Request.php';
/**
 * ���º�����Ҫ�Ǹ�FEʹ��
 */
/**
 * ����xssSafe ת��
 * @param (string|array) $mixValue �ַ����������ַ���ΪԪ�ص�����
 */
function _xssSafe($mixValue) {
	if(is_array($mixValue)) {
		array_walk_recursive($mixValue,array('Bingo_String','xssSafe'));
	}
	else {
	    if (BINGO_ENCODE_LANG == 'GBK') {
		    $mixValue = htmlspecialchars($mixValue, ENT_QUOTES, 'GB18030'/*UTF8DIFF*/);
	    } else {
	        $mixValue = htmlspecialchars($mixValue, ENT_QUOTES, BINGO_ENCODE_LANG/*UTF8DIFF*/);
	    }
	}
	return $mixValue;
}
/**
 * ��ת��һ��XSS��ȫ������
 * 
 * @param $mixValue
 */
function _un($mixValue) {
    return Bingo_String::xssDecode($mixValue);
}
/**
 * �µ��ַ������ȼ��㺯��
 * 
 * @param unknown_type $strData
 */
function _len($strData,$strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/) {
    return Bingo_String::newLenth($strData,$strEncode);
}


function h($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    if ($strEncode == 'GBK') {
        return Bingo_String::escapeHtml($strVar, 'GB18030');
    }
	return Bingo_String::escapeHtml($strVar,$strEncode);
}
function htmlAll($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    if ($strEncode == 'GBK') {
        return Bingo_String::escapeHtmlAll($strVar, 'GB18030');
    }
	return Bingo_String::escapeHtmlAll($strVar,$strEncode);
}
/**
 * �µ�jsת�巽����ֻת�� \/
 * 
 * @param unknown_type $strVar
 * @param unknown_type $strEncode
 */
function _j($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    if ($strEncode == 'GBK') {
        return Bingo_String::newEscapeJs($strVar, 'GB2312');
    }
	return Bingo_String::newEscapeJs($strVar,$strEncode);
}
function j($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    if ($strEncode == 'GBK') {
        return Bingo_String::escapeJs($strVar, 'GB2312');
    }
	return Bingo_String::escapeJs($strVar,$strEncode);
}
function u($strVar)
{
	return Bingo_String::escapeUrl($strVar);
}
/**
 * �µ�urlת�巽��,�Ƚ���xssDecode�ٽ���rawurlencode����
 * 
 * @param $strUrl
 */
function _u($strUrl) {
    return Bingo_String::newEscapeUrl($strUrl);
}
/**
 * �µ�jsonת�巽��
 * 
 * @param $strUrl
 */
function _json($arrVar, $strEncode=BINGO_ENCODE_LANG/*UTF8DIFF*/) {
	return Bingo_String::newJson($arrVar, $strEncode);
}
function json($arrVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
	return Bingo_String::array2json($arrVar, $strEncode);
}
function json2array($strVar, $strToEncode=BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
	return Bingo_String::json2array($strVar, $strToEncode);
}
/**
 * �µ��ַ�����ȡ�ĺ���
 * 
 * @param string $strData
 * @param $intLen
 * @param $strEtc
 * @param $strEncode
 */
function _c($strData, $intLen = 80, $strEtc = '...', $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/) {
    return Bingo_String::newTruncate($strData,$intLen,$strEtc,$strEncode);
}
function c($string, $intLen = 80, $strEtc = '...', $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
	return Bingo_String::truncate($string, $intLen, $strEtc, $strEncode);
}

function CONF($strConfKey, $strTypeKey='', $mixDefaultValue='')
{
	return Bingo_View_Script::getInstance()->conf($strConfKey, $strTypeKey, $mixDefaultValue);
}
/**
 * �µ�ȡGET�����ķ���
 * @param $strKey
 * @param $mixDefaultValue
 */
function _GET($strKey,$mixDefaultValue='') {
    $mixRet = Bingo_Http_Request::getGet($strKey,$mixDefaultValue);
	if (is_string($mixRet)) {
	    if (BINGO_ENCODE_LANG == 'GBK') {
		    return htmlspecialchars($mixRet, ENT_QUOTES, 'GB18030'/*UTF8DIFF*/);
	    } else {
	        return htmlspecialchars($mixRet, ENT_QUOTES, BINGO_ENCODE_LANG/*UTF8DIFF*/);
	    }
	}
	else if(is_array($mixRet)) {
		array_walk_recursive($mixRet,array('Bingo_String','xssSafe'));
	}
	return $mixRet;
}
function GET($strKey, $mixDefaultValue='')
{
	return Bingo_Http_Request::getGet($strKey, $mixDefaultValue);
}
/**
 * �µ�ȡPOST�����ķ���
 * @param $strKey
 * @param $mixDefaultValue
 */
function _POST($strKey,$mixDefaultValue='') {
    $mixRet = Bingo_Http_Request::getPost($strKey,$mixDefaultValue);
    if (is_string($mixRet)) {
        if (BINGO_ENCODE_LANG == 'GBK') {
		    return htmlspecialchars($mixRet, ENT_QUOTES, 'GB18030'/*UTF8DIFF*/);
        } else {
            return htmlspecialchars($mixRet, ENT_QUOTES, BINGO_ENCODE_LANG/*UTF8DIFF*/);
        }
	}
	else if(is_array($mixRet)) {
		array_walk_recursive($mixRet,array('Bingo_String','xssSafe'));
	}
	return $mixRet;
}
function POST($strKey, $mixDefaultValue='')
{
	return Bingo_Http_Request::getPost($strKey, $mixDefaultValue);
}
/**
 * �µ�ȡ�����ķ���
 * @param unknown_type $strKey
 * @param unknown_type $mixDefaultValue
 */
function _REQUEST($strKey,$mixDefaultValue='') {
    $mixRet = Bingo_Http_Request::get($strKey,$mixDefaultValue);
    if (is_string($mixRet)) {
        if (BINGO_ENCODE_LANG == 'GBK') {
		    return htmlspecialchars($mixRet, ENT_QUOTES, 'GB18030'/*UTF8DIFF*/);
        } else {
            return htmlspecialchars($mixRet, ENT_QUOTES, BINGO_ENCODE_LANG/*UTF8DIFF*/);
        }
	}
	else if(is_array($mixRet)) {
		array_walk_recursive($mixRet,array('Bingo_String','xssSafe'));
	}
	return $mixRet;
}

function REQUEST($strKey, $mixDefaultValue='')
{
    return Bingo_Http_Request::get($strKey, $mixDefaultValue);
}

function COOKIE($strKey, $mixDefaultValue='')
{
	return Bingo_Http_Request::getCookie($strKey, $mixDefaultValue);
}

function IFELSE($bolVar, $mixValue, $mixFalseValue)
{
	return ($bolVar)?$mixValue:$mixFalseValue;
}

function helper()
{
	return Bingo_View_Script::getInstance()->getObjHelper();
}

function ContentType($strType, $strCharSet=BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    require_once 'Bingo/Http/Response.php';
    $strContentType = 'text/html';
    switch ($strType) {
        case 'json':
            $strContentType = 'application/json';
            break;
        case 'wml':
            $strContentType = 'text/vnd.wap.wml';
            break;
        case 'xml':
            $strContentType = 'text/xml';
            break;
        case 'xhtml':
            $strContentType = 'application/xhtml+xml';
            break;
        case 'html':
            $strContentType = 'text/html';
            break;
        default:
            $strContentType = $strType;
            break;
    }
    Bingo_Http_Response::contextType($strContentType, $strCharSet);
}
/**
 * �ո�ת����&#160;  or &nbsp;
 * @param $strVar
 * @param $strSpace
 */
function spaceFormat($strVar, $strSpace='&nbsp;')
{
    //TODO
    return mb_ereg_replace(' ', $strSpace, $strVar);
}
function spaceAndDonaFormat($strVar, $strSpace='&nbsp;')
{
    return str_replace(array('$', ' '), array('$$', $strSpace), $strVar);
}
/**
 * xhtml/wml ת�庯��ת��
 * @param $strType
 */
class Bingo_View_Function_Escape
{
    public static $_strType = 'xhtml';
}
function escapeSwitch($strType='xhtml') 
{
    Bingo_View_Function_Escape::$_strType = $strType;
}
/**
 * h(),xhtml���htmlת��
xml��ת�壬����< ��>���ո�&��
w(),wml���htmlת��
��hת�����ƣ��������Ӷ���$���ŵ�ת�壬$ת��Ϊ$$
 * @param $strVar
 * @param $strEncode
 */
function xh($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    if ($strEncode == 'GBK') {
        $strVar = Bingo_String::escapeHtml($strVar,'GB18030');
    } else {
        $strVar = Bingo_String::escapeHtml($strVar,$strEncode);
    }
    if (Bingo_View_Function_Escape::$_strType == 'xhtml') {
        //ת��ո�
        $strVar = spaceFormat($strVar, '&#160;');
    } else {
        //ת��ո�+dona
        $strVar = spaceAndDonaFormat($strVar, '&nbsp;');
    }
    return $strVar;
}
/**
 * m(),xhtml���
n(),wml���
��������h/w��ת�壬��ѿո�ת��Ϊ&nbsp;�����ύ������ᵼ�±������⡣
m/n�Ὣ�ո�ת��Ϊʵ���ַ�������������һ��
 * @param unknown_type $strVar
 * @param unknown_type $strEncode
 */
function xhf($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    if ($strEncode == 'GBK') {
        $strVar = Bingo_String::escapeHtml($strVar,'GB18030');
    } else {
        $strVar = Bingo_String::escapeHtml($strVar,$strEncode);
    }
    if (Bingo_View_Function_Escape::$_strType == 'xhtml') {
        //ת��ո�
        $strVar = spaceFormat($strVar, '&#160;');
    } else {
        //ת��ո�+dona
        $strVar = spaceAndDonaFormat($strVar, '&#160;');
    }
    return $strVar;
}
/**
 * wap ʹ�õ� xh ����
 * @param $strVar
 * @param $strEncode
 */
function _xh($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    if (Bingo_View_Function_Escape::$_strType == 'xhtml') {
        //ת��ո�
        $strVar = spaceFormat($strVar, '&#160;');
    } else {
        //ת��ո�+dona
        $strVar = spaceAndDonaFormat($strVar, '&nbsp;');
    }
    return $strVar;
}
/**
 * wap ʹ�õ� xhf
 * @param unknown_type $strVar
 * @param unknown_type $strEncode
 */
function _xhf($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    if (Bingo_View_Function_Escape::$_strType == 'xhtml') {
        //ת��ո�
        $strVar = spaceFormat($strVar, '&#160;');
    } else {
        //ת��ո�+dona
        $strVar = spaceAndDonaFormat($strVar, '&#160;');
    }
    return $strVar;
}
