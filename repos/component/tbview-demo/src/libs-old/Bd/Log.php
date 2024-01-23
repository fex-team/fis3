<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * $Id: Log.php,v 1.3 2011/01/21 12:05:28 liushi Exp $ 
 * $Id: Log.php,v 1.4 2011/03/21 12:05:28 chenqiuwu Inf $ 
 * 
 **************************************************************************/

/**
 * @file Log.php
 * @author zhujt(zhujianting@baidu.com)
 * @date 2009/08/04 10:31:44
 * @version $Revision: 1.2 $ 
 * @brief class for logging
 *  
 **/


/*********************************************
 * format string 格式，取自lighttpd文档
 * 前面标记 - 代表ODP的Log库不支持
 * 行为不一致的，均有注释说明
 * 后面的 === 之后的，是ODP Log库扩展的功能
  ====== ================================
  Option Description
  ====== ================================
  %%     a percent sign
  %h     name or address of remote-host
  -%l     ident name (not supported)
  -%u     authenticated user
  %t     timestamp of the end-time of the request //param, show current time, param specifies strftime format
  -%r     request-line 
  -%s     status code 
  -%b     bytes sent for the body
  %i     HTTP-header field //param
  %a     remote address
  %A     local address
  -%B     same as %b
  %C     cookie field (not supported) //param
  %D     time used in ms
  %e     environment variable //param
  %f     physical filename
  %H     request protocol (HTTP/1.0, ...)
  %m     request method (GET, POST, ...)
  -%n     (not supported)
  -%o     `response header`_
  %p     server port
  -%P     (not supported)
  %q     query string
  %T     time used in seconds //support param, s, ms, us, default to s
  %U     request URL
  %v     server-name
  %V     HTTP request host name
  -%X     connection status
  -%I     bytes incomming
  -%O     bytes outgoing
  ====== ================================
  %L     Log level
  %N     line number
  %E     err_no
  %l     log_id
  %u     user
  %S     strArray, support param, takes a key and removes the key from %S
  %M     error message
  %x     ODP extension, supports various param, like log_level, line_number etc.

  currently supported param for %x:
  log_level, line, class, function, err_no, err_msg, log_id, app, function_param, argv, encoded_str_array

  in %x, prepend u_ to key to urlencode before its value
*************************************************/
class Bd_Log
{
    const LOG_LEVEL_FATAL   = 0x01;
    const LOG_LEVEL_WARNING = 0x02;
    const LOG_LEVEL_NOTICE  = 0x04;
    const LOG_LEVEL_TRACE   = 0x08;
    const LOG_LEVEL_DEBUG   = 0x10;

    public static $arrLogLevels = array(
        self::LOG_LEVEL_FATAL   => 'FATAL',
        self::LOG_LEVEL_WARNING => 'WARNING',
        self::LOG_LEVEL_NOTICE  => 'NOTICE',
        self::LOG_LEVEL_TRACE    => 'TRACE',
        self::LOG_LEVEL_DEBUG   => 'DEBUG',
    );

    protected $intLevel;
    protected $strLogFile;
    protected $bolAutoRotate;
    protected $addNotice = array();

    private static $arrInstance = array();
    public static $current_instance;

	private static $bolIsOmp    = null;
	private static $strLogPath  = null;
	private static $strDataPath = null;

    const DEFAULT_FORMAT = '%L: %t [%f:%N] errno[%E] logId[%l] uri[%U] user[%u] refer[%{referer}i] cookie[%{cookie}i] %S %M';
    const DEFAULT_FORMAT_STD = '%L: %{%m-%d %H:%M:%S}t %{app}x * %{pid}x [logid=%l filename=%f lineno=%N errno=%{err_no}x %{encoded_str_array}x errmsg=%{u_err_msg}x]';

    private function __construct($arrLogConfig)
    {
        $this->intLevel         = $arrLogConfig['level'];
        $this->bolAutoRotate    = $arrLogConfig['auto_rotate'];
        $this->strLogFile       = $arrLogConfig['log_file'];
        $this->strFormat        = $arrLogConfig['format']; 
        $this->strFormatWF      = $arrLogConfig['format_wf'];
	}

