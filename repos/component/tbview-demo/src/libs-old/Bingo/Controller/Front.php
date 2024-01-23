<?php
/**
 * ·��ת�������������·��ת���Ĺ�����
 * 
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package bingo2.0
 * @since 2010-02-24
 */
require_once 'Bingo/Http/Request.php';
require_once 'Bingo/Http/Router/Abstract.php';
class Bingo_Controller_Front
{
	private static $_singleton     = null;
	/**
	 * ��̬·�� ����
	 * @var Bingo_Router_Static
	 */
	protected $_objStaticRouter    = null;
	/**
	 * ����·�� ����
	 * @var Bingo_Router_Rule
	 */
	protected $_objRuleRouter      = null;
	/**
	 * ���зַ��Ķ������飬����ÿһ������һ��dispatcher
	 * @var array
	 */
	protected $_arrDispatchHash    = array();
	/**
	 * ������Ϣ
	 * @var array
	 */
	protected $_arrConfig          = array();
	/**
     * ���ڷַ���router
     *
     * @var string
     */
    protected $_strDispatchRouter  = '';
    /**
     * ���dispatchRouterΪ�գ�����ø�Ĭ�ϵ�Router��
     * @var string
     */
    protected $_strDefaultRouter   = 'index';
    /**
     * ������е�dispatcher��dispatchʧ�ܺ󣬽����ø�router���½��зַ���
     * @var string
     */
    protected $_strNotFoundRouter  = 'index';
    /**
     * filterActions��һ��������ÿ��processAction����֮ǰ˳��ִ��
     * @var unknown_type
     */
    protected $_arrFilterActions   = array();
    /**
     * 
     * @var unknown_type
     */
    protected $_arrEndActions      = array();
    /**
     * Actionջ��ע���ǵ����
     * @var unknown_type
     */
    protected $_objActions         = array();

    public function addFilterAction($objAction)
    {
        $this->_arrFilterActions[] = $objAction;
    }
    
    public function setFilterActions($arrActions)
    {
        $this->_arrFilterActions   = $arrActions;
    }
    
    public function addEndAction($objAction)
    {
        $this->_arrEndActions[]    = $objAction;
    }
    
    public function setEndActions($arrActions)
    {
        $this->_arrEndActions      = $arrActions;
    }
    
