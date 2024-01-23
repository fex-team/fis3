<?php
/**
 * ����ʹ�õ� TbView ����ӿڣ����ܵ�ͬ�� Bingo/View/Script.php
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
	
	
	private $_root_path = ''; //ģ���·��
	private $_module = ''; //��ǰģ��
	private $_templateLoader;	//template������
	private $_widgetLoader;	//widget������
	private $_serviceLoader;	//service������
	private $_componentLoader;	//component������
	private $_layoutLoader;	//layout������
	private $_resource_map; //��Դ���ñ�

	function __construct(){
		
	}
	
	/**
	 * TbView��ʼ������bingo����ڲ�����
	 * @param string FE view���·��
	 * @param string ��ǰģ��
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
		
		//����widget����� layout������
		$this->_widgetLoader->setLayoutLoader($this->_layoutLoader);
		
		$this->_resource_map = new TbView_ResourceMap($root_path, $module);
		
		TbView_ModuleResourceLoader::setRootPath($root_path);
		TbView_ModuleResourceLoader::setLocalScope($module);
		HTML::setResourceMap($this->_resource_map);
	}
	
	/**
	 * ������Դ���ñ���FE����
	 * @param array keyȡֵΪ static_domain �� static_perfix
	 * @param 
	 */
	public function initResourceMap($array){
		$this->_resource_map->init($array);
	}
	
	/**
	 * ����ģ��ľ�̬�ļ���Դ����display��������
	 * @param string ģ����
	 * @param 
	 */
	private function _loadTemplateResource($strTemplate){
		$template_name = dirname($strTemplate);
		$tpl_path = 'template' . DIRECTORY_SEPARATOR . $template_name;
		if(!empty($this->_module)){
			$path = $this->_module . DIRECTORY_SEPARATOR . $tpl_path;
			TbView_ModuleResourceLoader::setCurTemplate($template_name);//���õ�ǰ��Ⱦ��ģ��
			TbView_ModuleResourceLoader::load($path);//����ģ��ľ�̬��Դ
		}
	}
	
	
	//�趨ģ�����
	public function assign($name, $var){
		$this->_vars[$name] = $var;
	}
	
	//��Ⱦ��ͼ������
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
	 * ���ô�������
	 */
	public function setErrorHandler($mixValue){
		//to do
		return true;
	}
	
	/**
   * ����DEBUGģʽ������DEBUGģʽĬ������»�Ѵ�����־echo���������һ���غϲ�ǰ���ļ�
   */
	public function setDebug($bolDebug=true){
		if($bolDebug === true){
			TbView_Conf::debug(true);
		}
	}
	
	//��Ⱦģ��
	public function display($template_file){
		$this->_templateLoader->clearData();
		$this->_templateLoader->setData($this->_vars);
		$this->_templateLoader->loadTemplate($this->_template_path.$template_file);
	}
}

/** end of file TbView/View.php **/