<?php
/**
 * 编码转化接口类
 * @author xuliqiang<xuliqiang@baidu.com>
 * @since 2009-12-01
 *
 */
abstract class Bingo_Encode_Abstract
{
	/**
	 * 转换GET数据
	 *
	 * @param mixed $value
	 */
	abstract public function convertGet($strValue, $strToEncode, $strFromEncode);
	/**
	 * 转化POST数据
	 *
	 * @param mixed $value
	 */
	abstract public function convertPost($strValue, $strToEncode, $strFromEncode);
	/**
	 * 通用情况下的编码转化
	 *
	 * @param mixed $value
	 */
	abstract public function convert($strValue, $strToEncode, $strFromEncode);
}