<?php
/**
 * Bingo_View_Script
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package bingo
 * @since 2010-04-12
 *
 */
require_once 'Bingo/View/Exception.php';

require_once('TbView/ConfiguratorLoader.php');
require_once('TbView/WidgetLoader.php');
require_once('TbView/ServiceLoader.php');
require_once('TbView/ComponentLoader.php');
require_once('TbView/LayoutLoader.php');
require_once('TbView/TemplateLoader.php');
require_once('TbView/Domain.php');
require_once('TbView/ModuleResourceLoader.php');
require_once('TbView/ResourceMap.php');
require_once('TbView/PageUnitLoader.php');
require_once('TbView/Conf.php');
require_once('TbView/ScriptPool.php');
require_once('TbView/HTML.php');

if (! defined('BINGO_ENCODE_LANG')) define('BINGO_ENCODE_LANG', 'GBK');
class Bingo_View_Script
{
	protected $_strBaseDir = '.';
	/**
	 * 
	 * @var array
	 */
	protected $_arrPaths = array(
		'config' => array(),//key=>object
		'helper' => array(),//key=>value
		'template' => array(),//value
		'layout' => array(),//value
		'element' => array(),//value
	);
	/**
	 * UI传递给FE的数据字典
	 * @var array
	 */
	protected $_arrVars = array();
	/**
	 * UI传递给FE的错误号
	 * @var int
	 */
	protected $_intErrno = 0;
	/**
	 * 当前布局
	 * @var string
	 */
	protected $_strLayout = '';
	/**
	 * Layout对象，用户存储Layout需要用到的相关数据
	 * @var Object Bingo_View_Layout
	 */
	protected $_objLayout = null;
	/**
	 * 数组，用于存储已经实例化的helper对象。基于$name为key的。
	 * @var array
	 */
	protected $_arrHelperStore = array();
	
	protected $_strHelperName = 'helper';
	
	protected $_objHelper = null;
	
	protected $_objCache = null;
	
	protected $_arrOutputConfig = array();
	
	/**
	 * 错误处理器
	 * null ：则忽视错误信息。推荐在线上程序使用。
	 * 'echo' : 直接在页面echo出错误信息。具体有格式化
	 * '__VIEW_LOG__': 则直接log输出错误日志。
	 * 目前不支持扩展。
	 * @var object
	 */
	protected $_objErrorHandler = null;
	/**
	 * 是否停止继续渲染，主要是__init.php里面使用
	 * @var bool
	 */
	protected $_bolStopRender   = false;
	
	private static $_instance = null;
	
	/********* Begin add 模块化支持 by niuyao *********/
	private $_root_path = ''; //模板跟路径
	private $_module = ''; //当前模块
	private $_templateLoader;	//template加载器
	private $_widgetLoader;	//widget加载器
	private $_serviceLoader;	//service加载器
	private $_componentLoader;	//component加载器
	private $_layoutLoader;	//layout加载器
	private $_resource_map; //资源配置表 
	
	/**
	 * TbView初始化，给bingo框架内部调用
	 * @param string FE view层根路径
	 * @param string 当前模块
	 */
	public function initTbView($root_path, $module){
		//echo "@Bingo_View_Script.initTbView; root path : $root_path , module : $module <br />";
		
		$this->_root_path = $root_path; 
		$this->_module = $module; 
		$this->_control_path = $root_path . $module . "/control/";
		$this->_template_path = $root_path . $module . "/template/";
		$this->_configurateTbView($root_path, $module);//配置tbview
		$this->_componentLoader = new TbView_ComponentLoader($this->_module, $this->_root_path);
		
		$this->_widgetLoader = new TbView_WidgetLoader($this->_module, $this->_root_path, array(
			'__component__' => $this->_componentLoader
		));
		
		$this->_serviceLoader = new TbView_ServiceLoader($this->_module, $this->_root_path, array(
		));//需要在TbView中根据当前加载的service所属的模块去重新构造 widget、layout、component的加载器
		
		$this->_layoutLoader = new TbView_LayoutLoader($this->_module, $this->_root_path, array(
			'__component__' => $this->_componentLoader,
			'__widget__' => $this-> _widgetLoader,
			'__service__' => $this->_serviceLoader
		));
		
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
		
		
		$this->_resource_map = new TbView_ResourceMap($root_path, $module);
		
		TbView_ModuleResourceLoader::setRootPath($root_path);
		TbView_ModuleResourceLoader::setLocalScope($module);
		TbView_ModuleResourceLoader::setResourceMap($this->_resource_map);
		HTML::setResourceMap($this->_resource_map);
		TbView_PageUnitLoader::init($this->_resource_map);
	}
	
