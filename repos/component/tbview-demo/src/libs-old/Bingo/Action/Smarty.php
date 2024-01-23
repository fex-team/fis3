<?php
/**
 * 包含有smarty的Action基类封装
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package Bigno2
 * @since 2010-05-24
 */
require_once 'Bingo/Action/Abstract.php';
require_once 'Bingo/View/Smarty.php';
abstract class Bingo_Action_Smarty extends Bingo_Action_Abstract
{
    public function assign($strKey, $mixValue) 
    {
        return Bingo_View_Smarty::assign($strKey, $mixValue);
    }    
    
    public function display($strTemplate)
    {
        return Bingo_View_Smarty::display($strTemplate);
    }
}