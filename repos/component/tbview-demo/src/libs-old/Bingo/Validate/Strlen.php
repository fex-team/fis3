<?php
/**
 * 校验器之一，检查字符串的长度是否在制定范围内
 * @package Validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-26
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_Strlen extends Bingo_Validate_Abstract 
{
    private $_min = 0;
    
    private $_max = 0;
    
    private $_trimEnable = true;
    
    public function __construct($min,$max,$trimEnable = true)
    {
        $min = intval($min);
        $max = intval($max);
        if ($max>$min) {
            $this->_min = $min;
            $this->_max = $max;
        }
        $this->_trimEnable = $trimEnable;
    }
    
    public function isValid($value)
    {
        if ($this->_trimEnable) $value = trim($value);
        $_length = strlen($value);
        if ( $_length<$this->_min || $_length>$this->_max ) {
            return false;
        }
        return true;
    }
}