	/**
	 * 对参数中获取的模块化元素进行过滤，避免安全漏洞，模块名仅允许包含数字、字母、中中划线
	 * @param string 参数名
	 * @return array 参数列表
	 */
	private function _filterModuleParamInGet($param_name){
		$ret = array();
		$partten = '/[^\w\_\-]/';//模块名规则，不允许包含非数字、字母、中下划线的字符
		if(isset($_GET[$param_name])){
			$param = trim($_GET[$param_name]);
			if($param != ''){
				$list = explode(',', $param);
				foreach($list as $item){
					$item = trim($item);
					if($item != '' && !preg_match($partten, $item)){
						$ret[] = $item;
					}
				}
			}
		}
		return $ret;
	}
	public function setTerminalModel ($model) {
		if (TbView_Conf::get('TERMINAL_DIF')) {
			$this->_resource_map->setTerminalModel($model);
			$this->_componentLoader->setTerminalModel($model); // 模板差异化处理
			$this->_widgetLoader->setTerminalModel($model);	// 模板差异化处理
		}	
	}
	/**
	 * 根据默认配置文件配置Tbview
	 */
	private function _configurateTbView($root_path, $module){
		$_default_conf_file = $root_path . $module . '/__tbview_conf.php';//默认的tbview初始化配置
		if(is_file($_default_conf_file)){
			$conf = include($_default_conf_file);
			if(is_array($conf)){
				foreach($conf as $key => $value){
					TbView_Conf::set($key, $value);
				}
			}
		}
	}
	/**
	 * 设置TbView中template可见的全局变量，给bingo框架调用
	 */
	public function setTbViewGloablVar(){
		$data = array(
			'__component__'     => $this->_componentLoader,
			'__widget__'        => $this->_widgetLoader,
			'__service__'       => $this->_serviceLoader,
			'__layout__'        => $this->_layoutLoader,
			'__template_path__' => $this->_template_path, //模板跟路径，方便通过require方式复用局部模块
		);
		foreach($data as $key => $item){
			$this->_arrVars[$key] = $item;
		}
	}
	
	/**
	 * 清除一个数组中的TbView全局变量，给返回所有变量的 g() 接口 519行 使用
	 * 部分模板调用 $this->g 拿到变量直接json，需要调用此方法，否则会输出额外变量
	 * @param array $arrData，要清理的数组
	 */
	private function _clearTbViewGlobalVar($arrData){
		$var_name = array(
			'__component__',
			'__widget__',
			'__service__',
			'__layout__',
			'__template_path__',
		);
		foreach($var_name as $item){
			unset($arrData[$item]);//不判读是否 isset 也不会报错
		}
		return $arrData;
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
		$info = pathinfo($strTemplate);
		$tpl_dir = $info['dirname'];
		if($tpl_dir == '.'){//不在目录下的模板，不需要资源加载
			return;
		}
		
		$filename = $info['filename'];
		$tpl_name = basename($tpl_dir);
		if($tpl_name === $filename){//最后一级目录和文件名相等的为符合模块化规范的模板
			$tpl_path = 'template/' . $tpl_dir;
			if(!empty($this->_module)){
				$path = $this->_module . '/' . $tpl_path;
				TbView_ModuleResourceLoader::setCurTemplate($tpl_name);//设置当前渲染的模板
				TbView_ModuleResourceLoader::load($path);//加载模板的静态资源
				
			}
		}
	}
	
	/**
	 * 是否数据导出模式
	 */
	private function _isExportDataMode(){
		$__qa = isset($_GET['__qa']) ? $_GET['__qa'] : '';
		if($__qa === ''){
			return false;
		}
		$__key = md5(date('Y.m.d') . 'bingo-view-data-mode');
		return $__key === $__qa;
	}
	
