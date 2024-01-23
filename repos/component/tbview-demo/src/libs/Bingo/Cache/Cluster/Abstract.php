<?php
/**
 * Cache集群接口
 * @author chenyuzhe <chenyuzhe01@baidu.com>
 * @since 2011-09-19
 * @package Bingo
 *
 */
require_once 'Bingo/Cache/Abstract.php';
abstract class Bingo_Cache_Cluster_Abstract extends Bingo_Cache_Abstract  
{
    /**
     * 如果需要完全关闭log，则建议把它设置成false。
     * @var string
     */
    protected $_strLogModule = false;
    
    public function setLogModule($strLogModule) 
    {
        if (! empty($strLogModule)) {
            $this->_strLogModule = $strLogModule;
        }
    }
    
    /**
     * 添加一条记录
     *
     * @param string $key
     * @param mixed $value
     * @param int $lifetime
     * @return mixed
     */
    abstract public function add($strKey, $mixValue, $intLifeTime=NULL);
    
    /**
     * 获取一条记录
     *
     * @param string $key
     * @param string $subkey
     * @return mixed
     */
    abstract public function getExt($strKey, $strSubKey);
    
    /**
     * 添加一条记录
     *
     * @param string $key
     * @param string $subkey
     * @param mixed $value
     * @param int $lifetime
     * @return mixed
     */
    abstract public function addExt($strKey, $strSubKey ,$mixValue, $intLifeTime=NULL);
    
    /**
     * 删除一条记录
     *
     * @param string $key
     * @param string $subkey
     * @return mixed
     */
    abstract public function removeExt($strKey, $strSubKey);
    
    /**
     * 批量获取记录
     *
     * @param arr $key(key,subkey)
     * @return mixed
     */
    abstract public function multipleGet($arrKey);
    
    /**
     * 批量插入记录
     *
     * @param arr $key(key,subkey)
     * @return mixed
     */
    abstract public function multipleSet($arrKey);
}