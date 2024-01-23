<?php
/**
 * 校验器之一，检查是否输入为空
 * @package Validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-26
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_Empty extends Bingo_Validate_Abstract 
{
    private $_trueIfEmtpy = false;
    
    private $_trimEnable = true;
    
    public function __construct($trimEnable = true,$trueIfEmtpy = false)
    {
        $this->_trueIfEmtpy = $trueIfEmtpy;
        $this->_trimEnable = $trimEnable;
    }
    
    public function isValid($value)
    {
        if ($this->_trimEnable) $value = trim($value);
        if (empty($value)) {
            return $this->_trueIfEmtpy;
        }
        return !($this->_trueIfEmtpy);
    }
    
    public function setTrimEnable($flag)
    {
        $this->_trimEnable = $flag;
    }
}