	/**
	 * 导出数据
	 */
	private function _exportData(){
		header('Content-Type: text/plain; charset=' . BINGO_ENCODE_LANG);
		$__var = isset($_GET['__var']) ? $_GET['__var'] : '';
		$__type = isset($_GET['__type']) ? $_GET['__type'] : 'php';
		$__ui_data  = array();
		if($__var == ''){
			$__ui_data = $this->g('');
		}
		else{
			$__var_list = explode(',', $__var);
			foreach($__var_list as $__item){
				$__value = $this->g($__item);
				if($__value != null){
					$__ui_data[$__item] = $__value;
				}
			}
		}
		if($__type == 'json'){//json格式的数据，支持qa自动化测试
			$__output = Bingo_String::array2json($__ui_data);
		}
		else{//默认输出php源码
			$__output = '<?php' . PHP_EOL .' return ' . var_export($__ui_data, true) . ';' . PHP_EOL;
		}
		echo $__output;
		ob_end_flush();
	}
	
	/********* End 模块化支持 by niuyao *********/
	
	
	
	/**
	 * 单件，获取对象句柄
	 */
	public static function getInstance()
    {
        if (null === self::$_instance) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }
    
    protected function __construct()
    {    	
    	//防止被外部new
    	$this->_objHelper = new Bingo_View_Script_Helper();
    }
    public function setContentType($strType, $strCharset=BINGO_ENCODE_LANG/*UTF8DIFF*/)
    {
        $this->_arrOutputConfig['type'] = $strType;
        $this->_arrOutputConfig['charset'] = $strCharset;
    }
    /**
     * 这是个错误，拼写错误。但已经在使用了。
     * @param $strType
     * @param $strCharset
     */
    public function setContextType($strType, $strCharset=BINGO_ENCODE_LANG/*UTF8DIFF*/)
    {
        $this->_arrOutputConfig['type'] = $strType;
        $this->_arrOutputConfig['charset'] = $strCharset;
    }
    /**
     * 设置根目录
     * @param string $strBaseDir
     */
    public function setBaseDir($strBaseDir)
    {
    	if (is_dir($strBaseDir)) {
    		$this->_strBaseDir = rtrim($strBaseDir, DIRECTORY_SEPARATOR);
    	}
    }
    /**
     * 设置错误信息
     * @param int $intErrno
     */
    public function setErrno($intErrno)
    {
    	$this->_intErrno = $intErrno;
    }
    /**
     * 获取错误信息
     */
    public function getErrno()
    {
    	return $this->_intErrno;
    }
    /**
     * 转向到view层处理，注意需要传递的是绝对路径
     * @param string $strViewFile
     * @param string $strInitFile
     */
    public function render($strViewFile, $strInitFile='')
    {
		//优先导出数据
		if($this->_isExportDataMode()){
			$this->_exportData();
			return true;
		}
		
		
    	${$this->_strHelperName} = $this->_objHelper;
    	if (! empty($strInitFile) && is_file($strInitFile)) {
    		include_once $strInitFile;
    	}
    	if (! $this->_bolStopRender && ! empty($strViewFile) && is_file($strViewFile)) {
    		include $strViewFile;
    	}
    	else{
    		trigger_error("Bingo_View_Script::render; View script not exists : $strViewFile", E_USER_ERROR);
    	}    	
    	return true;
    }
    /**
     * 停止对后面View的渲染
     */
    public function stopRender()
    {
        $this->_bolStopRender = true;
    }
    /**
     * 开启DEBUG模式，启用DEBUG模式默认情况下会把错误日志echo出来，
     * 可以通过设置第二个参数，把错误信息打印到日志。默认日志相关配置如下
     * 'file' => '/../log/view.log',
     * 'level' => 0xFF,
     * @param $bolDebug
     */
    public function setDebug($bolDebug=true, $strType='echo')
    {
    	if (! $bolDebug) {
    		$this->_objErrorHandler = null;
    	} else {
    		TbView_Conf::debug(true);
    		if ($strType == 'log') {
    			$strType = array(
    				'file' => '/../log/view.log',
    				'level' => 0xFF,
    			);
    		}
    		$this->setErrorHandler($strType);
    	}
    }
    /**
     * 设置错误处理方式，$mixValue 为字符串，则直接输入。
     * 如果是数组，则log输出。数组结构
     * {
     * 		file : log文件的路径，注意该路径是相对strBaseDir的。
     * 		level : 如果没有填写，则对应为0xFF
     * }
     * @param $mixValue
     */	
	public function setErrorHandler($mixValue)
	{
		if (is_string($mixValue)) {
			$this->_objErrorHandler = 'string';
		} elseif (is_array($mixValue) && isset($mixValue['file']) ) {
			$strFile = $this->_strBaseDir . $mixValue['file'];
			require_once 'Bingo/Log.php';
			require_once 'Bingo/Log/File.php';
			$intLevel = 0xFF;
			if (isset($mixValue['level'])) $intLevel = intval($mixValue['level']);
			Bingo_Log::addModule('__VIEW_LOG__', new Bingo_Log_File($strFile, $intLevel));
			$this->_objErrorHandler = '__VIEW_LOG__';
		}
		return true;
	}
	
