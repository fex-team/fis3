<?php

/***************************************************************************
 * 
 * Copyright (c) 2009 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/

require_once("CNsHead.class.php");
require_once("socket.inc.php");
require_once("mc_log.inc.php");
require_once("zcache_adapter.utils.inc.php");
require_once("zcache_adapter.conf.php");

/**
 * @file zcache_adapter.class.php
 * @author wanghao (wanghao01@baidu.com)
 * @brief 包装对zcacheagent的通信和接受。
 * zcacheagent支持3个通信接口，通信格式如下:
 * {
 *   Pname :产品名，用以区分产品线
 *   logid:用于log纪录追查
 * 	cmd:”命令号”,
 *  content:{
 *	（视命令号不同内容不同）
 *   },
 *   }
 *  
 * {
 *  err_no: (int32)err_no,
 *  error（可选，当err_no不为0时用于说明错误具体原因）:”错误原因”,
 *  content:{
 *	（可选，视命令号不同内容不同）
 *  },
 * }
 * 
 *
 **/
class CZcacheAdapter
{
  private $last_err_no;
  private $last_err;
  private $zcfObj; 
  private $handlers;

  protected function getHandler()
  {
	 $servers = $this->zcfObj->arrZcacheAgentServer[$this->zcfObj->CURRENT_CONF];
	 $num = count($servers);
	 $retry = $this->zcfObj->RETRYTIME;

	 while ($retry-- > 0)
	 {
		$idx = rand() % $num;
		$server = $servers[$idx];	
		$key = $server['socket_address'] . ":" . $server['socket_port'];
		if (!isset($this->handlers[$key]))
		{
	 		$socket = new c_socket();
			$socket->set_vars_from_array($server);

			if ($socket->connect($this->zcfObj->CONNTIMEOUT))
			{
			   $this->handlers[$key] = $socket;
			   return $socket;   
			}
		}
		else
		return $this->handlers[$key];
	 }

	 return null;
  }


  protected function putHandler($handler, $force = 0)
  {
	 if (!$this->zcfObj->PERSISTENT || $force != 0)
	 {
		foreach ($this->handlers as $key => $value)
		{
		   if ($value === $handler)
		   {
			  $handler->close();
			  unset($this->handlers[$key]);
			  break;
		   }
		}
	 }
  }


  protected function readResponse($handler)
  {
	 //读取nshead
	 $headbuf = $handler->read(36);
	 if (!$headbuf)
	 {
		$this->last_err_no=-12;
		$this->last_err="net err";
		return NULL;
	 }

	 //解析nshead
	 $head = split_nshead($headbuf);
	 if (!isset($head['body_len']))
	 {
		$this->last_err_no=-19;
		$this->last_err="zcache agent err";
		return NULL;
	 }

	 //读取数据包内容
	 $retbuffer = $handler->read($head['body_len']);
	 if (!$retbuffer)
	 {
		$this->last_err_no=-12;
		$this->last_err="net err";
		return NULL;
	 }

	 return $retbuffer;
  }

  /**
  * 构造函数,传递ZcacheAdapterConf对象
  * @param $zcfObj  ZcacheAdapterConf对象指针
  */	
  public function __construct($pZcfObj)
  {
	 $this->handlers = array();
	 $this->zcfObj = $pZcfObj;
  }

