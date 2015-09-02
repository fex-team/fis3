<?php
class FISBlockFisWidget{//为了处理参数压栈，定义一个静态变量：参数栈
    private static $_vars = array();
    public static function push($params, &$tpl_vars){
        self::$_vars[] = $tpl_vars;
        foreach($params as $key => $value){
            if($value instanceof Smarty_Variable){
                $tpl_vars[$key] = $value;
            } else {
                $tpl_vars[$key] = new Smarty_Variable($value);
            }
        }
    }
    public static function pop(&$tpl_vars){
        $tpl_vars = array_pop(self::$_vars);
    }
}

function smarty_block_widget_inline($params, $content, Smarty_Internal_Template $template, &$repeat){
    if(!$repeat){//block 定义结束
        FISBlockFisWidget::pop($template->tpl_vars);
        return $content;
    }else{//block 定义开始
        FISBlockFisWidget::push($params, $template->tpl_vars);
    }
}
