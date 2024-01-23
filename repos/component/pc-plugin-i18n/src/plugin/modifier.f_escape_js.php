<?php
global $fis_smarty_modifier_f_escape_js_char_map_array_keys;
global $fis_smarty_modifier_f_escape_js_char_map_array_values;
$fis_smarty_modifier_f_escape_js_char_map_array_keys = array("\\","'","\"","/","\n","\r");
$fis_smarty_modifier_f_escape_js_char_map_array_values = array("\\\\","\\x27","\\x22","\\/","\\n","\\r");

function smarty_modifier_f_escape_js($str)
{

    global $fis_smarty_modifier_f_escape_js_char_map_array_keys;
    global $fis_smarty_modifier_f_escape_js_char_map_array_values;

    $str = strval($str);
    return str_replace($fis_smarty_modifier_f_escape_js_char_map_array_keys, $fis_smarty_modifier_f_escape_js_char_map_array_values, $str);
}