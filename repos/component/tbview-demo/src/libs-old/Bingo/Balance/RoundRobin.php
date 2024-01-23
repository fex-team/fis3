<?php
/**
 * RoundRobin ��ѯ���ؾ����㷨
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-06-01
 * @package bingo
 */
require_once 'Bingo/Balance/Abstract.php';
class Bingo_Balance_RoundRobin extends Bingo_Balance_Abstract
{
    protected $_intBalanceKey    = null;
    
    protected $_intConnectNum    = 0;
    
    public function __construct($intBalanceKey = null)
    {
        if (! is_null($intBalanceKey)) {
            $this->setBalanceKey($intBalanceKey);
        } else {
            $this->_intBalanceKey = mt_rand();
        }
    }  
    
    public function setBalanceKey($intBalanceKey)
    {
        $this->_intBalanceKey = intval($intBalanceKey);
        return $this;
    }
    
	public function getConnection()
	{
	    $arrServers = $this->_arrServers;
		$intTotalServers = count($arrServers);
		if ($intTotalServers == 1) {
			return $this->_objServer->realConnect($arrServers[0]);
		} else {
			$_intKey = $this->_intBalanceKey % $intTotalServers;
			$_resRet = $this->_objServer->realConnect($arrServers[$_intKey]);
			++ $this->_intBalanceKey;
			++ $this->_intConnectNum;
			if ($_resRet) return $_resRet;
			//����������Ӵ�������Ҫ�Ͽ�����Ȼ�п�����ѭ����
			if ($this->_intConnectNum > $this->_intMaxConnectNum) 
			    return false;
		}
		return false;
	}
}