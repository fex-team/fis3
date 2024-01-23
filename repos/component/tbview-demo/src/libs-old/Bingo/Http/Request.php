<?php
/**
 * http request，含有http请求的相关数据，比如GET POST COOKIE URL_PARSE
 * 其中所有的数据都进行了相应的编码转换工作。
 * @author xuliqiang@baidu.com
 * @since 2009-12-1
 * @example 
 * 
 * @tutorial 
 *
 */
if (! defined('BINGO_ENCODE_LANG')) define('BINGO_ENCODE_LANG', 'GBK');
class Bingo_Http_Request
{
    const METHOD_POST = 'POST';
    
    const METHOD_GET = 'GET';
    /**
     * 设置编码方式的字段名称
     *
     */
    protected static $_strAutoDetectEncodeName = 'ie';
    /**
     * http请求过来的编码方式
     *
     * @var string:utf-8/gbk
     */
    protected static $_strHttpEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/;
    /**
     * 内部代码编码方式
     *
     * @var string:utf-8/gbk
     */
    protected static $_strInternalEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/;
    /**
     * 进行编码转换的库，可以选择uconv或者mb_string
     * 具体参考Bingo_Encode库类
     *
     * @var string
     */
    protected static $_strEncodeEngine = 'uconv';
    /**
     * $_GET数组的数据，对字符编码进行了处理
     *
     * @var array
     */
    protected static $_arrGet = array();
    /**
     * $_POST数组的数据，对字符编码都进行了处理
     *
     * @var array
     */
    protected static $_arrPost = array();
    /**
     * $_COOKIE数组的数据，对字符编码进行了处理
     *
     * @var array
     */
    protected static $_arrCookie = array();
    /**
     * $_SERVER数组的数据，对字符编码进行了处理
     *
     * @var array
     */
    protected static $_arrServer = array();
    /**
     * http router
     *
     * @var string
     */
    protected static $_strHttpRouter = '';
    protected static $_arrHttpRouter = array();
    /**
     * 用于dispatch的router
     * @var unknown_type
     */
    protected static $_strDispatchRouter = '';
    protected static $_arrDispatchRouter = array();
    /**
     * router中的参数变量
     *
     * @var array
     */
    protected static $_arrRouterParams = array();
    protected static $_arrDict = array();
    /**
     * URL中参数数组
     *
     * @var array
     */
    protected static $_arrParams = array();
    protected static $_arrParamsFormat = null;
    protected static $_strMethod = '';
    private static $_boolHttpEncodeHasDetect = false;//是否进行HTTP编码类型的检查
    private static $_boolIsInit = false;//是否已经初始化
    /**
     * 从Dict中获取数据
     * @param unknown_type $strKey
     * @param unknown_type $mixDefaultValue
     */
    public static function getDict($strKey, $mixDefaultValue = null)
    {
        if (empty($strKey)) {
            return self::$_arrDict;
        }
        if (array_key_exists($strKey, self::$_arrDict)) {
            return self::$_arrDict[$strKey];
        }
        return $mixDefaultValue;
    }
    /**
     * 设置数据到Dict中去
     * @param unknown_type $strKey
     * @param unknown_type $mixValue
     */
    public static function setDict($strKey, $mixValue)
    {
        self::$_arrDict[$strKey] = $mixValue;
    }
    /**
     * 设置HTTP的编码格式，调用必须先于init函数的调用
     *
     * @param string $_strHttpEncode
     */
    public static function setHttpEncode($_strHttpEncode) 
    {
        self::$_strHttpEncode = $_strHttpEncode;
        self::$_boolHttpEncodeHasDetect = TRUE;
    }
    /**
     * 设置内部编码格式，调用必须先于init函数的调用
     *
     * @param string $_strInternalEncode
     */
    public static function setInternalEncode($_strInternalEncode)
    {
        self::$_strInternalEncode = $_strInternalEncode;
    }
    /**
     * 初始化，使用httpRequest，必须首先调用这个函数。
     * 完成编码检测及编码转化工作。
     * @param array $arrConfig
     * {
     * 		httpEncode : string
     * 		internalEncode : string
     * 		autoDetectEncodeName : string
     * 		encodeEngine : string (uconv 或者mb_string)
     * 		
     * }
     *
     */
    public static function init($arrConfig = array())
    {
    	if (self :: $_boolIsInit) 
    		return true;
    	if (isset( $arrConfig ['httpEncode'] )) {
    		self :: setHttpEncode( $arrConfig ['httpEncode'] );
    	} else {
    		if (isset($arrConfig['autoDetectEncodeName'])) {
    			self :: $_strAutoDetectEncodeName = $arrConfig['autoDetectEncodeName'];
    		}
    		self :: _detectHttpEncode();
    	}
        if (isset( $arrConfig ['internalEncode'] )) {
        	self :: setInternalEncode( $arrConfig ['internalEncode'] );    	
        }
        if (isset($arrConfig['encodeEngine'])) {
        	self::$_strEncodeEngine = $arrConfig['encodeEngine'];
        }
        //stripslashes
        if (get_magic_quotes_gpc()) {
            $_POST      = array_map( array('Bingo_Http_Request', '_stripslashesDeep'), $_POST );
            $_GET       = array_map( array('Bingo_Http_Request', '_stripslashesDeep'), $_GET );
            $_COOKIE    = array_map( array('Bingo_Http_Request', '_stripslashesDeep'), $_COOKIE );
            $_REQUEST   = array_map( array('Bingo_Http_Request', '_stripslashesDeep'), $_REQUEST );   
            $_SERVER    = array_map( array('Bingo_Http_Request', '_stripslashesDeep'), $_SERVER );
        }
        //编码转换    
        if (self::$_strHttpEncode != self::$_strInternalEncode) {
            //需要进行编码转换        
            require_once 'Bingo/Encode.php';
            self::$_arrGet = Bingo_Encode::convertGet($_GET, self::$_strInternalEncode, self::$_strHttpEncode, self::$_strEncodeEngine);
            self::$_arrPost = Bingo_Encode::convertPost($_POST, self::$_strInternalEncode, self::$_strHttpEncode, self::$_strEncodeEngine);
            self::$_arrCookie = Bingo_Encode::convertGet($_COOKIE, self::$_strInternalEncode, self::$_strHttpEncode, self::$_strEncodeEngine);
        } else {
            self::$_arrGet = $_GET;
            self::$_arrPost = $_POST;
            self::$_arrCookie = $_COOKIE;
        }
        self :: $_arrServer = $_SERVER;
        self :: $_boolIsInit = true;
        return true;
    }
    /**
     * 获取Request Method
     */
    public static function getMethod()
    {
        if (empty (self::$_strMethod)) {
            self::$_strMethod = strtoupper(strip_tags(trim(self::getServer('REQUEST_METHOD', self::METHOD_GET))));
        }
        return self::$_strMethod;
    }
    /**
     * 是否是POST方法
     */
    public static function isPost()
    {
        return (bool)( self::METHOD_POST == self::getMethod());
    }
    /**
     * 是否是GET方法
     */
    public static function isGet()
    {
        return (bool)( self::METHOD_GET == self::getMethod());
    }
    
