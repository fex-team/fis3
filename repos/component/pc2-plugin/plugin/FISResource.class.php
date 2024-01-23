<?php
class FISResource {
    
    const CSS_LINKS_HOOK = '<!--[FIS_CSS_LINKS_HOOK]-->';
    
    private static $arrMap = array();
    private static $arrLoaded = array();
    private static $arrStaticCollection = array();
    private static $arrScriptPool = array();
    
    public static function reset(){
        self::$arrMap = array();
        self::$arrLoaded = array();
        self::$arrStaticCollection = array();
        self::$arrScriptPool = array();
    }
    
    public static function cssHook(){
        return self::CSS_LINKS_HOOK;
    }
    
    public static function renderResponse($strContent){
        $intPos = strpos($strContent, self::CSS_LINKS_HOOK);
        if($intPos !== false){
            $strContent = substr_replace($strContent, self::render('css'), $intPos, strlen(self::CSS_LINKS_HOOK));
        }
        self::reset();
        return $strContent;
    }
    
    public static function render($type){
        $html = '';
        if(!empty(self::$arrStaticCollection[$type])){
            $arrURIs = &self::$arrStaticCollection[$type];
            if($type === 'js'){
                $html = '<script type="text/javascript" src="' . implode('"></script><script type="text/javascript" src="', $arrURIs) . '"></script>';
            } else if($type === 'css'){
                $html = '<link rel="stylesheet" type="text/css" href="' . implode('"/><link rel="stylesheet" type="text/css" href="', $arrURIs) . '"/>';
            }
        }
        return $html;
    }
    
    public static function addScriptPool($str){
        self::$arrScriptPool[] = $str;
    }
    
    public static function renderScriptPool(){
        $html = '';
        if(!empty(self::$arrScriptPool)){
            $html = '<script type="text/javascript">!function(){' . implode("}();\n!function(){", self::$arrScriptPool) . '}();</script>';
        }
        return $html;
    }
    
    public static function register($strNamespace, $smarty){
        if($strNamespace === '__global__'){
            $strMapName = 'map.json';
        } else {
            $strMapName = $strNamespace . '-map.json';
        }
        $arrConfigDir = $smarty->getConfigDir();
        foreach ($arrConfigDir as $strDir) {
            $strPath = preg_replace('/[\\/\\\\]+/', '/', $strDir . '/' . $strMapName);
            if(is_file($strPath)){
                self::$arrMap[$strNamespace] = json_decode(file_get_contents($strPath), true);
                return true;
            }
        }
        return false;
    }
    
    public static function load($strName, $smarty){
        $strLoadedURI = self::$arrLoaded[$strName];
        if(isset($strLoadedURI)){
            return $strLoadedURI;
        } else {
            $intPos = strpos($strName, ':');
            if($intPos === false){
                $strNamespace = '__global__';
            } else {
                $strNamespace = substr($strName, 0, $intPos);
            }
            if(isset(self::$arrMap[$strNamespace]) || self::register($strNamespace, $smarty)){
                $arrMap = &self::$arrMap[$strNamespace];
                $arrRes = &$arrMap['res'][$strName];
                if(isset($arrRes)){
                    if(!array_key_exists('debug', $_GET) && isset($arrRes['pkg'])){
                        $arrPkg = &$arrMap['pkg'][$arrRes['pkg']];
                        $strURI = $arrPkg['uri'];
                        foreach ($arrPkg['has'] as $strResId) {
                            //todo
                            self::$arrLoaded[$strResId] = $strURI;
                        }
                    } else {
                        if(isset($arrRes['deps'])){
                            foreach ($arrRes['deps'] as $strDep) {
                                self::load($strDep, $smarty);
                            }
                        }
                        $strURI = $arrRes['uri'];
                        self::$arrLoaded[$strName] = $strURI;
                    }
                    self::$arrStaticCollection[$arrRes['type']][] = $strURI;
                    return $strURI;
                }
            } else {
                trigger_error('missing map file of "' . $strNamespace . '"', E_USER_ERROR);
            }
        }
    }
}
