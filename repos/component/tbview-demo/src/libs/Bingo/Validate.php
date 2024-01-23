<?php
/**
 * ���ڹ�������
 * @package validator
 * @author xuliqiang@baidu.com
 * @since 2009-08-21
 *
 */
require_once 'Bingo/Validate/Abstract.php';
class Bingo_Validate
{
    /**
     * �洢��������
     *
     * @var ����
     */
    private $_messages = array();
    /**
     * У�����
     *
     * @var ����
     */
    private $_rules = array();
    /**
     * �Ƿ�һ����У�鲻ͨ���������ֱ�ӷ���
     *
     * @var boolean
     */
    private $_breakOnFailure = true;
    /**
     * ���캯��
     *
     * @param boolean $breakOnFailure
     */
    public function __construct($breakOnFailure=true)
    {
        $this->setBreakOnFailure($breakOnFailure);
    }
    /**
     * ���һ��У�����
     *
     * @param ��ҪУ��ı������κ����� $var
     * @param У���� $validator
     * @param ������Ϣ $errorMsg
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
     * ��ʼ�ж�
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
     * ��ȡ������Ϣ����
     *
     * @return unknown
     */
    public function getMessage()
    {
        return $this->_messages;
    }
    /**
     * ��ȡ������Ϣ����ʾ���ַ�����ʽ
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
     * �����Ƿ��׳�����˳�
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