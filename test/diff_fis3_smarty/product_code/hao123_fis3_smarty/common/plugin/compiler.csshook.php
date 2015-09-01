<?php

function smarty_compiler_csshook($arrParams,  $smarty){
    $strCode = '<?php ';
    $strCode .= 'if(class_exists(\'FISPagelet\')){';
    $strCode .= 'echo FISPagelet::cssStyleHook();';
    $strCode .= '}';
    $strCode .= ' ?>';
    return $strCode;
}
