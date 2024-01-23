<?php
/**
 * 负载均衡算法基类
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-05-18
 * @package bingo
 *
 */
class Bingo_Server_Connect_Default
{
    public function realConnect($arrServer)
    {
        return $arrServer;
    }
}
abstract class Bingo_Balance_Abstract
{
	protected $_objServer = null;//Bingo_Server_Abstract
	
	protected $_strLog = '';
	
	protected $_arrServers = array();
	/**
	 * 最大链接次数
	 * @var unknown_type
	 */
	protected $_intMaxConnectNum = 0;
	
	public function setServers($objServer, $arrServers)
	{
		//TODO check
		$this->_objServer = $objServer;
		$this->_arrServers = $arrServers;
		$this->_intMaxConnectNum = count($arrServers);
		return $this;
	}
    public function setMaxConnectNum($intNum) 
    {
        $this->_intMaxConnectNum = intval($intNum);
        return $this;
    }
	/**
	 * 提供接口，后续可以不用设置objServer
	 * @param unknown_type $arrServers
	 * @param unknown_type $objServer
	 */
	public function setServersExt($arrServers, $objServer=null)
	{
	    $this->_objServer = $objServer;
		$this->_arrServers = $arrServers;
	}
	
	public function getObjServer()
	{
	    if (is_null($this->_objServer)) {
	        $this->_objServer = new Bingo_Server_Connect_Default();
	    }
	    return $this->_objServer;
	}
	/**
	 * 负载均衡获取一个有效的连接对象。
	 * 返回false，说明获取失败。
	 */
	abstract public function getConnection();
	public function connectSuccess()
	{
	    
	}
	public function connectFailure()
	{
	    
	}
	/**
	 * 数据读取成功，有一些特定的负载均衡算法，可能需要反馈
	 */
	public function readSucess()
	{
		
	}
	/**
	 * 数据读取失败，有一些特定的负载均衡算法，可能需要进行反馈。
	 */
	public function readFailure()
	{
		
	}
	/**
	 * 设置一些特定的选项。
	 * @param array $arrConfig
	 */
	public function setOptions($arrConfig)
	{
		
	}
	
	public function setLog($strLog)
	{
		$this->_strLog = $strLog;
	}
}
