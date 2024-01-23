<?php
/**
 * TODO:
 * 		getInput  : 获取输入参数。需要是解析好的格式。
 * 		setOutputHeader : 设置输出头，比如说输出的type
 * 
 */
require_once 'Bingo/Action/Abstract.php';
abstract class Bingo_Action_Server extends Bingo_Action_Abstract
{
    protected $_strDefaultType = 'json';//默认输出格式
    
    protected $_arrAllTypes    = array('json', 'mcpack', 'php');//默认支持的输出格式
    
    protected $_arrTypeCbks    = array(
        'json'	=> 'Bingo_String::array2json',
        'mcpack'=> 'mc_pack_array2pack',
        'php'	=> 'serialize',
    );

    protected $_arrOutput     = array();
    
    protected $_intErrno      = 0;

    protected $_strErrmsg     = '';
    
    protected $_bolBingoAutoFlush      = false;
    
    public function addOutputType($strType, $cbkConvert)
    {
        if (is_callable($cbkConvert)) {
            $this->_arrAllTypes[] = $strType;
            $this->_arrTypeCbks[$strType] = $cbkConvert;
        }
    }
    
    public function setOutput($arrOutput) 
    {
        $this->_arrOutput = (array)$arrOutput;
    }
    
    public function setErrno($intErrno)
    {
        $this->_intErrno = intval($intErrno);
    }
    
    public function addOutput($strKey, $mixValue)
    {
        $this->_arrOutput[strval($strKey)] = $mixValue;
    }

    public function setError($intErrno, $strErrmsg='')
    {
	$this->_intErrno = intval($intErrno);
        $this->_strErrmsg = strval($strErrmsg);
    }

    public function setErrmsg($strErr) 
    {
        $this->_strErrmsg = strval($strErr);
    }
    
    public function bingoAutoFlush()
    {
        $strType = Bingo_Http_Request::get('alt', $this->_strDefaultType);
        if (! in_array($strType, $this->_arrAllTypes)) {
            $strType = $this->_strDefaultType;
        }
        $cbkCall = $this->_arrTypeCbks[$strType];
        $arrOutput = array(
            'no'    => $this->_intErrno,
            'data'  => $this->_arrOutput,
            'error' => $this->_strErrmsg,
        );
        echo call_user_func_array($cbkCall, array($arrOutput));
        $this->_bolBingoAutoFlush = true;
    }
    
    public function __destruct()
    {
        if (! $this->_bolBingoAutoFlush) {
            $this->bingoAutoFlush();
        }
    }
}
