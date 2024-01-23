<?php
/**
 * Bingo2.0视图
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-25
 * @package bingo
 */
require_once 'Bingo/View/Script.php';
if (! defined('BINGO_ENCODE_LANG')) define('BINGO_ENCODE_LANG', 'GBK');
class Bingo_View
{
    /**
     * 根路径
     * @var string
     */
	protected $_strBaseDir = '.';
	/**
	 * 输出类型，html/json/xml
	 * TODO 根据该类型，自动输出不同的头信息
	 * @var string
	 */
	protected $_strOutputType = 'html';
	/**
	 * view文件夹的路径名称
	 * @var string
	 */
	protected $_strScriptPathName = 'control';
	/**
	 * View文件夹路径，根据输出类型进行一一对应。
	 * @var array
	 */
	protected $_arrScriptPaths = array();
	/**
	 * 默认视图处理器，当找不到视图处理器的时候，就采用默认的。
	 * @var string
	 */
	protected $_strDefaultView = 'index.php';
	/**
	 * 试图初始化对应的文件。
	 * @var string
	 */
	protected $_strInitView = '__init.php';
	/**
	 * 错误号，UI传递给FE
	 * @var int
	 */
	protected $_intErrno = 0;
	/**
	 * 是否开启了debug模式，在开启debug模式的时候，不会进行页面渲染，而是直接进行数据的var_dump
	 * @var boolean
	 */
	protected $_bolDebug = false;	
	
	protected $_objScript = null;
	/**
	 * 只输出数据的类型，默认为空
	 * @var string
	 */
	protected $_strOnlyDataType = '';
	/**
	 * 获取只输出数据的类型，空字符串表示不采用只输出数据的功能
	 */
	public function getOnlyDataType() {
		return $this->_strOnlyDataType;
	}
	/**
	 * 设置只输出数据功能的数据类型
	 * @param string $strType 只输出数据的类型，目前支持json格式(json)，序列化(serial)和mcpack(mcpack)
	 */
	public function setOnlyDataType($strType) {
		$this->_strOnlyDataType = $strType;
	}
	/*
     * 是否开启XSS安全模式，默认为true,可在__construct中配置,也可用setXssSafe设置
     */
    protected $_bolXssSafe = true;
    /*
     * XSS白名单
     */
    protected $_arrWhiteList = array();
    /*
     * 是否已经读取白名单
     */
    protected $_bolWhiteListIni = false;
    /*
     * 白名单配置文件路径，可在__construct中配置
     */
    protected $_whiteListFilePath = 'conf/white_list.txt';
    /*
     * 缓存目录，可在__contruct中配置
     */
    protected $_catchPath = 'data';
    /**
     * 设置XSS安全模式
     * 
     * @param unknown_type $bolXssSafe
     */
    public function setXssSafe($bolXssSafe) {
        $this->_bolXssSafe = (boolean) $bolXssSafe;
    }
    /**
     * 获得XSS安全模式
     */
    public function getXssSafe() {
        return $this->_bolXssSafe;
    }
    /**
     * 读取白名单配置，注意需要先进行配置
     * 
     * @param $filePath 白名单配置路径
     * @param $catchPath 缓存路径	
     */
    public function loadWhiteList() {
        if(! $this->_bolWhiteListIni) {     
            require_once 'Bingo/Cache.php';
            require_once 'Bingo/Config.php';       
	        $cache = Bingo_Cache::factory('source', 
	                array(
	                    'dir'	    => $this->_strBaseDir.DIRECTORY_SEPARATOR.$this->_catchPath,
	                    'encode'	=> 'md5'));
	        $objConf = Bingo_Config::factory('Text',array(
	            'fileName'		=> $this->_strBaseDir.DIRECTORY_SEPARATOR.$this->_whiteListFilePath,
	            'autoRefresh'	=> true,
	            'catch'			=> $cache,
	        ));
	        if($objConf) {
	            $this->_arrWhiteList = $objConf->getData();
	            require_once 'Bingo/String.php';
                Bingo_String::$_arrWhiteList = $this->_arrWhiteList;
	            $this->_bolWhiteListIni = true;
	        }	        
        }
    }
	
