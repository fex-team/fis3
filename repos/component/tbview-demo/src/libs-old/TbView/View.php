<?php
/**
 * 独立使用的 TbView 对外接口，功能等同于 Bingo/View/Script.php
 */
require_once('TbView/WidgetLoader.php');
require_once('TbView/ServiceLoader.php');
require_once('TbView/ComponentLoader.php');
require_once('TbView/LayoutLoader.php');
require_once('TbView/TemplateLoader.php');
require_once('TbView/Domain.php');
require_once('TbView/ModuleResourceLoader.php');
require_once('TbView/ResourceMap.php');
require_once('TbView/Conf.php');
require_once('TbView/ScriptPool.php');
require_once('TbView/HTML.php');

class TbView_View{
 
	
	private $_control_path = '';
	private $_template_path = '';
	private $_vars = array();
	
	
	private $_root_path = ''; //模板跟路径
	private $_module = ''; //当前模块
	private $_templateLoader;	//template加载器
	private $_widgetLoader;	//widget加载器
	private $_serviceLoader;	//service加载器
	private $_componentLoader;	//component加载器
	private $_layoutLoader;	//layout加载器
	private $_resource_map; //资源配置表

	function __construct(){
		
	}
	
	/**
	 * TbView初始化，给bingo框架内部调用
	 * @param string FE view层根路径
	 * @param string 当前模块
	 */
	public function initTbView($root_path, $module){
		//echo "[TbView][init] root path : $root_path , module : $module <br />";
		$this->_root_path = $root_path; 
		$this->_module = $module; 
		$this->_control_path = $root_path . $module . "/control/";
		$this->_template_path = $root_path . $module . "/template/";
		
		$this->_componentLoader = new TbView_ComponentLoader($this->_module, $this->_root_path);
		
		$this->_widgetLoader = new TbView_WidgetLoader($this->_module, $this->_root_path, array(
			'__component__' => $this->_componentLoader
		));
		
		$this->_serviceLoader = new TbView_ServiceLoader($this->_module, $this->_root_path, array(
			'__component__' => $this->_componentLoader,
			'__widget__' => $this->_widgetLoader
		));
		
		$this->_layoutLoader = new TbView_LayoutLoader($this->_module, $this->_root_path, array(
			'__component__' => $this->_componentLoader,
			'__widget__' => $this-> _widgetLoader,
			'__service__' => $this->_serviceLoader
		));
		
		$this->_templateLoader = new TbView_TemplateLoader(array(
			'__view__' => $this,
			'__component__' => $this->_componentLoader,
			'__widget__' => $this->_widgetLoader,
			'__service__' => $this->_serviceLoader,
			'__layout__' => $this->_layoutLoader
		));
		
		//设置widget对象的 layout加载器
		$this->_widgetLoader->setLayoutLoader($this->_layoutLoader);
		
		$this->_resource_map = new TbView_ResourceMap($root_path, $module);
		
		TbView_ModuleResourceLoader::setRootPath($root_path);
		TbView_ModuleResourceLoader::setLocalScope($module);
		HTML::setResourceMap($this->_resource_map);
	}
	
	/**
	 * 设置资源配置表，给FE调用
	 * @param array key取值为 static_domain 、 static_perfix
	 * @param 
	 */
	public function initResourceMap($array){
		$this->_resource_map->init($array);
	}
	
	/**
	 * 加载模板的静态文件资源，给display方法调用
	 * @param string 模块名
	 * @param 
	 */
	private function _loadTemplateResource($strTemplate){
		$template_name = dirname($strTemplate);
		$tpl_path = 'template' . DIRECTORY_SEPARATOR . $template_name;
		if(!empty($this->_module)){
			$path = $this->_module . DIRECTORY_SEPARATOR . $tpl_path;
			TbView_ModuleResourceLoader::setCurTemplate($template_name);//设置当前渲染的模板
			TbView_ModuleResourceLoader::load($path);//加载模板的静态资源
		}
	}
	
	
	//设定模板变量
	public function assign($name, $var){
		$this->_vars[$name] = $var;
	}
	
	//渲染视图控制器
	public function render($view_file){
		//echo "@View.render; view file : $view_file <br />";
		$init_script = $script = $this->_control_path . '__init.php';
		if(is_file($init_script)){
			include($init_script);
		}
		$script = $this->_control_path . $view_file;
		include($this->_control_path . $view_file);
	}
	
	/**
	 * 设置错误处理器
	 */
	public function setErrorHandler($mixValue){
		//to do
		return true;
	}
	
	/**
   * 开启DEBUG模式，启用DEBUG模式默认情况下会把错误日志echo出来，而且会加载合并前的文件
   */
	public function setDebug($bolDebug=true){
		if($bolDebug === true){
			TbView_Conf::debug(true);
		}
	}
	
	//渲染模板
	public function display($template_file){
		$this->_templateLoader->clearData();
		$this->_templateLoader->setData($this->_vars);
		$this->_templateLoader->loadTemplate($this->_template_path.$template_file);
	}
}

/** end of file TbView/View.php **/