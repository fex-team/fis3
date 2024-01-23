<?php

function smarty_compiler_script($params,  $smarty){
    $strCode = '<?php ob_start(); ?>';
    return $strCode;
}

function smarty_compiler_scriptclose($params,  $smarty){
    $strResourceApiPath = preg_replace('/[\\/\\\\]+/', '/', dirname(__FILE__) . '/FISResource.class.php');
    $strCode  = '<?php ';
    $strCode .= '$script=ob_get_clean();';
    $strCode .= 'if($script!==false){';
    $strCode .= 'if(!class_exists(\'FISResource\')){require_once(\'' . $strResourceApiPath . '\');}';
    $strCode .= 'FISResource::addScriptPool($script);';
    $strCode .= '}?>';
    return $strCode;
}