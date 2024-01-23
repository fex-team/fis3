<?php
/***************************************************************************
 * 
 * Copyright (c) 2008 Baidu.com, Inc. All Rights Reserved
 * $Id: mc_log.inc.php,v 1.2 2009/08/28 03:20:19 wanghao2 Exp $ 
 * 
 **************************************************************************/
 
 
 
/**
 * @file log.php
 * @author sheny(shenyi@baidu.com)
 * @date 2008/04/19 19:25:03
 * @version $Revision: 1.2 $ 
 * @brief 简单的php日志库,使用上同ub_log
 * 实现及使用说明
 * 1 不做日志回滚,因此需要脚本配合使用
 * 2 如果日志内容没有达到4K,日志会在destruct里打出,原因是为了减少IO次数
 * 3 每条日志可以有一些默认打出的字段,可以参考__mc_log::$BASIC_FIELD,这些参数可以在初始化时传入
 * 4 每个php进程只能使用一个log对象,不然内容可能会乱
 * 
 * @history
 *  2008.5.7 添加多进程支持 sheny
 *  
 **/


/**
 * __mc_log 内部使用的log实现类,使用class的一个考虑是想在析构时打出日志
 * 
 */
final class __mc_log
{
	const LOG_FATAL   = 1;
	const LOG_WARNING = 2;
	const LOG_MONITOR = 3;
	const LOG_NOTICE  = 4;
	const LOG_TRACE   = 8;
	const LOG_DEBUG   = 16;
	const PAGE_SIZE   = 4096;
	const LOG_SPACE   = "\10";
	const MONTIR_STR  = ' ---LOG_MONITOR---';

	static $LOG_NAME = array (
			self::LOG_FATAL   => 'FATAL',
			self::LOG_WARNING => 'WARNING',
			self::LOG_MONITOR => 'MONITOR',
			self::LOG_NOTICE  => 'NOTICE',
			self::LOG_TRACE   => 'TRACE',
			self::LOG_DEBUG   => 'DEBUG'
			);
	static $BASIC_FIELD = array (
			'logid',
			'reqip',
			'uid',
			'uname',
			'baiduid',
			'method',
			'uri'
			);

	/**
	 * log_name 日志名
	 * 
	 * @var string
	 * @access private
	 */
	private $log_name   = '';
	/**
	 * log_path 正常日志全路径 
	 * 
	 * @var string
	 * @access private
	 */
	private $log_path   = '';
	/**
	 * wflog_path wf日志全路径 
	 * 
	 * @var string
	 * @access private
	 */
	private $wflog_path = '';
	private $log_str    = '';
	private $wflog_str  = '';
	private $basic_info = '';
	private $notice_str = '';
	private $log_level	= 16;
	private $arr_basic  = null;

	/**
	 * force_flush 是否强制写出
	 * 
	 * @var mixed
	 * @access private
	 */
	private $force_flush = false;

	/**
	 * init_pid 初始化时的pid
	 * 
	 * @var int
	 * @access private
	 */
	private $init_pid   = 0;

	function __construct()
	{
	}

	function __destruct()
	{
		if ($this->init_pid==posix_getpid()) {
			/* 只在打出当前进程的日志 */
			$this->check_flush_log(true);
		}
	}

	function init($dir, $name, $level, $arr_basic_info, $flush=false)
	{
		if (empty($dir) || empty($name)) {
			return false;
		}

		/* 使用的为绝对路径 */
		if ('/'!= $dir{0}) {
			$dir = realpath($dir);
		}

		$dir  = rtrim($dir, ".");
		$name = rtrim($name, "/");
		$this->log_path   = $dir . "/" . $name .".log";
		$this->wflog_path = $dir . "/" . $name . ".log.wf";	
		$this->log_name  = $name;
		$this->log_level = $level;

		/* set basic info */
		$this->arr_basic = $arr_basic_info;
		/* 生成basic info的字符串 */
		$this->gen_basicinfo();
		/* 记录初使化进程的id */
		$this->init_pid = posix_getpid();
		$this->force_flush = $flush;
		
		return true;
	}

	private function gen_log_part($str)
	{
		return "[ " . self::LOG_SPACE . $str . " ". self::LOG_SPACE . "]";
	}

	private function gen_basicinfo()
	{
		$this->basic_info = '';
		foreach (self::$BASIC_FIELD as $key) {
			if (!empty($this->arr_basic[$key])) {
				$this->basic_info .= $this->gen_log_part("$key:".$this->arr_basic[$key]) . " ";
			}
		}
	}

