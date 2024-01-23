<?php
/**
 * ���嵱ǰ·����������Bingo2.0���뵽php��include_path��
 * ��������Bingo2.0�Ŀ���ص�php��include_path������Ҫ�������롣
 */
define('ROOT_PATH' , dirname(__FILE__));
error_reporting(E_ALL);
$strBingoLibPath = ROOT_PATH . DIRECTORY_SEPARATOR . 'libs';
set_include_path(get_include_path() . PATH_SEPARATOR . $strBingoLibPath);

require_once 'Bingo/Timer.php';
require_once 'Bingo/Page.php';

try{
	//����FrontController��
	require_once 'Bingo/Controller/Front.php';
	//ʵ�������󣬲����ô���Actions�ĸ�Ŀ¼
	$objFrontController = Bingo_Controller_Front::getInstance(array(
		'actionDir' => ROOT_PATH . DIRECTORY_SEPARATOR . 'actions' . DIRECTORY_SEPARATOR,
	    //'beginRouterIndex'=>1,
	));
	//��Ӿ�̬·�ɣ���staticֱ��ӳ�䵽test/static
	$objFrontController->addStaticRouter('static', 'test/static');
	//��ӹ���·�ɣ�������test/:id/echo��URLӳ�䵽test/rule
	$objFrontController->addRouterRule('hello/pb', array(
		'rule' => array('hello', ':fname', 'pb'),
	));
	$objFrontController->dispatch();
} catch (Exception $e) {
	//������
}