<?php
if (! defined('BINGO_ENCODE_LANG')) define('BINGO_ENCODE_LANG', 'GBK');
require_once 'Bingo/String.php';
require_once 'Bingo/View/Script.php';
require_once 'Bingo/Http/Request.php';
/**
 * 以下函数主要是给FE使用
 */
/**
 * 进行xssSafe 转换
 * @param (string|array) $mixValue 字符串或者以字符串为元素的数组
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
 * 反转义一个XSS安全的数据
 * 
 * @param $mixValue
 */
function _un($mixValue) {
    return Bingo_String::xssDecode($mixValue);
}
/**
 * 新的字符串长度计算函数
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
 * 新的js转义方案，只转义 \/
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
 * 新的url转义方法,先进行xssDecode再进行rawurlencode编码
 * 
 * @param $strUrl
 */
function _u($strUrl) {
    return Bingo_String::newEscapeUrl($strUrl);
}
/**
 * 新的json转义方法
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
 * 新的字符串截取的函数
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
 * 新的取GET参数的方法
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
 * 新的取POST参数的方法
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
 * 新的取参数的方法
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
 * 空格转化，&#160;  or &nbsp;
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
 * xhtml/wml 转义函数转换
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
 * h(),xhtml里的html转义
xml的转义，对于< 、>、空格、&等
w(),wml里的html转义
和h转义类似，但是增加对于$符号的转义，$转义为$$
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
        //转义空格
        $strVar = spaceFormat($strVar, '&#160;');
    } else {
        //转义空格+dona
        $strVar = spaceAndDonaFormat($strVar, '&nbsp;');
    }
    return $strVar;
}
/**
 * m(),xhtml里的
n(),wml里的
由于上面h/w的转义，会把空格转义为&nbsp;，在提交表单域里，会导致编码问题。
m/n会将空格转义为实体字符，其他和上面一致
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
        //转义空格
        $strVar = spaceFormat($strVar, '&#160;');
    } else {
        //转义空格+dona
        $strVar = spaceAndDonaFormat($strVar, '&#160;');
    }
    return $strVar;
}
/**
 * wap 使用的 xh 函数
 * @param $strVar
 * @param $strEncode
 */
function _xh($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    if (Bingo_View_Function_Escape::$_strType == 'xhtml') {
        //转义空格
        $strVar = spaceFormat($strVar, '&#160;');
    } else {
        //转义空格+dona
        $strVar = spaceAndDonaFormat($strVar, '&nbsp;');
    }
    return $strVar;
}
/**
 * wap 使用的 xhf
 * @param unknown_type $strVar
 * @param unknown_type $strEncode
 */
function _xhf($strVar, $strEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/)
{
    if (Bingo_View_Function_Escape::$_strType == 'xhtml') {
        //转义空格
        $strVar = spaceFormat($strVar, '&#160;');
    } else {
        //转义空格+dona
        $strVar = spaceAndDonaFormat($strVar, '&#160;');
    }
    return $strVar;
}
