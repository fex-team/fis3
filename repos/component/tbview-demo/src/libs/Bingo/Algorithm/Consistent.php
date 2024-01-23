<?php
/**
 * 一致性hash算法。
 * 特点：
 * 1、虚拟节点解决节点分布不均衡的问题。
 * 2、优化md5算法。
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package Bingo
 * @since 2010-05-16
 *
 */
class Bingo_Algorithm_Consistent
{
	/**
	 * 虚拟节点个数。太小会影响分布均衡，太大影响性能
	 * @var int
	 */
	protected $_intReplicas = 64;
	/**
	 * hash算法，callback or string
	 * @var mix
	 */
	protected $_mixHash = 'md5';	
	/**
	 * 目标节点数目
	 * @var int
	 */
	protected $_intTragetNum = 0;
	/**
	 * {
	 * 		position => target
	 * }
	 * @var unknown_type
	 */
	private $_arrPositionToTarget = array();
	/**
	 * {
	 * 		position
	 * }
	 * @var unknown_type
	 */
	private $_arrPositions = array();
	/**
	 * {
	 * 		targetl
	 * }
	 * @var unknown_type
	 */
	private $_arrTargets = array();
	/**
	 * 设置参数
	 * @param array $arrConfig
	 */
	public function setOptions($arrConfig)
	{
		if (isset($arrConfig['hash'])) {
			$this->_mixHash = $arrConfig['hash'];
		}
		if (isset($arrConfig['replicas'])) {
			$this->_intReplicas = intval($arrConfig['replicas']);
		}
		if (isset($arrConfig['targets'])) {
			$this->setTargets($arrConfig['targets']);
		}
	}
	/**
	 * 设置target
	 * @param array $arrTargets
	 */
	public function setTargets($arrTargets)
	{
		foreach($arrTargets as $strTarget) {
			$this->addTarget($strTarget);	
		}
		sort($this->_arrPositions);
	}
	/**
	 * load内部数据，方便cache使用
	 * @param array $arrData
	 */
	public function load($arrData)
	{
		$this->_arrPositions = $arrData['positions'];
		$this->_arrTargets = $arrData['targets'];
		$this->_intTragetNum = count($arrData['targets']);
		$this->_arrPositionToTarget = $arrData['positionToTarget'];
	}
	/**
	 * 获取内部数据，用于cache
	 */
	public function getData()
	{
		return array(
			'positions' => $this->_arrPositions,
			'targets' => $this->_arrTargets,
			'positionToTarget' => $this->_arrPositionToTarget,
		);
	}
	/**
	 * 一致性查找
	 * @param string $str
	 */
	public function find($str)
	{
		if ($this->_intTragetNum == 0) {
			return false;
		}
		if ($this->_intTragetNum == 1) {
			return $this->_arrTargets[0];
		}
		$position = $this->_md5($str);
		$intHigh = count($this->_arrPositions) - 1;
		//头尾查找
		if ($position < $this->_arrPositions[0]) {
			return $this->_arrPositionToTarget[$this->_arrPositions[0]];
		}
		if ($position > $this->_arrPositions[$intHigh]) {
			return $this->_arrPositionToTarget[$this->_arrPositions[0]];
		}
		//二分查找
		$intLow = 0;		
		$intPosition = 0;
		$intMid = 0;
		while ($intLow <= $intHigh) {
			if ($intLow == $intHigh) {
				$intPosition = $this->_arrPositions[$intLow];
				break;
			}
			$intMid = ($intHigh + $intLow) >> 1;
			if ($this->_arrPositions[$intMid] < $position) {
				if ($this->_arrPositions[$intMid + 1] >= $position) {
					$intPosition = $this->_arrPositions[$intMid + 1];
					break;
				}
				$intLow = $intMid;
			} else {
				$intHigh = $intMid;
			}
		}
		return $this->_arrPositionToTarget[$intPosition];
	}
	
	public function addTarget($strTarget)
	{
		++ $this->_intTragetNum;
		$this->_arrTargets[] = $strTarget;
		for ($i=0; $i<$this->_intReplicas; ++$i) {
			$position = $this->_md5($strTarget . $i);
			$this->_arrPositionToTarget[$position] = $strTarget;
			$this->_arrPositions[] = $position;
		}
	}
	
	protected function _md5($str)
	{
		if (is_callable($this->_mixHash)) {		
			return call_user_func_array($this->_mixHash, array($str));
		} elseif ($this->_mixHash == 'crc32') {
			$intVal = crc32($str);
			return sprintf("%u", $intVal);
		} else {
			return sprintf("%u", hexdec(bin2hex(substr(md5($str, true), 0, 4))));
		}
	}
}