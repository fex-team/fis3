<?php
/**
 * ����ת���ӿ���
 * @author xuliqiang<xuliqiang@baidu.com>
 * @since 2009-12-01
 *
 */
abstract class Bingo_Encode_Abstract
{
	/**
	 * ת��GET����
	 *
	 * @param mixed $value
	 */
	abstract public function convertGet($strValue, $strToEncode, $strFromEncode);
	/**
	 * ת��POST����
	 *
	 * @param mixed $value
	 */
	abstract public function convertPost($strValue, $strToEncode, $strFromEncode);
	/**
	 * ͨ������µı���ת��
	 *
	 * @param mixed $value
	 */
	abstract public function convert($strValue, $strToEncode, $strFromEncode);
}