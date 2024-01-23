<?php

class fis_widget_map {

    private static $arrCached = array();

    public static function lookup(&$strFilename, &$smarty){
        $strPath = self::$arrCached[$strFilename];
        if(isset($strPath)){
            return $strPath;
        } else {
            $arrConfigDir = $smarty->getConfigDir();
            foreach ($arrConfigDir as $strDir) {
                $strPath = preg_replace('/[\\/\\\\]+/', '/', $strDir . '/' . $strFilename);
                if(is_file($strPath)){
                    self::$arrCached[$strFilename] = $strPath;
                    return $strPath;
                }
            }
        }
        trigger_error('missing map file "' . $strFilename . '"', E_USER_ERROR);
    }
}

function smarty_compiler_widget($arrParams,  $smarty){
    //支持1.X widget 通过path属性判断 同时判断是否有name属性
    if (isset($arrParams['path'])) {
        if(!isset($arrParams['name']) || strpos($arrParams['name'], ':') === false){
            $path = $arrParams['path'];
            unset($arrParams['path']);
            return getWidgetStrCode($path, $arrParams);
        }
    }

    $strResourceApiPath = preg_replace('/[\\/\\\\]+/', '/', dirname(__FILE__) . '/FISResource.class.php');
    $strCode = '<?php if(!class_exists(\'FISResource\', false)){require_once(\'' . $strResourceApiPath . '\');}';
    $strCall = $arrParams['call'];
    $bHasCall = isset($strCall);
    $strName = $arrParams['name'];
    unset($arrParams['name']);
    //construct params
    $strFuncParams = getFuncParams($arrParams);

    if($bHasCall){
        unset($arrParams['call']);
        $strTplFuncName = '\'smarty_template_function_\'.' . $strCall;
        $strCallTplFunc = 'call_user_func('. $strTplFuncName . ',$_smarty_tpl,' . $strFuncParams . ');';

        $strCode .= 'if(is_callable('. $strTplFuncName . ')){';
        $strCode .= $strCallTplFunc;
        $strCode .= '}else{';
    }
    if($strName){
        $strCode .= '$_tpl_path=FISResource::getUri(' . $strName . ',$_smarty_tpl->smarty);';
        $strCode .= 'if(isset($_tpl_path)){';
        if($bHasCall){
            $strCode .= '$_smarty_tpl->getSubTemplate($_tpl_path, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, $_smarty_tpl->caching, $_smarty_tpl->cache_lifetime, ' . $strFuncParams . ', Smarty::SCOPE_LOCAL);';
            $strCode .= 'if(is_callable('. $strTplFuncName . ')){';
            $strCode .= $strCallTplFunc;
            $strCode .= '}else{';
            $strCode .= 'trigger_error(\'missing function define "\'.' . $strTplFuncName . '.\'" in tpl "\'.$_tpl_path.\'"\', E_USER_ERROR);';
            $strCode .= '}';
        } else {
            $strCode .= 'echo $_smarty_tpl->getSubTemplate($_tpl_path, $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, $_smarty_tpl->caching, $_smarty_tpl->cache_lifetime, ' . $strFuncParams . ', Smarty::SCOPE_LOCAL);';
        }
        $strCode .= '}else{';
        $strCode .= 'trigger_error(\'unable to locale resource "\'.' . $strName . '.\'"\', E_USER_ERROR);';
        $strCode .= '}';
        $strCode .= 'FISResource::load('.$strName.', $_smarty_tpl->smarty);';
    } else {
        trigger_error('undefined widget name in file "' . $smarty->_current_file . '"', E_USER_ERROR);
    }
    if($bHasCall){
        $strCode .= '}';
    }
    $strCode .= '?>';
    return $strCode;
}


function getWidgetStrCode($path, $arrParams){
    $strFuncParams = getFuncParams($arrParams);
    $path = trim($path,"\"");
    $fn = '"smarty_template_function_fis_' . strtr(substr($path, 0, strrpos($path, '/')), '/', '_') . '"';
    $strCode = '<?php ';
    $strCode .= 'if(is_callable(' . $fn . ')){';
    $strCode .=     'return call_user_func(' . $fn . ',$_smarty_tpl,' . $strFuncParams . ');';
    $strCode .= '}else{';
    $strCode .=     '$fis_widget_output = $_smarty_tpl->getSubTemplate("' . $path . '", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, '. $strFuncParams.', Smarty::SCOPE_LOCAL);';
    $strCode .=     'if(is_callable(' . $fn .')){';
    $strCode .=         'return call_user_func('. $fn . ',$_smarty_tpl,' . $strFuncParams . ');';
    $strCode .=     '}else{';
    $strCode .=         'echo $fis_widget_output;';
    $strCode .=     '}';
    $strCode .= '}?>';
    return $strCode;
}

function getFuncParams($arrParams){
    $arrFuncParams = array();
    foreach ($arrParams as $_key => $_value) {
        if (is_int($_key)) {
            $arrFuncParams[] = "$_key=>$_value";
        } else {
            $arrFuncParams[] = "'$_key'=>$_value";
        }
    }
    $strFuncParams = 'array(' . implode(',', $arrFuncParams) . ')';
    return $strFuncParams;
}
