<?php
/**
 * rpc base class
 * 
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package baidu
 * @since 2010-05-24
 * 
 */
require_once 'Bingo/Log.php';
abstract class Bd_Rpc_Abstract
{
    /**
     * 如果需要完全关闭log，则建议把它设置成false。
     * @var string
     */
    protected $_strLogModule = 'rpc';
    /**
     * 目前只支持三种
     * 空：没有head
     * nshead: nshead
     * shead : shead
     * @var unknown_type
     */
    protected $_strHead = 'nshead';
    protected $_strServerName = '';
    
    protected $_arrAllowHeads = array('shead', 'nshead');
    
    protected $_cbkSendConvert = null;
    
    protected $_cbkReceiveConvert = null;
    
    protected $_intNsheadReserved = 0;
    
    abstract public function setOptions($arrConfig);
    
    abstract function call($arrInput, $intRetry = 1);
    
    public function setLogModule($strLogModule) 
    {
        if (! empty($strLogModule)) {
            $this->_strLogModule = $strLogModule;
        }
    }
    
    public function setHead($strHead)
    {
        if (! empty($strHead)) {
            $strHead = strtolower($strHead);
            if (! in_array($strHead, $this->_arrAllowHeads)) {
                throw new Exception('Bd_Rpc_Abstract :: setHead failure! head=' . $strHead);
            }
        }
        $this->_strHead = $strHead;
    }
    
    public function setSendConvert($callback)
    {
        if (is_callable($callback)) {
            $this->_cbkSendConvert = $callback;
        }
    }
    
    public function setReceiveConvert($callback)
    {
        if (is_callable($callback)) {
            $this->_cbkReceiveConvert = $callback;
        }
    }

    public function haveCustomConverter()
    {
	return $this->_cbkSendConvert || $this->_cbkReceiveConvert; 
    }
    
    public function setNsheadReserved($intReserved)
    {
        $this->_intNsheadReserved = intval($intReserved);
    }
    
    public function packInput($arrInput, $with_head=true)
    {
        $strBody = '';
        if (is_null($this->_cbkSendConvert)) {
            //mcpack
            require_once 'Bd/Mcpack.php';
            $strBody = Bd_Mcpack::array2pack($arrInput);
        } else {
            $strBody = call_user_func_array($this->_cbkSendConvert, array($arrInput));
        }
        if ($strBody === false) {
            Bingo_Log::warning('packInput failure! server=' . $this->_strServerName, $this->_strLogModule);
            return false;
        }
        if (empty($this->_strHead) || !$with_head) {
            return $strBody;
        } else {
            $strHead = '';
            if ($this->_strHead == 'nshead') {
                require_once 'Bd/Nshead.php';
                $strHead = Bd_Nshead::pack(strlen($strBody), $this->_intNsheadReserved);
            } else {
                require_once 'Bd/Shead.php';
                $strHead = Bd_Shead::pack(strlen($strBody));
            }
        }
        return $strHead . $strBody;
    }
    
    public function unpackOutput($strOutput)
    {
        $arrOutput = array();
        if (is_null($this->_cbkReceiveConvert)) {
            //mcpack
            require_once 'Bd/Mcpack.php';
            $arrOutput = Bd_Mcpack::pack2array($strOutput);
        } else {
            $arrOutput = call_user_func_array($this->_cbkReceiveConvert, array($strOutput));
        }
        return $arrOutput;
    }
}
