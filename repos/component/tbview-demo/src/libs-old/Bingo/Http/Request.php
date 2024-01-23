<?php
/**
 * http request������http�����������ݣ�����GET POST COOKIE URL_PARSE
 * �������е����ݶ���������Ӧ�ı���ת��������
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
     * ���ñ��뷽ʽ���ֶ�����
     *
     */
    protected static $_strAutoDetectEncodeName = 'ie';
    /**
     * http��������ı��뷽ʽ
     *
     * @var string:utf-8/gbk
     */
    protected static $_strHttpEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/;
    /**
     * �ڲ�������뷽ʽ
     *
     * @var string:utf-8/gbk
     */
    protected static $_strInternalEncode = BINGO_ENCODE_LANG/*UTF8DIFF*/;
    /**
     * ���б���ת���Ŀ⣬����ѡ��uconv����mb_string
     * ����ο�Bingo_Encode����
     *
     * @var string
     */
    protected static $_strEncodeEngine = 'uconv';
    /**
     * $_GET��������ݣ����ַ���������˴���
     *
     * @var array
     */
    protected static $_arrGet = array();
    /**
     * $_POST��������ݣ����ַ����붼�����˴���
     *
     * @var array
     */
    protected static $_arrPost = array();
    /**
     * $_COOKIE��������ݣ����ַ���������˴���
     *
     * @var array
     */
    protected static $_arrCookie = array();
    /**
     * $_SERVER��������ݣ����ַ���������˴���
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
     * ����dispatch��router
     * @var unknown_type
     */
    protected static $_strDispatchRouter = '';
    protected static $_arrDispatchRouter = array();
    /**
     * router�еĲ�������
     *
     * @var array
     */
    protected static $_arrRouterParams = array();
    protected static $_arrDict = array();
    /**
     * URL�в�������
     *
     * @var array
     */
    protected static $_arrParams = array();
    protected static $_arrParamsFormat = null;
    protected static $_strMethod = '';
    private static $_boolHttpEncodeHasDetect = false;//�Ƿ����HTTP�������͵ļ��
    private static $_boolIsInit = false;//�Ƿ��Ѿ���ʼ��
    /**
     * ��Dict�л�ȡ����
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
     * �������ݵ�Dict��ȥ
     * @param unknown_type $strKey
     * @param unknown_type $mixValue
     */
    public static function setDict($strKey, $mixValue)
    {
        self::$_arrDict[$strKey] = $mixValue;
    }
    /**
     * ����HTTP�ı����ʽ�����ñ�������init�����ĵ���
     *
     * @param string $_strHttpEncode
     */
    public static function setHttpEncode($_strHttpEncode) 
    {
        self::$_strHttpEncode = $_strHttpEncode;
        self::$_boolHttpEncodeHasDetect = TRUE;
    }
    /**
     * �����ڲ������ʽ�����ñ�������init�����ĵ���
     *
     * @param string $_strInternalEncode
     */
    public static function setInternalEncode($_strInternalEncode)
    {
        self::$_strInternalEncode = $_strInternalEncode;
    }
    /**
     * ��ʼ����ʹ��httpRequest���������ȵ������������
     * ��ɱ����⼰����ת��������
     * @param array $arrConfig
     * {
     * 		httpEncode : string
     * 		internalEncode : string
     * 		autoDetectEncodeName : string
     * 		encodeEngine : string (uconv ����mb_string)
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
        //����ת��    
        if (self::$_strHttpEncode != self::$_strInternalEncode) {
            //��Ҫ���б���ת��        
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
     * ��ȡRequest Method
     */
    public static function getMethod()
    {
        if (empty (self::$_strMethod)) {
            self::$_strMethod = strtoupper(strip_tags(trim(self::getServer('REQUEST_METHOD', self::METHOD_GET))));
        }
        return self::$_strMethod;
    }
    /**
     * �Ƿ���POST����
     */
    public static function isPost()
    {
        return (bool)( self::METHOD_POST == self::getMethod());
    }
    /**
     * �Ƿ���GET����
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
     * ��HTTP�����л�ȡԭʼ��router
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
     * ����HTTP·���еĲ��������ʹ���˹���·�ɵ�ʱ�򣬻����á�
     * ����˵
     * url : /club/1234/thread/23456.html
     * regex : /club/:club_id/thread/:thread_id.html
     * �Ϳ���ͨ��Bingo_Http_Request :: getRouterParam('club_id')����1234
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
     * ��ȡURL�е�$intIndex�Ĳ���������/news-1234-pn-2.html
     * ��ȡ��1����������1234,�ڶ���������pn
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
     * key value��ȡ��ȡURL�еĲ���
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
     * ��ȡ���еĲ���
     *
     * @return array
     */
    public static function getParams()
    {
    	return self :: $_arrParams;
    }    
    /**
     * ��ȡHTTP�����е�һ������
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
     * ��ȡHTTP�����е�һ�����ݣ�δת�룩
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
     * ��ȡGET�����е�һ��Ԫ�أ�����������򷵻�Ĭ��ֵ��
     * ���$key=null���򷵻�����GET����
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
     * ��ȡGET�����е�һ��Ԫ�أ�δת�룩������������򷵻�Ĭ��ֵ��
     * ���$key=null���򷵻�����GET����
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
     * ��ȡPOST�����е�һ��Ԫ�أ�����������򷵻�Ĭ��ֵ��
     * ���$key=null���򷵻�����POST����
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
     * ��ȡPOST�����е�һ��Ԫ�أ�δת�룩������������򷵻�Ĭ��ֵ��
     * ���$key=null���򷵻�����POST����
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
     * ��ȡCOOKIE�����е�һ��Ԫ�أ�����������򷵻�Ĭ��ֵ��
     * ���$key=null���򷵻�����COOKIE����
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
     * ��ȡCOOKIE�����е�һ��Ԫ�أ�δת�룩������������򷵻�Ĭ��ֵ��
     * ���$key=null���򷵻�����COOKIE����
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
     * ����������ÿһ��Ԫ�ض�����stripslashes
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
     * ���HTTP�ı��뷽ʽ
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
