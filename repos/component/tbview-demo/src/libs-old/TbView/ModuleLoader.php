<?php
require_once('TbView/ModuleResourceLoader.php');
require_once('TbView/TemplateLoader.php');

class TbView_ModuleLoader extends TbView_TemplateLoader
{
	protected $_tempLoader;
	protected $_sourceList;
	protected $_localScope;
	protected $_rootPath;
	protected $_commonDirname;//common模块的目录名，支持自定义目录名，满足类似移动贴吧的需求
	protected $_loadResource = true;//是否加载资源，仅service接口用到，部分service可以配置为不加载js和css资源，发贴框是典型
	protected $_terminalModel = false;
	
	protected $_targetModules = array();//需要去加载的模块，用做独立渲染部分 widget 和 service
	protected $_renderMode = 'template';////渲染模式，默认为 tamplate 代表整页渲染，取值为 module 代表为渲染指定widget或service ，loader 本身为一次性使用，只能选择 temlpate 模式或者 single模式，顾不需要重新设置
	protected $_isEnable = true;//是否生效，在单独渲染一个页面中的widget时 service 需要禁止执行
	
	
	public function __construct($scope, $rootPath, $defaultData=NULL)
	{
		$this->_rootPath = $rootPath;	//根路径
		$this->_localScope = $scope;	//当前所在模块
		$this->_sourceList = array();
		$this->_commonDirname = TbView_Conf::get('COMMON_DIRNAME');
		parent::__construct($defaultData);
	}
	
	
	/**
	 * 设置是否起作用，在单独渲染 widget 或 service 的情况模式下需要设置关闭另一个
	 * @param bool ，是否生效
	 */
	public function setEnable($enable_state){
		$state = (bool) $enable_state;
		$this->_isEnable = $state;
	}
	
	/**
	 * 设置需要渲染的模块（widget或者service）
	 * QA widget单测接口或者仅需要渲染局部页面时使用
	 * @param array 待渲染的模块列表
	 */
	public function setTargetModules($module_list){
		if(count($module_list) > 0){
			$this->_targetModules = $module_list;
			$this->_renderMode = 'module';//渲染模式设置为页面功能模块
		}
	}
	public function setTerminalModel($model) {
		$this->_terminalModel = $model;
	}
	
	/***
	 * 加载一个组件的html
	 */	
	public function getHtml($moduleName,$data,$scope){
		$_html = '';
		ob_start();
		$this->load($moduleName, $data, $scope);//子类需要实现load接口
		$_html = ob_get_contents();
		ob_end_clean();	
		return $_html;
	}
	
	/***
	 * 加载一个打包的module 包含 php css 和 js 并且会将其加载的资源写入$sourceList
	 * 是对以上三个函数的封装
	 */
	protected function _loadModule($moduleName, $php=NULL, $data=NULL, $needRequire=false)
	{
		if(isset($data) && isset($php))
			$this->setData($data);
		//加载php
		if(isset($php) && is_string($php)){
			if ($this->_terminalModel) {
				$tmp = substr($php,0, -4) . '_' . $this->_terminalModel . '.php';
				if (is_file($tmp)) {
					$this->loadTemplate($tmp, $needRequire);
				} else {
					$this->loadTemplate($php, $needRequire);
				}
			} else {
				$this->loadTemplate($php, $needRequire);
			}
			
		}
		
		//写入资源列表
		$this->_sourceList[$moduleName] = array(
			'php' => $php,
		);
		
		//加载静态资源 by niuyao
		if($this->_loadResource === true){
			TbView_ModuleResourceLoader::load($moduleName);
		}
	}
	
	/**
	 * 验证要加载的模块所属域是否符合模块化规范
	 * 支持子域模式(main/sub)，such as frs/aside，
	 * 但还需要修改 ModuleResourceLoader.php 以支持，by niuyao 2012.09.28
	 * @param string 模块所属域
	 */
	protected function _validateScope($scope){
		$is_valid = false;
		$paths = explode('/',$scope);//
		
		$common_dirname = $this->_commonDirname;
		//echo "TbView_ModuleLoader@_validateScope : commonDirname=$common_dirname; scope=$scope <br />";
		if(count($paths) > 0){
			$main_scope = $paths[0];
			//echo "$scope :::: $main_scope  "; 
			if($main_scope === $this->_localScope || $main_scope === $this->_commonDirname){
				$is_valid = true;
			}
		}
		return $is_valid;
	}
	
	/**
	 * 判断是否需要渲染一个模块
	 * @param string 模块所属域
	 * @param string 模块名
	 */
	protected function _needToRender($scope, $module){
		$is_need = true;
		if($this->_isEnable == true){
			if('module' === $this->_renderMode && !in_array($module , $this->_targetModules)){
				$is_need = false;
			}
		}
		else{
			$is_need = false;
		}
		return $is_need;
	}
	
	
	protected function _loadModuleOnce($moduleName, $php=NULL, $data=NULL, $needRequire=false)
	{
		if(!$this->getSource($moduleName)){
			$this->_loadModule($moduleName, $php, $data, $needRequire);
		}
	}
	protected function _getDefaultData()
	{
		return $this->_defaultData;
	}
	/***
	 * 获取已经加载的模块的资源列表
	 * 当没有传入moduleName的时候 返回整个sourceList
	 */
	public function getSource($moduleName=NULL)
	{
		if(!isset($moduleName))
			return $this->_sourceList;
		
		if(is_string($moduleName) && isset($this->_sourceList[$moduleName])){
			return $this->_sourceList[$moduleName];
		}else{
			return false;
		}
	}
}

/** end of file  TbView/ModuleLoader.php **/