	private function __construct($arrConfig=array())
	{
		$this->_arrConfig = $arrConfig;
		Bingo_Http_Request::init($arrConfig);
		if (isset($arrConfig['httpRouter']) && is_subclass_of($arrConfig['httpRouter'], 'Bingo_Http_Router_Abstract') ) {
			$objHttpRouter = $arrConfig['httpRouter'];
		} else {
			require_once 'Bingo/Http/Router/Pathinfo.php';
			$objHttpRouter = new Bingo_Http_Router_Pathinfo($arrConfig);
		}
		if (isset($arrConfig['defaultRouter'])) {
			$this->_strDefaultRouter = $arrConfig['defaultRouter'];
		}
		if (isset($arrConfig['notFoundRouter'])) {
			$this->_strNotFoundRouter = $arrConfig['notFoundRouter'];
		}
		$objHttpRouter->getHttpRouter();
	}	
	/**
	 * ����ģʽ����ȡ��һ��ʵ������
	 * @param array $arrConfig
	 * {
	 * 		httpEncode : string ��������ı�������
     * 		internalEncode : string �ڲ����õı������ͣ�ͨ����gbk
     * 		autoDetectEncodeName : string �Զ���ȡ�������͵�key�����������httpEncode������Ҫ���øñ���     * 
     * 		encodeEngine : string (uconv ����mb_string)
     * 		httpRouter : ��ȡrouter�Ķ�����Ҫ��Bingo_Http_Router_Abstract�����ࡣĬ�ϲ���Bingo_Http_Router_Pathinfo
     * 		�������Bingo_Http_Router_Pathinfo����ô���м�������
     * 		{
     * 		sepOfRouterAndParams �� 
     * 		sepOfParams ��
     * 		endOfParams ��
     * 		beginRouterIndex ��
     * 		sepOfRouter ��
     * 		defaultHttpRouter �� 
     * 		usePathinfo �� 
     * 		}
     * 		defaultRouter : ���dispatchRouterΪ�գ�����ø�Ĭ�ϵ�Router��
     * 		notFoundRouter : ������е�dispatcher��dispatchʧ�ܺ󣬽����ø�router���½��зַ���
     * 		�������Ĭ�ϵ��Զ��ַ����������µĲ���
     * 		actionDir �� actions��Ŀ¼
     * 		actionFileSuffix �� �ļ���׺��Ĭ����.php
     * 		actionClassNameSuffix : �����ĺ�׺��Ĭ����Action
     * }	
	 */
	public static function getInstance($arrConfig=array())
    {
        if (is_null(self::$_singleton)) {
            self::$_singleton = new Bingo_Controller_Front($arrConfig);
        }
        return self::$_singleton;
    }
    /**
     * ע��ַ���
     * @param $objDispatch
     */
	public function registerDispatch($objDispatch)
	{
	    if (method_exists($objDispatch, 'dispatch')) {
	        $this->_arrDispatchHash[] = $objDispatch;  
	        return true;
	    }
	    trigger_error('registerDispatch error! invalid!', E_USER_WARNING);
	    return false;
	}    
	/**
	 * ��Ӿ�̬·��
	 *
	 * @param string $key
	 * @param string $value
	 */
	public function addStaticRouter($key, $value = NULL)
	{
	    if (is_null($this->_objStaticRouter)) {
	    	require_once 'Bingo/Router/Static.php';
	        $this->_objStaticRouter = new Bingo_Router_Static();
	    }
	    if (is_null($value)) $value = $key;
	    $this->_objStaticRouter->add($key,$value);
	    return $this;
	}
	/**
	 * ���·�ɹ���
	 * @example 
	 * $rule = array{
	 * 	   'rule' => array('test', ':key', 'here'),
 	 *     'regex' => array(
 	 *         ':key' => '[0-9]',
 	 *     ),
 	 * }
 	 * $this->addRouterRule('test', $rule);
	 *
	 * @param string $key
	 * @param array $rule
	 * {
	 * 		rule : array
	 * 		regex : array
	 * }
	 * @return $this
	 */
	public function addRouterRule($key, $rule)
	{
	    if (is_null($this->_objRuleRouter)) {
	    	require_once 'Bingo/Router/Rule.php';
	        $this->_objRuleRouter = new Bingo_Router_Rule();
	    }
	    $this->_objRuleRouter->add($key, $rule);
	    return $this;
	}	
	/**
	 * ��ȡ����dipatch��·��
	 *
	 * @return string
	 */
	public function getDispatchRouter()
	{
	    if (empty($this->_strDispatchRouter)) {
	        return $this->_geneDispatchRouter();
	    }
	    return $this->_strDispatchRouter;
	}
	/**
	 * ��ȡAction,���ִ�е�һ��
	 */
	public function getAction()
	{
	    return $this->getLastAction();
	}	
	public function getActions()
	{
	    return $this->_objActions;
	}
	/**
	 * ��ȡ���ִ�е�һ��Action
	 */
	public function getLastAction()
	{
	    if (! empty($this->_objActions)) {	    
	        return $this->_objActions[0];
	    }
	    return false;
	}
	/**
	 * ��ȡ��һ��ִ�е�Action
	 */
	public function getFirstAction()
	{
	    if (! empty($this->_objActions)) {	    
	        return $this->_objActions[count($this->_objActions)-1];
	    }
	    return false;
	}
	
