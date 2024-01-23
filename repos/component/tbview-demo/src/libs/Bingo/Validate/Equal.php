<?php
/**
 * 校验器之一，检查输入是否和其他变量相等
 * @package Validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-26
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_Equal extends Bingo_Validate_Abstract 
{
    private $_equalVar = NULL;
    //todo
    private $_varType = NULL;
    public function __construct($equalVar = NULL,$varType = NULL)
    {
        $this->_equalVar = $equalVar;
        $this->_varType = $varType;
    }
    public function isValid($value)
    {
        if ( $value == $this->_equalVar ) {
            return true;
        }
        return false;
    }
}