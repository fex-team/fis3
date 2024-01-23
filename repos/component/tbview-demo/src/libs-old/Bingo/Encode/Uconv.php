<?php
/**
 * ����uconv��չ�ı���ת���⣬Ŀǰֻ֧��utf8->gbk
 */
require_once 'Bingo/Encode/Abstract.php';
require_once 'Bingo/Encode.php';
class Bingo_Encode_Uconv extends Bingo_Encode_Abstract 
{
	const UCONV_INVCHAR_IGNORE   = 0x01;
    const UCONV_INVCHAR_REPLACE  = 0x02;
    const UCONV_INVCHAR_ERROR    = 0x03;
    const UCONV_INVCHAR_ENTITES  = 0x04;
    /**
     * ���캯��
     *
     * @param array $arrConfig
     */
    public function __construct()
    {
    	if (! function_exists('utf8_to_gbk')) {
    		throw new Exception('can not find function utf8_to_gbk()');
    	}
    }
    /**
	 * ͨ������µı���ת��
	 *
	 * @param mixed $value
	 */
	public function convert($strValue, $strToEncode, $strFromEncode)
	{
		return $this->convertPost($strValue, $strToEncode, $strFromEncode);
	}
    /**
	 * ת��GET����
	 *
	 * @param mixed $value
	 */
	public function convertGet($strValue, $strToEncode, $strFromEncode) 
	{
		$boolRs = utf8_to_gbk($strValue, self::UCONV_INVCHAR_ERROR);
		if ($boolRs) {
			$strValue = $boolRs;
		}
		return $strValue;
	}
	/**
	 * ת��POST����
	 *
	 * @param mixed $value
	 */
	public function convertPost($strValue, $strToEncode, $strFromEncode)
	{
		$boolRs = utf8_to_gbk($strValue, self::UCONV_INVCHAR_ENTITES);
		if ($boolRs) {
			$strValue = $boolRs;
		}
		return $strValue;
	}
	/**
	 * ����Ƿ���UTF8�ַ�
	 *
	 * @param string $value
	 * @return bool
	 */
	public function isUtf8($strValue)
	{
		if (is_utf8($strValue)) {
			if (utf8_to_gbk($strValue, self::UCONV_INVCHAR_ERROR)) {
				return true;
			}
		}
		return false;
	}
}