	private function check_flush_log($force_flush)
	{
		if (strlen($this->log_str)>self::PAGE_SIZE || strlen($this->wflog_str)>self::PAGE_SIZE ) {
			$force_flush = true;
		}	

		if ($force_flush) {
			/* first write warning log */
			if (!empty($this->wflog_str)) {
				$this->write_file($this->wflog_path, $this->wflog_str);
			}
			/* then common log */
			if (!empty($this->log_str)) {
				$this->write_file($this->log_path, $this->log_str);
			}

			/* clear the printed log*/
			$this->wflog_str = '';
			$this->log_str   = '';
		
		} /* force_flush */
	}

	
	private function write_file($path, $str)
	{
		$fd = @fopen($path, "a+" );
		if (is_resource($fd)) {
			fputs($fd, $str);
			fclose($fd);
		}
		return;
	}

	public function add_basicinfo($arr_basic_info)
	{
		$this->arr_basic = array_merge($this->arr_basic, $arr_basic_info);
		$this->gen_basicinfo();
	}

	public function push_notice($format, $arr_data)
	{
		$this->notice_str .= " " .$this->gen_log_part(vsprintf($format, $arr_data));
	}

	public function clear_notice()
	{
		$this->notice_str = '';
	}

	public function write_log($type, $format, $arr_data)
	{
		if ($this->log_level<$type)
			return;

		/* log heading */
		$str = sprintf( "%s: %s: %s * %d", self::$LOG_NAME[$type], date("m-d H:i:s"),
				$this->log_name, posix_getpid() );
		/* add monitor tag?	*/	
		if ($type==self::LOG_MONITOR || $type==self::LOG_FATAL) {
			$str .= self::MONTIR_STR;
		}
		/* add basic log */
		$str .= " " . $this->basic_info;
		/* add detail log */
		$str .= " " . vsprintf($format, $arr_data);

		switch ($type) {
			case self::LOG_MONITOR :
			case self::LOG_FATAL :
			case self::LOG_WARNING :
			case self::LOG_FATAL :
				$this->wflog_str .= $str . "\n";
				break;
			case self::LOG_DEBUG :
			case self::LOG_TRACE :
				$this->log_str .= $str . "\n";
				break;
			case self::LOG_NOTICE : 	
				$this->log_str .= $str . $this->notice_str . "\n";
				$this->clear_notice();
				break;
			default : 
				break;	
		}

		$this->check_flush_log($this->force_flush); 
	}
}