	/**
	 * @brief ODP环境下日志的前缀为AppName，非ODP环境需要配置指定前缀
	 *
	 * @return  public static function 
	 * @retval   
	 * @see 
	 * @note 
	 * @author luhaixia
	 * @date 2012/07/31 17:10:32
	**/
	public static function getLogPrefix(){
		if(defined('IS_ODP') && IS_ODP == true){
			return Bd_AppEnv::getCurrApp();
		}else{
			if(defined('MODULE')){
				return MODULE;
			}else{
				return 'unknow';
			}
		}
	}

	/**
	 * @brief 日志打印的根目录
	 *
	 * @return  public static function 
	 * @retval   
	 * @see 
	 * @note 
	 * @author luhaixia
	 * @date 2012/07/31 17:15:59
	**/
	public static function getLogPath(){
		if(defined('IS_ODP') && IS_ODP == true){
			return LOG_PATH;
		}else{
			if(self::$strLogPath == null){
				$ret = Bd_Conf::getConf('/log/log_path');
				if(false !== $ret){
					self::$strLogPath = $ret;
				}else{
					self::$strLogPath = './';
				}
			}
			return self::$strLogPath;
		}

	}

	/**
	 * @brief 日志库依赖的数据文件根目录
	 *
	 * @return  public static function 
	 * @retval   
	 * @see 
	 * @note 
	 * @author luhaixia
	 * @date 2012/07/31 17:16:30
	**/
	public static function getDataPath(){
		if(defined('IS_ODP') && IS_ODP == true){
			return DATA_PATH;
		}else{
			if(self::$strDataPath == null){
				$ret = Bd_Conf::getConf('/log/data_path');
				if(false !== $ret){
					self::$strDataPath = $ret;
				}else{
					self::$strDataPath =  "./";
				}
			}
			return self::$strDataPath;
		}

	}

	/**
	 * @brief 是否打印omp日志
	 *
	 * @return  public static function 
	 * @retval   
	 * @see 
	 * @note 
	 * @author luhaixia
	 * @date 2012/08/09 20:25:18
	**/
	public static function isOMP(){
		if(self::$bolIsOmp == null){
			$ret = Bd_Conf::getConf('/log/is_omp');
			if(false !== $ret && $ret <= 2 && $ret >= 0){
				self::$bolIsOmp = intval($ret);
			}else{
				self::$bolIsOmp = 0;
			}
		}
		return self::$bolIsOmp;
	}

    // 获取指定App的log对象，默认为当前App
    public static function getInstance($app = null)
    {
        if(empty($app))
		{
			$app = self::getLogPrefix();
        }

        if(empty(self::$arrInstance[$app]))
        {
			$g_log_conf = Bd_Conf::getConf('/log/');
            $app_log_conf = Bd_Conf::getAppConf('log', $app);

            // app配置优先
            if(is_array($app_log_conf))
            {
                $g_log_conf = array_merge($g_log_conf, $app_log_conf);
            }

            // 生成路径
			$logPath = self::getLogPath();
            if($g_log_conf['use_sub_dir'] == "1")
            {
                if(!is_dir($logPath."/$app"))
                {
                    @mkdir($logPath."/$app");
                }
                $log_file = $logPath."/$app/$app.log";
            }
            else
            {
                $log_file = $logPath."/$app.log";
            }

            //get log format
            if (isset($g_log_conf['format'])) {
                $format = $g_log_conf['format'];
            } else {
                $format = self::DEFAULT_FORMAT;
            }

            if (isset($g_log_conf['format_wf'])) {
                $format_wf = $g_log_conf['format_wf'];
            } else {
                $format_wf = $format;
            }

            $log_conf = array(
                'level'         => intval($g_log_conf['level']),
                'auto_rotate'   => ($g_log_conf['auto_rotate'] == '1'),
                'log_file'      => $log_file,
                'format'        => $format,
                'format_wf'     => $format_wf,
            );

            self::$arrInstance[$app] = new Bd_Log($log_conf);
        }

        return self::$arrInstance[$app];
    }

