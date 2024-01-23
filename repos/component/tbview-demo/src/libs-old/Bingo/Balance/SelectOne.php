<?php
/**
 * 从多个中选择一个连接，顺序选择，如果第1个选择不上，则选择第二个。
 * 如果第一个连续多次$intMaxErrorNum次选择不上的话，则封禁指定时间$intFrozenTime。
 * 需要采用Cache支持。从性能上考虑，推荐采用apc或者eacc
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
     * 连续多次连接不上后，将进行切换。
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
	        //cache中没有，选择第一个，并保存到Cache中
	        $this->_objCache->set($strIndexCacheKey, 0, $this->_intLifeTime);
	        $this->_objCache->set($strNumCacheKey,   0, $this->_intLifeTime);
	        return $this->getObjServer()->realConnect($this->_arrServers[0]);
	    }
	    //检查是否达到了最大失败次数
	    $intConnectErrorNum = $this->_objCache->get($strNumCacheKey);
	    $intConnectIndex = $intCacheIndex;
	    if ($intConnectErrorNum === false || is_null($intConnectErrorNum) ) {
	        //已经失效或者获取失败，当作0
	        $intConnectErrorNum = 0;
	    }
	    if ($intConnectErrorNum > $this->_intMaxErrorNum) {
	        //需要计算新的index
	        $intConnectIndex = $intCacheIndex + 1;
	        if (! isset($this->_arrServers[$intConnectIndex])) {
	            $intConnectIndex = 0;
	        }
	        //同时更新Cache中的数据，包括index和失败次数
	        $this->_objCache->set($strIndexCacheKey, $intConnectIndex, $this->_intLifeTime);
	        $this->_objCache->set($strNumCacheKey,   0, $this->_intLifeTime);
	    }
	    return $this->getObjServer()->realConnect($this->_arrServers[$intConnectIndex]);
	}
    /**
     * 设置当前连接失败的次数为0
     */
	public function connectSuccess()
	{
	    $strNumCacheKey = $this->_strCacheKey . '_num';
	    $this->_objCache->set($strNumCacheKey, 0, $this->_intLifeTime);
	}
	/**
	 * 把当前的连接失败次数设置+1
	 */
	public function connectFailure()
	{
	    $strNumCacheKey     = $this->_strCacheKey . '_num';
	    $intConnectErrorNum = $this->_objCache->get($strNumCacheKey);
	    if ($intConnectErrorNum === false || is_null($intConnectErrorNum)) {
	        $this->_objCache->set($strNumCacheKey, 1, $this->_intLifeTime);
	    } else {
	        //增加次数
	        $intConnectErrorNum = intval($intConnectErrorNum) + 1;
	        $this->_objCache->set($strNumCacheKey, $intConnectErrorNum, $this->_intLifeTime);
	    }
	}
}