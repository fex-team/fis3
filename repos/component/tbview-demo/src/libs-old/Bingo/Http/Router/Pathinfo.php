<?php
/**
 * get router from url(pathinfo),and get params
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-03-04
 * @package bingo
 * @example TODO
 */
require_once 'Bingo/Http/Router/Abstract.php';
require_once 'Bingo/Http/Request.php';
class Bingo_Http_Router_Pathinfo extends Bingo_Http_Router_Abstract
{
	protected $_boolUsePathinfo = true;
	
	protected $_strDefaultHttpRouter = 'index';
	
	protected $_arrConfig = array(
		'sepOfRouterAndParams' => '-',
		'sepOfParams' => '-',
		'endOfParams' => '.',
		'beginRouterIndex' => 0,
		'sepOfRouter' => '/',
	);
	
	const MUST_END_CHAR = '?';  
	
	public function __construct($arrConfig=array())
	{
		if (! empty($arrConfig)) {
			$this->setConfig($arrConfig);
		}
	}
	
	public function setConfig($arrConfig)
	{
		$this->_arrConfig = array_merge($this->_arrConfig, $arrConfig);
		if (isset($arrConfig['defaultHttpRouter'])) {
			$this->_strDefaultHttpRouter = $arrConfig['defaultHttpRouter'];
		}
		if (isset($arrConfig['usePathinfo'])) {
			$this->_boolUsePathinfo = (bool) $arrConfig['usePathinfo'];
		}
	}
	/**
	 * TODO 优化
	 */
	public function getHttpRouter()
	{
		$strUrl = '';
		if ($this->_boolUsePathinfo) {
			if (isset($_SERVER['PATH_INFO'])) {
				$strUrl = strip_tags( $_SERVER['PATH_INFO'] );
			}
		} else {
			if (isset($_SERVER['REQUEST_URI'])) {
				$strUrl = strip_tags( $_SERVER['REQUEST_URI'] );
			}
		}
		//get config end,if $strUrl = '/news/article-123-pn-2.html?ie=utf-8'
		$_intTmpPos = strpos($strUrl, $this->_arrConfig['endOfParams']);
		if ($_intTmpPos) {
			$strUrl = substr($strUrl, 0, $_intTmpPos);
		}
		$_intTmpPos = strpos($strUrl, self::MUST_END_CHAR);
		if ($_intTmpPos) {
			$strUrl = substr($strUrl, 0, $_intTmpPos);
		}
		//$strUrl = '/news/article-123-pn-2'
		$_intTmpPos = strpos($strUrl, $this->_arrConfig['sepOfRouterAndParams']);
		$_strHttpRouter = $strUrl;
		$_strParams = '';
		if ($_intTmpPos) {
			list($_strHttpRouter, $_strParams) = explode($this->_arrConfig['sepOfRouterAndParams'], $strUrl, 2);
		}
		//$_strRouter = '/news/article' $_strParams = '123-pn-2'
		$_arrParams = array();
		if (! empty($_strParams)) {
			$_arrParams = Bingo_Http_Request::arrayFilterEmpty(explode($this->_arrConfig['sepOfParams'], $_strParams));
		}
		Bingo_Http_Request::setParams($_arrParams);
		//strHttpRouter处理，防止"//news//article"不被正确的分发
		$_arrHttpRouter = array();
		if (! empty($_strHttpRouter)) {
			$_arrHttpRouter = Bingo_Http_Request::arrayFilterEmpty( explode( $this->_arrConfig['sepOfRouter'], $_strHttpRouter ) );
		}
		$_intBeginRouterIndex = $this->_arrConfig['beginRouterIndex'];
		if ($_intBeginRouterIndex>0 && ! empty($_arrHttpRouter)) {
			for ($i=0; $i< $_intBeginRouterIndex; $i++) {
		        if (! empty($_arrHttpRouter)) array_shift($_arrHttpRouter); 
		    }
		}
		$_strHttpRouter = implode($this->_arrConfig['sepOfRouter'], $_arrHttpRouter);
		if (empty($_strHttpRouter)) {
			$_strHttpRouter = $this->_strDefaultHttpRouter;
			$_arrHttpRouter = array($this->_strDefaultHttpRouter);
		}
		Bingo_Http_Request::setHttpRouter($_strHttpRouter, $_arrHttpRouter);
		return $_strHttpRouter;
	}
	
}