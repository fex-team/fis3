<?php
/**
 * Bingo2.0��ͼ
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-25
 * @package bingo
 */
require_once 'Bingo/View/Script.php';
if (! defined('BINGO_ENCODE_LANG')) define('BINGO_ENCODE_LANG', 'GBK');
class Bingo_View
{
    /**
     * ��·��
     * @var string
     */
	protected $_strBaseDir = '.';
	/**
	 * ������ͣ�html/json/xml
	 * TODO ���ݸ����ͣ��Զ������ͬ��ͷ��Ϣ
	 * @var string
	 */
	protected $_strOutputType = 'html';
	/**
	 * view�ļ��е�·������
	 * @var string
	 */
	protected $_strScriptPathName = 'control';
	/**
	 * View�ļ���·��������������ͽ���һһ��Ӧ��
	 * @var array
	 */
	protected $_arrScriptPaths = array();
	/**
	 * Ĭ����ͼ�����������Ҳ�����ͼ��������ʱ�򣬾Ͳ���Ĭ�ϵġ�
	 * @var string
	 */
	protected $_strDefaultView = 'index.php';
	/**
	 * ��ͼ��ʼ����Ӧ���ļ���
	 * @var string
	 */
	protected $_strInitView = '__init.php';
	/**
	 * ����ţ�UI���ݸ�FE
	 * @var int
	 */
	protected $_intErrno = 0;
	/**
	 * �Ƿ�����debugģʽ���ڿ���debugģʽ��ʱ�򣬲������ҳ����Ⱦ������ֱ�ӽ������ݵ�var_dump
	 * @var boolean
	 */
	protected $_bolDebug = false;	
	
