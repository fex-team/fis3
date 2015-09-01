<?php


/*
 *desciption:hotsitecustom.php 前端api类，热区自定义api
 *
 *@finename:hotsitecustom.class.php
 *@author  :fengkun@baidu.com
 *@date    :2014-06-17
 *@modify  :
 *
 *@Copyright (c) 2014 BAIDU-GPM
 *
 */
require_once dirname(__FILE__) . '/adapterUi.php';
	class HotSiteCustom extends adapterUi{
		//前端callback
		protected $callback = '';
		//数据
		protected $data = array();
		//校验状态码
		protected $statusCode = "";
		//data文件md5
		protected $md5 = "";
		//访问类型web/m
		protected $hostType = "";

		// 模块名
		const MODULE_NAME = "hotsitecustom";

		//返回信息列表
		public $infoList = array(
			//获取成功,返回的数据格式
			'200' => array("status" => 200, "info" => "success"),
			//数据没有改变
			'304' => array("status" => 304, "info" => "data not modified"),
			//参数传递错误
			'401' => array("status" => 401, "info" => "wrong parameters"),
			//读取文件不存在
			'404' => array("status" => 404, "info" => "file not found")
		);
		public function _before(){
			//参数校验
			$this->statusCode = $this->_check_param();
			//校验错误退出
			if ( $this->statusCode !== 200 ){
				$this->_error( $this->statusCode );
			}
		}
		public function index(){
			// 格式化数据
			$this->data = $this->_format($this->data);

			// 将md5值合入数据中
			$this->data = array_merge_recursive($this->infoList[$this->statusCode], array("md5" => $this->md5), array("data" => $this->data));

			$this->_success($this->data);
		}

		/*
		 * 参数校验
		 */
		private function _check_param(){
			$this->country = $_GET['country'];
			$this->callback = $_GET['callback'];
			// PC版访问类型为web,移动版为m,用作数据路径拼接
			$this->hostType = $_GET['ismobile'] == true ? 'm' : 'web';

			//参数校验
			if(empty($this->country) || !empty($this->callback) && !preg_match('/^\w+$/', $this->callback)){
				return 401;
			}

			$dataPath = DATA_ROOT . "{$this->hostType}/{$this->country}/" . self::MODULE_NAME . "/data.php";
			//检测数据是否存在
			if( !file_exists( $dataPath ) ){
				return 404;
				//读取数据
			} else{
				include_once $dataPath;
				$this->data = $root;
				return $this->_check_md5($dataPath);
			}
		}

		/*
		 *	md5校验
		 */
		private function _check_md5($dataPath) {
			$md5 = $_GET['md5'];
			// 获取data.php文件md5值,并截取中间16位以缩短请求
			$this->md5 = substr(md5_file($dataPath),8,16);
			if ($md5 === $this->md5) {
				return 304; 
			}
			return 200;
		}

		/*
		 * 格式化数据
		 */
		private function _format($data) {
			if (!empty($data['body'])) {
				$data = $data['body'];
				// 自定义网址映射数据格式化
				if (!empty($data['customSites'])) {
					$customData = array();
					foreach ($data['customSites'] as $value) {
						// 用host值做key
						$customData[trim($value['host'], '/')] = $value;
						unset($customData[$value['host']]['host']);
					}
					$data['customSites'] = $customData;
				}
				// 推荐网址列表数据格式化
				if (!empty($data['recommendList'])) {
					$recommendData = array();
					foreach ($data['recommendList'] as $value) {
						// 用category值做为key,以list数组内容作为值
						$recommendData[$value['category']] = $value['list'];
					}
					$data['recommendList'] = $recommendData;
				}
				// 去掉注释字段
				$this->_removeComments($data);
			}
			return $data;
		}

		/*
		 * 清除数据中以下划线开头的注释，例如：'_img' => '这是图片'
		 * 支持递归
		 */
		private function _removeComments(&$arr) {
			if (!is_array($arr)) {
				return false;
			}
			foreach ($arr as $key => $value) {
				if (is_array($arr[$key])) {
					$this->_removeComments($arr[$key]);
				} else if ($key[0] === '_') {
					unset($arr[$key]);
				}
			}
		}

		/*
		 *  错误反馈
		 */
		private function _error( $statusCode ){
			// 支持json|jsonp格式返回结果
			if(empty($this->callback)) {
				echo json_encode( $this->infoList[$statusCode] );
			} else {
				echo $this->callback."(". json_encode( $this->infoList[$statusCode] ) .")";
			}
			exit;
		}

		/*
		 *  成功反馈
		 */
		private function _success( $content ){
			// 支持json|jsonp格式返回结果
			if(empty($this->callback)) {
				echo json_encode( $content );
			} else {
				echo $this->callback."(". json_encode( $content ) .")";
			}
			exit;
		}
	}

	$controller = new HotSiteCustom();
	$controller->index();
