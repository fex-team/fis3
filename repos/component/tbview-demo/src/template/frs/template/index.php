<?

$layout = $__layout__->load('test');

//$e = new Exception();
//echo $e->getTraceAsString();
//echo "\n";
//echo "\n";
$layout->setBlock('title', 'ab----c');

$layout->startBlock('content', 'frs_main');
$__widget__->load('menu', null, null, 'frs_menu');
$layout->endBlock('content');

$layout->render();

BigPipe::import('widget/comp/comp.js', 'frs');
BigPipe::import('index.js', 'frs');
BigPipe::import('frs:index.css');
?>


<?php BigPipe::scriptStart();?>
alert(123);

<?php BigPipe::scriptEnd();?>