    public static function debug($str, $errno = 0, $arrArgs = null, $depth = 0)
    {
		
		if(self::isOMP() == 0 || self::isOMP() == 1){
			$ret = self::getInstance()->writeLog(self::LOG_LEVEL_DEBUG, $str, $errno, $arrArgs, $depth + 1, '.new', self::DEFAULT_FORMAT_STD);
		}
		if(self::isOMP() == 0 || self::isOMP() == 2){
			$ret = self::getInstance()->writeLog(self::LOG_LEVEL_DEBUG, $str, $errno, $arrArgs, $depth + 1);
		}
		return $ret;
	}

	public static function trace($str, $errno = 0, $arrArgs = null, $depth = 0)
	{
		if(self::isOMP() == 0 || self::isOMP() == 1){
		    $ret = self::getInstance()->writeLog(self::LOG_LEVEL_TRACE, $str, $errno, $arrArgs, $depth + 1, '.new', self::DEFAULT_FORMAT_STD);
		}
		if(self::isOMP() == 0 || self::isOMP() == 2){
	 		$ret = self::getInstance()->writeLog(self::LOG_LEVEL_TRACE, $str, $errno, $arrArgs, $depth + 1);
		}
		return $ret;
	}

	public static function notice($str, $errno = 0, $arrArgs = null, $depth = 0)
	{
		if(self::isOMP() == 0 || self::isOMP() == 1){
			$ret = self::getInstance()->writeLog(self::LOG_LEVEL_NOTICE, $str, $errno, $arrArgs, $depth + 1, '.new', self::DEFAULT_FORMAT_STD);
		}
		if(self::isOMP() == 0 || self::isOMP() == 2){
			$ret = self::getInstance()->writeLog(self::LOG_LEVEL_NOTICE, $str, $errno, $arrArgs, $depth + 1);
		}
	}

	public static function warning($str, $errno = 0, $arrArgs = null, $depth = 0)
	{
		if(self::isOMP() == 0 || self::isOMP() == 1){
			$ret = self::getInstance()->writeLog(self::LOG_LEVEL_WARNING, $str, $errno, $arrArgs, $depth + 1, '.new', self::DEFAULT_FORMAT_STD);
		}
		if(self::isOMP() == 0 || self::isOMP() == 2){
			$ret = self::getInstance()->writeLog(self::LOG_LEVEL_WARNING, $str, $errno, $arrArgs, $depth + 1);
		}
	}

	public static function fatal($str, $errno = 0, $arrArgs = null, $depth = 0)
	{
		if(self::isOMP() == 0 || self::isOMP() == 1){
			$ret = self::getInstance()->writeLog(self::LOG_LEVEL_FATAL, $str, $errno, $arrArgs, $depth + 1, '.new', self::DEFAULT_FORMAT_STD);
		}
		if(self::isOMP() == 0 || self::isOMP() == 2){
			$ret = self::getInstance()->writeLog(self::LOG_LEVEL_FATAL, $str, $errno, $arrArgs, $depth + 1);
		}
	}

	public static function addNotice($key, $value)
	{
		$log = self::getInstance();

        if(!isset($value)) {
            $value = $key;
            $key = '@';
        }

        $info = is_array($value) ? strtr(strtr(var_export($value, true), 
        array("  array (\n"=>'{', "array (\n"=>'{', ' => '=> ':',",\n"=> ',',)), 
        array('{  '=> '{', ":\n{"=>':{', '  ),  ' => '},', '),' => '},', ',)'=>'}', ',  '=>',',))
        : $value;
        $log->addNotice[$key] = $info;
    }

    // 生成logid
    public static function genLogID()
    {
		if(defined('LOG_ID')){
			return LOG_ID;
		}
		if(getenv('HTTP_X_BD_LOGID')){
			define('LOG_ID', trim(getenv('HTTP_X_BD_LOGID')));
		}elseif(isset($_REQUEST['logid'])){
			define('LOG_ID', intval($_REQUEST['logid']));
		}else{
       		$arr = gettimeofday();
        	$logId = ((($arr['sec']*100000 + $arr['usec']/10) & 0x7FFFFFFF) | 0x80000000);
			define('LOG_ID', $logId);
		}
		return LOG_ID;
	}