	public function errorHandler($intErrno, $strErrmsg, $strFile, $intLine)
	{
		if (is_null($this->_objErrorHandler)) {
		    //默认是不出现任何错误信息。修改成默认打印warning日志
		    if ($intErrno == E_USER_ERROR || $intErrno == E_USER_WARNING) {
		        $strLog = sprintf('Bingo_View error[%d]![%s]', $intErrno, $strErrmsg);
		        require_once 'Bingo/Log.php';
		        Bingo_Log::warning($strLog, '', $strFile, $intLine);
		    }
			return ;
		}
		if ($this->_objErrorHandler == 'string') {
			//直接输出到页面上
			$this->_errorHandlerEcho($intErrno, $strErrmsg, $strFile, $intLine);
			return;
		}
		if ($this->_objErrorHandler == '__VIEW_LOG__') {
			//日志输出
			$this->_errorHandlerLog($intErrno, $strErrmsg, $strFile, $intLine);
			return ;
		}
	}
    /**
     * 添加路径，比如template
     * @param string $strPath
     * @param string $strType
     */
    public function addPath($strPath, $strType='template')
    {
    	$strPath = $this->_strBaseDir . $strPath;
    	if (! file_exists($strPath)) {
    		// path不存在时，不输出错误日志，直接返回，by niuyao 2013.01.30
    		return $this;	
    	}
    	$this->_arrPaths[$strType][] = rtrim($strPath, DIRECTORY_SEPARATOR);
    	return $this;
    }
    /**
     * 设置当前采用的Layout
     * @param string $strName
     */
    public function setLayout($strName)
    {
    	$this->_strLayout = $this->_getPath($strName, 'layout');
    	if ($this->_strLayout === false) return $this;
    	//var_dump($this->_strLayout);
    	require_once 'Bingo/View/Layout.php';
    	$this->_objLayout = new Bingo_View_Layout();
    	return $this;
    }
    /**
     * 获取当前的Layout对象
     */
    public function layout()
    {
        if($this->_objLayout === NULL){
            Bingo_Log::warning('the template Layout is NULL');
        }
    	return $this->_objLayout;
    }
	public function assign($mixKey, $mixValue = null)
    {
        if (is_array($mixKey)) {
            foreach ($mixKey as $_key => $_val) {
            	$this->_arrVars[$_key] = $_val;
            }
        } elseif (is_string($mixKey)) {
            $this->_arrVars[$mixKey] = $mixValue;
        } else {
            //notice
            trigger_error('Bingo_View_Script::assign : Type is invalid!', E_USER_WARNING);
        }
        return true;
    }
    public function clean()
    {
    	$this->_arrVars = array();
    }
    /**
     * 进行模板页面渲染
     * @param string $strTemplate
     * @return true/false/intLength
     */
    public function display($strTemplate, $___bolGetLength=false)
    {
    	$this->_loadTemplateResource($strTemplate);//加载模板所需要的静态文件资源
        $this->_outputType();
    	if (empty($this->_strLayout)) {
    	    if ($___bolGetLength) ob_start();
    		$this->_displayTemplate($strTemplate);
    		if ($___bolGetLength) {
    		    $intLength = ob_get_length();
    		    ob_end_flush();
    		    return $intLength;
    		}
    		return true;
    	} else {	
    	    //没有layout	
    		ob_start();
    		$this->_displayTemplate($strTemplate);
    		$_________c = ob_get_clean();
    		//var_dump($_________c);
    		$______ = $this->_objLayout->get();
    		if (is_array($______) && ! empty($______) )extract($______, EXTR_OVERWRITE);
    		$content = $_________c;
    		${$this->_strHelperName} = $this->_objHelper;
    		unset($______);
    		unset($_________c);
    		if ($___bolGetLength) ob_start();
    		include $this->_strLayout;
    		if ($___bolGetLength) {
    		    $intLength = ob_get_length();
    		    ob_end_flush();
    		    return $intLength;
    		}
    		return true;
    	}
    }
    /**
     * 渲染一个小模板，并把模板内容返回
     * @param string $strTemplate
     */
    public function template($strTemplate)
    {
    	ob_start();
    	$this->_displayTemplate($strTemplate);
    	return ob_get_clean();
    }
    /**
     * elemenet，主要是模板的复用，小区域的抽取
     * @param string $strName
     * @param array $_____arrVars
     * @param bool $bolG 是否允许全局数据可见
     */
    public function element($strName, $_____arrVars = array(), $bolG = false)
    {
    	$______ = $this->_getPath($strName, 'element');
    	if ($______ === false) return false;
    	unset($strName);
    	if ($bolG && ! empty($this->_arrVars)) {
    		//抽取全局数据
    		extract($this->_arrVars, EXTR_OVERWRITE);;
    	}
    	if ( (is_array($_____arrVars)) && ! empty($_____arrVars)) extract($_____arrVars, EXTR_OVERWRITE);
    	unset($_____arrVars);
    	${$this->_strHelperName} = $this->_objHelper;
    	include $______;
    }
    public function elementG($strName, $_____arrVars = array())
    {
    	$this->element($strName, $_____arrVars, true);
    }
    /**
     * 获取element的返回数据。和elment方法不同的是，该方法不输出，而是直接返回html字符串。
     * @param string $strName
     * @param array $_____arrVars
     */
    public function getElement($strName, $_____arrVars = array())
    {
    	ob_start();
    	$this->element($strName, $_____arrVars);
    	return ob_get_clean();
    }
    /**
     * 添加helper的路径，需要制定helper的前缀。
     * @param string $strPrefix
     * @param string $strPath
     */
    public function addHelperPath($strPrefix, $strPath)
    {
    	$strPath = $this->_strBaseDir . $strPath;
    	$strPath = rtrim($strPath, DIRECTORY_SEPARATOR);
    	if (! file_exists($strPath)) {
    		// path不存在时，不输出错误日志，直接返回，by niuyao 2013.01.30
    		return $this;
    	}
    	$this->_arrPaths['helper'][$strPrefix] = $strPath;
    	return $this;
    }
    /**
     * 获取全局数据
     * @param string $strKey
     * @param string $mixDefaultValue
     */
    public function g($strKey='', $mixDefaultValue=null)
    {
    	if (empty($strKey)) {
    		/******-^- by by niuyao 2012.05.31 去掉TbView增加的内置变量 -^_******/
    		return $this->_clearTbViewGlobalVar($this->_arrVars);
    	}
    	if (isset($this->_arrVars[$strKey])) {
    		return $this->_arrVars[$strKey];
    	}
    	return $mixDefaultValue;
    }
    /**
     * 
     * @param array $arrConfig
     * {
     * 		dir : string cache 的目录
     * 		lifeTime ： int 有效时长，精确到秒
     * }
     * @param $strType : file source eacc apc static
     */
    public function setCache($arrConfig=array(), $strType='source')
    {
    	if (isset($arrConfig['dir'])) {
    		$arrConfig['dir'] = $this->_strBaseDir . $arrConfig['dir'];
    	} else {
    	    //mkdir
    	    if ($this->_strBaseDir{strlen($this->_strBaseDir)-1} == ".") {
    	        //处理目录提升级别的情况，非常trick
    	        $arrConfig['dir'] = $this->_strBaseDir . DIRECTORY_SEPARATOR . 'data';
    	    } else {
    		    $arrConfig['dir'] = $this->_strBaseDir . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'data';
    	    }
    	    if(is_dir($arrConfig['dir'])){//目录存在时，仅更改权限
    	         @chmod($arrConfig['dir'], 0755);  
    	    }
    	    else{ //目录不存在，创建权限为755的目录
    	         @mkdir($arrConfig['dir'], 0755, true);
    	    }
    	    
    	}
    	if (! is_dir($arrConfig['dir'])) {
    		return false;	
    	}
    	require_once 'Bingo/Cache.php';//$arrConfig['encode'] = 'md5';print_r($arrConfig);
    	$objCache = Bingo_Cache::factory($strType, $arrConfig);
    	if (! $objCache) {
    		trigger_error('factory Bingo_Cache error!type=' . $strType);
    		return false;
    	}
    	$this->_objCache = $objCache;
    	return true;
    }
    /**
     * 添加配置文件对应关系
     * @param $strTypeKey，关键字，用于简称该配置文件
     * @param $arrConfig具体参考Bingo_Config库
     * @param $strType ：ini array configure
     */
    public function addConfig($strTypeKey, $arrConfig=array(), $strType='ini')
    {
    	if (isset($arrConfig['fileName']) && $strType != 'configure') {
    		$arrConfig['fileName'] = $this->_strBaseDir . $arrConfig['fileName'];
    		if (! is_file($arrConfig['fileName'])) {
    			trigger_error('addConfig error!fileName is invalid!fileName='.$arrConfig['fileName'],
    			    E_USER_WARNING);
    			return false;
    		}
    	}
    	//configure的时候，会存在dir目录
    	if ( $strType == 'configure' ) {
    		if (isset($arrConfig['dir'])) {
    	        $arrConfig['dir'] = $this->_strBaseDir . $arrConfig['dir'];
    		    $arrConfig['confFileName'] = $arrConfig['fileName'];
    		} else {
    		    //没有目录信息，直接从fileName提取
    		    $arrConfig['dir'] = $this->_strBaseDir . dirname($arrConfig['fileName']);
    		    $arrConfig['confFileName'] = basename($arrConfig['fileName']);
    		}
    		if (! is_dir($arrConfig['dir'])) {
    			trigger_error('addConfig dir is invalid!dir=' . $arrConfig['dir'], E_USER_WARNING);
    			return false;   		
    		}
    	}     	
    	//默认开启自动更新
    	if (! array_key_exists('autoRefresh', $arrConfig)) {
    		$arrConfig['autoRefresh'] = true;
    	}
    	//如果含有Cache，则启用
    	if (! array_key_exists('cache', $arrConfig)) {
    	    $this->setCache();
    		if (! is_null($this->_objCache)) {
    			$arrConfig['cache'] = $this->_objCache;
    		}
    	}
    	//有优化空间，可以到使用的时候再加载。
    	require_once 'Bingo/Config.php';
    	$objConfig = Bingo_Config::factory($strType, $arrConfig);
    	if ($objConfig) {
    		$this->_arrPaths['config'][$strTypeKey] = $objConfig;
    		return true;
    	}
    	trigger_error('addConfig error!strKey=' . $strTypeKey, E_USER_WARNING);
    }
    /**
     * 获取配置
     * @param string $strConfKey
     * @param mix $mixDefaultValue
     * @param string $strTypeKey
     */
    public function conf($strConfKey, $strTypeKey='', $mixDefaultValue='')
    {
    	if (! empty($strTypeKey) && isset($this->_arrPaths['config'][$strTypeKey])) {
		$_mixTmp = $this->_arrPaths['config'][$strTypeKey]->get($strConfKey, NULL);
		if (! is_null($_mixTmp)) return $_mixTmp;
    	} else {
    		//遍历，有性能损耗，不推荐使用
    		if (! empty($this->_arrPaths['config'])) {
    			foreach ($this->_arrPaths['config'] as $_strKey => $_objConfig) {
    				$_mixTmp = $_objConfig->get($strConfKey, NULL);
    				if (! is_null($_mixTmp)) return $_mixTmp;
    			}
    		}
    	}
    	return $mixDefaultValue;
    }
    /**
     * 用户处理helper方法的调用
     * @param string $strName
     * @param array $arrArguments
     */
    public function __call($strName, $arrArguments)
    {
    	$helper = $this->getHelper($strName);
    	if (method_exists($helper, $strName)) {
        	return call_user_func_array(array($helper, $strName), $arrArguments);
    	} 
    	return $helper;
    }
    /**
     * 通过$this->helper_name的方式获取到一个Helper对象
     * @param string $strName
     */
    public function __get($strName)
    {
    	$helper = $this->getHelper($strName);
    	return $helper;
    }
    
