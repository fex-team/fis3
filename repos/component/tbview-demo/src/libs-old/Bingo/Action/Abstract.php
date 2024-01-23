<?php 
/**
 * Action»ùÀà
 * 
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-02-25
 * @package bingo2.0
 *
 */
abstract class Bingo_Action_Abstract
{    
    public function init()
    {
    	return true;
    }
        
    abstract public function execute();
}