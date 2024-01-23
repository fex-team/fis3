<?php

define('FIS_PLUGIN_ROOT', dirname(__FILE__) . '/');

// i18n
require_once (FIS_PLUGIN_ROOT . 'FISTranslate.class.php');
// FIS resource api
require_once (FIS_PLUGIN_ROOT . 'FISResource.class.php');

$fis_config = array(
    'common_module_namespace' => 'common' //common,common1
    , 'i18n_variable' => 'i18n'
);

