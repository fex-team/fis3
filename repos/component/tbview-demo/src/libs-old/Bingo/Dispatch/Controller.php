<?php
/**
 * ����Controller => Action �ķַ���ʽ������club/dir��Ӧ��ClubController :: dirAction����
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-07
 * @package bingo2.0
 */
require_once 'Bingo/Dispatch/Interface.php';
require_once 'Bingo/Http/Request.php';
class Bingo_Dispatch_Controller implements Bingo_Dispatch_Interface 
{
	/**
	 * controller��ŵ�·��
	 * @var string
	 */
	protected $_strControllerDir = './';
	/**
	 * �ļ�����׺
	 * @var string
	 */
	protected $_strFileSuffix = '.php';
	/**
	 * ������׺
	 * @var string
	 */
	protected $_strClassSuffix = 'Controller';
	/**
	 * ����Action��������׺
	 * @var string
	 */
	protected $_strActionSuffix = 'Action';
	/**
	 * Ĭ�ϵ�Controller
	 * @var string
	 */
	protected $_strDefaultController = 'index';
	/**
	 * Ĭ�ϵ�Action
	 * @var string
	 */
	protected $_strDefaultAction = 'index';
	
	protected $_objController = null;
	
	public function __construct($arrConfig = array())
	{
		if (! empty($arrConfig))$this->setConfig($arrConfig);
	}
    /**
     * ���ò���
     * @param array $arrConfig
     */
    public function setConfig($arrConfig = array())
    {
        if (isset($arrConfig['controllerDir'])) {
            $this->_strControllerDir = rtrim($arrConfig['controllerDir'], DIRECTORY_SEPARATOR);
        }
        if (isset($arrConfig['fileSuffix'])) {
        	$this->_strFileSuffix = $arrConfig['fileSuffix'];
        }
    	if (isset($arrConfig['classSuffix'])) {
        	$this->_strClassSuffix = $arrConfig['classSuffix'];
        }
        if (isset($arrConfig['actionSuffix'])) {
        	$this->_strActionSuffix = $arrConfig['actionSuffix'];
        }
    	if (isset($arrConfig['defaultController'])) {
        	$this->_strDefaultController = $arrConfig['defaultController'];
        }
    	if (isset($arrConfig['defaultAction'])) {
        	$this->_strDefaultAction = $arrConfig['defaultAction'];
        }
    }
    
    public function getAction()
    {
        return $this->_objController;
    }
    /**
     * ·�ɷַ�
     * @param string $strDispatchRouter
     */
	public function dispatch($strDispatchRouter)
	{
		$arrDisatchRouter = Bingo_Http_Request::arrayFilterEmpty( explode('/', $strDispatchRouter) );
		$strController = $this->_strDefaultController;
		$strAction= $this->_strDefaultAction;
		if (isset($arrDisatchRouter[0]) && ! empty($arrDisatchRouter[0])) $strController = $arrDisatchRouter[0];
		if (isset($arrDisatchRouter[1]) && ! empty($arrDisatchRouter[1])) $strAction = $arrDisatchRouter[1];
		$strControllerName = $strController . $this->_strClassSuffix;
		$strFileName = $this->_strControllerDir . DIRECTORY_SEPARATOR . $strControllerName . $this->_strFileSuffix;
		if (is_file($strFileName)) {
			include_once 'Bingo/Action/Controller.php';
			include_once $strFileName;
			if (! class_exists($strControllerName)) {
				return false;
			}
			$objController = new $strControllerName();
			$this->_objController = $objController;
			$strActionName = $strAction . $this->_strActionSuffix;
			if (method_exists($objController, 'init')) {
				$objController->init();
			}
			if (method_exists($objController, $strActionName)) {
				$objController->$strActionName();
				return true;
			}
		}
		return false;
	}
}