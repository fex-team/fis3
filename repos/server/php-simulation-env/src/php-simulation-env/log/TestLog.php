<?php

require_once(__DIR__ . '/Log.class.php');

$log = new Log(array(
    'fd' => 'php://stdout',
    'level' => Log::WARN | Log::ERROR
));

$log->error(new Exception('test'));
$log->warn("test");
$log->info("test");
$log->debug("test");