    public static function setHttpRouter($strHttpRouter, $arrHttpRouter = array())
    {
    	self :: $_strHttpRouter = self :: $_strDispatchRouter = $strHttpRouter;
    	if (! empty($arrHttpRouter))self :: $_arrHttpRouter = self :: $_arrDispatchRouter = $arrHttpRouter;
    }
    public static function setDispatchRouter($strDispatchRouter)
    {
    	self :: $_strDispatchRouter = $strDispatchRouter;
    }
    public static function setArrDispathRouter($arrDispatchRouter)
    {
    	self :: $_arrDispatchRouter = $arrDispatchRouter;
    }
    public static function getDispatchRouter()
    {
    	return self :: $_strDispatchRouter;
    }
    public static function getArrDispatchRouter()
    {
    	return self :: $_arrDispatchRouter;
    }
    /**
     * 从HTTP请求中获取原始的router
     *
     * @return string
     */
    public static function getStrHttpRouter()
    {
    	return self::$_strHttpRouter;
    }
    
    public static function getArrHttpRouter()
    {
    	return self::$_arrHttpRouter;
    }
    /**
     * 设置HTTP路由中的参数，如果使用了规则路由的时候，会有用。
     * 比如说
     * url : /club/1234/thread/23456.html
     * regex : /club/:club_id/thread/:thread_id.html
     * 就可以通过Bingo_Http_Request :: getRouterParam('club_id')返回1234
     * @param arr $arrRouterParams
     */
    public static function setRouterParams($arrRouterParams)
    {
    	self::$_arrRouterParams = $arrRouterParams;
    }
    
