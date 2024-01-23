<?php
/**
 * 校验器之一，调用用户自定义的函数
 * @package Validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-26
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_Callback extends Bingo_Validate_Abstract 
{
    private $_callback = NULL;
    
    public function __construct($callback)
    {
        if (is_callable($callback)) {
            $this->_callback = $callback;
        } else {
            trigger_error('Bingo_Validate_Callback::__construct():callbcak is invalid!',
            E_USER_WARNING);
        }
    }
    public function isValid($value)
    {
        if (!empty($this->_callback)) {
            return call_user_func_array($this->_callback, array($value));
        }
        return false;
    }
}