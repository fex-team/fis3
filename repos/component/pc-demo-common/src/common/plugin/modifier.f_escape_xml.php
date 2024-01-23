<?php
function smarty_modifier_f_escape_xml($str) {
    return str_replace(
        array('&', '<', '>', '\'', '"'),
        array('&amp;', '&lt;', '&gt;', '&#39;', '&quot;'),
        strval($str)
    );
}