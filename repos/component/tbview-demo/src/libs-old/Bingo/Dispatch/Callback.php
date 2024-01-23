<?php 
/**
 * dispatch callback
 * router -> callback
 * 
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-02-24
 * @package bingo 2.0
 */
require_once 'Bingo/Dispatch/Interface.php';
class Bingo_Dispatch_Callback implements Bingo_Dispatch_Interface 
{
    /**
     * ÅäÖÃ¸ñÊ½
     *
     * @var array
     * {
     *     $strDispatchRouter => array(
     * 	       'callback' => '',
     * 		   'file' => '', 
     *     )
     * }
     */
    protected $_arrConfig = array();
    /**
     * callback
     * @var unknown_type
     */
    protected $_objAction = null;
    
    public function __construct($arrConfig=array())
    {                    
        $this->setConfig($arrConfig);
    }
    
    public function setConfig($arrConfig=array())
    {
        $this->_arrConfig = $arrConfig;
    }
    
    public function dispatch($strDispatchRouter)
    {
        $callback = $this->_getCallback($strDispatchRouter);
        if ($callback) {
            call_user_func_array($callback, array($strDispatchRouter));
            return true;
        }
        return false;
    }
    
    public function getAction()
    {
        return $this->_objAction;
    }
    
    protected function _getCallback($strDispatchRouter)
    {
        if (isset($this->_arrConfig[$strDispatchRouter])) {
            $arrDispatch = $this->_arrConfig[$strDispatchRouter];
            if (! isset($arrDispatch['callback'])) {
                return false;
            }
            if (isset($arrDispatch['file']) && is_file($arrDispatch['file']) ) {
                require_once $arrDispatch['file'];
            }
            if (is_callable($arrDispatch['callback'])) {
                $this->_objAction = $arrDispatch['callback'];
                return $arrDispatch['callback'];
            }
        }
        return false;
    }
}