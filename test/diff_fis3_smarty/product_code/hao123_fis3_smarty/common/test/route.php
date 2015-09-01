<?php
	$route_url =  $_SERVER['SCRIPT_URL'] ? $_SERVER['SCRIPT_URL'] : $_SERVER['REQUEST_URI'];
	$route_root_dir = dirname(__FILE__)."/";
	//初始化环境变量
	require_once $route_root_dir."env/env_init.php";
	//url->php路由映射
	$routeMap = array(
					  "fetchwidget"=>"fetchwidget",
					  "api"=>"api",
					  "openapi"=>"openapi",
					  "applistapi"=>"applistapi",
					  "hotsitecustom"=>"hotsitecustom",
					  "static304"=>"static304/static304",
				);

	if( preg_match("/".implode('|', array_keys($routeMap ) )."/",$route_url,$matchArray)){
		require_once $route_root_dir. $routeMap[ $matchArray[0] ] .".php";
	} else{
		require_once $route_root_dir."BaseController.php";
	}