<?php
global $fis_smarty_modifier_f_escape_xml_search_array;
global $fis_smarty_modifier_f_escape_xml_value_array;
$fis_smarty_modifier_f_escape_xml_search_array = array('&', '<', '>', '\'', '"');
$fis_smarty_modifier_f_escape_xml_value_array = array('&amp;', '&lt;', '&gt;', '&#39;', '&quot;');
function smarty_modifier_f_escape_xml($str)
{
    global $fis_smarty_modifier_f_escape_xml_search_array;
    global $fis_smarty_modifier_f_escape_xml_value_array;

    return str_replace(
        $fis_smarty_modifier_f_escape_xml_search_array,
        $fis_smarty_modifier_f_escape_xml_value_array,
        strval($str)
    );
}