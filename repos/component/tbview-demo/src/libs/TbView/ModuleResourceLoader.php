<?php
require_once('TbView/Conf.php');
class TbView_ModuleResourceLoader
{
	private static $_rootPath = ''; //根路径
	private static $_resourceMap = NULL;
	private static $_moduleList = array(); //模块列表
	private static $_localScope = '';//当前所处理的模块
	private static $_curTemplate = '';//当前所渲染的模板名称，不包含所属的模块名
	private static $_resource = array( //资源信息
			'css'	=> array(), //js文件
			'js'	=> array(), //css文件
		);
	private static $_modules = array(//当前模板所加载的模块化元素，重点关注service和template
			'template'	=> array(),
			'service' 	=> array(),
		);
	private static $_merge_conf = array(//存储资源合并配置信息
      //'module' => array(),
    );


	/**
	 * 设置根路径，必须最先设置
	 */
	public static function setRootPath($path){
		self::$_rootPath = $path;
	}
	
	/**
	 * 设置渲染的模板名，必须在调用模板时设置，该接口已经废弃，仅用作记录当前渲染的模板，用作调试 by niuyao，2012.06.19
	 * @param string $templateName 当前所渲染的模板
	 */
	public static function setCurTemplate($templateName){
		if(!empty($templateName)){
			self::$_curTemplate = $templateName;
		}
	}
	public static function setResourceMap ($resourceMap) {
		self::$_resourceMap = $resourceMap;
	}
	
	/**
	 * 设置当前处理的模块，必须最先设置
	 * @param string $scope 设置当前所处理的模块
	 */
	public static function setLocalScope($scope){
		self::$_localScope = $scope;
	}
	
	/**
	 * 给 HTML 组件调用，获取运行过程中所引用的css资源
	 */
	public static function getCss()
	{
		$ret = self::$_resource['css'];
		return $ret;
	}
	
	/**
	 * 给 HTML 组件调用，获取运行过程中所引用的JS资源
	 */
	public static function getJs()
	{
		$ret = self::$_resource['js'];
		return $ret;
	}
	
	/**
	 * 加载一个具体的模块（template、layout、widget等）的静态资源，给模块加载器调用
	 * @param string $modulePath	模块路径
	 * @param string $runtimeType	当前运行环境的类型 
	 */
	public static function load($modulePath){
		//使用bigpipe的静态资源管理器
		if(constant('USING_BIG_PIPE')){
			return;
		}
		if(isset(self::$_moduleList[$modulePath])){//已加载过
			return;
		}
		self::$_moduleList[$modulePath] = 'loaded';

		$paths = explode('/', $modulePath);
		$len = count($paths);
		$scope = $paths[0];//第一个为域
		$type = $paths[1];//第二个为类型
		$modName = $paths[$len - 1];//最后一个为名字
		
		$is_debug = TbView_Conf::isDebug();
		self::$_modules[$type] = $modulePath;//记录所加载的模块
				
		if($is_debug === true){
			if(TbView_Conf::get('COMMON_DIRNAME') !== $scope){//debug模式下，非common模块的资源，都需要加载
				$js_file = self::$_rootPath . $modulePath . "/$modName.js"; //js文件
				$css_file = self::$_rootPath . $modulePath . "/$modName.css"; //css文件

				self::_loadResource($js_file, $scope, 'js');
				self::_loadResource($css_file, $scope, 'css');
			}
		} else if (TbView_Conf::get('RUNTIME_MERGE')) {
			self::_addMoudleResource($modulePath);			
		}else if (TbView_Conf::get('DYNAMIC_MERGE')) { // 使用动态合并
			if ('template' === $type) {
				$des = self::$_resourceMap->getModuleDependency($type.'/'.$modName, $scope);				
				foreach ($des as $item) {
					self::_addMoudleResource($item);
				}
			}
		} else if ('template' === $type || 'service' === $type){
			self::_addMoudleResource($modulePath, true);
		}
	}
	
	/**
	 * 根据一个文件名及所属的域来决定要加载的文件，仅在debug模式下生效
	 * 由于线上和测试环境采用文件覆盖的模式，并不会删除任何文件
	 * 所以一个资源在svn代码库删除后，线上仍存在，故某些情况下会出现额外加载文件的情况
	 * JS全采用模块化机前，要避免这种情况，最好只是清空代码文件，并不真正删除
	 * 
	 * @param string 文件名
	 * @param string 域/模块名
	 * @param string 资源类型
	 */
	private static function _loadResource($file, $scope, $type){
		if(is_file($file)){
			//echo "<p><b>[Load][Resource]: Find recource : $scope : $res, load it!</b><p>";
			self::_loadResourceMergeConf($scope);//读取资源手工合并配置
			$res = str_replace(self::$_rootPath . $scope . '/', '' , $file);
			
			if(isset(self::$_merge_conf[$scope][$res])){//处理一个资源由多个资源合并而成的情况
				$list = self::$_merge_conf[$scope][$res];
				foreach($list as $item){
					self::$_resource[$type][] = array($item, $scope);
				}
			}
			else{
				self::$_resource[$type][] = array($res, $scope);
			}
		}
	}
	
	/**
	 * 加载一个模块的资源合并配置信息
	 * @param string 域/模块名
	 */
	private static function _loadResourceMergeConf($scope){
		if(!isset(self::$_merge_conf[$scope])){
			$file = self::$_rootPath . "$scope/__merge_conf.php";
			if(is_file($file)){
				self::$_merge_conf[$scope] = include($file);
			}
			else{
				self::$_merge_conf[$scope] = array();
			}
		}
	}

	/**
	 * 加载模块的静态资源
	 * @param string 模块路径 类似 frs/widget/thread_list
	 * @param boolen 资源名是否使用__page__ 默认使用模块名
	 */
	private static function _addMoudleResource ($modulePath, $usePageName = false) {
		$paths = explode('/', $modulePath);
		$scope = $paths[0];//第一个为域
		$modName = $paths[2];//最后一个为名字

		if ($usePageName) {
			$fileName = '__page__';
		} else {
			$fileName = $modName;
		}
		
		self::$_resource['css'][] = array($paths[1]. '/'. $modName . '/' . $fileName. '.css', $scope);
		self::$_resource['js'][] = array($paths[1]. '/'. $modName . '/' . $fileName. '.js', $scope);
	}
}

/** end of file TbView/TbView_ModuleResourceLoader.php **/