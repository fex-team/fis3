<?php
require_once('base-data.php');
$root1 = $root;
require_once('index-data.php');
$root = array_merge_recursive_new($root1, $root);
function array_merge_recursive_new() {  
	$arrays = func_get_args();
	$base = array_shift($arrays);    
	foreach ($arrays as $array) {        
		reset($base); //important       
		while (list($key, $value) = @each($array)) {           
			if (is_array($value) && @is_array($base[$key])) {                
			  	$base[$key] = array_merge_recursive_new($base[$key], $value);      
			} 
			else {
			  	$base[$key] = $value;
			}       
		 }   
	}   
	return $base;
}

$fis_data = array(
	"root" => $root,
    "title"=>"来自php数据的标题",
    "xss_data" => "<b>我不可以变成粗体！</b>",
    "menu" => array(
        array("href" => "http://www.baidu.com", "title" => "百度首页"),
        array("href" => "http://zhidao.baidu.com", "title" => "百度知道"),
        array("href" => "http://ting.baidu.com", "title" => "Ting")
    )
);
?>
