<?php
ini_set('display_errors', 1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

$root = dirname(__FILE__);
require_once ($root . '/smarty/Smarty.class.php');
$smarty = new Smarty();
$smarty->setTemplateDir($root . '/template');
$smarty->setConfigDir($root . '/config');
$smarty->addPluginsDir($root . '/plugin');
$smarty->setLeftDelimiter('{%');
$smarty->setRightDelimiter('%}');
$smarty->assign(include($root . '/data/index.php'));
$smarty->display('page/index.tpl');