    public static function addRouterParams($key, $value)
    {
    	self :: $_arrRouterParams[$key] = $value;
    }
    public static function emptyRouterParams()
    {
    	self :: $_arrRouterParams = array();
    }
    public static function getRouterParam( $key, $defaultValue = null )
    {
        return self::_getFromArray($key, $defaultValue, self::$_arrRouterParams);
    }
    
    public static function setParams($arrParams)
    {
    	self :: $_arrParams = $arrParams;
    }
    /**
     * 获取URL中第$intIndex的参数，比如/news-1234-pn-2.html
     * 获取第1个参数就是1234,第二个参数是pn
     *
     * @param int $intIndex
     * @param mixed $defaultValue
     * @return mixed
     */
    public static function getParamByIndex($intIndex, $defaultValue = null)
    {
    	-- $intIndex;
    	if (isset( self :: $_arrParams[ $intIndex ] )) {
    		return  self :: $_arrParams[ $intIndex ];
    	}
    	return $defaultValue;
    }
    /**
     * key value获取获取URL中的参数
     * @param $strKey
     * @param $defaultValue
     */
    public static function getParam($strKey, $defaultValue = null)
    {
    	if (is_null(self :: $_arrParamsFormat)) {
    		self :: $_arrParamsFormat = array();
    		if (! empty(self :: $_arrParams)) {
    			$_intNum = count(self::$_arrParams);
    			$_intNum --;
    			if ($_intNum > 0) {
    				for($i=0; $i < $_intNum; $i++) {
    					self :: $_arrParamsFormat[self::$_arrParams[$i]] = self::$_arrParams[$i+1];
    				}
    			}
    		} 
    	}
    	if (isset(self::$_arrParamsFormat[$strKey])) {
    		return self::$_arrParamsFormat[$strKey];
    	}
    	return $defaultValue;
    }
    /**
     * 获取所有的参数
     *
     * @return array
     */
    public static function getParams()
    {
    	return self :: $_arrParams;
    }    
    /**
     * 获取HTTP请求中的一个数据
     *
     * @param string $key
     * @param mixed $defaultValue
     * @return mixed
     */
    public static function get($key, $defaultValue=null)
    {
        if ( isset( self::$_arrGet[$key] ) ) {
            return self::$_arrGet[$key];
        } elseif ( isset( self::$_arrPost[$key] )) {
            return self::$_arrPost[$key];
        } else {
            return $defaultValue;
        }
    }
    /**
     * 获取HTTP请求中的一个数据（未转码）
     *
     * @param string $key
     * @param mixed $defaultValue
     * @return mixed
     */
    public static function getRaw($key, $defaultValue=null)
    {
        if ( isset( $_GET[$key] ) ) {
            return $_GET[$key];
        } elseif ( isset( $_POST[$key] )) {
            return $_POST[$key];
        } else {
            return $defaultValue;
        }
    }
    /**
     * 获取GET数据中的一个元素，如果不存在则返回默认值。
     * 如果$key=null，则返回整个GET数组
     *
     * @param string $key
     * @param string $defaultValue
     * @return mixed
     */
    public static function getGet($key=null, $defaultValue=null) 
    {
        self::init();
        return self::_getFromArray($key, $defaultValue, self::$_arrGet);
    }
    /**
     * 获取GET数据中的一个元素（未转码），如果不存在则返回默认值。
     * 如果$key=null，则返回整个GET数组
     *
     * @param string $key
     * @param string $defaultValue
     * @return mixed
     */
    public static function getGetRaw($key=null, $defaultValue=null) 
    {
        self::init();
        return self::_getFromArray($key, $defaultValue, $_GET);
    }
    /**
     * 获取POST数据中的一个元素，如果不存在则返回默认值。
     * 如果$key=null，则返回整个POST数组
     *
     * @param string $key
     * @param string $defaultValue
     * @return mixed
     */
    public static function getPost($key=null, $defaultValue=null) 
    {
        self::init();
        return self::_getFromArray($key, $defaultValue, self::$_arrPost);
    }
    /**
     * 获取POST数据中的一个元素（未转码），如果不存在则返回默认值。
     * 如果$key=null，则返回整个POST数组
     *
     * @param string $key
     * @param string $defaultValue
     * @return mixed
     */
    public static function getPostRaw($key=null, $defaultValue=null) 
    {
        self::init();
        return self::_getFromArray($key, $defaultValue, $_POST);
    }
    /**
     * 获取COOKIE数据中的一个元素，如果不存在则返回默认值。
     * 如果$key=null，则返回整个COOKIE数组
     *
     * @param string $key
     * @param string $defaultValue
     * @return mixed
     */
    public static function getCookie($key=null, $defaultValue=null) 
    {
        self::init();
        $value = self::_getFromArray($key, $defaultValue, self::$_arrCookie);
        if( 'BAIDUID' === strval($key) ){
            $value = trim($value,'"');
            $value = ltrim($value,'%22');
        }
        return $value;
    }
    /**
     * 获取COOKIE数据中的一个元素（未转码），如果不存在则返回默认值。
     * 如果$key=null，则返回整个COOKIE数组
     *
     * @param string $key
     * @param string $defaultValue
     * @return mixed
     */
    public static function getCookieRaw($key=null, $defaultValue=null) 
    {
        self::init();
        $value = self::_getFromArray($key, $defaultValue, $_COOKIE);
        if( 'BAIDUID' === strval($key) ){
            $value = trim($value,'"');
        }
        return $value;
    }
    
