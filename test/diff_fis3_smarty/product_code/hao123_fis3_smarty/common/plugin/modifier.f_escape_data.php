<?php
function smarty_modifier_f_escape_data($str){
	$str = strval($str);
	$arr_js_char = array(
		'<' => '&lt;',
		'>' => '&gt;',
		"'" => "\\&#39;",
		'"' => '\\&quot;',
		"\\" => "\\\\",
		"\n" => "\\n",
		"\r" => "\\r",
		"/" => "\\/"
	);
    $patterns = array_keys($arr_js_char);
    $targets = array_values($arr_js_char);
    $ret =  str_replace($patterns, $targets, $str);
	return $ret;
}