	public function dispatchByRouter($strDispatchRouter, $bolNoFrameworkDispatch = true)
	{
	    $boolDispatched = false;
	    if (empty($this->_arrDispatchHash)) {
	    	require_once 'Bingo/Dispatch/Auto.php';
	    	$this->_arrDispatchHash[] = new Bingo_Dispatch_Auto($this->_arrConfig);
	    }
	    foreach ($this->_arrDispatchHash as $_objDispatch) {
	    	$boolDispatched = $_objDispatch->dispatch($strDispatchRouter);
	    	if ($boolDispatched) {
	    	    if (method_exists($_objDispatch, 'getAction')) {
	    	        $this->_objActions[] = $_objDispatch->getAction();
	    	    }
	    	    break;
	    	}
	    }
	    if (! $boolDispatched) {
	    	trigger_error('dispatch error!router[' . $strDispatchRouter . '],goto notFoundRouter', E_USER_WARNING);
	    } else {
	    	return true;
	    }
	    //not Found dispatch
    	foreach ($this->_arrDispatchHash as $_objDispatch) {
	    	$boolDispatched = $_objDispatch->dispatch($this->_strNotFoundRouter);
	    	if ($boolDispatched) {
	    	    if (method_exists($_objDispatch, 'getAction')) {
	    	        $this->_objActions[] = $_objDispatch->getAction();
	    	    }
	    	    break;
	    	}
	    }
	    
    	if (! $boolDispatched) {
	    	throw new Exception('dispatch error!router[' . $strDispatchRouter . ']');
	    }
	    return false;
	}
    /**
     * �ַ�
     */
    public function dispatch()
    {
        $bolDispatch = true;
        if (! empty($this->_arrFilterActions)) {
            $mixRet = true;
            foreach ($this->_arrFilterActions as $_objAction) {
                $mixRet = $this->_runAction($_objAction);
                if ($mixRet == Bingo_Action_Filter::FILTER_END) {
                    trigger_error('filterAction:' . get_class($_objAction). ' ret=FILTER_END', E_USER_NOTICE);
                    //ֱ����ת��Action
                    break;
                }elseif ($mixRet == Bingo_Action_Filter::FILTER_ACTION_END) {
                    //ֱ����ת��end Action
                    trigger_error('filterAction:' . get_class($_objAction). ' ret=FILTER_ACTION_END', E_USER_NOTICE);
                    $bolDispatch = false;
                    break;
                }elseif ($mixRet == Bingo_Action_Filter::FILTER_ALL_END) {
                    //ȫ������
                    trigger_error('filterAction:' . get_class($_objAction). ' ret=FILTER_ALL_END', E_USER_NOTICE);
                    return ;
                }
            }
        }
        //filterActions end
        if ($bolDispatch) {
    	    $strDispatchRouter = $this->getDispatchRouter();
	        $this->dispatchByRouter($strDispatchRouter);
        }
        //endActions begin
        if (! empty($this->_arrEndActions)) {
            foreach ($this->_arrEndActions as $_objAction) {
                $mixRet = $this->_runAction($_objAction);
                if ($mixRet === false) {
                    trigger_error('endAction:' . get_class($_objAction). ' ret=FILTER_ALL_END', E_USER_NOTICE);
                    return ;
                }
            }
        }
    }
    
    protected function _runAction($objAction)
    {
        $mixRet = true;
        if (method_exists($objAction, 'init')) {
            $objAction->init();
        }
        if (method_exists($objAction, 'execute')) {
            $mixRet = $objAction->execute();
        }
        return $mixRet;
    }
    /**
     * ����dispatchRouter��������filter�� static �� ����
     */
	protected function _geneDispatchRouter()
	{	    
	    $strHttpRouter = Bingo_Http_Request::getStrHttpRouter();
	    if (! is_null($this->_objStaticRouter)) {
	        //static
	    	$this->_strDispatchRouter = $this->_objStaticRouter->getDispatchRouter($strHttpRouter);
	    	if ($this->_strDispatchRouter) return $this->_strDispatchRouter;
	    }
	    if (! is_null($this->_objRuleRouter)) {
	        //rule
	        $this->_strDispatchRouter = $this->_objRuleRouter->getDispatchRouter($strHttpRouter);
	        if ($this->_strDispatchRouter) return $this->_strDispatchRouter;
	    }	    
	    //default
	    $this->_strDispatchRouter = $strHttpRouter;
	    if (empty($this->_strDispatchRouter)) {
	    	$this->_strDispatchRouter = $this->_strDefaultRouter;
	    }
	    return $this->_strDispatchRouter;
	}
}