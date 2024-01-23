<?php
/**
 * ���ؾ����㷨����
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
	 * ������Ӵ���
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
	 * �ṩ�ӿڣ��������Բ�������objServer
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
	 * ���ؾ����ȡһ����Ч�����Ӷ���
	 * ����false��˵����ȡʧ�ܡ�
	 */
	abstract public function getConnection();
	public function connectSuccess()
	{
	    
	}
	public function connectFailure()
	{
	    
	}
	/**
	 * ���ݶ�ȡ�ɹ�����һЩ�ض��ĸ��ؾ����㷨��������Ҫ����
	 */
	public function readSucess()
	{
		
	}
	/**
	 * ���ݶ�ȡʧ�ܣ���һЩ�ض��ĸ��ؾ����㷨��������Ҫ���з�����
	 */
	public function readFailure()
	{
		
	}
	/**
	 * ����һЩ�ض���ѡ�
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
