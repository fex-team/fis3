<?PHP

/***************************************************************************
 * 
 * Copyright (c) 2009 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
/**
 * @file util.php
 * @author wanghao (wanghao01@baidu.com)
 * @brief zcacheagentwrapper utils
 */


	/**
	 * 生成logid
	 */
	function build_logid()
	{
		list($usec, $sec) = explode(" ", microtime());
		$logid = (((intval(($sec * 100000 + ($usec * 1000000) / 10))) & 0x7FFFFFFF) | 0x80000000);
		return $logid;
	}
	
	
	/**
	 * 创建nshead包
	 * typedef struct _nshead_t
	 * {
	 *   unsigned short id;              
	 *	 unsigned short version;         
	 *	 unsigned int   log_id;
	 *	 char           provider[16];
	 *	 unsigned int   magic_num;
	 *	 unsigned int   reserved;       
	 *	 unsigned int   body_len;
	 * } nshead_t;
	 */
	function build_nshead($vars_arr)
	{
		$nshead_arr = array(
			'id'        => 0,
			'version'   => 0,
			'log_id'    => build_logid(),
			'provider'  => str_pad("", 16, "\0", STR_PAD_BOTH),
			'magic_num' => 0xfb709394,
			'reserved'  => 0,
			'body_len'  => 0
		);
		foreach ($vars_arr as $key => $value)
		{
			if (isset($nshead_arr[$key]))
			{
				$nshead_arr[$key] = $value;
			}
		}
		$nshead  = "";
		$nshead  = pack("L*", (($nshead_arr['version'] << 16) + ($nshead_arr['id'])), $nshead_arr['log_id']);
    $nshead .= $nshead_arr['provider'];
  	$nshead .= pack("L*", $nshead_arr['magic_num'], $nshead_arr['reserved']);
    $nshead .= pack("L", $nshead_arr['body_len']);
		return $nshead;
	}
	
	/**
	 * 解析nshead包，并将buf放入返回数组的buf字段中
	 * typedef struct _nshead_t
	 * {
	 *   unsigned short id;              
	 *	 unsigned short version;         
	 *	 unsigned int   log_id;
	 *	 char           provider[16];
	 *	 unsigned int   magic_num;
	 *	 unsigned int   reserved;       
	 *	 unsigned int   body_len;
	 * } nshead_t;
	 */
	function split_nshead($buf)
	{
	        #echo "split nshead";
                $ret_arr = array(
			'id'        => 0,
			'version'   => 0,
			'log_id'    => 0,
			'provider'  => "",
			'magic_num' => 0,
			'reserved'  => 0,
			'body_len'  => 0,
			'buf'       => ""
		);
		$ret = unpack("v1id/v1version/I1log_id", substr($buf, 0, 8));
		foreach ($ret as $key => $value)
		{
			$ret_arr[$key] = $value;
		}
		$ret_arr['provider'] = substr($buf, 8, 16);
		$ret = unpack("I1magic_num/I1reserverd/I1body_len", substr($buf, 24, 12));
		foreach ($ret as $key => $value)
		{
			$ret_arr[$key] = $value;
		}
		$ret_arr['buf'] = substr($buf, 36, $ret_arr['body_len']);
		return $ret_arr;
	}

?>