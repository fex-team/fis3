<?php
/**
 * һ����hash�㷨��
 * �ص㣺
 * 1������ڵ����ڵ�ֲ�����������⡣
 * 2���Ż�md5�㷨��
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package Bingo
 * @since 2010-05-16
 *
 */
class Bingo_Algorithm_Consistent
{
	/**
	 * ����ڵ������̫С��Ӱ��ֲ����⣬̫��Ӱ������
	 * @var int
	 */
	protected $_intReplicas = 64;
	/**
	 * hash�㷨��callback or string
	 * @var mix
	 */
	protected $_mixHash = 'md5';	
	/**
	 * Ŀ��ڵ���Ŀ
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
	 * ���ò���
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
	 * ����target
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
	 * load�ڲ����ݣ�����cacheʹ��
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
	 * ��ȡ�ڲ����ݣ�����cache
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
	 * һ���Բ���
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
		//ͷβ����
		if ($position < $this->_arrPositions[0]) {
			return $this->_arrPositionToTarget[$this->_arrPositions[0]];
		}
		if ($position > $this->_arrPositions[$intHigh]) {
			return $this->_arrPositionToTarget[$this->_arrPositions[0]];
		}
		//���ֲ���
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