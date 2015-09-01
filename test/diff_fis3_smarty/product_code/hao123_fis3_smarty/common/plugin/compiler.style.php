<?php

function smarty_compiler_style($params,  $smarty){
    $strCode = '<?php ';
    if (isset($params['id'])) {
        $strResourceApiPath = preg_replace('/[\\/\\\\]+/', '/', dirname(__FILE__) . '/lib/FISPagelet.class.php');
        $strCode .= 'if(!class_exists(\'FISPagelet\')){require_once(\'' . $strResourceApiPath . '\');}';
        $strCode .= 'FISPagelet::$cp = ' . $params['id'].';';
    }
    $strCode .= 'ob_start();?>';
    return $strCode;
}

function smarty_compiler_styleclose($params,  $smarty){
    $strResourceApiPath = preg_replace('/[\\/\\\\]+/', '/', dirname(__FILE__) . '/lib/FISPagelet.class.php');
    $strCode  = '<?php ';
    $strCode .= '$style=ob_get_clean();';
    $strCode .= 'if($style!==false){';
    $strCode .= 'if(!class_exists(\'FISPagelet\')){require_once(\'' . $strResourceApiPath . '\');}';
    $strCode .=     'if(FISPagelet::$cp){';
    $strCode .=         'if (!in_array(FISPagelet::$cp, FISPagelet::$arrEmbeded)){';
    $strCode .=             'FISPagelet::addStyle($style);';
    $strCode .=             'FISPagelet::$arrEmbeded[] = FISPagelet::$cp;';
    $strCode .=         '}';
    $strCode .=     '} else {';
    $strCode .=         'FISPagelet::addStyle($style);';
    $strCode .=     '}';
    $strCode .= '}';
    $strCode .= 'FISPagelet::$cp = false;?>';
    return $strCode;
}