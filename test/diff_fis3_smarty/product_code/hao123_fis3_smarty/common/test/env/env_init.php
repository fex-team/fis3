<?php

	/**
	 * initial framework's environment  
	 *
	 * initial default include_path, autoload, context and so on,
	 * this file is required by framework/common/common.conf.php
	 * which is auto prepended before every request.
	 *
	 * @package bingo/framework/common
	 * @author  mozhuoying@baidu.com 
	 */

	define('WEBROOT_PATH', dirname(__FILE__).'/../../../');
	define('DATA_ROOT', WEBROOT_PATH."test/common/data/");
	define('UI_ROOT', WEBROOT_PATH."test/common/");
	define('TEMPLATE_PATH',      WEBROOT_PATH.'template/');
	define('TEMPLATE_COMPLITE_PATH',      WEBROOT_PATH.'templates_c/');
	define('SCRIPT_PATH',        ROOT_PATH.'script/');	
	define('CONFIG_PATH',        WEBROOT_PATH.'config/');
	define('LIB_PATH',       WEBROOT_PATH."test/common/lib/");
	define('SMARTY_PLUGINS_DIR', WEBROOT_PATH."smarty/plugins/");
	define('FIS_SMARTY_PLUGINS_DIR', WEBROOT_PATH."plugin/");
	//引进smarty模拟类
	require_once dirname(__FILE__).'/SimpleTemplate.class.php';
	//格式化json数据类
	require_once LIB_PATH.'/jsonformat/jsonformat.class.php';
	//设置cms数据类
	require_once LIB_PATH.'/cmsdata/cmsDataAdapter.class.php';
	//ui适配器
	require_once UI_ROOT . '/adapterUi.php';

?>
