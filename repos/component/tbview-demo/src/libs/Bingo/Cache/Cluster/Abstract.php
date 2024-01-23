<?php
/**
 * Cache��Ⱥ�ӿ�
 * @author chenyuzhe <chenyuzhe01@baidu.com>
 * @since 2011-09-19
 * @package Bingo
 *
 */
require_once 'Bingo/Cache/Abstract.php';
abstract class Bingo_Cache_Cluster_Abstract extends Bingo_Cache_Abstract  
{
    /**
     * �����Ҫ��ȫ�ر�log������������ó�false��
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
     * ���һ����¼
     *
     * @param string $key
     * @param mixed $value
     * @param int $lifetime
     * @return mixed
     */
    abstract public function add($strKey, $mixValue, $intLifeTime=NULL);
    
    /**
     * ��ȡһ����¼
     *
     * @param string $key
     * @param string $subkey
     * @return mixed
     */
    abstract public function getExt($strKey, $strSubKey);
    
    /**
     * ���һ����¼
     *
     * @param string $key
     * @param string $subkey
     * @param mixed $value
     * @param int $lifetime
     * @return mixed
     */
    abstract public function addExt($strKey, $strSubKey ,$mixValue, $intLifeTime=NULL);
    
    /**
     * ɾ��һ����¼
     *
     * @param string $key
     * @param string $subkey
     * @return mixed
     */
    abstract public function removeExt($strKey, $strSubKey);
    
    /**
     * ������ȡ��¼
     *
     * @param arr $key(key,subkey)
     * @return mixed
     */
    abstract public function multipleGet($arrKey);
    
    /**
     * ���������¼
     *
     * @param arr $key(key,subkey)
     * @return mixed
     */
    abstract public function multipleSet($arrKey);
}