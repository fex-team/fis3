<?php
/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id: Pic.php,v 1.0 2012/03/21 12:05:28 wenweidong $ 
 * 
 **************************************************************************/

/**
 * @file Pic.php
 * @author wenwedong(wenweidong@baidu.com)
 * @date 2012/03/21 12:35:23
 * @version 1.0.0.0
 * @brief 调用社区图片系统服务
 * 
 **/
class Bd_Pic {
	/**
	 * @brief 图片提交(图片上传，删除等)
	 * @param 请求数组
	 * @return 返回数组，错误时返回false
	 * @author wenweidong
	 * @date 2012/03/21 11:31:37
	 * @note
	 */
	public static function picCommit($reqArr) {
		ral_set_logid ( time () + mt_rand () );
		$ret = ral ( 'picCommit', 'nothing', $reqArr, rand () );
		if ($ret === false) {
			Bd_Pic_Log::warning ( ral_get_error (), ral_get_errno () );
			return false;
		}
		return $ret;
	}
	
	/**
	 * @brief pic_id转url(批量接口)
	 * @param 请求数组
	 * @return 返回数组，错误时返回false
	 * @author wenweidong
	 * @date 2012/03/21 11:31:37
	 * @note
	 */
	public static function pid2Url($reqArr, $useRal = true) {
		if ($useRal) {
			return self::pid2UrlRal ( $reqArr );
		} else {
			return self::pid2UrlLocal ( $reqArr );
		}
	}
	
	/**
	 * @brief 图片转存接口
	 * @param 请求数组
	 * @return 返回数组，错误时返回false
	 * @author wenweidong
	 * @date 2012/03/21 11:31:37
	 * @note
	 */
	public static function picCrawler($productName, $picUrl) {
		$reqArr = array (
					"cmd_no" => 10404, //命令号
					"op_uid" => 0, 
					"op_uip" => 0, 
					"pic_width" => 0, 
					"pic_height" => 0, 
					"datalen" => 0, 
					"pic_type" => 0, 
					"op_username" => $productName, 
					"pic_url" => $picUrl, 
					"space_id" => 0 
				);
		$ret = ral ( 'picCrawler', 'nothing', $reqArr, rand () );
		if ($ret === false) {
			Bd_Pic_Log::warning ( ral_get_error (), ral_get_errno () );
			return false;
		}
		return $ret;
	}
	private static function pid2UrlRal($reqArr) {
		ral_set_logid ( time () + mt_rand () );
		$array = array (
					"cmd_no" => 1012, //命令号
					"reqs" => $reqArr 
				);
		$ret = ral ( 'urlCrypt', 'nothing', $array, rand () );
		if ($ret === false) {
			Bd_Pic_Log::warning ( ral_get_error (), ral_get_errno () );
			return false;
		}
		return $ret;
	}
	private static function pid2UrlLocal($reqArr) {
		$obj = new Bd_Pic_UrlCrypt ();
		$ret = $obj->BatPid2Url ( $reqArr );
		if ($ret['err_no'] != 0) {
			Bd_Pic_Log::warning ($ret['err_msg'],  $ret['err_no'] );
			return false;
		}
		return $ret;
	}
}

?>