    public function getHelper($strName)
    {
    	$objHelper = null;
    	if (! isset($this->_arrHelperStore[$strName])) {
    		$objHelper = $this->_geneHelper($strName);
    		if ($objHelper) {
    		    $this->_arrHelperStore[$strName] = $objHelper;
    		}
    	} else {
    		$objHelper = $this->_arrHelperStore[$strName];
    	}
    	return $objHelper;
    }
    
    public function getObjHelper()
    {
    	return $this->_objHelper;
    }
    
    protected function _geneHelper($strName)
    {
    	if (! empty($this->_arrPaths['helper'])) {
    		$strName = ucfirst($strName);
    		foreach ($this->_arrPaths['helper'] as $_strPrefix => $_strPath) {
    			$_strFilePath = $_strPath . DIRECTORY_SEPARATOR . $strName . '.php';
    			//检查文件是否存在
    			if (is_file($_strFilePath)) {
    				$_strHelperName = $_strPrefix . '_' . $strName;
    				include_once $_strFilePath;
    				//检查是否存在helper类
    				if (class_exists($_strHelperName)) {
    					$_objHelper = new $_strHelperName();
    					if (method_exists($_objHelper, 'setView')) {
    						$_objHelper->setView($this);
    					}
    					return $_objHelper;
    				}
    			}
    		}
    	}
    	trigger_error('Bingo_View_Script::_geneHelper error!' . $strName . ' invalid!', E_USER_WARNING);
    	return false;
    }
    
