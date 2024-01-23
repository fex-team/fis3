<?php
/**
 * Bingo page。后续可以考虑对多模块引擎的支持，暂时不支持
 * @author xuliqiang@baidu.com
 *
 */
require_once 'Bingo/View.php';
class Bingo_Page
{
    protected static $_intErrno  = 0;
    protected static $_objView   = null;
    protected static $_strTpl    = '';
    protected static $_bolRender = true;
    
    public static function setXssSafe($bolXssSafe) {
        self::getView()->setXssSafe($bolXssSafe);
    }
    public static function getXssSafe() {
        return self::getView()->getXssSafe();
    }
    public static function loadWhiteList() {
        self::getView()->loadWhiteList();
    }
    public static function init($arrConfig)
    {
        self::$_objView = new Bingo_View($arrConfig);
    }
    
    public static function getView()
    {
        if (is_null(self::$_objView)) {
            self::$_objView = new Bingo_View();
        }
        return self::$_objView;
    }
    
    public static function disableRender()
    {
        self::$_bolRender = false;
    }
    
    public static function assign($mixKey, $mixValue = null)
    {
        return self::getView()->assign($mixKey, $mixValue);
    }
    
    public static function setErrno($intErrno)
    {
        self::$_intErrno = $intErrno;
        return self::getView()->error($intErrno);
    }
    public static function setTpl($strTpl)
    {
        self::$_strTpl = strval($strTpl);
    }
    public static function getErrno()
    {
        return self::$_intErrno;
    }
    
    public static function buildPage()
    {
        if (self::$_bolRender && ! empty(self::$_strTpl)) {
            return self::getView()->render(self::$_strTpl);
        }
    }

    public static function setOnlyDataType($strType){
        self::getView()->setOnlyDataType($strType);
        self::setTpl('noNeed');
    }

    public static function getOnlyDataType(){
        return self::getView()->getOnlyDataType();
    }
}
