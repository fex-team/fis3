<?php
/**
 * �漴��Ŀǰʵ�ֵķǳ��򵥡���ʵ��Ȩ�أ���Ȩ�ص����ֿ���ͨ������Ӽ���ʵ�֡�
 * ��Ҫ����Ȩ�ص��㷨����ô�Ϳ���ֱ�ӿ����������㷨�������֡�
 * @author xuliqiang<xuliqiang@baidu.com>
 * @since 2010-05-28
 * @package bingo-balance
 */
require_once 'Bingo/Balance/Abstract.php';
class Bingo_Balance_Rand extends Bingo_Balance_Abstract
{		
	public function getConnection()
	{
		$arrServers = $this->_arrServers;
		$intTotalServers = count($arrServers);
		if ($intTotalServers == 1) {
			return $this->_objServer->realConnect($arrServers[0]);
		} else {
			$_intRand = mt_rand(0, $intTotalServers-1);
			$_resRet = $this->_objServer->realConnect($arrServers[$_intRand]);
			if ($_resRet) return $_resRet;
		}
		return false;
	}
}