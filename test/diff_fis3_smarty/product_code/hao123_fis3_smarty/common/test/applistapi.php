<?php


/*
 *desciption:applistApi.php 前端api类，通过传递参数编译widget
 *
 *@finename:applistApi.class.php
 *@author  :mozhuoyinng@baidu.com
 *@date    :2014-03-10
 *@modify  :
 *
 *@Copyright (c) 2013 BAIDU-GPM
 *
 */
require_once dirname(__FILE__) . '/adapterUi.php';
	class AppListApi extends adapterUi{
		//前端callback
		protected $callBack = '';
		protected $country = "";
		//数据
		protected $data = array();
		//校验状态码
		protected $statusCode = "";
		//读取数据模块名称
		protected $module = "";
		//是否获取指定的app信息
		protected $appIds = array();
		protected $idToAppInfo = array();
		protected $version = "";
		//返回信息列表
		public $infoList = array(
			//参数传递错误
			'401' => array('status'=>401,'info'=>'param error'),
			//未知文件处理类型(前端不能处理)
			'402' => array('status'=>402,'info'=>'don\'t handle file type'),
			//读取文件不存在
			'404' => array("status"=>404,"info"=>'file not find'),
			//获取成功,返回的数据格式
			'200' => array('status'=>200,"info"=>'success',)
		);
		public function _before(){
			//参数校验
			$this->statusCode = $this->_check_param();
			//校验错误退出
			if ( $this->statusCode !== 200 ){
				$this->_error( $statusCode );
			}
		}
		public function index(){
	
			//格式化cms数据
			$idToAppInfo = $this->_idToAppInfo();
			$appInfo = array();
			//根据pm或者用户指定的id获取对应的app信息
			foreach ($this->appIds as $id) {
				$appInfo[$id] = $this->idToAppInfo[$id];
			}
			//通过defaulApp字段区分1,2期,设置了为2期
			if( !empty( $this->version ) ){
				//取代applist列表信息
				$this->data['sidebar']['list'] = $appInfo;
			}
			
			$this->_success( $this->data );
		}

		public function getAllInfo(){
			$idToAppInfo = $this->_idToAppInfo();
			//取代applist列表信息
			//取代applist列表信息
			$this->data['sidebar']['list'] = $idToAppInfo;
			$this->_success( $this->data );
		}
		/*
		 * 参数校验
		 */
		private function _check_param(){
			//获取widget所在根路径
			$this->callBack = $_GET['callback'];
			$this->country = $_GET['country'];
			$this->module = $_GET['module'];
			$this->version = $_GET['version'];
			//参数校验
			if( empty($this->callBack) || empty($this->country) || empty($this->module) || !preg_match('/^\w+$/', $this->callBack) ){
				return 401;
			}
			$path = "applist/{$this->country}/{$this->module}/data.php";
			$localAppListDataPath = DATA_ROOT."data/".$path;
			//检测数据是否存在
		
				$this->data = CmsDataAdapter::saveAndGetOrMergeData($localAppListDataPath, $path);
				if( empty( $this->data ) ){
					return 404;

				}
				//合并mis数据
				$misDataPath = DATA_ROOT."applist/{$this->country}/mis/data.php";
				if( file_exists( $misDataPath ) ) {
					include_once $misDataPath;
					// 合并sidebar list数据
					foreach ($root['sidebar']['list'] as $item) {
						$this->data['sidebar']['list'][]= $item;
					}
					// 合并sidebar气泡数据
	                foreach ($root['sidebar']['guideBubble']['list'] as $item) {
	                    $this->data['sidebar']['guideBubble']['list'][]= $item;
	                }
				}
				//是否获取用户app信息，否则获取pm配置的app信息
				$ids = empty( $_GET['appids'] ) ? $this->data['defaultApp']['list'] : $_GET['appids'];
				$this->appIds = explode( ",", $ids);

			return 200;
		}

		/*
		 *  转换cms中的applist信息列表，cms(方便pm配数据)中配的方式为array( array(id=>"1" )) => array(1=>array(id=>'1'))
		 */
		private function _idToAppInfo( $statusCode ){
			$idToAppInfo = array();
			foreach ($this->data['sidebar']['list'] as $val) {
				$idToAppInfo[ $val['id'] ] = $val;
			}
			$this->idToAppInfo = $idToAppInfo;
			return $this->idToAppInfo;
		}

		/*
		 *  错误反馈
		 */
		private function _error( $statusCode ){
			echo json_encode( $this->infoList[$statusCode] );
			exit;
		}

		/*
		 *  成功反馈
		 */
		private function _success( $content ){
			echo $this->callBack."(". json_encode( $content ) .")";
			exit;
		}
	}
$route_url =  $_SERVER['SCRIPT_URL'] ? $_SERVER['SCRIPT_URL'] : $_SERVER['REQUEST_URI'];
$index = new AppListApi();
if( preg_match("/getAllInfo/",$route_url)){
	$index->getAllInfo();
} else{
	$index->index();
}
