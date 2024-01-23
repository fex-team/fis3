<?php
/**
 * �Ӷ����ѡ��һ�����ӣ�˳��ѡ�������1��ѡ���ϣ���ѡ��ڶ�����
 * �����һ���������$intMaxErrorNum��ѡ���ϵĻ�������ָ��ʱ��$intFrozenTime��
 * ��Ҫ����Cache֧�֡��������Ͽ��ǣ��Ƽ�����apc����eacc
 * @author xuliqiang<xuliqiang@baidu.com>
 * @since 2010-05-28
 * @package bingo-balance
 */
require_once 'Bingo/Balance/Abstract.php';
class Bingo_Balance_SelectOne extends Bingo_Balance_Abstract
{
    protected $CACHE_PREFIX_KEY  = 'select_one_key_';
    
    protected $_objCache         = null;
    
    protected $_strCacheKey      = 'select_one_key_';
    
    protected $_intLifeTime      = 86400;
    /**
     * ����������Ӳ��Ϻ󣬽������л���
     * @var unknown_type
     */
    protected $_intMaxErrorNum        = 10;
    
    public function __construct($objCache, $strKey)
    {
        if (! is_subclass_of($objCache, 'Bingo_Cache_Abstract')) {
            throw new Exception('objCache must be a subclass of Bingo_Cache_Abstract');
        }
        $this->_objCache = $objCache;
        $this->_strCacheKey = $this->CACHE_PREFIX_KEY . $strKey;
    }
    
    public function setLifeTime($intLifeTime)
    {
        $this->_intLifeTime = intval($intLifeTime);
        return $this;
    }
    
    public function setMaxErrorNum($intNum)
    {
        $this->_intMaxErrorNum = intval($intNum);
        return $this;
    }
    
	public function getConnection()
	{
	    //
	    $strIndexCacheKey = $this->_strCacheKey . '_index';
	    $strNumCacheKey   = $this->_strCacheKey . '_num';
	    $intCacheIndex = $this->_objCache->get($strIndexCacheKey);
	    if ($intCacheIndex === false || is_null($intCacheIndex)) {
	        //cache��û�У�ѡ���һ���������浽Cache��
	        $this->_objCache->set($strIndexCacheKey, 0, $this->_intLifeTime);
	        $this->_objCache->set($strNumCacheKey,   0, $this->_intLifeTime);
	        return $this->getObjServer()->realConnect($this->_arrServers[0]);
	    }
	    //����Ƿ�ﵽ�����ʧ�ܴ���
	    $intConnectErrorNum = $this->_objCache->get($strNumCacheKey);
	    $intConnectIndex = $intCacheIndex;
	    if ($intConnectErrorNum === false || is_null($intConnectErrorNum) ) {
	        //�Ѿ�ʧЧ���߻�ȡʧ�ܣ�����0
	        $intConnectErrorNum = 0;
	    }
	    if ($intConnectErrorNum > $this->_intMaxErrorNum) {
	        //��Ҫ�����µ�index
	        $intConnectIndex = $intCacheIndex + 1;
	        if (! isset($this->_arrServers[$intConnectIndex])) {
	            $intConnectIndex = 0;
	        }
	        //ͬʱ����Cache�е����ݣ�����index��ʧ�ܴ���
	        $this->_objCache->set($strIndexCacheKey, $intConnectIndex, $this->_intLifeTime);
	        $this->_objCache->set($strNumCacheKey,   0, $this->_intLifeTime);
	    }
	    return $this->getObjServer()->realConnect($this->_arrServers[$intConnectIndex]);
	}
    /**
     * ���õ�ǰ����ʧ�ܵĴ���Ϊ0
     */
	public function connectSuccess()
	{
	    $strNumCacheKey = $this->_strCacheKey . '_num';
	    $this->_objCache->set($strNumCacheKey, 0, $this->_intLifeTime);
	}
	/**
	 * �ѵ�ǰ������ʧ�ܴ�������+1
	 */
	public function connectFailure()
	{
	    $strNumCacheKey     = $this->_strCacheKey . '_num';
	    $intConnectErrorNum = $this->_objCache->get($strNumCacheKey);
	    if ($intConnectErrorNum === false || is_null($intConnectErrorNum)) {
	        $this->_objCache->set($strNumCacheKey, 1, $this->_intLifeTime);
	    } else {
	        //���Ӵ���
	        $intConnectErrorNum = intval($intConnectErrorNum) + 1;
	        $this->_objCache->set($strNumCacheKey, $intConnectErrorNum, $this->_intLifeTime);
	    }
	}
}