	protected $_objScript = null;
	/**
	 * ֻ������ݵ����ͣ�Ĭ��Ϊ��
	 * @var string
	 */
	protected $_strOnlyDataType = '';
	/**
	 * ��ȡֻ������ݵ����ͣ����ַ�����ʾ������ֻ������ݵĹ���
	 */
	public function getOnlyDataType() {
		return $this->_strOnlyDataType;
	}
	/**
	 * ����ֻ������ݹ��ܵ���������
	 * @param string $strType ֻ������ݵ����ͣ�Ŀǰ֧��json��ʽ(json)�����л�(serial)��mcpack(mcpack)
	 */
	public function setOnlyDataType($strType) {
		$this->_strOnlyDataType = $strType;
	}
	/*
     * �Ƿ���XSS��ȫģʽ��Ĭ��Ϊtrue,����__construct������,Ҳ����setXssSafe����
     */
    protected $_bolXssSafe = true;
    /*
     * XSS������
     */
    protected $_arrWhiteList = array();
    /*
     * �Ƿ��Ѿ���ȡ������
     */
    protected $_bolWhiteListIni = false;
    /*
     * �����������ļ�·��������__construct������
     */
    protected $_whiteListFilePath = 'conf/white_list.txt';
    /*
     * ����Ŀ¼������__contruct������
     */
    protected $_catchPath = 'data';
    /**
     * ����XSS��ȫģʽ
     * 
     * @param unknown_type $bolXssSafe
     */
    public function setXssSafe($bolXssSafe) {
        $this->_bolXssSafe = (boolean) $bolXssSafe;
    }
    /**
     * ���XSS��ȫģʽ
     */
    public function getXssSafe() {
        return $this->_bolXssSafe;
    }
    /**
     * ��ȡ���������ã�ע����Ҫ�Ƚ�������
     * 
     * @param $filePath ����������·��
     * @param $catchPath ����·��	
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
		
		/******-^- Begin ��ʼ��ģ�黯�������� -^-******/
		//��ʼ��view��ģ�黯���ز��� by niuyao@2012.02.24��Ĭ�Ͽ�������һ����hack��Ϊ
		if(!isset($arrConfig['viewRootpath'])){
			//�����ɵĲ����У�һ��ģ������·��Ϊ����ģ���ģ�岿��ĸ�·��
			$arrConfig['viewRootpath'] = realpath($this->_strBaseDir . '/../') . '/';
		}
		if(!isset($arrConfig['module'])){
			//�����ɵĲ����У�һ��ģ������·��Ϊ����ģ���ģ�岿��ĸ�·��
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
		/******-^- End ��ʼ��ģ�黯�������� -^-******/
	}
	/**
	 * �������������Ϣ
	 * @param array $arrConfig
	 * {
	 * 		baseDir : ��Ŀ¼
	 * 		defaultView �� Ĭ��View��������Ĭ����index.php
	 * 		scriptPathName : script�ļ��д�ŵ��ļ������ơ�Ĭ����script
	 * 		outputType : ������͡�Ĭ����html
	 * 		initView : ��ʼ��View���ļ���Ĭ����__init.php
	 * 		debug : �Ƿ�����debugģʽ
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
	 * ���ø�Ŀ¼��ע�⣬��FE��ʹ�õ�Ŀ¼��ʱ�򣬶����Զ����ϸ�Ŀ¼����Ҫʹ�þ���·����
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
	 * ����������ͣ�Ĭ����HTML�����ݸ�viewʹ��
	 * @param string $strOutputType
	 */
	public function setOutputType($strOutputType)
	{
		$this->_strOutputType = $strOutputType;
	}
	/**
	 * ���������Ͷ�Ӧ��Ŀ¼�ṹ
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
	 * ��ȡ��ǰScript�ű��ĸ�Ŀ¼
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
	 * ת����ͼ�㣬������Ⱦ
	 * @param string $strViewName
	 */
	public function render($strViewName)
	{
		switch($this->_strOnlyDataType) {
			case 'json': // ֻ��� json ���ݸ�ʽ
				$arrDataTmp = $this->getScript()->g();
				require_once 'Bingo/String.php';
				$strJson = Bingo_String::array2json($arrDataTmp, BINGO_ENCODE_LANG/*UTF8DIFF*/);
				echo $strJson;
				return true;
				break;
			case 'serial': // ֻ������л������ݸ�ʽ
				$arrDataTmp = $this->getScript()->g();
				$strSerialize = serialize($arrDataTmp);
				echo $strSerialize;
				return true;
				break;
				/* ����mcpack�����������Ҫ���ݲ�֧��
			case 'mcpack': // ���mcpack ��ʽ
				$arrDataTmp = $this->getScript()->g();
				$strMcpack = mc_pack_array2pack($arrDataTmp);
				echo $strMcpack;
				return true;
				break;
				*/
			default:
				break;
		}
		// �����ݽӿ�
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
	 * ����ģ�����Ⱦ���ʺ��ڲ�����view���ʱ�����
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
	 * ģ�������ֵ
	 * @param mix(string|array) $mixKey
	 * @param mix(array|string) $mixValue,ʹ������Ҫ��ֻ֤����ģ�����
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
	 * ��ձ���
	 */
	public function clean()
	{
		$this->_objScript->clean();
	}
	/**
	 * ����debugģʽ
	 * @param boolean $bolDebug
	 */
	public function setDebug($bolDebug = true)
	{
		$this->_bolDebug = (bool)$bolDebug;
	}
	/**
	 * ���ݴ�����Ϣ��view
	 * @param int $intErrno
	 */
	public function error($intErrno)
	{
		$this->_intErrno = intval($intErrno);
		$this->_objScript->setErrno($intErrno);
	}
	
	protected function _debugOutput($strViewName, $strViewPath, $strInitViewPath)
    {
    	echo '<b>��������</b><br/>';
    	echo '��Ŀ¼��baseDir�� : ' . $this->_strBaseDir . '<br />';
    	echo '������ͣ�outputType�� : ' . $this->_strOutputType . '<br />';
    	echo '��ʼ����ͼ�ļ���' . $strInitViewPath . '<br />';
    	echo '��ͼ�ļ����ƣ�' . $strViewName . '<br />';
    	echo '��ͼ�ļ�·����' . $strViewPath . '<br />';
    	echo '����ţ�' . $this->_intErrno . '<br />';
    	echo '<hr><b>�����ֵ�</b></hr><br/>';
    	echo '<pre>';
    	print_r($this->_objScript->g());
    	echo '</pre>';	
    }
    
    protected function _render($strViewName)
    {
    	//������ͼ��Ҫ�ĺ�����
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
