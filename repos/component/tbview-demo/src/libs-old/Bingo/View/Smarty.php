<?php
/**
 * 对smarty的一种简单封装
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package Bingo2
 * @since 2010-05-24
 */
require_once 'Third/Smarty/Smarty.class.php';
class Bingo_View_Smarty
{
    public static $view = NULL;
    public static function getView ()
    {
        if (empty(self::$view)) {
            self::$view = new Smarty();
        }
        return self::$view;
    }
    public static function setOptions($arrConfig)
    {
        $objSmarty = self::getView();
        if (isset($arrConfig['template_dir'])) $objSmarty->template_dir = $arrConfig['template_dir'];
		if (isset($arrConfig['compile_dir'])) $objSmarty->compile_dir = $arrConfig['compile_dir'];
        if (isset($arrConfig['config_dir'])) $objSmarty->template_dir = $arrConfig['config_dir'];
        if (isset($arrConfig['cache_dir'])) $objSmarty->cache_dir = $arrConfig['cache_dir'];
        if (isset($arrConfig['plugins_dir'])) $objSmarty->plugins_dir = $arrConfig['plugins_dir'];
        if (isset($arrConfig['left_delimiter'])) $objSmarty->left_delimiter = $arrConfig['left_delimiter'];
        if (isset($arrConfig['right_delimiter'])) $objSmarty->right_delimiter = $arrConfig['right_delimiter'];
        if (isset($arrConfig['compile_check'])) $objSmarty->compile_check = $arrConfig['compile_check'];
    }
    public static function assign($key, $value)
    {
        self::getView()->assign($key, $value);
    }
    public static function display($template)
    {
        self::getView()->display($template);
    }
}