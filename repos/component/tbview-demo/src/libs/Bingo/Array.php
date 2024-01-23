<?php
/**
 * 数组函数封装，主要是提供一些容易踩坑函数的封装。
 * @author lichao <lichao@baidu.com>
 * @since 2013-03-13
 * @package bingo
 *
 */
class Bingo_Array
{
   	/**
     * 在数组中搜索给定的值，默认采用强制类型查找。
	 * in_array(0,array('a','b')) == true; 原生函数容易让调用者意识不到该隐含问题。
     *
     * @param mixed $needle
     * @param array $arrHaystack
     * @param bool $boolStrict
     * @return bool 
     */
	public static function in_array($needle, $arrHaystack, $bookStrict=true)
	{
		return in_array($needle, $arrHaystack, $bookStrict);
	}
    
}    