    protected function _getPath($strFile, $strType='template')
    {
    	$strTemplatePath = '';
    	if (! empty($this->_arrPaths[$strType])) {
    		foreach ($this->_arrPaths[$strType] as $_strRootPath) {
    			$strTemplatePath = $_strRootPath . DIRECTORY_SEPARATOR . $strFile;
    			if (is_file($strTemplatePath)) return $strTemplatePath;
    		} 
    	}
    	//走默认的。
    	$strTemplatePath = $this->_strBaseDir . DIRECTORY_SEPARATOR . $strType . DIRECTORY_SEPARATOR . $strFile;
    	if (is_file($strTemplatePath)) return $strTemplatePath;
    	trigger_error('Bingo_View_Script::_getPath failure!' . $strFile . ' invalid!type='.$strType, E_USER_WARNING);
    	return false;
    }
    
    protected function _displayTemplate($strTemplate)
    {
    	$________ = $this->_getPath($strTemplate);
    	if ($________ === false) return false;
    	if ( ! empty($this->_arrVars)) extract($this->_arrVars, EXTR_OVERWRITE);
    	${$this->_strHelperName} = $this->_objHelper;
    	unset($strTemplate);
    	include $________;
    	return true;
    }
    
    protected function _errorHandlerEcho($intErrno, $strErrmsg, $strFile, $intLine)
    {
    	//只输出非php本身产生warning信息
    	if ($intErrno ==  E_USER_ERROR || $intErrno ==  E_USER_WARNING || $intErrno ==  E_USER_NOTICE) {
    		echo $strErrmsg . ';<br />';
    	}
		//echo $strErrmsg . ';<br />';
    }
    
