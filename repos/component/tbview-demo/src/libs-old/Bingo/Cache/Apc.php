<?php
/**
 * apc cache
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-23
 * @package bingo
 */
require_once 'Bingo/Cache/Abstract.php';
class Bingo_Cache_Apc extends Bingo_Cache_Abstract
{
	protected $_intLifeTime = 900;
	
	public function __construct($arrConfig=array())
	{
		if (!extension_loaded('apc'))
		{
			throw new Exception('The apc extension must be loaded for using Bingo_Cache_Apc!');
		}
		$this->setOptions($arrConfig);
	}
	
	public function get($strKey)
	{
		return apc_fetch($strKey);
	}
    
    public function set($strKey, $mixValue, $intLifeTime=NULL)
    {
    	if (is_null($intLifeTime)) $intLifeTime = $this->_intLifeTime;
    	return apc_store($strKey, $mixValue, $lifeTime);
    }
    
    public function remove($key)
    {
    	return apc_delete($key);
    }
    
    public function setOptions($arrConfig)
    {
    	if (isset($arrConfig['lifeTime'])) $this->_intLifeTime = intval($arrConfig['lifeTime']);
    }	
}