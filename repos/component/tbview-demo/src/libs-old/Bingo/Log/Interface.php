<?php
/**
 * Log interface
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-26
 *
 */
interface Bingo_Log_Interface
{
	public function check($intLevel);
	
	public function log($intLogLevel, $strLog, $strFile, $intLine, $intLogId);
	
	public function flush();
}