    public static function getServer($key=null, $defaultValue=null)
    {
        self::init();
    	return self::_getFromArray($key, $defaultValue, self::$_arrServer);
    }
    
    private static function _getFromArray($key, $defaultValue, $array)
    {
        if (is_null($key)) {
            return $array;
        } elseif (isset($array[$key])) {
            return $array[$key];
        } else {
            return $defaultValue;
        }
    }
    /**
     * 对数组里面每一个元素都调用stripslashes
     *
     * @param mixed $value
     * @return mixed
     */
    private static function _stripslashesDeep($value)
    {
        $value = is_array($value) ? array_map(array('Bingo_Http_Request', '_stripslashesDeep'), $value) : stripslashes($value);            
        return $value;
    }
    /**
     * 检测HTTP的编码方式
     *
     */
    private static function _detectHttpEncode()
    {
        if (self::$_boolHttpEncodeHasDetect) return true;
        $strEncode = '';
        if (isset($_GET[self::$_strAutoDetectEncodeName])) {
            $strEncode = $_GET[self::$_strAutoDetectEncodeName];            
        } elseif (isset($_POST[self::$_strAutoDetectEncodeName])) {
            $strEncode = $_POST[self::$_strAutoDetectEncodeName];
        }
        if (! empty($strEncode)) {
            self::$_strHttpEncode = strtolower(trim(strip_tags($strEncode)));
        }
    }
    
    public static function arrayFilterEmpty($arrInput)
    {
    	$arrOutput = array();
		if (! empty($arrInput)) {
			foreach ($arrInput as $_strNode) {
				if (trim($_strNode) === '') {
					
				} else {
					$arrOutput[] = $_strNode;
				}
			}
		}
		return $arrOutput;
    }
}
