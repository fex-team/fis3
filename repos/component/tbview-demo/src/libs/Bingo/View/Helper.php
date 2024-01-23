<?php
/**
 * helper»ùÀà¡£
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package bingo
 * @since 2010-04-12
 *
 */
abstract class Bingo_View_Helper
{
	protected $_objView = null;
	
	public $helper = null;
	
	public function setView($objView)
	{
		$this->_objView = $objView;
		$this->helper = $objView->getObjHelper();
	}
	
	public function getView()
	{
		return $this->_objView;
	}
	
	public function getHelper()
	{
		return $this->helper;
	}

	public function g($strKey='', $mixDefaultValue=null)
	{
		return $this->_objView->g($strKey, $mixDefaultValue);
	}
}