    protected function _errorHandlerLog($intErrno, $strErrmsg, $strFile, $intLine)
    {
    	//log输出
    	switch ($intErrno)
    	{
    		case E_USER_ERROR:
    			Bingo_Log::fatal($strErrmsg, $this->_objErrorHandler, $strFile, $intLine);
    			return ;
    		case E_USER_WARNING:
    			Bingo_Log::warning($strErrmsg, $this->_objErrorHandler, $strFile, $intLine);
    			return ;
    		case E_USER_NOTICE:
    			Bingo_Log::notice($strErrmsg, $this->_objErrorHandler, $strFile, $intLine);
    			return ;
    		default:
    			Bingo_Log::debug($strErrmsg, $this->_objErrorHandler, $strFile, $intLine);
    			return ;
    	}
    }
    
    protected function _outputType()
    {
        $strType = 'html';
        $strCharset = BINGO_ENCODE_LANG/*UTF8DIFF*/;
        if (isset($this->_arrOutputConfig['type'])) $strType = $this->_arrOutputConfig['type'];
        if (isset($this->_arrOutputConfig['charset'])) $strCharset = $this->_arrOutputConfig['charset'];
        ContentType($strType, $strCharset);
    }
}

class Bingo_View_Script_Helper
{
	/**
     * 用户处理helper方法的调用
     * @param string $strName
     * @param array $arrArguments
     */
    public function __call($strName, $arrArguments)
    {
    	$helper = Bingo_View_Script::getInstance()->getHelper($strName);
    	if (method_exists($helper, $strName)) {
        	return call_user_func_array(array($helper, $strName), $arrArguments);
    	} 
    	return $helper;
    }
    /**
     * 通过$this->helper_name的方式获取到一个Helper对象
     * @param string $strName
     */
    public function __get($strName)
    {
    	return Bingo_View_Script::getInstance()->getHelper($strName);
    }
}