    // 获取客户端ip
    public static function getClientIp()
    {
        return Bd_Ip::getClientIp();
    }

    private function writeLog($intLevel, $str, $errno = 0, $arrArgs = null, $depth = 0, $filename_suffix = '', $log_format = null)
    {
        if( $intLevel > $this->intLevel || !isset(self::$arrLogLevels[$intLevel]) )
        {
            return;
        }

        //log file name
        $strLogFile = $this->strLogFile;
        if( ($intLevel & self::LOG_LEVEL_WARNING) || ($intLevel & self::LOG_LEVEL_FATAL) )
        {
            $strLogFile .= '.wf';
        }

        $strLogFile .= $filename_suffix;

        //assign data required
        $this->current_log_level = self::$arrLogLevels[$intLevel];

        //build array for use as strargs
        $_arr_args = false;
        $_add_notice = false;
        if (is_array($arrArgs) && count($arrArgs) > 0) {
            $_arr_args = true;
        }
        if (!empty($this->addNotice)) {
            $_add_notice = true;
        }

        if ($_arr_args && $_add_notice) { //both are defined, merge
            $this->current_args = $arrArgs + $this->addNotice;
        } else if (!$_arr_args && $_add_notice) { //only add notice
            $this->current_args = $this->addNotice;
        } else if ($_arr_args && !$_add_notice) { //only arr args
            $this->current_args = $arrArgs;
        } else { //empty
            $this->current_args = array();
        }

        $this->current_err_no = $errno;
        $this->current_err_msg = $str;
        $trace = debug_backtrace();
        $depth2 = $depth + 1;
        if( $depth >= count($trace) )
        {
            $depth = count($trace) - 1;
            $depth2 = $depth;
        }
		$this->current_file = isset( $trace[$depth]['file'] ) 
			                  ? $trace[$depth]['file'] : "" ;
		$this->current_line = isset( $trace[$depth]['line'] ) 
			                  ? $trace[$depth]['line'] : "";
		$this->current_function = isset( $trace[$depth2]['function'] ) 
			                      ? $trace[$depth2]['function'] : "";
		$this->current_class = isset( $trace[$depth2]['class'] ) 
			                   ? $trace[$depth2]['class'] : "" ; 
		$this->current_function_param = isset( $trace[$depth2]['args'] ) 
			                            ? $trace[$depth2]['args'] : "";

        self::$current_instance = $this;

        //get the format
        if ($log_format == null)
            $format = $this->getFormat($intLevel);
        else
            $format = $log_format;
        $str = $this->getLogString($format);

        if($this->bolAutoRotate)
        {
            $strLogFile .= '.'.date('YmdH');
        }

        return file_put_contents($strLogFile, $str, FILE_APPEND);
    }

