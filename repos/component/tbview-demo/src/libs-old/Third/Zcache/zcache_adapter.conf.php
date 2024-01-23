<?php

/***************************************************************************
 * 
 * Copyright (c) 2009 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/

/**
 * @author wanghao wanghao01@baidu.com
 * @berif ZcacheAdapter 的conf类 ，注意其$arrZcacheAgentServer
 *        可以双机房配置
 * 
 * */

class ZcacheAdapterConf
{
	//持续连接
	public  $PERSISTENT = 1;		
	//连接超时，秒级
	public $CONNTIMEOUT = 1;			
	//MCPACK版本
	public $MCPACK_VERSION = PHP_MC_PACK_V2;
	//product name
	public $arrPName=array(0 =>"bae0000", 1=>"bae0001");
	//token
	public $arrToken=array(0 =>"bae30096", 1=>"bae8213");
	//retry time
	public $RETRYTIME = 3;

	//当前配置
	public $CURRENT_CONF = "jx";	//或tc
	public $arrZcacheAgentServer = array(
			"jx" => array(
					array(  "socket_address" => "10.23.247.90",
						"socket_port" => 10240,
						"socket_timeout" => 5
					     ),      
					array(  "socket_address" => "10.23.247.91",
						"socket_port" => 10240,
						"socket_timeout" => 5,
					     ),
					array(  "socket_address" => "10.23.250.25",
						"socket_port" => 10240,
						"socket_timeout" => 5,
				     	), 
				),
			"tc" => array(
					array(  "socket_address" => "10.23.247.90",
						"socket_port" => 10240,
						"socket_timeout" => 5
					     ),      
					array(  "socket_address" => "10.23.247.91",
						"socket_port" => 10240,
						"socket_timeout" => 5,
					     ),
					array(  "socket_address" => "10.23.250.25",
						"socket_port" => 10240,
						"socket_timeout" => 5,
				 	    ), 
					)
				);
}
?>
