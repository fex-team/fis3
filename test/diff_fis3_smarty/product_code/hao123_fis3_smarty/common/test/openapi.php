<?php


/*
 *desciption:Getwidget.php 前端api类，通过传递参数编译widget
 *
 *@finename:Getwidget.class.php
 *@author  :mozhuoyinng@baidu.com
 *@date    :2013-12-19
 *@modify  :
 *
 *@Copyright (c) 2013 BAIDU-GPM
 *
 */
	class OpenApi extends adapterUi{
		protected $cmsData = array();
		protected $urlParam = array();
		protected $path = "";
		protected $privateDataDir = "index";
		//fis使用短路径
		protected $fisWidgetRootPath = "";
		//widget所在的前缀路径
		protected $widgetPrefix = "widget";
		//缺省文件类型
		protected $handlerFileType = 'js';

		//检测是否属于fis,fis需要特殊处理
		protected $isFis = false;

		//返回信息列表
		public $infoList = array(
			//参数传递错误
			'401' => array('status'=>401,'info'=>'param error'),
			//未知文件处理类型(前端不能处理)
			'402' => array('status'=>402,'info'=>'don\'t handle file type'),
			//读取文件不存在
			'404' => array("status"=>404,"info"=>'file not find'),
			//获取成功,返回的数据格式
			'200' => array('status'=>200,"info"=>'success',
						//静态资源
						'resource_map'=>array(
							'style'  => '',
							'script' => '',
						),
						//html片段
						'pagelets'=>''
					)
		);

		//不同的文件类型对应前端不同字段（前端需要根据不同的字段进行不同的处理）
		protected $frontHandlerList = array(
			'html' => 'pagelets',
			'tpl'  => 'pagelets',
			'css'  => 'style',
			'js'   => 'script'
		);
		protected $frontHandler = '';

		//处理句柄函数
		public $handler = array(
			//js处理方式
			'js' => 'file_get_contents'
		);

		//主站fis tpl内置echo ,所以不需要返回值
		public $notReturn = array('fis');
		//初始化controller
		function _before(){
			parent::_before();
			//tpl的处理方式
			$this->handler['tpl'] = array($this->smarty,"fetch");
			//fis的处理方式
			$this->handler['fis'] = array($this->smarty,"display");
			//私有数据merge
			if( $_GET['dataDir'] ){
				$this->privateDataDir = $_GET['dataDir'];
			}
			$dataDir = DATA_ROOT."web/{$this->country}/".rtrim( $this->privateDataDir,"/" ) . "/data.php";
			$baseDataDir = DATA_ROOT."web/{$this->country}/base/data.php";
			//
			if( !preg_match('/\d/',$this->country ) ){
				if ( file_exists($baseDataDir) ) {
				    include_once $baseDataDir;
				    $this->smarty->cmsdata = $this->merge_data($this->smarty->cmsdata,$root);
				}
				if ( file_exists($dataDir) ) {
				    include_once $dataDir;
				    $this->smarty->cmsdata = $this->merge_data($this->smarty->cmsdata,$root);
				}
			}
			$this->cmsData = $this->smarty->cmsdata ;
			$this->smarty->assign('root',$this->cmsData);
			$this->smarty->assign('body',$this->cmsData['body']);
			$this->smarty->assign('head',$this->cmsData['head']);
			$this->smarty->assign('foot',$this->cmsData['foot']);
			$this->smarty->assign('urlparam',$this->cmsData['urlparam']);
			$this->urlParam = $this->cmsData['urlparam'];
		}
		//入口函数
		function index(){

			//参数校验
			$statusCode = $this->_check_param();
			if ( $statusCode !== 200 ){
				$this->_error( $statusCode );
			}

			//初始化
			$this->_Init();

			//根据文件后缀或者参数选择不同的处理方式
			$handler = $this->isFis ? 'fis' : $this->handlerFileType;
			//获取请求内容
			$content = call_user_func_array($this->handler[$handler], array($this->path));
			//是否需要返回值
			if( !in_array($handler, $this->notReturn) ){
				$this->_success( $content );
			}
			
		}
		/*		
		 *  fis widget初始化函数
		 */
		function _init(){
			//是否需要fis模块的初始化
			$fisWidget = $this->urlParam['pagelets'];
			//主站模块需初始化fis widget 
			if( $fisWidget && $this->handlerFileType === 'tpl' ){
				//根据参数pagelets判断是否是fis模块
				$this->isFis = true;
				require_once FIS_SMARTY_PLUGINS_DIR."lib/FISPagelet.class.php";
				FISPagelet::init();
				$this->smarty->assign('openApi',array(
					'widgetPathRoot'=> $this->fisWidgetRootPath,
					'widgetId'=> $fisWidget
				));
				$this->smarty->registerFilter('output', array('FISPagelet', 'renderResponse'));
			}
			
		}
		/*
		 * 参数校验
		 */
		function _check_param(){
			//获取widget所在根路径
			$modulePath = $this->urlParam['module'];
			//获取widgetname
			$widgetName = $this->urlParam['widgetName'];
			//是否指定文件类型
			if( $this->urlParam['fileType'] ){
				$this->handlerFileType = $this->urlParam['fileType'];
			}
			//检测参数是否可用
			if ( !$widgetName || !$modulePath ){
				return 401;
			}

			$widgetPath =  WEBROOT_PATH."template/{$modulePath}/{$this->widgetPrefix}//{$widgetName}/{$widgetName}.{$this->handlerFileType}";
			$this->fisWidgetRootPath = "{$modulePath}:{$this->widgetPrefix}";
			//检测模板是否存在
			if( !file_exists( $widgetPath ) ){
				return 404;
			}
			$this->frontHandler = $this->frontHandlerList[ $this->handlerFileType ];
			//检测前端是否有对应的handler处理对应的文件类型
			if( !$this->frontHandler ){
				return 402;
			}
			$this->path = $widgetPath;

			return 200;
		}

		/*
		 *  错误反馈
		 */
		private function _error( $statusCode ){
			echo json_encode( $this->infoList[$statusCode] );
			exit;
		}

		/*
		 * 成功反馈
		*/
		private function _success( $content ){
			//检测前端是否有对应的方式处理对应的文件类型
			//html
			if( $this->frontHandler === 'pagelets' ){
				$this->infoList['200'][$this->frontHandler] = $content;
			//静态资源
			} else{
				$this->infoList['200']['resource_map'][$this->frontHandler] = $content;
			}
			echo json_encode( $this->infoList['200'] );
			exit;
		}
		private function merge_data() {  
			$arrays = func_get_args();
			$base = array_shift($arrays);    
			foreach ($arrays as $array) {        
				reset($base); //important       
				while (list($key, $value) = @each($array)) {           
					if (is_array($value) && @is_array($base[$key])) {                
					  	$base[$key] = $this->merge_data($base[$key], $value);      
					} 
					else {
					  	$base[$key] = $value;
					}       
				 }   
			}   
			return $base;
		}
	}

$sidebar = new OpenApi();
$sidebar->index();