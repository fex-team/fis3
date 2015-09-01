<?php

function smarty_compiler_setfs($params, $smarty) {
    $strCode = '';
    $strCode .= '<?php ';
    $strCode .= 'if (class_exists("FISAutoPack", false)) {';
    $strCode .= 'FISAutoPack::setFRender();'; //设置自动打包首屏完成
    $strCode .= '}';
    $strCode .= ' ?>';
    return $strCode;
}