<?php
/**
 * 定义当前路径常量，把Bingo2.0加入到php的include_path。
 * 如果本身把Bingo2.0的库加载到php的include_path，则不需要下述代码。
 */
define('ROOT_PATH' , dirname(__FILE__));
error_reporting(E_ALL);
$strBingoLibPath = ROOT_PATH . DIRECTORY_SEPARATOR . 'libs';
set_include_path(get_include_path() . PATH_SEPARATOR . $strBingoLibPath);

require_once 'Bingo/Timer.php';
require_once 'Bingo/Page.php';

try{
	//加载FrontController库
	require_once 'Bingo/Controller/Front.php';
	//实例化对象，并设置处理Actions的根目录
	$objFrontController = Bingo_Controller_Front::getInstance(array(
		'actionDir' => ROOT_PATH . DIRECTORY_SEPARATOR . 'actions' . DIRECTORY_SEPARATOR,
	    //'beginRouterIndex'=>1,
	));
	//添加静态路由，把static直接映射到test/static
	$objFrontController->addStaticRouter('static', 'test/static');
	//添加规则路由，把满足test/:id/echo的URL映射到test/rule
	$objFrontController->addRouterRule('hello/pb', array(
		'rule' => array('hello', ':fname', 'pb'),
	));
	$objFrontController->dispatch();
} catch (Exception $e) {
	//出错处理
}