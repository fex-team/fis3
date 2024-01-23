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
	 * UI���ݸ�FE�������ֵ�
	 * @var array
	 */
	protected $_arrVars = array();
	/**
	 * UI���ݸ�FE�Ĵ����
	 * @var int
	 */
	protected $_intErrno = 0;
	/**
	 * ��ǰ����
	 * @var string
	 */
	protected $_strLayout = '';
	/**
	 * Layout�����û��洢Layout��Ҫ�õ����������
	 * @var Object Bingo_View_Layout
	 */
	protected $_objLayout = null;
	/**
	 * ���飬���ڴ洢�Ѿ�ʵ������helper���󡣻���$nameΪkey�ġ�
	 * @var array
	 */
	protected $_arrHelperStore = array();
	
	protected $_strHelperName = 'helper';
	
	protected $_objHelper = null;
	
	protected $_objCache = null;
	
	protected $_arrOutputConfig = array();
	
	/**
	 * ��������
	 * null ������Ӵ�����Ϣ���Ƽ������ϳ���ʹ�á�
	 * 'echo' : ֱ����ҳ��echo��������Ϣ�������и�ʽ��
	 * '__VIEW_LOG__': ��ֱ��log���������־��
	 * Ŀǰ��֧����չ��
	 * @var object
	 */
	protected $_objErrorHandler = null;
	/**
	 * �Ƿ�ֹͣ������Ⱦ����Ҫ��__init.php����ʹ��
	 * @var bool
	 */
	protected $_bolStopRender   = false;
	
	private static $_instance = null;
	
	/********* Begin add ģ�黯֧�� by niuyao *********/
	private $_root_path = ''; //ģ���·��
	private $_module = ''; //��ǰģ��
	private $_templateLoader;	//template������
	private $_widgetLoader;	//widget������
	private $_serviceLoader;	//service������
	private $_componentLoader;	//component������
	private $_layoutLoader;	//layout������
	private $_resource_map; //��Դ���ñ� 
	
	/**
	 * TbView��ʼ������bingo����ڲ�����
	 * @param string FE view���·��
	 * @param string ��ǰģ��
	 */
	public function initTbView($root_path, $module){
		//echo "@Bingo_View_Script.initTbView; root path : $root_path , module : $module <br />";
		
		$this->_root_path = $root_path; 
		$this->_module = $module; 
		$this->_control_path = $root_path . $module . "/control/";
		$this->_template_path = $root_path . $module . "/template/";
		$this->_configurateTbView($root_path, $module);//����tbview
		$this->_componentLoader = new TbView_ComponentLoader($this->_module, $this->_root_path);
		
		$this->_widgetLoader = new TbView_WidgetLoader($this->_module, $this->_root_path, array(
			'__component__' => $this->_componentLoader
		));
		
		$this->_serviceLoader = new TbView_ServiceLoader($this->_module, $this->_root_path, array(
		));//��Ҫ��TbView�и��ݵ�ǰ���ص�service������ģ��ȥ���¹��� widget��layout��component�ļ�����
		
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
		
		//����widget����� layout������
		$this->_widgetLoader->setLayoutLoader($this->_layoutLoader);
		
		$_list = $this->_filterModuleParamInGet('__widget');
		if(!empty($_list)){//�������Ⱦ�ֲ�widget������
			$this->_widgetLoader->setTargetModules($_list);
			$this->_serviceLoader->setEnable(false);
		}
		else{
			$_list = $this->_filterModuleParamInGet('__service');
			if(!empty($_list)){//�������Ⱦ�ֲ�service������
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
	 * �Բ����л�ȡ��ģ�黯Ԫ�ؽ��й��ˣ����ⰲȫ©����ģ����������������֡���ĸ�����л���
	 * @param string ������
	 * @return array �����б�
	 */
	private function _filterModuleParamInGet($param_name){
		$ret = array();
		$partten = '/[^\w\_\-]/';//ģ�������򣬲�������������֡���ĸ�����»��ߵ��ַ�
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
			$this->_componentLoader->setTerminalModel($model); // ģ����컯����
			$this->_widgetLoader->setTerminalModel($model);	// ģ����컯����
		}	
	}
	/**
	 * ����Ĭ�������ļ�����Tbview
	 */
	private function _configurateTbView($root_path, $module){
		$_default_conf_file = $root_path . $module . '/__tbview_conf.php';//Ĭ�ϵ�tbview��ʼ������
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
	 * ����TbView��template�ɼ���ȫ�ֱ�������bingo��ܵ���
	 */
	public function setTbViewGloablVar(){
		$data = array(
			'__component__'     => $this->_componentLoader,
			'__widget__'        => $this->_widgetLoader,
			'__service__'       => $this->_serviceLoader,
			'__layout__'        => $this->_layoutLoader,
			'__template_path__' => $this->_template_path, //ģ���·��������ͨ��require��ʽ���þֲ�ģ��
		);
		foreach($data as $key => $item){
			$this->_arrVars[$key] = $item;
		}
	}
	
	/**
	 * ���һ�������е�TbViewȫ�ֱ��������������б����� g() �ӿ� 519�� ʹ��
	 * ����ģ����� $this->g �õ�����ֱ��json����Ҫ���ô˷��������������������
	 * @param array $arrData��Ҫ���������
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
			unset($arrData[$item]);//���ж��Ƿ� isset Ҳ���ᱨ��
		}
		return $arrData;
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
		$info = pathinfo($strTemplate);
		$tpl_dir = $info['dirname'];
		if($tpl_dir == '.'){//����Ŀ¼�µ�ģ�壬����Ҫ��Դ����
			return;
		}
		
		$filename = $info['filename'];
		$tpl_name = basename($tpl_dir);
		if($tpl_name === $filename){//���һ��Ŀ¼���ļ�����ȵ�Ϊ����ģ�黯�淶��ģ��
			$tpl_path = 'template/' . $tpl_dir;
			if(!empty($this->_module)){
				$path = $this->_module . '/' . $tpl_path;
				TbView_ModuleResourceLoader::setCurTemplate($tpl_name);//���õ�ǰ��Ⱦ��ģ��
				TbView_ModuleResourceLoader::load($path);//����ģ��ľ�̬��Դ
				
			}
		}
	}
	
	/**
	 * �Ƿ����ݵ���ģʽ
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
	 * ��������
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
		if($__type == 'json'){//json��ʽ�����ݣ�֧��qa�Զ�������
			$__output = Bingo_String::array2json($__ui_data);
		}
		else{//Ĭ�����phpԴ��
			$__output = '<?php' . PHP_EOL .' return ' . var_export($__ui_data, true) . ';' . PHP_EOL;
		}
		echo $__output;
		ob_end_flush();
	}
	
	/********* End ģ�黯֧�� by niuyao *********/
	
	
	
	/**
	 * ��������ȡ������
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
    	//��ֹ���ⲿnew
    	$this->_objHelper = new Bingo_View_Script_Helper();
    }
    public function setContentType($strType, $strCharset=BINGO_ENCODE_LANG/*UTF8DIFF*/)
    {
        $this->_arrOutputConfig['type'] = $strType;
        $this->_arrOutputConfig['charset'] = $strCharset;
    }
    /**
     * ���Ǹ�����ƴд���󡣵��Ѿ���ʹ���ˡ�
     * @param $strType
     * @param $strCharset
     */
    public function setContextType($strType, $strCharset=BINGO_ENCODE_LANG/*UTF8DIFF*/)
    {
        $this->_arrOutputConfig['type'] = $strType;
        $this->_arrOutputConfig['charset'] = $strCharset;
    }
    /**
     * ���ø�Ŀ¼
     * @param string $strBaseDir
     */
    public function setBaseDir($strBaseDir)
    {
    	if (is_dir($strBaseDir)) {
    		$this->_strBaseDir = rtrim($strBaseDir, DIRECTORY_SEPARATOR);
    	}
    }
    /**
     * ���ô�����Ϣ
     * @param int $intErrno
     */
    public function setErrno($intErrno)
    {
    	$this->_intErrno = $intErrno;
    }
    /**
     * ��ȡ������Ϣ
     */
    public function getErrno()
    {
    	return $this->_intErrno;
    }
    /**
     * ת��view�㴦��ע����Ҫ���ݵ��Ǿ���·��
     * @param string $strViewFile
     * @param string $strInitFile
     */
    public function render($strViewFile, $strInitFile='')
    {
		//���ȵ�������
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
     * ֹͣ�Ժ���View����Ⱦ
     */
    public function stopRender()
    {
        $this->_bolStopRender = true;
    }
    /**
     * ����DEBUGģʽ������DEBUGģʽĬ������»�Ѵ�����־echo������
     * ����ͨ�����õڶ����������Ѵ�����Ϣ��ӡ����־��Ĭ����־�����������
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
     * ���ô�����ʽ��$mixValue Ϊ�ַ�������ֱ�����롣
     * ��������飬��log���������ṹ
     * {
     * 		file : log�ļ���·����ע���·�������strBaseDir�ġ�
     * 		level : ���û����д�����ӦΪ0xFF
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
		    //Ĭ���ǲ������κδ�����Ϣ���޸ĳ�Ĭ�ϴ�ӡwarning��־
		    if ($intErrno == E_USER_ERROR || $intErrno == E_USER_WARNING) {
		        $strLog = sprintf('Bingo_View error[%d]![%s]', $intErrno, $strErrmsg);
		        require_once 'Bingo/Log.php';
		        Bingo_Log::warning($strLog, '', $strFile, $intLine);
		    }
			return ;
		}
		if ($this->_objErrorHandler == 'string') {
			//ֱ�������ҳ����
			$this->_errorHandlerEcho($intErrno, $strErrmsg, $strFile, $intLine);
			return;
		}
		if ($this->_objErrorHandler == '__VIEW_LOG__') {
			//��־���
			$this->_errorHandlerLog($intErrno, $strErrmsg, $strFile, $intLine);
			return ;
		}
	}
    /**
     * ���·��������template
     * @param string $strPath
     * @param string $strType
     */
    public function addPath($strPath, $strType='template')
    {
    	$strPath = $this->_strBaseDir . $strPath;
    	if (! file_exists($strPath)) {
    		// path������ʱ�������������־��ֱ�ӷ��أ�by niuyao 2013.01.30
    		return $this;	
    	}
    	$this->_arrPaths[$strType][] = rtrim($strPath, DIRECTORY_SEPARATOR);
    	return $this;
    }
    /**
     * ���õ�ǰ���õ�Layout
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
     * ��ȡ��ǰ��Layout����
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
     * ����ģ��ҳ����Ⱦ
     * @param string $strTemplate
     * @return true/false/intLength
     */
    public function display($strTemplate, $___bolGetLength=false)
    {
    	$this->_loadTemplateResource($strTemplate);//����ģ������Ҫ�ľ�̬�ļ���Դ
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
    	    //û��layout	
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
     * ��Ⱦһ��Сģ�壬����ģ�����ݷ���
     * @param string $strTemplate
     */
    public function template($strTemplate)
    {
    	ob_start();
    	$this->_displayTemplate($strTemplate);
    	return ob_get_clean();
    }
    /**
     * elemenet����Ҫ��ģ��ĸ��ã�С����ĳ�ȡ
     * @param string $strName
     * @param array $_____arrVars
     * @param bool $bolG �Ƿ�����ȫ�����ݿɼ�
     */
    public function element($strName, $_____arrVars = array(), $bolG = false)
    {
    	$______ = $this->_getPath($strName, 'element');
    	if ($______ === false) return false;
    	unset($strName);
    	if ($bolG && ! empty($this->_arrVars)) {
    		//��ȡȫ������
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
     * ��ȡelement�ķ������ݡ���elment������ͬ���ǣ��÷��������������ֱ�ӷ���html�ַ�����
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
     * ���helper��·������Ҫ�ƶ�helper��ǰ׺��
     * @param string $strPrefix
     * @param string $strPath
     */
    public function addHelperPath($strPrefix, $strPath)
    {
    	$strPath = $this->_strBaseDir . $strPath;
    	$strPath = rtrim($strPath, DIRECTORY_SEPARATOR);
    	if (! file_exists($strPath)) {
    		// path������ʱ�������������־��ֱ�ӷ��أ�by niuyao 2013.01.30
    		return $this;
    	}
    	$this->_arrPaths['helper'][$strPrefix] = $strPath;
    	return $this;
    }
    /**
     * ��ȡȫ������
     * @param string $strKey
     * @param string $mixDefaultValue
     */
    public function g($strKey='', $mixDefaultValue=null)
    {
    	if (empty($strKey)) {
    		/******-^- by by niuyao 2012.05.31 ȥ��TbView���ӵ����ñ��� -^_******/
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
     * 		dir : string cache ��Ŀ¼
     * 		lifeTime �� int ��Чʱ������ȷ����
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
    	        //����Ŀ¼���������������ǳ�trick
    	        $arrConfig['dir'] = $this->_strBaseDir . DIRECTORY_SEPARATOR . 'data';
    	    } else {
    		    $arrConfig['dir'] = $this->_strBaseDir . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'data';
    	    }
    	    if(is_dir($arrConfig['dir'])){//Ŀ¼����ʱ��������Ȩ��
    	         @chmod($arrConfig['dir'], 0755);  
    	    }
    	    else{ //Ŀ¼�����ڣ�����Ȩ��Ϊ755��Ŀ¼
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
     * ��������ļ���Ӧ��ϵ
     * @param $strTypeKey���ؼ��֣����ڼ�Ƹ������ļ�
     * @param $arrConfig����ο�Bingo_Config��
     * @param $strType ��ini array configure
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
    	//configure��ʱ�򣬻����dirĿ¼
    	if ( $strType == 'configure' ) {
    		if (isset($arrConfig['dir'])) {
    	        $arrConfig['dir'] = $this->_strBaseDir . $arrConfig['dir'];
    		    $arrConfig['confFileName'] = $arrConfig['fileName'];
    		} else {
    		    //û��Ŀ¼��Ϣ��ֱ�Ӵ�fileName��ȡ
    		    $arrConfig['dir'] = $this->_strBaseDir . dirname($arrConfig['fileName']);
    		    $arrConfig['confFileName'] = basename($arrConfig['fileName']);
    		}
    		if (! is_dir($arrConfig['dir'])) {
    			trigger_error('addConfig dir is invalid!dir=' . $arrConfig['dir'], E_USER_WARNING);
    			return false;   		
    		}
    	}     	
    	//Ĭ�Ͽ����Զ�����
    	if (! array_key_exists('autoRefresh', $arrConfig)) {
    		$arrConfig['autoRefresh'] = true;
    	}
    	//�������Cache��������
    	if (! array_key_exists('cache', $arrConfig)) {
    	    $this->setCache();
    		if (! is_null($this->_objCache)) {
    			$arrConfig['cache'] = $this->_objCache;
    		}
    	}
    	//���Ż��ռ䣬���Ե�ʹ�õ�ʱ���ټ��ء�
    	require_once 'Bingo/Config.php';
    	$objConfig = Bingo_Config::factory($strType, $arrConfig);
    	if ($objConfig) {
    		$this->_arrPaths['config'][$strTypeKey] = $objConfig;
    		return true;
    	}
    	trigger_error('addConfig error!strKey=' . $strTypeKey, E_USER_WARNING);
    }
    /**
     * ��ȡ����
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
    		//��������������ģ����Ƽ�ʹ��
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
     * �û�����helper�����ĵ���
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
     * ͨ��$this->helper_name�ķ�ʽ��ȡ��һ��Helper����
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
    			//����ļ��Ƿ����
    			if (is_file($_strFilePath)) {
    				$_strHelperName = $_strPrefix . '_' . $strName;
    				include_once $_strFilePath;
    				//����Ƿ����helper��
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
    	//��Ĭ�ϵġ�
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
    	//ֻ�����php�������warning��Ϣ
    	if ($intErrno ==  E_USER_ERROR || $intErrno ==  E_USER_WARNING || $intErrno ==  E_USER_NOTICE) {
    		echo $strErrmsg . ';<br />';
    	}
		//echo $strErrmsg . ';<br />';
    }
    
    protected function _errorHandlerLog($intErrno, $strErrmsg, $strFile, $intLine)
    {
    	//log���
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
     * �û�����helper�����ĵ���
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
     * ͨ��$this->helper_name�ķ�ʽ��ȡ��һ��Helper����
     * @param string $strName
     */
    public function __get($strName)
    {
    	return Bingo_View_Script::getInstance()->getHelper($strName);
    }
}
