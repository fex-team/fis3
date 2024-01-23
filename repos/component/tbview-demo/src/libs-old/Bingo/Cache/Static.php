<?php
/**
 * static cache for request
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-23
 * @package bingo
 */
require_once 'Bingo/Cache/Abstract.php';
class Bingo_Cache_Static extends Bingo_Cache_Abstract
{
	/**
     * ´æ´¢cacheµÄÊý×é
     *
     * @var unknown_type
     */
    protected static $_arrCache = array();
    
    public function get($strKey)
    {
        if (isset(self::$_arrCache[$strKey]))
        {
            return self::$_arrCache[$strKey];        
        }
        return FALSE;
    }
    
    public function set($strKey, $mixValue, $intLifeTime=NULL)
    {
        self::$_arrCache[$strKey] = $mixValue;
        return TRUE;
    }
    
    public function remove($strKey)
    {
        if (isset(self::$_arrCache[$strKey]))
        {
            self::$_arrCache[$strKey] = NULL;
            unset(self::$_arrCache[$strKey]);        
        }
        return TRUE;
    }
    
    public function setOptions($config)
    {
        //
    }
}