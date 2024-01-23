<?php
/**
 * eacclerator cache
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-23
 * @package bingo
 */
require_once 'Bingo/Cache/Abstract.php';
class Bingo_Cache_Eacc extends Bingo_Cache_Abstract
{
	protected $_intLifeTime = 900;
	
	public function __construct($arrConfig=array())
	{
		if (! extension_loaded('eaccelerator') || ! function_exists('eaccelerator_get') )
		{
			throw new Exception('The eaccelerator extension must be loaded for using Bingo_Cache_Eacc!');
		}
		$this->setOptions($arrConfig);
	}
	
	public function get($strKey)
	{
		return eaccelerator_get($strKey);
	}
    
    public function set($strKey, $mixValue, $intLifeTime=NULL)
    {
    	if (is_null($intLifeTime)) $intLifeTime = $this->_intLifeTime;
    	return eaccelerator_put($strKey, $mixValue, $intLifeTime);
    }
    
    public function remove($key)
    {
    	return eaccelerator_rm($key);
    }
    
    public function setOptions($arrConfig)
    {
    	if (isset($arrConfig['lifeTime'])) $this->_intLifeTime = intval($arrConfig['lifeTime']);
    }
}