//$__log = null;
//
//function __ub_log($type, $arr)
//{
//	global $__log;
//	$format = $arr[0];
//	array_shift($arr);
//
//	$pid = posix_getpid();
//
//	if (!empty($__log[$pid])) {
//		/* shift $type and $format, arr_data left */
//		$log = $__log[$pid];
//		$log->write_log($type, $format, $arr);
//	} else {
//		/* print out to stderr */
//		$s =  __mc_log::$LOG_NAME[$type] . ' ' . vsprintf($format, $arr) . "\n";
//		echo $s;
//		/*
//		   if (!defined('STDERR')) {
//		   $stderr = fopen('php://stderr', 'w');
//		   fprintf($stderr, $s);
//		   echo $s;
//		   } else {
//		   fprintf(STDERR, $s);
//		   }
//		 */
//	} /* if $__log */
//}
//
//
///**
// * ub_log_init Log初始化 
// * 
// * @param string $dir      目录名
// * @param string $file     日志名
// * @param interger $level  日志级别 
// * @param array $info      日志基本信息,可以参考__mc_log::$BASIC_FIELD  
// * @param bool  $flush     是否日志直接flush到硬盘,默认会有4K的缓冲
// * @return boolean          true成功;false失败
// */
//function ub_log_init($dir, $file, $level, $info, $flush=false)
//{
//	global $__log;
//
//	$pid = posix_getpid();
//
//	if (!empty($__log[$pid]) ) {
//		unset($__log[$pid]);
//	}
//
//	$__log[posix_getpid()] = new __mc_log(); 
//	$log = $__log[posix_getpid()];
//	if ($log->init($dir, $file, $level, $info, $flush)) {
//		return true;
//	} else {
//		unset($__log[$pid]);
//		return false;
//	}
//}
//
//
///**
// * UB_LOG_DEBUG            DEBUG日志
// * 
// * @param string $fmt      格式字符串
// * @param mixed  $arg      data
// * @return void
// */
//function UB_LOG_DEBUG()
//{
//	$arg = func_get_args();
//	__ub_log(__mc_log::LOG_DEBUG, $arg );
//}
//
//
///**
// * UB_LOG_TRACE            TRACE日志
// * 
// * @param string $fmt      格式字符串
// * @param mixed  $arg      data
// * @return void
// */
//function UB_LOG_TRACE()
//{
//	$arg = func_get_args();
//	__ub_log(__mc_log::LOG_TRACE, $arg );
//}
//
//
///**
// * UB_LOG_NOTICE           NOTICE日志,一般一次请求只打一条 
// * 
// * @param string $fmt      格式字符串
// * @param mixed  $arg      data
// * @return void
// */
//function UB_LOG_NOTICE()
//{
//	$arg = func_get_args();
//	__ub_log(__mc_log::LOG_NOTICE, $arg );
//}
//
//
///**
// * UB_LOG_MONITOR          MONITOR日志,主要用于监控
// * 
// * @param string $fmt      格式字符串
// * @param mixed  $arg      data
// * @return void
// */
//function UB_LOG_MONITOR()
//{
//	$arg = func_get_args();
//	__ub_log(__mc_log::LOG_MONITOR, $arg );
//}
//
//
///**
// * UB_LOG_WARNING          WANRING日志 
// * 
// * @param string $fmt      格式字符串
// * @param mixed  $arg      data
// * @return void
// */
//function UB_LOG_WARNING()
//{
//	$arg = func_get_args();
//	__ub_log(__mc_log::LOG_WARNING, $arg );
//}
//
//
///**
// * UB_LOG_FATAL            FATAL日志,会同时打出MONITOR日志的标识 
// * 
// * @param string $fmt      格式字符串
// * @param mixed  $arg      data
// * @return void
// */
//function UB_LOG_FATAL()
//{
//	$arg = func_get_args();
//	__ub_log(__mc_log::LOG_FATAL, $arg );
//}
//
//
///**
// * ub_log_pushnotice       压入NOTICE日志,和UB_LOG_XXX接受的参数相同(不同于ub_log同名函数))  
// *                         
// * @param string $fmt      格式字符串
// * @param mixed  $arg      data
// * @return void
// */
//function ub_log_pushnotice()
//{
//	global $__log;
//	$arr = func_get_args();
//
//	$pid = posix_getpid();
//
//	if (!empty($__log[$pid])) {
//		$log = $__log[$pid];
//		$format = $arr[0];
//		/* shift $type and $format, arr_data left */
//		array_shift($arr);
//		$log->push_notice($format, $arr);
//	} else {
//		/* nothing to do */
//	}
//}
//
///**
// * ub_log_clearnotice       清除目前的NOTICE日志,每次调用UB_LOG_NOTICE都会调用本函数
// * 
// * @return void
// */
//function ub_log_clearnotice()
//{
//	global $__log;
//	$arr = func_get_args();
//
//	$pid = posix_getpid();
//
//	if (!empty($__log[$pid])) {
//		$log = $__log[$pid];
//		$log->clear_notice();
//	} else {
//		/* nothing to do */
//	}
//}
//
//
///**
// * ub_log_addbasic       添加日志的基本信息,字段可以参考 BASIC_FIELD 
// * 
// * @param mixed $arr_basic 基本信息的数组 
// * @return void
// */
//function ub_log_addbasic($arr_basic)
//{
//	global $__log;
//	$arr = func_get_args();
//
//	$pid = posix_getpid();
//
//	if (!empty($__log[$pid])) {
//		$log = $__log[$pid];
//		$log->add_basicinfo($arr_basic);
//	} else {
//		/* nothing to do */
//	}
//}





/* //TEST
   $r = ub_log_init("/tmp", "test", 16, array("logid"=>12345 , "reqip"=>"210.23.55.33"), true);

//var_dump($__log);
UB_LOG_FATAL("fatal %d  %s !!!", 1231324, "asdfasdfsf");
UB_LOG_TRACE("fatal %d  %s !!!", 1231324, "asdfasdfsf");
UB_LOG_DEBUG("fatal %d  %s !!!", 1231324, "asdfasdfsf");
UB_LOG_WARNING("fatal %d  %s !!!", 1231324, "asdfasdfsf");
UB_LOG_NOTICE("fatal %d  %s !!!", 1231324, "asdfasdfsf");
UB_LOG_MONITOR("fatal %d  %s !!!", 1231324, "asdfasdfsf");

ub_log_pushnotice("notice %s %d", "asdfasdf", 111);
ub_log_pushnotice("notice %s %d", "asdfasdf", 222);
UB_LOG_NOTICE("fatal %d  %s !!!", 1231324, "asdfasdfsf");
UB_LOG_NOTICE("fatal %d  %s !!!", 1231324, "asdfasdfsf");

ub_log_addbasic( array("uid"=>1234, "uname"=>2323 ));
UB_LOG_NOTICE("fatal %d  %s !!!", 1231324, "asdfasdfsf");

//var_dump($__log);

//*/



/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
?>