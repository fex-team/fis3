<?php
/**
 * 校验器之一，检查是否是一个合法的IP地址
 * @package Validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-26
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_Ip extends Bingo_Validate_Abstract 
{
    private $_inputIsNum = true;
    
    public function __construct($inputIsNum=true)
    {
        $this->_inputIsNum = $inputIsNum;
    }
    
    public function isValid($value)
    {
        if (empty($value)) {
            return false;
        }
        if ($this->_inputIsNum) {
            //
            if (false===long2ip($value))
            {
                return false;
            }
        } else  {
            //127.0.0.1
            if (false===ip2long($value))
            {
                return false;
            }
        }
        return true;
    }
}