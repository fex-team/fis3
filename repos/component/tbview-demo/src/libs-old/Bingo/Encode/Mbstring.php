<?php
/**
 * ����mb_string��չ�ı���ת����
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
	 * ͨ������µı���ת��
	 *
	 * @param mixed $value
	 */
	public function convert($strValue, $strToEncode, $strFromEncode)
	{
		return mb_convert_encoding($strValue, $strToEncode, $strFromEncode);
	}
    /**
	 * ת��GET����
	 *
	 * @param mixed $value
	 */
	public function convertGet($strValue, $strToEncode, $strFromEncode) 
	{
		return mb_convert_encoding($strValue, $strToEncode, $strFromEncode);
	}
	/**
	 * ת��POST����
	 *
	 * @param mixed $value
	 */
	public function convertPost($strValue, $strToEncode, $strFromEncode)
	{
		return mb_convert_encoding($strValue, $strToEncode, $strFromEncode);
	}
}