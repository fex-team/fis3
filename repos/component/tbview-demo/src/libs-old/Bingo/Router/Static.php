<?php
/**
 * static router
 * hash表直接对路由进行关系映射
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2009-12-08
 */
require_once 'Bingo/Router/Interface.php';
class Bingo_Router_Static implements Bingo_Router_Interface 
{
	protected $_hashRouters = array();
	
	public function getDispatchRouter($strRouter)
	{
		if (isset( $this->_hashRouters [ $strRouter ] )) {
			return $this->_hashRouters [ $strRouter ];
		}
		return false;
	}
	
	public function add($strRouter, $strDispatchRouter) 
	{
		$this->_hashRouters [ $strRouter ] = $strDispatchRouter;
	}
	
	public function remove($strRouter)
	{
		if (isset( $this->_hashRouters [ $strRouter ] )) {
			unset( $this->_hashRouters [ $strRouter ] );
		}
	}
}