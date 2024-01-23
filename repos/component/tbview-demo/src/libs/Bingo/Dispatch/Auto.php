<?php
/**
 * dispatch auto
 * 
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-02-24
 * @package bingo 2.0
 */
require_once 'Bingo/Dispatch/Interface.php';
class Bingo_Dispatch_Auto implements Bingo_Dispatch_Interface 
{
	protected $_actionDir = '';
	
	protected $_actionFileSuffix = '.php';
	
	protected $_actionClassNameSuffix = 'Action';
	
	protected $_strAutoName = 'index';
	
	protected $_objAction = null;
	/**
	 * Action的类名是否也和路径绑定，只有绑定才能采用redirect
	 * @var unknown_type
	 */
	protected $_bolActionNameWithPath = false;
	
	public function __construct($arrConfig = array())
	{
		if (! empty($arrConfig))$this->setConfig($arrConfig);
	}
    
    public function setConfig($arrConfig = array())
    {
        if (isset($arrConfig['actionDir'])) {
            $this->_actionDir = rtrim($arrConfig['actionDir'], DIRECTORY_SEPARATOR);
        }
        if (isset($arrConfig['actionFileSuffix'])) {
        	$this->_actionFileSuffix = $arrConfig['actionFileSuffix'];
        }
    	if (isset($arrConfig['actionClassNameSuffix'])) {
        	$this->_actionClassNameSuffix = $arrConfig['actionClassNameSuffix'];
        }
        if (isset($arrConfig['actionAutoName'])) {
        	$this->_strAutoName = strval($arrConfig['actionAutoName']);
        }
        if (isset($arrConfig['ActionNameWithPath'])) {
            $this->_bolActionNameWithPath = (bool) $arrConfig['ActionNameWithPath'];
        }
    }
    public function dispatch($strDispatchRouter)
    {
        if (! empty($this->_strAutoName)) {
            $bolRet = $this->_dispatch($strDispatchRouter);
            if (! $bolRet) {
                return $this->_dispatch($strDispatchRouter . '/' . $this->_strAutoName);
            }
            return $bolRet;
        } else {
            return $this->_dispatch($strDispatchRouter);
        }
    }
    
    public function getAction()
    {
        return $this->_objAction;
    }
    
    public function _dispatch($strDispatchRouter)
    {
        if ($this->_bolActionNameWithPath) {
            $arrDispathRouters = explode('/', $strDispatchRouter);
            $strClassPath = '';
            $strClassName = '';
            if (! empty($arrDispathRouters)) {
                foreach($arrDispathRouters as $_strNode) {
                    $strClassName .= ucfirst($_strNode) . '_';
                    $strClassPath .= ucfirst($_strNode) . '/';
                }
                $strClassName = rtrim($strClassName, '_') . $this->_actionClassNameSuffix;
                $strClassPath = $this->_getClassPath(rtrim($strClassPath, '/'));
            }
        } else {
            $strClassPath = $this->_getClassPath($strDispatchRouter);
            $strClassName = $this->_getClassName($strDispatchRouter);
        }
        if (is_file($strClassPath) && is_readable($strClassPath) ){
        	require_once 'Bingo/Action/Abstract.php';;
            require_once $strClassPath;
            if (class_exists($strClassName)) {
                $action = new $strClassName();
                $bolRet = true;
                if (method_exists($action, 'init')) {
                    $bolRet = $action->init();
                }
                if ($bolRet)$action->execute();
                $this->_objAction = $action;
                return true;
            }
        }
        return false;
    }
    
    protected function _getClassName($strDispatchRouter)
    {
        $_intPos = strrpos($strDispatchRouter, '/'); 
        $_strClassName = $strDispatchRouter;
        if ($_intPos) {
        	$_strClassName = substr($strDispatchRouter, $_intPos + 1);
        }
        return $_strClassName . $this->_actionClassNameSuffix;
    }
    
    protected function _getClassPath($strDispatchRouter)
    {
        return $this->_actionDir . DIRECTORY_SEPARATOR . $strDispatchRouter . $this->_actionClassNameSuffix . $this->_actionFileSuffix;
    }
}