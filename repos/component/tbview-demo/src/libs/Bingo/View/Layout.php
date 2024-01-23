<?php
/**
 * Layout for FE, 仅仅只是一个数据存储。
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-21
 * @package bingo
 *
 */
class Bingo_View_Layout
{
	protected $_arrVars = array();
	
	public function __get($strName)
	{
		if (isset($this->_arrVars[$strName]))
		{		
			return $this->_arrVars[$strName];
		}
		return null;
	}
	
	public function __set($strName, $mixValue)
	{
		$this->_arrVars[$strName] = $mixValue;
	}
	
	public function get()
	{
		return $this->_arrVars;
	}
}