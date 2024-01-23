<?php
/**
 * 路由转发控制器，完成路由转发的工作。
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
	 * 静态路由 对象
	 * @var Bingo_Router_Static
	 */
	protected $_objStaticRouter    = null;
	/**
	 * 规则路由 对象
	 * @var Bingo_Router_Rule
	 */
	protected $_objRuleRouter      = null;
	/**
	 * 进行分发的对象数组，里面每一个都是一个dispatcher
	 * @var array
	 */
	protected $_arrDispatchHash    = array();
	/**
	 * 配置信息
	 * @var array
	 */
	protected $_arrConfig          = array();
	/**
     * 用于分发的router
     *
     * @var string
     */
    protected $_strDispatchRouter  = '';
    /**
     * 如果dispatchRouter为空，则采用该默认的Router。
     * @var string
     */
    protected $_strDefaultRouter   = 'index';
    /**
     * 如果所有的dispatcher都dispatch失败后，将采用该router重新进行分发。
     * @var string
     */
    protected $_strNotFoundRouter  = 'index';
    /**
     * filterActions，一个链表，在每个processAction处理之前顺序执行
     * @var unknown_type
     */
    protected $_arrFilterActions   = array();
    /**
     * 
     * @var unknown_type
     */
    protected $_arrEndActions      = array();
    /**
     * Action栈，注意是倒序的
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
	 * 单件模式，获取到一个实例对象
	 * @param array $arrConfig
	 * {
	 * 		httpEncode : string 输入参数的编码类型
     * 		internalEncode : string 内部采用的编码类型，通常是gbk
     * 		autoDetectEncodeName : string 自动获取编码类型的key。如果设置了httpEncode，则不需要设置该变量     * 
     * 		encodeEngine : string (uconv 或者mb_string)
     * 		httpRouter : 获取router的对象，需要是Bingo_Http_Router_Abstract的子类。默认采用Bingo_Http_Router_Pathinfo
     * 		如果采用Bingo_Http_Router_Pathinfo，那么还有几个参数
     * 		{
     * 		sepOfRouterAndParams ： 
     * 		sepOfParams ：
     * 		endOfParams ：
     * 		beginRouterIndex ：
     * 		sepOfRouter ：
     * 		defaultHttpRouter ： 
     * 		usePathinfo ： 
     * 		}
     * 		defaultRouter : 如果dispatchRouter为空，则采用该默认的Router。
     * 		notFoundRouter : 如果所有的dispatcher都dispatch失败后，将采用该router重新进行分发。
     * 		如果采用默认的自动分发，则还有以下的参数
     * 		actionDir ： actions的目录
     * 		actionFileSuffix ： 文件后缀，默认是.php
     * 		actionClassNameSuffix : 类名的后缀，默认是Action
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
     * 注册分发器
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
	 * 添加静态路由
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
	 * 添加路由规则
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
	 * 获取用于dipatch的路由
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
	 * 获取Action,最后执行的一个
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
	 * 获取最后执行的一个Action
	 */
	public function getLastAction()
	{
	    if (! empty($this->_objActions)) {	    
	        return $this->_objActions[0];
	    }
	    return false;
	}
	/**
	 * 获取第一个执行的Action
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
     * 分发
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
                    //直接跳转到Action
                    break;
                }elseif ($mixRet == Bingo_Action_Filter::FILTER_ACTION_END) {
                    //直接跳转到end Action
                    trigger_error('filterAction:' . get_class($_objAction). ' ret=FILTER_ACTION_END', E_USER_NOTICE);
                    $bolDispatch = false;
                    break;
                }elseif ($mixRet == Bingo_Action_Filter::FILTER_ALL_END) {
                    //全部结束
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
     * 产生dispatchRouter，有两种filter： static 和 规则
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