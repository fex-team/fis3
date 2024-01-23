<?php
/**
 * 校验器之一，检查是否正则匹配
 * @package Validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-26
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_Regex extends Bingo_Validate_Abstract 
{
    private $_patern = '';
    
    private $_trueIfMatch = true;
    
    public function __construct($patern,$trueIfMatch = true)
    {
        $this->_patern = $patern;
        $this->_trueIfMatch = $trueIfMatch;
    }
    public function isValid($value)
    {
        if ( !is_string($value) && !is_int($value) && !is_float($value) ) {
            trigger_error('Bingo_Validate_Regex::isValid():input [' . $value . '] is invalid!',
                E_USER_WARNING);
            return false;
        }
        $status = preg_match($this->_patern, $value);
        if (false === $status) {
            trigger_error('Bingo_Validate_Regex::isValid():preg_match inner error!',E_USER_WARNING);
            return false;
        }
        if (!$status) {
            //not match
            return !($this->_trueIfMatch);
        }
        return $this->_trueIfMatch;
    }
}