<?php
/**
 * 校验器之一，数字大小在两者之间
 * @package Validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-26
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_Between extends Bingo_Validate_Abstract 
{
    private $_start = 0;
    
    private $_end = 0;
    
    private $_strict = true;
    
    public function __construct($start,$end,$strict = true)
    {
        $this->_start = $start;
        $this->_end = $end;
        $this->_strict = $strict;
    }
    
    public function isValid($value)
    {
        if ($this->_strict) {
            if ($value>=$this->_start && $value <=$this->_end) {
                return true;
            }
        } else {
            if ($value>$this->_start && $value <$this->_end) {
                return true;
            }
        }
        return false;
    }
}