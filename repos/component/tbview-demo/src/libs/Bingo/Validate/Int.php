<?php
/**
 * 校验器之一，检查是否是INT类型
 * @package Validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-26
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_Int extends Bingo_Validate_Abstract 
{
    private $_trimEnable = true;
    public function __construct($trimEnable = true)
    {
        $this->_trimEnable = $trimEnable;
    }
    public function isValid($value)
    {
        //todo
        if ($this->_trimEnable)$value = trim($value);
        if (strval(intval($value)) == $value) {
            return true;
        }
        return FALSE;
    }
}