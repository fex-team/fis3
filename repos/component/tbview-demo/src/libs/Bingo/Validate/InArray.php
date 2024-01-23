<?php
/**
 * У����֮һ����������Ƿ��ڸ�������
 * @package Bingo_Validate
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-05-28
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_InArray extends Bingo_Validate_Abstract 
{
    protected $_arrData = array();
    
    public function __construct($arrData)
    {
        $this->_arrData = $arrData;
    }
    
    public function isValid($value)
    {
        return (bool)in_array($value, $this->_arrData);
    }
}