<?php

function smarty_compiler_cssposition($arrParams,  $smarty){
    $strCode = '<?php ';
    $strCode .= 'if(class_exists(\'FISPagelet\')){';
    $strCode .= 'echo FISPagelet::cssGlobalLinkHook();';
    $strCode .= '}';
    $strCode .= ' ?>';
    return $strCode;
}
