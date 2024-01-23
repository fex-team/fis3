<?php

function smarty_modifier_f_escape_path($string, $esc_type = 'urlpathinfo'){

	switch ($esc_type) {
        case 'urlpathinfo':
            return str_replace('%3A',':',str_replace('%2F','/',rawurlencode($string)));
        case 'url':
            return rawurlencode($string);
        default:
            return $string;
    }

}
