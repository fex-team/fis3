<?php
/**
 * get router from http request($_GET,$_POST,$_SERVER etc)
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package bingo 2.0
 * @since 2010-03-02
 *
 */
abstract class Bingo_Http_Router_Abstract
{
	abstract public function getHttpRouter();
}