  public function getLastErrNO()
  {
	 return $this->last_err_no;
  }
  public function getLastErr()
  {
	 return $this->last_err;
  }
  /**
  * 
  * @author wanghao (wanghao01@baidu.com)
  * @brief insert一条ke->value $subkey_str可以为空
  *   
  * */
  public function addOne($key_str,$subkey_str,$value_object,$delaytime_int=0,$pid_int=0,$logid_int=0)
  { 
	 //param judge 
	 if(!isset($key_str)||!is_string($key_str)||!is_int($delaytime_int)
	 ||!is_int($logid_int)||!isset($value_object))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return $this->last_err_no;
	 }
	 if(isset($subkey_str)&&!is_string($subkey_str))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return $this->last_err_no;
	 }
	 //pid judge
	 if(!array_key_exists($pid_int,$this->zcfObj->arrPName))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return $this->last_err_no;
	 }
	 //fill query pack
	 $query_arr['cmd']="insert";
	 $query_arr['pname']=$this->zcfObj->arrPName[$pid_int];
	 $query_arr['token']=$this->zcfObj->arrToken[$pid_int];
	 $query_arr['logid']=$logid_int;
	 $query_arr['content']['query_num']=1;
	 $query_arr['content']['query0']['key']=$key_str;
	 if(isset($subkey_str))
	 {
		$query_arr['content']['query0']['subkey']=$subkey_str;
	 }
	 $query_arr['content']['query0']['delay_time']=$delaytime_int;
	 //$query_arr['content']['query0']['logid']=$logid_int;
	 $value_arr['value']=$value_object;
	 $query_arr['content']['query0']['value']= mc_pack_array2pack($value_arr, $this->zcfObj->MCPACK_VERSION);

	 #echo "sendout: " . var_export($query_arr, true);
	 $query_pack= mc_pack_array2pack($query_arr, $this->zcfObj->MCPACK_VERSION);
	 #echo "sendout: " . var_export($query_pack, true);    

	 $nshead = new NsHead();
	 $nshead_arr['provider']="zcacheadapter";
	 $nshead_arr['log_id']=$logid_int;
	 $nshead_arr['body_len']=strlen($query_pack);
	 $buffer = $nshead->build_nshead($nshead_arr) . $query_pack;

	 $handler = $this->getHandler();
	 if (!$handler)
	 {
		$this->last_err_no=-12;
		$this->last_err="net err";
		return $this->last_err_no;
	 }

	 if (!$handler->write($buffer))
	 {
		$this->last_err_no=-12;
		$this->last_err="net err";
		$this->putHandler($handler, 1);
		return $this->last_err_no;
	 }

	 $retbuffer = $this->readResponse($handler);
	 if (!$retbuffer)
	 {
		$this->putHandler($handler, 1);
		return $this->last_err_no;
	 }

	 $this->putHandler($handler);

	 $ret_arr = mc_pack_pack2array($retbuffer);
	 if(isset($ret_arr['err_no']))
	 {
		$this->last_err_no=$ret_arr['err_no'];
		$this->last_err=$ret_arr['error'];
	 }
	 else
	 {
		$this->last_err_no=-19;
		$this->last_err="zcache agent err";
		return $this->last_err_no;
	 }
	 if(0==$ret_arr['err_no'] && isset($ret_arr['content']['result0']['err_no']))
	 {
		$this->last_err_no=$ret_arr['content']['result0']['err_no'];
	 }
	 if(0==$ret_arr['err_no'] && isset($ret_arr['content']['result0']['error']))
	 {
		$this->last_err=$ret_arr['content']['result0']['error'];
	 }
	 return $this->last_err_no;
  }

  /**
  * 
  * @author wanghao (wanghao01@baidu.com)
  * @brief update一条ke->value $subkey_str可以为空
  *   
  * */
  public function updateOne($key_str,$subkey_str,$value_object,$delaytime_int=0,$pid_int=0,$logid_int=0)
  {
	 //param judge
	 if(!isset($key_str)||!is_string($key_str)||!is_int($delaytime_int)||!is_int($logid_int)||!isset($value_object))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return $this->last_err_no;
	 }
	 if(isset($subkey_str)&&!is_string($subkey_str))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return $this->last_err_no;
	 }
	 //pid judge
	 if(!array_key_exists($pid_int,$this->zcfObj->arrPName))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return $this->last_err_no;
	 }
	 //fill query pack
	 $query_arr['cmd']="update";
	 $query_arr['pname']=$this->zcfObj->arrPName[$pid_int];
	 $query_arr['token']=$this->zcfObj->arrToken[$pid_int];
	 $query_arr['logid']=$logid_int;
	 $query_arr['content']['query_num']=1;
	 $query_arr['content']['query0']['key']=$key_str;
	 if(isset($subkey_str))
	 {
		$query_arr['content']['query0']['subkey']=$subkey_str;
	 }
	 $query_arr['content']['query0']['delay_time']=$delaytime_int;
	 //$query_arr['content']['query0']['logid']=$logid_int;
	 $value_arr['value']=$value_object;
	 $query_arr['content']['query0']['value']= mc_pack_array2pack($value_arr, $this->zcfObj->MCPACK_VERSION);

	 $query_pack= mc_pack_array2pack($query_arr, $this->zcfObj->MCPACK_VERSION);
	 $nshead = new NsHead();
	 $nshead_arr['provider']="zcacheadapter";
	 $nshead_arr['log_id']=$logid_int;
	 $nshead_arr['body_len']=strlen($query_pack);
	 $buffer = $nshead->build_nshead($nshead_arr) . $query_pack;

	 $handler = $this->getHandler();
	 if (!$handler)
	 {
		$this->last_err_no=-12;
		$this->last_err="net err";
		return $this->last_err_no;
	 }

	 if (!$handler->write($buffer))
	 {
		$this->last_err_no=-12;
		$this->last_err="net err";
		$this->putHandler($handler, 1);
		return $this->last_err_no;
	 }

	 $retbuffer = $this->readResponse($handler);
	 if (!$retbuffer)
	 {
		$this->putHandler($handler, 1);
		return $this->last_err_no;
	 }

	 $this->putHandler($handler);

	 $ret_arr = mc_pack_pack2array($retbuffer);
	 if(isset($ret_arr['err_no']))
	 {
		$this->last_err_no=$ret_arr['err_no'];
		$this->last_err=$ret_arr['error'];
	 }
	 else
	 {
		$this->last_err_no=-19;
		$this->last_err="zcache agent err";
		return $this->last_err_no;
	 }
	 if(0==$ret_arr['err_no'] && isset($ret_arr['content']['result0']['err_no']))
	 {
		$this->last_err_no=$ret_arr['content']['result0']['err_no'];
	 }
	 if(0==$ret_arr['err_no'] && isset($ret_arr['content']['result0']['error']))
	 {
		$this->last_err=$ret_arr['content']['result0']['error'];
	 }
	 return $this->last_err_no;
  }

  /**
  * 
  * @author wanghao (wanghao01@baidu.com)
  * @brief search一条ke->value $subkey_str可以为空
  *   
  * */
  public function getOne($key_str,$subkey_str,$pid_int=0,$logid_int=0)
  {
	 //param judge
	 if(!isset($key_str)||!is_string($key_str)||!is_int($logid_int))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return NULL;
	 }
	 if(isset($subkey_str)&&!is_string($subkey_str))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return NULL;
	 }
	 //pid judge
	 if(!array_key_exists($pid_int,$this->zcfObj->arrPName))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return NULL;
	 }
	 //fill query pack
	 $query_arr['cmd']="search";
	 $query_arr['pname']=$this->zcfObj->arrPName[$pid_int];
	 $query_arr['token']=$this->zcfObj->arrToken[$pid_int];
	 $query_arr['logid']=$logid_int;
	 $query_arr['content']['query_num']=1;
	 $query_arr['content']['query0']['key']=$key_str;
	 if(isset($subkey_str))
	 {
		$query_arr['content']['query0']['subkey']=$subkey_str;
	 }
	 #$query_arr['content']['query0']['delay_time']=$delaytime_int;
	 //$query_arr['content']['query0']['logid']=$logid_int;
	 #$query_arr['content']['query0']['value']= mc_pack_array2pack($value_object, ZcacheAdapterConf::MCPACK_VERSION);

	 $query_pack= mc_pack_array2pack($query_arr, $this->zcfObj->MCPACK_VERSION);
	 $nshead = new NsHead();
	 $nshead_arr['provider']="zcacheadapter";
	 $nshead_arr['log_id']=$logid_int;
	 $nshead_arr['body_len']=strlen($query_pack);
	 $buffer = $nshead->build_nshead($nshead_arr) . $query_pack;

	 $handler = $this->getHandler();
	 if (!$handler)
	 {
		$this->last_err_no=-12;
		$this->last_err="net err";
		return NULL;
	 }

	 if (!$handler->write($buffer))
	 {
		$this->last_err_no=-12;
		$this->last_err="net err";
		$this->putHandler($handler, 1);
		return NULL;
	 }

	 $retbuffer = $this->readResponse($handler);
	 if (!$retbuffer)
	 {
		$this->putHandler($handler, 1);
		return NULL;
	 }

	 $this->putHandler($handler);

	 $ret_arr =  mc_pack_pack2array($retbuffer);
	 if(isset($ret_arr['err_no'])&&0==$ret_arr['err_no']
	 &&isset($ret_arr['content']['result0']['err_no'])
	 &&0==$ret_arr['content']['result0']['err_no']
	 &&isset($ret_arr['content']['result0']['value']))
	 {
		$this->last_err_no=$ret_arr['err_no'];
		$this->last_err=$ret_arr['error'];
		$value_arr=mc_pack_pack2array($ret_arr['content']['result0']['value']);
		return $value_arr['value'];
	 }
	 else
	 {
		if(isset($ret_arr['err_no']))
		{
		   $this->last_err_no=$ret_arr['err_no'];
		   $this->last_err=$ret_arr['error'];
		}
		else
		{
		   $this->last_err_no=-19;
		   $this->last_err="zcache agent err";
		}
		if(0==$ret_arr['err_no'] && isset($ret_arr['content']['result0']['err_no']))
		{
		   $this->last_err_no=$ret_arr['content']['result0']['err_no'];
		}
		if(0==$ret_arr['err_no'] && isset($ret_arr['content']['result0']['error']))
		{
		   $this->last_err=$ret_arr['content']['result0']['error'];
		}
		return NULL;
	 }
  }

  public function getMultiple($key_arr,$pid_int=0,$logid_int=0)
  {
	  //param judge
	  if(!isset($key_arr)||!is_array($key_arr)||!is_int($logid_int))
	  {
		  $this->last_err_no=-1;
		  $this->last_err="param err";
		  return NULL;
	  }
	  foreach ($key_arr as $key)
	  {
	      if (!is_array($key) || !isset($key['key']) || !is_string($key['key']))
		  {
			  $this->last_err_no=-1;
			  $this->last_err="param err";
			  return NULL;
		  }
		  if(isset($key['subkey']) && !is_string($key['subkey']))
		  {
			  $this->last_err_no=-1;
			  $this->last_err="param err";
			  return NULL;
		  }
	  }
	  //pid judge
	  if(!array_key_exists($pid_int,$this->zcfObj->arrPName))
	  {
		  $this->last_err_no=-1;
		  $this->last_err="param err";
		  return NULL;
	  }
	  //fill query pack
	  $query_arr['cmd']="search";
	  $query_arr['pname']=$this->zcfObj->arrPName[$pid_int];
	  $query_arr['token']=$this->zcfObj->arrToken[$pid_int];
	  $query_arr['logid']=$logid_int;
	  $query_num = count($key_arr);
	  $query_arr['content']['query_num']=$query_num;
	  for ($i=0; $i<$query_num; $i++)
	  {
		  $query_arr['content']['query'.$i]['key']=$key_arr[$i]['key'];
		  if(isset($key_arr[$i]['subkey']))
		  {
			  $query_arr['content']['query'.$i]['subkey']=$key_arr[$i]['subkey'];
		  }
	  }

	  $query_pack= mc_pack_array2pack($query_arr, $this->zcfObj->MCPACK_VERSION);
	  $nshead = new NsHead();
	  $nshead_arr['provider']="zcacheadapter";
	  $nshead_arr['log_id']=$logid_int;
	  $nshead_arr['body_len']=strlen($query_pack);
	  $buffer = $nshead->build_nshead($nshead_arr) . $query_pack;

	  $handler = $this->getHandler();
	  if (!$handler)
	  {
		  $this->last_err_no=-12;
		  $this->last_err="net err";
		  return NULL;
	  }

	  if (!$handler->write($buffer))
	  {
		  $this->last_err_no=-12;
		  $this->last_err="net err";
		  $this->putHandler($handler, 1);
		  return NULL;
	  }

	  $retbuffer = $this->readResponse($handler);
	  if (!$retbuffer)
	  {
		  $this->putHandler($handler, 1);
		  return NULL;
	  }

	  $this->putHandler($handler);

	  $ret_arr =  mc_pack_pack2array($retbuffer);
	  if(isset($ret_arr['err_no'])&&0==$ret_arr['err_no']
			  &&isset($ret_arr['content'])
			  &&is_array($ret_arr['content']))
	  {
		  $this->last_err_no=$ret_arr['err_no'];
		  $this->last_err=$ret_arr['error'];

		  $values = array();
		  for ($i=0; $i<$query_num; $i++)
		  {
			  $val = $ret_arr['content']['result'.$i];
			  if (isset($val['err_no'])
					  && 0==$val['err_no']
					  && isset($val['value']))
			  {
				  $error = isset($val['error']) ? $val['error'] : "success";
				  $val_arr = mc_pack_pack2array($val['value']);
				  $values[] = array (
						  "err_no" => 0,
						  "error" => $error,
						  "value" => $val_arr['value']
						  );
			  }
			  else
			  {
				  $err_no = isset($val['err_no']) ? $val['err_no'] : -100;
				  $error = isset($val['error']) ? $val['error'] : "success";
				  $values[] = array (
						  "err_no" => $err_no,
						  "error" => $error,
						  );
			  }
		  }

		  return $values;
	  }
	  else
	  {
		  if(isset($ret_arr['err_no']))
		  {
			  $this->last_err_no=$ret_arr['err_no'];
			  $this->last_err=$ret_arr['error'];
		  }
		  else
		  {
			  $this->last_err_no=-19;
			  $this->last_err="zcache agent err";
		  }
		  return NULL;
	  }
  }
  /**
  * 
  * @author wanghao (wanghao01@baidu.com)
  * @brief delete一条ke->value $subkey_str可以为空，唯恐表示按key删除所有
  *   
  * */
  public function deleteOne($key_str,$subkey_str,$delaytime_int=0,$pid_int=0,$logid_int=0)
  {  
	 //param judge
	 if(!isset($key_str)||!is_string($key_str)||!is_int($delaytime_int)||!is_int($logid_int))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return $this->last_err_no;
	 }
	 if(isset($subkey_str)&&!is_string($subkey_str))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return $this->last_err_no;
	 }
	 //pid judge
	 if(!array_key_exists($pid_int,$this->zcfObj->arrPName))
	 {
		$this->last_err_no=-1;
		$this->last_err="param err";
		return $this->last_err_no;
	 }
	 //fill query pack
	 $query_arr['cmd']="delete";
	 $query_arr['pname']=$this->zcfObj->arrPName[$pid_int];
	 $query_arr['token']=$this->zcfObj->arrToken[$pid_int];
	 $query_arr['logid']=$logid_int;
	 $query_arr['content']['query_num']=1;
	 $query_arr['content']['query0']['key']=$key_str;
	 if(isset($subkey_str))
	 {
		$query_arr['content']['query0']['subkey']=$subkey_str;
	 }
	 $query_arr['content']['query0']['delay_time']=$delaytime_int;
	 //$query_arr['content']['query0']['logid']=$logid_int;
	 #$query_arr['content']['query0']['value']= mc_pack_array2pack($value_object, ZcacheAdapterConf::MCPACK_VERSION);

	 $query_pack= mc_pack_array2pack($query_arr, $this->zcfObj->MCPACK_VERSION);
	 $nshead = new NsHead();
	 $nshead_arr['provider']="zcacheadapter";
	 $nshead_arr['log_id']=$logid_int;
	 $nshead_arr['body_len']=strlen($query_pack);
	 $buffer = $nshead->build_nshead($nshead_arr) . $query_pack;

	 $handler = $this->getHandler();
	 if (!$handler)
	 {
		$this->last_err_no=-12;
		$this->last_err="net err";
		return $this->last_err_no;
	 }

	 if (!$handler->write($buffer))
	 {
		$this->last_err_no=-12;
		$this->last_err="net err";
		$this->putHandler($handler, 1);
		return $this->last_err_no;
	 }

	 $retbuffer = $this->readResponse($handler);
	 if (!$retbuffer)
	 {
		$this->putHandler($handler, 1);
		return $this->last_err_no;
	 }

	 $this->putHandler($handler);

	 $ret_arr = mc_pack_pack2array($retbuffer);
	 if(isset($ret_arr['err_no']))
	 {
		$this->last_err_no=$ret_arr['err_no'];
		$this->last_err=$ret_arr['error'];
	 }
	 else
	 {
		$this->last_err_no=-19;
		$this->last_err="zcache agent err";
		return $this->last_err_no;
	 }
	 if(0==$ret_arr['err_no'] && isset($ret_arr['content']['result0']['err_no']))
	 {
		$this->last_err_no=$ret_arr['content']['result0']['err_no'];
	 }
	 if(0==$ret_arr['err_no'] && isset($ret_arr['content']['result0']['error']))
	 {
		$this->last_err=$ret_arr['content']['result0']['error'];
	 }
	 return $this->last_err_no;
  }

}

?>
