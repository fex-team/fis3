<?php
function smarty_modifier_f_escape_callback($callback, $len=50){
	$callback = substr($callback,0, $len);    //MAX_LENGTH
	$callback = preg_replace('/[^\w\.]/','',$callback);
	$callbackSplit = explode('.', $callback);
	$first = strtolower($callbackSplit[0]);
	$forbiddenStart = array('window', 'document', 'alert', 'location');
	if(in_array($first, $forbiddenStart) || strpos($first, '.alert') !== false){
		return false;
	}
	return $callback;
}