<?php
/**
 * @author xuliqiang <xuliqiang@baidu.com>
 * @TODO timer,log
 *
 * 2012-09-24
 * @modifid reeze <xiaxuhong@baidu.com>
 * For backward compatibility Bdsock use camel instead. it almost the same as Bd_Rpc_Camel
 * It can be used to community with raw struct services as before
 */

require_once 'Bd/Rpc/Abstract.php';
require_once 'Bingo/Timer.php';
class Bd_Rpc_Bdsock extends Bd_Rpc_Abstract
{    
    protected $_strServerName = '';
    protected $_strMethod = '';

    protected $_arrExtra = array();

    public function __construct($strServerName, $arrServers=array())
    {
        $this->_strServerName = (string) $strServerName;
        if (! function_exists('camel')) {
            throw new Exception('camel function must be loaded for using Bd_Rpc_Bdsock!');
        }
        camel_set_logid(Bingo_Log::getLogId());
    }
    
    public function setOptions($arrConfig)
    {
        if (isset($arrConfig['bk'])) {
            $this->_arrExtra['bk'] = intval($arrConfig['bk']);
        }
        if (isset($arrConfig['retry'])) {
            $this->_arrExtra['retry'] = intval($arrConfig['retry']);
        }
        if (isset($arrConfig['ctimeout'])) {
            $this->_arrExtra['ctimeout'] = intval($arrConfig['ctimeout']);
        }
        if (isset($arrConfig['wtimeout'])) {
            $this->_arrExtra['wtimeout'] = intval($arrConfig['wtimeout']);
        }
        if (isset($arrConfig['rtimeout'])) {
            $this->_arrExtra['rtimeout'] = intval($arrConfig['rtimeout']);
        }
        if (isset($arrConfig['method'])) {
            $this->_strMethod = (string) $arrConfig['method'];
        }
        if (isset($arrConfig['nsHeadReserved'])) {
            $this->_arrExtra['nsHeadReserved'] = intval($arrConfig['nsHeadReserved']);
        }
        if (isset($arrConfig['nsHeadId'])) {
            $this->_arrExtra['nsHeadId'] = intval($arrConfig['nsHeadId']);
        }
        return $this;
    }
    
    public function setMethod($strMethod)
    {
        $this->_strMethod = (string)$strMethod;
        return $this;
    }

    public function setNsheadReserved($intNsheadReserved) {
        $this->_arrExtra['nsHeadReserved'] = intval($intNsheadReserved);
    }
    
    public function setNsheadId($intNsheadId) {
        $this->_arrExtra['nsHeadId'] = $intNsheadId;
    }
    
    // 对于以后 camel 支持新添加的 extra 字段的支持，也算是一个后门，key 及 val 请rd自行保证正确。
    // 不推荐使用
    public function setExtra($strKey,$mixVal) {
        $strKey = strval($strKey);
        $this->_arrExtra[$strkey] = $mixVal;
    }
    
    public function strCall($strInput, $intRetry = 1)
    {
        if (!is_null($intRetry)) $this->_arrExtra['retry'] = intval($intRetry);

	$this->_arrExtra['conv'] = RAL_CONV_STRING;

        $out = camel($this->_strServerName, $this->_strMethod, $strInput, $this->_arrExtra);

	unset($this->_arrExtra['conv']);

	return $out;
    }
    
    public function call($arrInput, $intRetry = 1)
    {
	$arrOutput = false;

        if (!is_null($intRetry)) $this->_arrExtra['retry'] = intval($intRetry);

	$input = $arrInput;
	if($this->haveCustomConverter()) {
	    $this->_arrExtra['conv'] = RAL_CONV_STRING;	
	    if($this->_cbkSendConvert) {
		$input = call_user_func_array($this->_cbkSendConvert, array($arrInput));
		if($input === false) {
		    return false;
		}
	    }
	}

        $out = camel($this->_strServerName, $this->_strMethod, $input, $this->_arrExtra);

	if($out === false) {
	    return false;
	}

	$arrOutput = $out;
	if(isset($this->_arrExtra['conv']) && $this->_arrExtra['conv'] === RAL_CONV_STRING) {
	    // default mc_pack
	    if (!$this->_cbkReceiveConvert) {
		$arrOutput = mc_pack_pack2array($out);
	    }
	    else {
		$arrOutput = call_user_func_array($this->_cbkReceiveConvert, array($out));
	    }

	    if (false === $arrOutput) {
		    return false;
	    }
	}

	return $arrOutput;
    }
}
