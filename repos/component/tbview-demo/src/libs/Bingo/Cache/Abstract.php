<?php
/**
 * Cache abstract
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-23
 * @package bingo
 *
 */
abstract class Bingo_Cache_Abstract
{
	abstract public function get($strKey);
    
    abstract public function set($strKey, $mixValue, $intLifeTime=NULL);
    
    abstract public function remove($strKey);        
    
    abstract public function setOptions($arrConfig);
    
    protected function _getNowTime()
    {
    	require_once 'Bingo/Timer.php';
    	return Bingo_Timer::getNowTime();
    }
}