<?php

/***************************************************************************
 * 
 * Copyright (c) 2009 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
/**
 * @file sample.php
 * @author wanghao (wanghao01@baidu.com)
 * @brief zcacheagent lib的测试代码
 **/


require_once('zcache_adapter.class.php');

$key_str='wanghao test 2';
$subkey_str='wanghao test subkey';
$value_object='wanghao test value';
$zcfObj = new ZcacheAdapterConf();
$zcfObj->PERSISTENT = 0;
//连接超时，秒级
$zcfObj->CONNTIMEOUT = 1;
$zcfObj->MCPACK_VERSION = PHP_MC_PACK_V1;
//product name
$zcfObj->arrPName=array(0 =>"qa_tinyurl");
//token
$zcfObj->arrToken=array(0 =>"qa_tinyurl_token");
//retry time
$zcfObj->RETRYTIME = 3;
$zcfObj->arrZcacheAgentServer = array(
		"jx" => array(
			array(  "socket_address" => "10.81.11.99",
				"socket_port" => 10240,
				"socket_timeout" => 5
			     )
			)
		);

$zcache_adapter =new  CZcacheAdapter($zcfObj);


echo"add one: key($key_str) subkey($subkey_str) value($value_object)\n";
echo $zcache_adapter->addOne($key_str,$subkey_str,$value_object,0,0,100);
echo "$key_str : $subkey_str | ".$zcache_adapter->getLastErr()."\n\n";

echo"get one: key($key_str) subkey($subkey_str)\n";
$value_retuen=$zcache_adapter->getOne($key_str,$subkey_str,0,101);
echo " return : ".$value_retuen."\n\n";


echo "update one: key($key_str) subkey($subkey_str)\n";
echo $zcache_adapter->updateOne($key_str,$subkey_str,"wanghao test new value",0,0,102);
$value_retuen=$zcache_adapter->getOne($key_str,$subkey_str,0,103);
echo " return : ".$value_retuen."\n";
echo $zcache_adapter->getLastErr()."\n\n";

echo "err get: \n";
$value_retuen=$zcache_adapter->getOne("swqswqq",NULL,0,104);
echo " return : ".$value_retuen."\n";
echo $zcache_adapter->getLastErr()."\n\n";


echo "delete: \n";
echo $zcache_adapter->deleteOne($key_str,$subkey_str,0,0,105);
$value_retuen=$zcache_adapter->getOne($key_str,$subkey_str,0,106);
echo " return : ".$value_retuen."\n";
echo "$key_str : $subkey_str | ".$zcache_adapter->getLastErr()."\n\n";


$value_object='PCK\000\000\000\000\000\000\000\000A\000\000\000\000\000\000\000\000\000\000ITM\000 \000\000\000)\000\000\000\000\000
\000value\000wanghao test value\000';
print"    add one binary: \n";
echo $zcache_adapter->updateOne($key_str,$subkey_str,$value_object,0,0,107);
$value_retuen=$zcache_adapter->getOne($key_str,$subkey_str,0,108);
echo " return : ".$value_retuen."\n";
echo $zcache_adapter->getLastErr()."\n\n";

$value_object=2435;
echo $zcache_adapter->updateOne($key_str,$subkey_str,$value_object,0,0,109);
print"add one int: \n";
$value_retuen=$zcache_adapter->getOne($key_str,$subkey_str,0,110);
echo " return : ".$value_retuen."\n";
echo $zcache_adapter->getLastErr()."\n\n";

echo "delete: \n";
echo $zcache_adapter->deleteOne($key_str,$subkey_str,0,0,105);
$value_retuen=$zcache_adapter->getOne($key_str,$subkey_str,0,106);
echo " return : ".$value_retuen."\n";
echo "$key_str : $subkey_str | ".$zcache_adapter->getLastErr()."\n\n";

echo "add two:\n";
echo $zcache_adapter->addOne("key1", "subkey1", "value1", 0, 0, 100);
echo $zcache_adapter->addOne("key2", "subkey2", "value2", 0, 0, 100);
$key_arr = array(
		array(
			'key' => 'key1',
			'subkey' => 'subkey1',
		     ),
		array(
			'key' => 'key2',
			'subkey' => 'subkey2',
		     ),
		);
$values = $zcache_adapter->getMultiple($key_arr, 0, 111);
var_dump($values);
echo $zcache_adapter->getLastErr()."\n\n";

?>