    // added support for self define format
    private function getFormat($level) {
        if ($level == self::LOG_LEVEL_FATAL || $level == self::LOG_LEVEL_WARNING) {
            $fmtstr = $this->strFormatWF;
        } else {
            $fmtstr = $this->strFormat;
        }
        return $fmtstr;
    }
    public function getLogString($format) {
        $md5val = md5($format);
        $func = "_bd_log_$md5val";
        if (function_exists($func)) {
            return $func();
        }
		$dataPath = self::getDataPath();
        $filename = $dataPath . '/log/'.$md5val.'.php';
        if (!file_exists($filename)) {
            $tmp_filename = $filename . '.' . posix_getpid() . '.' . rand();
            if (!is_dir($dataPath . '/log')) {
                @mkdir($dataPath . '/log');
            }
            file_put_contents($tmp_filename, $this->parseFormat($format));
            rename($tmp_filename, $filename);
        }
        include_once($filename);
        $str = $func();

        return $str;
    }
    // parse format and generate code
    public function parseFormat($format) {
        $matches = array();
        $regex = '/%(?:{([^}]*)})?(.)/';
        preg_match_all($regex, $format, $matches);
        $prelim = array();
        $action = array();
        $prelim_done = array();
        
        $len = count($matches[0]);
        for($i = 0; $i < $len; $i++) {
            $code = $matches[2][$i];
            $param = $matches[1][$i];
            switch($code) {
            case 'h':
                $action[] = "(defined('CLIENT_IP')? CLIENT_IP : Bd_Log::getClientIp())";
                break;
            case 't':
                $action[] = ($param == '')? "strftime('%y-%m-%d %H:%M:%S')" : "strftime(" . var_export($param, true) . ")";
                break;
            case 'i':
                $key = 'HTTP_' . str_replace('-', '_', strtoupper($param));
                $key = var_export($key, true);
                $action[] = "(isset(\$_SERVER[$key])? \$_SERVER[$key] : '')";
                break;
            case 'a':
                $action[] = "(defined('CLIENT_IP')? CLIENT_IP : Bd_Log::getClientIp())";
                break;
            case 'A':
                $action[] = "(isset(\$_SERVER['SERVER_ADDR'])? \$_SERVER['SERVER_ADDR'] : '')";
                break;
            case 'C':
                if ($param == '') {
                    $action[] = "(isset(\$_SERVER['HTTP_COOKIE'])? \$_SERVER['HTTP_COOKIE'] : '')";
                } else {
                    $param = var_export($param, true);
                    $action[] = "(isset(\$_COOKIE[$param])? \$_COOKIE[$param] : '')";
                }
                break;
            case 'D':
                $action[] = "(defined('REQUEST_TIME_US')? (microtime(true) * 1000 - REQUEST_TIME_US/1000) : '')";
                break;
            case 'e':
                $param = var_export($param, true);
                $action[] = "((getenv($param) !== false)? getenv($param) : '')";
                break;
            case 'f':
                $action[] = 'Bd_Log::$current_instance->current_file';
                break;
            case 'H':
                $action[] = "(isset(\$_SERVER['SERVER_PROTOCOL'])? \$_SERVER['SERVER_PROTOCOL'] : '')";
                break;
            case 'm':
                $action[] = "(isset(\$_SERVER['REQUEST_METHOD'])? \$_SERVER['REQUEST_METHOD'] : '')";
                break;
            case 'p':
                $action[] = "(isset(\$_SERVER['SERVER_PORT'])? \$_SERVER['SERVER_PORT'] : '')";
                break;
            case 'q':
                $action[] = "(isset(\$_SERVER['QUERY_STRING'])? \$_SERVER['QUERY_STRING'] : '')";
                break;
            case 'T':
                switch($param) {
                case 'ms':
                    $action[] = "(defined('REQUEST_TIME_US')? (microtime(true) * 1000 - REQUEST_TIME_US/1000) : '')";
                    break;
                case 'us':
                    $action[] = "(defined('REQUEST_TIME_US')? (microtime(true) * 1000000 - REQUEST_TIME_US) : '')";
                    break;
                default:
                    $action[] = "(defined('REQUEST_TIME_US')? (microtime(true) - REQUEST_TIME_US/1000000) : '')";
                }
                break;
            case 'U':
                $action[] = "(isset(\$_SERVER['REQUEST_URI'])? \$_SERVER['REQUEST_URI'] : '')";
                break;
            case 'v':
                $action[] = "(isset(\$_SERVER['HOSTNAME'])? \$_SERVER['HOSTNAME'] : '')";
                break;
            case 'V':
                $action[] = "(isset(\$_SERVER['HTTP_HOST'])? \$_SERVER['HTTP_HOST'] : '')";
                break;

            case 'L':
                $action[] = 'Bd_Log::$current_instance->current_log_level';
                break;
            case 'N':
                $action[] = 'Bd_Log::$current_instance->current_line';
                break;
            case 'E':
                $action[] = 'Bd_Log::$current_instance->current_err_no';
                break;
            case 'l':
                $action[] = "Bd_Log::genLogID()";
                break;
            case 'u':
                if (!isset($prelim_done['user'])) {
                    $prelim[] = '$____user____ = Bd_Passport::getUserInfoFromCookie();';
                    $prelim_done['user'] = true;
                }
                $action[] = "((defined('CLIENT_IP') ? CLIENT_IP: Bd_Log::getClientIp()) . ' ' . \$____user____['uid'] . ' ' . \$____user____['uname'])";
                break;
            case 'S':
                if ($param == '') {
                    $action[] = 'Bd_Log::$current_instance->get_str_args()';
                } else {
                    $param_name = var_export($param, true);
                    if (!isset($prelim_done['S_'.$param_name])) {
                        $prelim[] = 
                            "if (isset(Bd_Log::\$current_instance->current_args[$param_name])) {
                            \$____curargs____[$param_name] = Bd_Log::\$current_instance->current_args[$param_name];
                            unset(Bd_Log::\$current_instance->current_args[$param_name]);
                        } else \$____curargs____[$param_name] = '';";
                        $prelim_done['S_'.$param_name] = true;
                    }
                    $action[] = "\$____curargs____[$param_name]";
                }
                break;
            case 'M':
                $action[] = 'Bd_Log::$current_instance->current_err_msg';
                break;
            case 'x':
                $need_urlencode = false;
                if (substr($param, 0, 2) == 'u_') {
                    $need_urlencode = true;
                    $param = substr($param, 2);
                }
                switch($param) {
                case 'log_level':
                case 'line':
                case 'class':
                case 'function':
                case 'err_no':
                case 'err_msg':
                    $action[] = 'Bd_Log::$current_instance->current_'.$param;
                    break;
                case 'log_id':
                    $action[] = "Bd_Log::genLogID()";
                    break;
                case 'app':
                    $action[] = "Bd_Log::getLogPrefix()";
                    break;
                case 'function_param':
                    $action[] = 'Bd_Log::flattenArgs(Bd_Log::$current_instance->current_function_param)';
                    break;
                case 'argv':
                    $action[] = '(isset($GLOBALS["argv"])? Bd_Log::flattenArgs($GLOBALS["argv"]) : \'\')';
                    break;
                case 'pid':
                    $action[] = 'posix_getpid()';
                    break;
                case 'encoded_str_array':
                    $action[] = 'Bd_Log::$current_instance->get_str_args_std()';
                    break;
                default:
                    $action[] = "''";
                }
                if ($need_urlencode) {
                    $action_len = count($action);
                    $action[$action_len-1] = 'rawurlencode(' . $action[$action_len-1] . ')';
                }
                break;
            case '%':
                $action[] =  "'%'";
                break;
            default:
                $action[] = "''";
            }
        }

