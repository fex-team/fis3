<?php
/**
 * 随即，目前实现的非常简单。不实现权重，简单权重的区分可以通过多添加几个实现。
 * 需要复杂权重的算法，那么就可以直接考虑其他的算法，比如打分。
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