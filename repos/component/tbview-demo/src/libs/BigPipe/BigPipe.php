<?php
/**
 * Bingo_View_BigPipe
 * @author zhangyunlong <zhangyunlong@baidu.com>
 * @since 2013-05-15
 *
 */


//override
require_once('BigPipe/ResourceMap.php');

class Bingo_View_BigPipe extends Bingo_View_Script
{

	private static $_instance = null;
	
	/**
	 * TbView初始化，给bingo框架内部调用
	 * @param string FE view层根路径
	 * @param string 当前模块
	 */
	public function initTbView($root_path, $module){
		//echo "@Bingo_View_Script.initTbView; root path : $root_path , module : $module <br />";
		
		//echo "@Bingo_View_Script.initTbView; root path : $root_path , module : $module <br />";
		
		$this->_root_path = $root_path;
		$this->_module = $module;
		$this->_control_path = $root_path . $module . "/control/";
		$this->_template_path = $root_path . $module . "/template/";
		$this->_configurateTbView($root_path, $module);//配置tbview
		
		$this->_componentLoader = new PageletLoaderHelper(
			new TbView_ComponentLoader($this->_module, $this->_root_path), 'component'
		);
		
		$this->_widgetLoader = new PageletLoaderHelper(
			new TbView_WidgetLoader($this->_module, $this->_root_path, array(
				'__component__' => $this->_componentLoader
			)), 'widget'
		);
		
		$this->_serviceLoader = new PageletLoaderHelper(
			new TbView_ServiceLoader($this->_module, $this->_root_path, array()), 'service'
		);//需要在TbView中根据当前加载的service所属的模块去重新构造 widget、layout、component的加载器
		
		$this->_layoutLoader = new PageletLoaderHelper(
			new TbView_LayoutLoader($this->_module, $this->_root_path, array(
				'__component__' => $this->_componentLoader,
				'__widget__' => $this-> _widgetLoader,
				'__service__' => $this->_serviceLoader
			)), 'layout'
		);
		
		$this->_templateLoader = new TbView_TemplateLoader(array(
			'__component__' => $this->_componentLoader,
			'__widget__' => $this->_widgetLoader,
			'__service__' => $this->_serviceLoader,
			'__layout__' => $this->_layoutLoader
		));
		
		//设置widget对象的 layout加载器
		$this->_widgetLoader->setLayoutLoader($this->_layoutLoader);
		
		$_list = $this->_filterModuleParamInGet('__widget');
		if(!empty($_list)){//处理仅渲染局部widget的情形
			$this->_widgetLoader->setTargetModules($_list);
			$this->_serviceLoader->setEnable(false);
		}
		else{
			$_list = $this->_filterModuleParamInGet('__service');
			if(!empty($_list)){//处理仅渲染局部service的情形
				$this->_service->setTargetModules($_list);
				$this->_widgetLoader->setEnable(false);
			}
		}
		
		
		$this->_resource_map = new BigPipe_ResourceMap($root_path, $module);
		BigPipe::setResourceMap($this->_resource_map);
		
		TbView_ModuleResourceLoader::setRootPath($root_path);
		TbView_ModuleResourceLoader::setLocalScope($module);
		TbView_ModuleResourceLoader::setResourceMap($this->_resource_map);
		HTML::setResourceMap($this->_resource_map);
		TbView_PageUnitLoader::init($this->_resource_map);
	}

	public static function getInstance()
    {
		if (null === self::$_instance) {
			self::$_instance = new self();
        }
        return self::$_instance;
	}
	
	protected function _outputType()
    {
		if(BigPipe::getMode() === BigPipe::QUICKLING){
			$this->_arrOutputConfig['type'] = 'json';
		}
		parent::_outputType();
	}
    
