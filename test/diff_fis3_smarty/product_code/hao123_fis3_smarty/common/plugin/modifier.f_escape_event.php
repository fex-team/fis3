<?php
function smarty_modifier_f_escape_event($str) {
    $str = strval($str);
    $char_map = array(
        '&' => '&amp;',
        '<' => '&lt;',
        '>' => '&gt;',
        "\\" => "\\\\",
        "'" => "\\&#39;",
        '"' => "\\&quot;",
        "\n" => "\\n",
        "\r" => "\\r",
        "/" => "\\/"
    );
    $patterns = array_keys($char_map);
    $targets = array_values($char_map);
    return str_replace($patterns, $targets, $str);
}