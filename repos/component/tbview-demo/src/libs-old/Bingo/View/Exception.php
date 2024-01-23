<?php
/**
 * Bingo_View exception
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package bingo
 * @since 2010-05-07
 *
 */
class Bingo_View_Exception extends Exception
{
	public function __construct($message, $code)
	{
		$arrTrace = debug_backtrace();
		$strFile = $arrTrace[1]['file'];
		$intLine = $arrTrace[1]['line'];
		$message = $strFile . ':' . $intLine . ' ' . $message;
		parent::__construct($message, $code);
	}
}