    protected function _displayTemplate($strTemplate)
    {
		ob_start();
    	$ret = parent::_displayTemplate($strTemplate);
		$html = ob_get_clean();
		$mode = BigPipe::getMode();
		if($ret && $mode !== BigPipe::QUICKLING){
			BigPipe::import('template/' . $strTemplate, $this->_module);
		}
		$collection = BigPipe::getCollection();
		$pagelets = BigPipe::getPagelets();
		$script = $collection['script'];
		unset($collection['script']);
		switch($mode){
			case BigPipe::NO_SCRIPT:
				$cssHtml = "";
				foreach($collection['res']['css'] as $css){
					$cssHtml .= '<link href="' . $css['uri'] . '" type="text/css" rel="stylesheet"/>';
					$cssHtml .= "\n";
				}
				$html = BigPipe::renderCss($html, $cssHtml);
				foreach($collection['res']['js'] as $js){
					$html .= '<script src="' . $js['uri'] . '" type="text/javascript"></script>';
					$html .= "\n";
				}
				foreach($collection['script'] as $code){
					$html .= '<script type="text/javascript">';
					$html .= implode($code, "\n");
					$html .= '</script>';
				}
			break;
			case BigPipe::QUICKLING:
				$html = json_encode(array(
					'title' => BigPipe::getTitle(),
					'pagelets' => $pagelets,
					'script' => $script,
					'resource_map' => $collection
				));
			break;
			case BigPipe::PIPE_LINE:
				$html .= '<script type="text/javascript">';
				$html .= "\n";
				if(isset($script)){
					$html .= 'BigPipe.onPageReady(function(){';
					if(isset($script['pagelet'])){
						$html .= "\n";
						$html .= $script['pagelet'];
					}
					if(isset($script['page'])){
						$html .= "\n";
						$html .= $script['page'];
					}
					$html .= '});';
				}
				$html .= '</script>';
				$html .= "\n";
				foreach($pagelets as $index => $pagelet){
					$id = '__cnt_' . $index;
					$html .= '<code style="display:none" id="' . $id . '"><!-- ';
					$html .= str_replace(
						array('\\', '-->'),
						array('\\\\', '--\\>'),
						$pagelet['html']
					);
					unset($pagelet['html']);
					$pagelet['html_id'] = $id;
					$html .= ' --></code>';
					$html .= "\n";
					$html .= '<script type="text/javascript">';
					$html .= "\n";
					$html .= 'BigPipe.onPageArrived(';
					$html .= json_encode($pagelet);
					$html .= ');';
					$html .= "\n";
					$html .= '</script>';
					$html .= "\n";
				}
				$html .= '<script type="text/javascript">';
				$html .= "\n";
				$html .= 'BigPipe.register(';
				if(empty($collection)){
					$html .= '{}';
				} else {
					$html .= json_encode($collection);
				}
				$html .= ');';
				$html .= "\n";
				$html .= '</script>';
			break;
		}
		echo $html;
    	return $ret;
    }
}

class PageletLoaderHelper {
	
	private $_instance = null;
	private $_type = null;
	
	public function __construct($loader, $type){
		$this->_instance = $loader;
		$this->_type = $type;
	}
	
	
	public function load($name, $data = null, $scope = null, $id = null){
		if($this->_type === 'layout'){
			$ret = new PageletLayoutLoaderHelper(
				$this->_instance->load($name, $data, $scope)
			);
		} else {
			$hit = BigPipe::start($id);
			$ret = $this->_instance->load($name, $data, $scope);
			BigPipe::end();
		}
		if($hit || BigPipe::getMode() !== BigPipe::QUICKLING){
			$scope = empty($scope) ? $this->_instance->getLocalScope() : $scope;
			BigPipe::import("{$scope}:{$this->_type}/{$name}/{$name}.php", $scope);
		}
		return $ret;
	}
	
	public function __call($method, $arguments){
		call_user_func_array(array($this->_instance, $method), $arguments);
	}
}

class PageletLayoutLoaderHelper {
	
	private $_instance = null;
	
	public function __construct($layout){
		$this->_instance = $layout;
	}
	
	public function startBlock($block, $id = null)
	{
		$this->_instance->startBlock($block);
		BigPipe::start($id);
	}
	
	public function endBlock()
	{
		BigPipe::end();
		$this->_instance->endBlock();
	}
	
