<?php
/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file Bd/Pic/Log.php
 * @author wenweidong(wenweidong@baidu.com)
 * @date 2012/03/21 21:49:14
 * @brief 
 *  
 **/


class Bd_Pic_Log {
	protected static $_isInit	= false;
	/**
	 * log callback
	 */
	protected static $_cbLogNotice	= null;
	protected static $_cbLogWarning = null;


	public static function addNotice($key, $value) {
		if (!self::$_isInit) {
			self::_initLog();
		}
		$errno = (IS_ODP === true) ? $errno : E_USER_NOTICE;
		call_user_func_array(self::$_cbLogNotice, array($key, $value));
	}

	public static function warning($strLog, $errno) {
		if (!self::$_isInit) {
			self::_initLog();
		}
		$errno = (IS_ODP === true) ? $errno : E_USER_WARNING;
		call_user_func_array(self::$_cbLogWarning, array($strLog, $errno));
	}

	protected static function _initLog() {
		if (defined('IS_ODP') && true === IS_ODP) {
			self::$_cbLogNotice  = array('Bd_Log', 'addNotice');
			self::$_cbLogWarning = array('Bd_Log', 'warning'); 
		} else {
			self::$_cbLogNotice  = 'trigger_error';
			self::$_cbLogWarning = 'trigger_error';
		}
		self::$_isInit = true;
	}
}



/* vim: set expandtab ts=4 sw=4 sts=4 tw=100 */
?>
