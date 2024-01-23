<?php
/**
 * 校验器之一，检查是否是有效的数字
 * @package Validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-26
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_Numeric extends Bingo_Validate_Abstract 
{
    private $_trimEnable = true;
    
    public function __construct($trimEnable=true)
    {
        $this->_trimEnable = $trimEnable;
    }
    
    public function isValid($value)
    {
        //todo
        if (!is_string($value) && !is_int($value) && !is_float($value)) {
            trigger_error('Bingo_Validate_Numeric:input [' . $value .'] is invalid!',
            E_USER_WARNING);
            return false;
        }
        if ($this->_trimEnable) $value = trim($value);
        if (is_numeric($value)) {
            return true;
        }
        return false;
    }
}