	public function __construct($arrConfig=array())
	{
		if (! empty($arrConfig)){
			$this->setOptions($arrConfig);
		}
		$this->_objScript = Bingo_View_Script::getInstance();
		$this->_objScript->setBaseDir($this->_strBaseDir . DIRECTORY_SEPARATOR . $this->_strOutputType);
		$whiteListFile = $this->_strBaseDir . DIRECTORY_SEPARATOR .$this->_whiteListFilePath;
		if(file_exists($whiteListFile)) {
		    $this->loadWhiteList();
		}
		
		/******-^- Begin 初始化模块化开发功能 -^-******/
		//初始化view层模块化加载部分 by niuyao@2012.02.24，默认开启，有一定的hack行为
		if(!isset($arrConfig['viewRootpath'])){
			//在贴吧的部署中，一个模块的外层路径为所有模块的模板部署的跟路径
			$arrConfig['viewRootpath'] = realpath($this->_strBaseDir . '/../') . '/';
		}
		if(!isset($arrConfig['module'])){
			//在贴吧的部署中，一个模块的外层路径为所有模块的模板部署的跟路径
			$module = '';
			$strPath = realpath($this->_strBaseDir);
			$arrPaths = explode(DIRECTORY_SEPARATOR, $strPath);
			$len = count($arrPaths);
			if($len > 0){
				$module = $arrPaths[$len -1];
			}
			$arrConfig['module'] = $module;
		}
		$this->_objScript->initTbView($arrConfig['viewRootpath'], $arrConfig['module']);
		$this->_objScript->setTbViewGloablVar();
		/******-^- End 初始化模块化开发功能 -^-******/
	}
	/**
	 * 设置相关配置信息
	 * @param array $arrConfig
	 * {
	 * 		baseDir : 根目录
	 * 		defaultView ： 默认View处理器，默认是index.php
	 * 		scriptPathName : script文件夹存放的文件夹名称。默认是script
	 * 		outputType : 输出类型。默认是html
	 * 		initView : 初始化View的文件。默认是__init.php
	 * 		debug : 是否启用debug模式
	 * }
	 */
	public function setOptions($arrConfig=array())
	{
		if (isset($arrConfig['baseDir'])) {
    		$this->setBaseDir($arrConfig['baseDir']);
    	}
    	if (isset($arrConfig['defaultView'])) {
    		$this->_strDefaultView = $arrConfig['defaultView'];
    	}
    	if (isset($arrConfig['scriptPathName'])) {
    		$this->_strScriptPathName = $arrConfig['scriptPathName'];
    	}
    	if (isset($arrConfig['outputType'])) {
    		$this->_strOutputType = $arrConfig['outputType'];
    	}
    	if (isset($arrConfig['initView'])) {
    		$this->_strInitView = $arrConfig['initView'];
    	}
    	if (array_key_exists('debug', $arrConfig)) {
    		$this->_bolDebug = (boolean) $arrConfig['debug'];
    	}
    	if (isset($arrConfig['isXssSafe'])) {
    		$this->_bolXssSafe = (boolean) $arrConfig['isXssSafe'];
    	}
    	if (isset($arrConfig['whiteListFilePath'])) {
    	    $this->_whiteListFilePath = $arrConfig['whiteListFilePath'];
    	}
    	if (isset($arrConfig['catchPath'])) {
    	    $this->_catchPath = $arrConfig['catchPath'];
    	}
	}
	/*
	 * 设置根目录。注意，在FE中使用到目录的时候，都会自动加上该目录，需要使用绝对路径。
	 */
	public function setBaseDir($strBaseDir)
	{
		if (is_dir($strBaseDir) && file_exists($strBaseDir)) {
			$this->_strBaseDir = rtrim($strBaseDir, DIRECTORY_SEPARATOR);
		} else {
			trigger_error('setBaseDir baseDir invalid!baseDir=' . $strBaseDir, E_USER_WARNING);
		}
		return false;
	}
	/**
	 * 设置输出类型，默认是HTML，传递给view使用
	 * @param string $strOutputType
	 */
	public function setOutputType($strOutputType)
	{
		$this->_strOutputType = $strOutputType;
	}
	/**
	 * 添加输出类型对应的目录结构
	 * @param string $strPath
	 * @param string $strOutputType
	 */
	public function setScriptPath($strPath, $strOutputType = 'html')
	{
		if (! is_dir($strPath)) {
    		trigger_error('setScriptPath path invalid!' . $strPath, E_USER_WARNING);
    	} 
    	$this->_arrScriptPaths[$strType] = rtrim($strPath, DIRECTORY_SEPARATOR);
	}
	/**
	 * 获取当前Script脚本的根目录
	 */
	public function getScriptPath()
    {
    	$strPath = '';
    	if (isset($this->_arrScriptPaths[$this->_strOutputType])) {
    		$strPath = $this->_arrScriptPaths[$this->_strOutputType];
    	} else {
    		$strPath = $this->_strBaseDir  .DIRECTORY_SEPARATOR . $this->_strOutputType . DIRECTORY_SEPARATOR . $this->_strScriptPathName;
    	}
    	if (! is_dir($strPath)) {
    		throw new Exception($strPath . ' invalid!');
    	}
    	return $strPath;
    }
	/**
	 * 转向视图层，进行渲染
	 * @param string $strViewName
	 */
	public function render($strViewName)
	{
		switch($this->_strOnlyDataType) {
			case 'json': // 只输出 json 数据格式
				$arrDataTmp = $this->getScript()->g();
				require_once 'Bingo/String.php';
				$strJson = Bingo_String::array2json($arrDataTmp, BINGO_ENCODE_LANG/*UTF8DIFF*/);
				echo $strJson;
				return true;
				break;
			case 'serial': // 只输出序列化的数据格式
				$arrDataTmp = $this->getScript()->g();
				$strSerialize = serialize($arrDataTmp);
				echo $strSerialize;
				return true;
				break;
				/* 由于mcpack对数据有诸多要求，暂不支持
			case 'mcpack': // 输出mcpack 格式
				$arrDataTmp = $this->getScript()->g();
				$strMcpack = mc_pack_array2pack($arrDataTmp);
				echo $strMcpack;
				return true;
				break;
				*/
			default:
				break;
		}
		// 非数据接口
		set_error_handler(array($this->_objScript, 'errorHandler'));
    	$bolRet = false;
    	try{
    		$bolRet = $this->_render($strViewName);
    	} catch (Exception $e) {
    		$this->_objScript->errorHandler(E_USER_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    	}
    	restore_error_handler();
    	return $bolRet;
	}
	/***
	 * 进行模板的渲染，适合在不采用view层的时候调用
	 */
	public function display($strTemplateName)
	{
		set_error_handler(array($this->_objScript, 'errorHandler'));
    	$bolRet = false;
    	try{
    		require_once 'Bingo/View/Functions.php';
    		$this->_objScript->display($strTemplateName);
    	} catch (Exception $e) {
    		$this->_objScript->errorHandler(E_USER_WARNING, $e->getMessage(), $e->getFile(), $e->getLine());
    	}
    	restore_error_handler();
    	return $bolRet;
	}
	/**
	 * 模板变量赋值
	 * @param mix(string|array) $mixKey
	 * @param mix(array|string) $mixValue,使用者需要保证只赋给模板标量
	 */
	public function assign($mixKey, $mixValue = null)
	{
		if($this->_bolXssSafe) {
		    require_once 'Bingo/String.php';
			if (is_null($mixValue) && is_array($mixKey)) {
				array_walk_recursive($mixKey,array('Bingo_String','xssSafe'));
			}
			else if (!in_array($mixKey,$this->_arrWhiteList) ) {
				if (is_string($mixValue)) {
					$mixValue = Bingo_String::escapeHtml($mixValue, BINGO_ENCODE_LANG, (BINGO_ENCODE_LANG == 'UTF-8'));
				}
				else if (is_array($mixValue)) {
					array_walk_recursive($mixValue,array('Bingo_String','xssSafe'));
				}
			}
		}
		return $this->_objScript->assign($mixKey, $mixValue);
	}
	public function getScript()
	{
		return $this->_objScript;
	}
	/**
	 * 清空变量
	 */
	public function clean()
	{
		$this->_objScript->clean();
	}
	/**
	 * 开启debug模式
	 * @param boolean $bolDebug
	 */
	public function setDebug($bolDebug = true)
	{
		$this->_bolDebug = (bool)$bolDebug;
	}
	/**
	 * 传递错误信息给view
	 * @param int $intErrno
	 */
	public function error($intErrno)
	{
		$this->_intErrno = intval($intErrno);
		$this->_objScript->setErrno($intErrno);
	}
	
	protected function _debugOutput($strViewName, $strViewPath, $strInitViewPath)
    {
    	echo '<b>基础参数</b><br/>';
    	echo '根目录（baseDir） : ' . $this->_strBaseDir . '<br />';
    	echo '输出类型（outputType） : ' . $this->_strOutputType . '<br />';
    	echo '初始化视图文件：' . $strInitViewPath . '<br />';
    	echo '视图文件名称：' . $strViewName . '<br />';
    	echo '视图文件路径：' . $strViewPath . '<br />';
    	echo '错误号：' . $this->_intErrno . '<br />';
    	echo '<hr><b>数据字典</b></hr><br/>';
    	echo '<pre>';
    	print_r($this->_objScript->g());
    	echo '</pre>';	
    }
    
    protected function _render($strViewName)
    {
    	//包含视图需要的函数库
    	require_once 'Bingo/View/Functions.php';
    	$strViewRootPath = $this->getScriptPath() . DIRECTORY_SEPARATOR;
    	$strViewFilePath = $strViewRootPath . $strViewName;
    	
    	if (! is_file($strViewFilePath)) {
    		$strViewFilePath = $strViewRootPath . $this->_strDefaultView;
    	}  	
    	$strInitViewPath = $strViewRootPath . $this->_strInitView;  
    	if (! is_file($strInitViewPath)) {
    		$strInitViewPath = '';
    	}
    	if ($this->_bolDebug) {
    		$this->_debugOutput($strViewName, $strViewFilePath, $strInitViewPath);
    		return true;
    	}
    	$bolRet = $this->_objScript->render($strViewFilePath, $strInitViewPath);
    	if (! $bolRet) {
    		trigger_error('Bingo_View::render ' . $strViewName . ' ret=' . intval($bolRet), E_USER_WARNING);
    	}
    	return $bolRet;
    }
}
