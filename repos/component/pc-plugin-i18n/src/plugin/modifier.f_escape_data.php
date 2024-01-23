<?php
global $fis_smarty_modifier_f_escape_data_js_char_keys;
global $fis_smarty_modifier_f_escape_data_js_char_values;
$fis_smarty_modifier_f_escape_data_js_char_keys = array('<','>',"'",'"','\\',"\n","\r","/");
$fis_smarty_modifier_f_escape_data_js_char_values = array('&lt;','&gt;',"\\&#39;",'\\&quot;',"\\\\","\\n","\\r","\\/");

function smarty_modifier_f_escape_data($str)
{

    global $fis_smarty_modifier_f_escape_data_js_char_keys;
    global $fis_smarty_modifier_f_escape_data_js_char_values;

    $str = strval($str);
    $ret = str_replace($fis_smarty_modifier_f_escape_data_js_char_keys, $fis_smarty_modifier_f_escape_data_js_char_values, $str);
    return $ret;
}