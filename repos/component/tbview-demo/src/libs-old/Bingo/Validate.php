<?php
/**
 * 用于过滤数据
 * @package validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-21
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate
{
    /**
     * 存储错误数据
     *
     * @var 数组
     */
    private $_messages = array();
    /**
     * 校验规则
     *
     * @var 数组
     */
    private $_rules = array();
    /**
     * 是否一碰到校验不通过的情况就直接返回
     *
     * @var boolean
     */
    private $_breakOnFailure = true;
    /**
     * 构造函数
     *
     * @param boolean $breakOnFailure
     */
    public function __construct($breakOnFailure=true)
    {
        $this->setBreakOnFailure($breakOnFailure);
    }
    /**
     * 添加一条校验规则
     *
     * @param 需要校验的变量，任何类型 $var
     * @param 校验器 $validator
     * @param 错误信息 $errorMsg
     * @param boolean $breakOnFailure
     * @return true/false
     */
    public function addValidator($var, $validator, $errorMsg, $breakOnFailure=NULL)
    {
        if (NULL == $breakOnFailure) {
            $breakOnFailure = $this->_breakOnFailure;
        }
        //check todo
        if ( (!empty($validator)) && (is_subclass_of($validator, 'Bingo_Validate_Abstract')) ) {
            $this->_rules[] = array($var,$validator,$errorMsg,$breakOnFailure);
            return true;
        }
        trigger_error('Bingo_Validate::addValidator():validator is inValid!',E_USER_WARNING);
        return false;
    }
    /**
     * 开始判定
     *
     * @return true/false
     */
    public function isValid()
    {
        $this->_messages = array();      
        if (!empty($this->_rules)) {
            $hasError = false;
            $arrRule = $this->_rules;
            //flush
            $this->_rules = array();
            foreach ($arrRule as $rule) {
                list($_var, $_validator, $_msg, $_breakOnFailure) = $rule;
                if (!$_validator->isValid($_var)) {
                    $this->_addMessage($_msg);
                    if ($_breakOnFailure) {
                        return false;
                    } else {
                        $hasError = true;
                    }
                }
            }
            if ($hasError) {
                return false;
            }            
        }
        return true;
    }
    /**
     * 获取错误信息数组
     *
     * @return unknown
     */
    public function getMessage()
    {
        return $this->_messages;
    }
    /**
     * 获取错误信息，表示成字符串形式
     *
     * @param unknown_type $_str
     * @return unknown
     */
    public function getMessage2String($_str)
    {
        if (!empty($this->_messages)) {
            return implode($_str,$this->_messages);
        }
        return '';
    }
    /**
     * 设置是否易出错就退出
     *
     * @param unknown_type $_flag
     */
    public function setBreakOnFailure($_flag)
    {
        $this->_breakOnFailure = $_flag;
    }
    
    private function _addMessage($msg)
    {
        $this->_messages[] = $msg;
    }
}