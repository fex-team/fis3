<?php

require(__DIR__ . '/../log/Log.class.php');
require(__DIR__ . '/Rule.class.php');

Log::getLogger(array(
    'level' => Log::ALL
));
$rule = new Rule('rEwrite', '@\/home\/(.*)@', '/home/test/$1.php');

var_dump($rule->fill('/home/index'));