        $strformat = preg_split($regex, $format);
        $code = var_export($strformat[0], true);
        for($i = 1; $i < count($strformat); $i++) {
            $code = $code . ' . ' . $action[$i-1] . ' . ' . var_export($strformat[$i], true);
        }
        $code .=  ' . "\n"';
        $pre = implode("\n", $prelim);

        $cmt = "Used for app " . self::getLogPrefix() . "\n";
        $cmt .= "Original format string: " . str_replace('*/', '* /', $format);

        $md5val = md5($format);
        $func = "_bd_log_$md5val";
        $str = "<?php \n/*\n$cmt\n*/\nfunction $func() {\n$pre\nreturn $code;\n}";
        return $str;
    }

    //helper functions for use in generated code
    public static function flattenArgs($args) {
        if (!is_array($args)) return '';
        $str = array();
        foreach($args as $a) {
            $str[] = preg_replace('/[ \n\t]+/', " ", $a);
        }
        return implode(', ', $str);
    }

    public function get_str_args() {
        $strArgs = '';
        foreach($this->current_args as $k=>$v){
            $strArgs .= ' '.$k.'['.$v.']';
        }
        return $strArgs;
    }

    //ORP Log Specification
    public function get_str_args_std() {
        $args = array();
        foreach($this->current_args as $k=>$v){
            $args[] = rawurlencode($k).'='.rawurlencode($v);
        }
        return implode(' ', $args);
    }
}
