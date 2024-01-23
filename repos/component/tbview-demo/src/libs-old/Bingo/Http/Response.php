<?php
/**
 * TODO
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package bingo
 *
 */
if (! defined('BINGO_ENCODE_LANG')) define('BINGO_ENCODE_LANG', 'GBK');
class Bingo_Http_Response
{
    public static function location($url)
	{
		header('location:'.$url);
	}
	
	public static function redirect($url, $bolUrl=true)
	{
	    if ($bolUrl) {
	        header('location:'.$url);
	    } else {
	        Bingo_Controller_Front::getInstance()->dispatchByRouter($url);
	    }
	}
	
	public static function contextType($strType='text/html', $strCharset=BINGO_ENCODE_LANG/*UTF8DIFF*/)
	{
	    header('Content-Type:' . $strType . '; charset=' . $strCharset);
	}
}