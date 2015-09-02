<?php
function smarty_modifier_f_escape_js($str) {
    $str = strval($str);
    $char_map = array(
        "\\" => "\\\\",
        "'" => "\\x27",
        "\"" => "\\x22",
        "/" => "\\/",
        "\n" => "\\n",
        "\r" => "\\r"
    );
    $patterns = array_keys($char_map);
    $targets = array_values($char_map);
    return str_replace($patterns, $targets, $str);
}