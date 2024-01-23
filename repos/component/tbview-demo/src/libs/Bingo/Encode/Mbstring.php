<?php
/**
 * 基于mb_string扩展的编码转化库
 */
require_once 'Bingo/Encode/Abstract.php';
class Bingo_Encode_Mbstring extends Bingo_Encode_Abstract 
{
    public function __construct()
    {
    	if (! function_exists('mb_convert_encoding')) {
    		throw new Exception('can not find function mb_convert_encoding()');
    	}
    }
    /**
	 * 通用情况下的编码转化
	 *
	 * @param mixed $value
	 */
	public function convert($strValue, $strToEncode, $strFromEncode)
	{
		return mb_convert_encoding($strValue, $strToEncode, $strFromEncode);
	}
    /**
	 * 转换GET数据
	 *
	 * @param mixed $value
	 */
	public function convertGet($strValue, $strToEncode, $strFromEncode) 
	{
		return mb_convert_encoding($strValue, $strToEncode, $strFromEncode);
	}
	/**
	 * 转化POST数据
	 *
	 * @param mixed $value
	 */
	public function convertPost($strValue, $strToEncode, $strFromEncode)
	{
		return mb_convert_encoding($strValue, $strToEncode, $strFromEncode);
	}
}