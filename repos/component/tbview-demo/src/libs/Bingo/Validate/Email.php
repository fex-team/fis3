<?php
/**
 * У����֮һ������Ƿ��ǺϷ����ʼ�
 * @package Validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-26
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate_Email extends Bingo_Validate_Abstract 
{
    public function isValid($value)
    {
        if ((strpos($value, '..') !== false) ||
            (!preg_match('/^(.+)@([^@]+)$/', $value, $matches))) {
            return false;
        }        
        $_local = $matches[1];
        $_host = $matches[2];
        if ((strlen($_local) > 64) || (strlen($_host) > 255)) {
            return false;
        }        
        //check host todo
        if (false === (strpos($_host,'.'))) {
            return false;        
        }
        return true;
    }
}