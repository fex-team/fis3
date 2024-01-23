<?php

define('WWW_ROOT', __DIR__);

require(__DIR__ . '/../log/Log.class.php');
require(__DIR__ . '/Rewrite.class.php');


Log::getLogger(array(
    'level' => Log::ALL
));

class Render implements RewriteHandle {
    public function process($file) {
        echo file_get_contents($file);
    }
}

$rewrite = new Rewrite(__DIR__ . '/test');
$rewrite->addConfigFile('home.conf');
$rewrite->addConfigFile('common.conf');
$rewrite->addRewriteHandle('tpl', new Render()); 

$rewrite->dispatch('/home/test');
