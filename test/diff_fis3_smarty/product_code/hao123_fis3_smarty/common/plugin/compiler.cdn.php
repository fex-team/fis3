<?php

function smarty_compiler_cdn($arrParams,  $smarty) {
    $strResourceApiPath = preg_replace('/[\\/\\\\]+/', '/', dirname(__FILE__) . '/lib/FISPagelet.class.php');
    $strUrl = $arrParams['url'];
    unset($arrParams['url']);
    $strAttr = '';
    $strCode = '<?php ';
    $strCode .= 'if(!class_exists(\'FISPagelet\')){require_once(\'' . $strResourceApiPath . '\');}';
    $strCode .= 'FISPagelet::setCdn('.$strUrl.');';
    $strCode .= ' ?>';
    return $strCode;
}
