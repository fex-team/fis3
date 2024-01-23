<?php
global $fis_smarty_modifier_f_escape_callback_forbiddenStart_array;
$fis_smarty_modifier_f_escape_callback_forbiddenStart_array = array('window', 'document', 'alert', 'location');
function smarty_modifier_f_escape_callback($callback, $len=50){
    global $fis_smarty_modifier_f_escape_callback_forbiddenStart_array;

    $callback = substr($callback,0, $len);    //MAX_LENGTH
    $callback = preg_replace('/[^\w\.]/','',$callback);
    $callbackSplit = explode('.', $callback);
    $first = strtolower($callbackSplit[0]);
    if(in_array($first, $fis_smarty_modifier_f_escape_callback_forbiddenStart_array) || strpos($first, '.alert') !== false){
        return false;
    }
    return $callback;
}