	public function __call($method, $arguments){
		call_user_func_array(array($this->_instance, $method), $arguments);
	}
}

class BigPipe {

	const PIPE_LINE = 0;
	const NO_SCRIPT = 1;
	const QUICKLING = 2;
	
	const CSS_PLACEHOLDER = '<!--[__PAGE_CSS_PLACEHOLDER__]-->';

	private static $_resource_map = null;
	private static $_script_name = null;
	private static $_context = null;
	private static $_filter = array();
	private static $_sessionId = 0;
	private static $_contextMap = array();
	private static $_pagelets = array();
	private static $_title = '';
	
	private static $_mode = null;
	
	public static function setFilter($ids){
		self::$_filter = array();
		foreach($ids as $id){
			self::$_filter[$id] = true;
		}
	}
	
	public static function css(){
		return self::CSS_PLACEHOLDER;
	}
	
	public static function renderCss($content, $fragment){
		$pos = strpos($content, self::CSS_PLACEHOLDER);
        if($pos !== false){
            $content = substr_replace($content, $fragment, $pos, strlen(self::CSS_PLACEHOLDER));
        }
		return $content;
	}
	
	public static function setMode($mode){
		if(self::$_mode === null){
			self::$_mode = $mode;
		}
	}
	
	public static function getMode(){
		return self::$_mode;
	}
	
	public static function setTitle($title){
		self::$_title = $title;
		return $title;
	}
	
	public static function getTitle(){
		return self::$_title;
	}
	
	public static function getPagelets(){
		return self::$_pagelets;
	}
	
	public static function start($id = null){
		$hit = true;
		switch(self::$_mode){
			case self::NO_SCRIPT:
				if(empty($id)){
					echo '<div>';
				} else {
					echo '<div id="' . $id . '">';
				}
			break;
			case self::QUICKLING:
				$hit = isset(self::$_filter[$id]);
			case self::PIPE_LINE:
				$id = empty($id) ? '__elm_' . self::$_sessionId++ : $id;
				$context = array( 'id' => $id );
				$parent = self::$_context;
				if(isset($parent)){
					$parent_id = $parent['id'];
					self::$_contextMap[$parent_id] = $parent;
					$context['parent_id'] = $parent_id;
					if($parent['hit']) {
						$hit = true;
					} else if($hit && self::$_mode === self::QUICKLING){
						unset($context['parent_id']);
					}
				}
				$context['hit'] = $hit;
				self::$_context = $context;
				echo '<div id="' . $id . '">';
				ob_start();
			break;
		}
		return $hit;
	}
	
	public static function end(){
		$ret = true;
		if(self::$_mode !== self::NO_SCRIPT){
			$html = ob_get_clean();
			$pagelet = self::$_context;

			if($pagelet['hit']){
				unset($pagelet['hit']);
				$pagelet['html'] = $html;
				self::$_pagelets[] = &$pagelet;
				unset($pagelet);
			} else {
				$ret = false;
			}
			$parent_id = self::$_context['parent_id'];
			if(isset($parent_id)){
				self::$_context = self::$_contextMap[$parent_id];
				unset(self::$_contextMap[$parent_id]);
			} else {
				self::$_context = null;
			}
		}
		echo '</div>';
		return $ret;
	}
	
	public static function setContext(BigPipeContext $context){
		self::$_context = $context;
	}
	
	public static function setResourceMap($resource_map)
	{
		self::$_resource_map = $resource_map;
	}
	
	public static function import($id, $namespace = null)
	{
		return self::$_resource_map->import($id, $namespace);
	}
	
	public static function getCollection()
	{
		return self::$_resource_map->getCollection();
	}
	
	public static function scriptStart()
	{
		ob_start();
	}
	
	public static function scriptEnd(){
		$code = ob_get_clean();
		if(self::$_context['hit'] || BigPipe::getMode() !== BigPipe::QUICKLING){
			$name = empty(self::$_context) ? 'page' : 'pagelet';
			self::$_resource_map->addScript($code, $name);
		}
	}
}