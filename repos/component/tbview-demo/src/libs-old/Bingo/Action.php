<?php
/**
 * Action基类，集成View
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package bingo
 * @since 2010-05-10
 */
require_once 'Bingo/Action/Abstract.php';
abstract class Bingo_Action extends Bingo_Action_Abstract
{
    protected $_objView = null;
    
    protected $_strViewPath = '';
    
    public function setViewPath($strPath) 
    {
        if (! is_dir($strPath)) {
            throw new Exception('setViewPath path invalid!path=' . $strPath);
        } 
        $this->_strViewPath = $strPath;
    }
    
    public function getView()
    {
        if (is_null($this->_objView)) {
            $strViewPath = $this->_strViewPath;
            if (empty($strViewPath) && defined('VIEW_PATH') ) {
                $strViewPath = VIEW_PATH;
            }
            require_once 'Bingo/View.php';
            $this->_objView = new Bingo_View(array(
                'baseDir' => $strViewPath,
            ));
        }
        return $this->_objView;
    }
    
    public function error($intErrno)
    {
        $this->getView()->error($intErrno);
    }
    
    public function assign($strKey, $mixValue) 
    {
        $this->getView()->assign($strKey, $mixValue);
    }
    
    public function display($strTemplate)
    {
        $this->getView()->render($strTemplate);
    }
}