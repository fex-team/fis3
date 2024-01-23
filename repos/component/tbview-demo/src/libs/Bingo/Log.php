<?php
/**
 * Log
 * 目前只支持file。后续考虑支持db,netcomlog等等
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-26
 * @package Bingo
 *
 */
require_once('Bd/Ip.php');
require_once('Bd/Conf.php');
require_once('Bd/Log.php');
require_once('Bd/Omp.php');
class Bingo_Log
{
    /**
     * none
     * @var int
     */
    const LOG_NONE      = 0x00;
    /**
     * Fatal
     * @var int
     */
    const LOG_FATAL     = 0x01;
    /**
     * Warning 
     * @var int
     */
    const LOG_WARNING    = 0x02;
    /**
     * notice
     * @var int
     */
    const LOG_NOTICE    = 0x04;
    /**
     * trace
     * @var int
     */
    const LOG_TRACE        = 0x08;
    /**
     * debug
     * @var int
     */
    const LOG_DEBUG        = 0x10;
    /**
     * all
     * @var int
     */
    const LOG_ALL        = 0xFF;
    /**
     * level to text
     * @var array
     */
    public static $arrLogNames = array(
        self::LOG_FATAL     => 'FATAL',
        self::LOG_WARNING    => 'WARNING',
        self::LOG_NOTICE    => 'NOTICE',
        self::LOG_TRACE        => 'TRACE',
        self::LOG_DEBUG        => 'DEBUG',
    );
    /**
     * module => obj log
     * @var array
     */
    protected static $_arrLogs = array();
    
    protected static $_strDefaultModule = '';
    
    protected static $_intLogId = 0;
    
    protected static $_arrNoticeNodes = array();
    
    protected static $_objOMP = null;
    
    protected static $_openOMP = false;
    
    public static function setModeName($mode_name){
        if(self::$_objOMP !== null ){
            self::$_objOMP->setModuleName($mode_name);
        }
    }
    
    /**
     * 初始化
     * @param array $arrConfig
     * {
     *         module => array(
     *             'file' => '',
     *             'level' => 0xFF,
      *         )
     * }
     * @param string $strDefaultModule
     */
    public static function init($arrConfig=array(), $strDefaultModule='',$ompConfig=false)
    {
        if (! empty($arrConfig)) {
            require_once 'Bingo/Log/File.php';
            foreach ($arrConfig as $_strModule => $_arrConf) {
                if (isset($_arrConf['file'])) {
                    $_intLevel = 0xFF;
                    if (isset($_arrConf['level'])) $_intLevel = intval($_arrConf['level']);
                    //self::addModule($_strModule, new Bingo_Log_File($_arrConf['file'], $_intLevel));
                    self::$_arrLogs[$_strModule] = new Bingo_Log_File($_arrConf['file'], $_intLevel, $_strModule);
                }
            }
        }
        self::$_strDefaultModule = $strDefaultModule;
        
        
        //判断是否开启OMP
        self::$_openOMP = false;
        if($ompConfig === false ){
           $autoOpen = intval(Bd_Conf::getConf('/log/tieba_auto_open_omp'));
           if($autoOpen === 1){
               self::$_openOMP = true;
           }
        }else{
           self::$_openOMP = true;
        }
        
        //OMP设置
        if( self::$_openOMP === true ){
           //1、logid生成、设置
            $intLogId = self::getLogId();
            if (function_exists('camel_set_logid')) {
                camel_set_logid($intLogId);
            }
            if(! defined('REQUEST_ID')){
               define('REQUEST_ID',$intLogId);
            }
            if(! defined('LOGID')){
               define('LOGID',$intLogId);
            }
            
               //初始化OMP
            $model_name = null;
            if(isset($ompConfig['model_name'])){
                $model_name = $ompConfig['model_name'];
            }elseif (defined('MODULE_NAME') ){
                $model_name = MODULE_NAME;
            }elseif (defined('MODULE') ){
                $model_name = MODULE;
            }
            self::$_objOMP = new Bd_Omp($model_name);
            if(self::$_objOMP !== null ){
                self::$_objOMP->start();
            }
         }
        //end OMP配置
    }
    
    public static function pushNotice($strKey, $strValue)
    {
        self::$_arrNoticeNodes[strval($strKey)] = strval($strValue);
        Bd_Log::addNotice($strKey,$strValue);
    }
    
    public static function buildNotice($strOtherLog='', $strModule='', $strFile='', $intLine=0, $intTraceLevel=0)
    {
        $strLog = '';
        if (! empty(self::$_arrNoticeNodes)) {
            foreach (self::$_arrNoticeNodes as $strKey=>$strValue) {
                $strLog .= $strKey . '=' . $strValue . ' ';
            }
        }
        $strLog .= $strOtherLog;
        if(self::$_openOMP === true){
           if(self::$_objOMP !== null ){
               self::$_objOMP -> stop();//notice时，进行OMP的结束操作
           }
           Bd_Log::notice('',0,null,1);
        }
        return self::_log(self::LOG_NOTICE, $strLog, $strModule, $strFile, $intLine, $intTraceLevel);
    }
    
    public static function getNoticeNods()
    {
        return self::$_arrNoticeNodes;
    }
    public static function getNoticeNodes()
    {
        return self::$_arrNoticeNodes;
    }
    
    public static function getLogId()
    {
        if (empty(self::$_intLogId)) {
            if (isset($_SERVER['LOGID'])) {
                self::$_intLogId = intval($_SERVER['LOGID']);
            } elseif(getenv('HTTP_X_BD_LOGID')){
                self::$_intLogId = intval(trim(getenv('HTTP_X_BD_LOGID')));
            } elseif (defined('REQUEST_ID')) {
                self::$_intLogId = REQUEST_ID;
            } elseif(defined('LOG_ID')){
                self::$_intLogId = defined('LOG_ID');
            } else {
                $requestTime = gettimeofday();
                self::$_intLogId = intval($requestTime['sec'] * 100000 + $requestTime['usec'] / 10) & 0x7FFFFFFF;
            }
        }
        return self::$_intLogId;
    }
    
    public static function addModule($strModule, $objLog) 
    {
        self::$_arrLogs[$strModule] = $objLog;
    }
    
    public static function getModule($strModule='') 
    {
        if ($strModule === false) {
            //说明完全是关闭log的，方便在其他的库类使用。
            return false;
        } 
        if (empty($strModule)) $strModule = self::$_strDefaultModule;
        if (isset(self::$_arrLogs[$strModule])) {
            return self::$_arrLogs[$strModule];
        }
        return false;
    }
    
    /*
        所有日志函数新增的$extra变量仅用于ORP日志规范统一中向后兼容以前的ub_log / MyLog
        "不要"用来传递额外字段
        notice 应尽量使用buildNotice，通过pushNotice来添加字段
    */
    public static function fatal($strLog, $strModule='', $strFile='', $intLine=0, $intTraceLevel=0, $extra = array())
    {
        //OMP 日志打印
        if(self::$_openOMP === true){
            Bd_Log::fatal($strLog,0,null,1);
        }
        return self::_log(self::LOG_FATAL, $strLog, $strModule, $strFile, $intLine, $intTraceLevel, $extra);
    }
    
    public static function warning($strLog, $strModule='', $strFile='', $intLine=0, $intTraceLevel=0, $extra = array())
    {
        //OMP 日志打印
        if(self::$_openOMP === true){
            Bd_Log::warning($strLog,0,null,1);
        }
        return self::_log(self::LOG_WARNING, $strLog, $strModule, $strFile, $intLine, $intTraceLevel, $extra);
    }
    
    public static function notice($strLog, $strModule='', $strFile='', $intLine=0, $intTraceLevel=0, $extra = array())
    {
        if(self::$_openOMP === true){
           if(self::$_objOMP !== null ){
               self::$_objOMP -> stop();//notice时，进行OMP的结束操作
           }
           Bd_Log::notice('',0,null,1);
        }
        return self::_log(self::LOG_NOTICE, $strLog, $strModule, $strFile, $intLine, $intTraceLevel, $extra);
    }
    
    public static function trace($strLog, $strModule='', $strFile='', $intLine=0, $intTraceLevel=0, $extra = array())
    {
        //OMP 日志打印
        if(self::$_openOMP === true){
            Bd_Log::trace($strLog,0,null,1);
        }
        return self::_log(self::LOG_TRACE, $strLog, $strModule, $strFile, $intLine, $intTraceLevel, $extra);
    }
    
    public static function debug($strLog, $strModule='', $strFile='', $intLine=0, $intTraceLevel=0, $extra = array())
    {
        //OMP 日志打印
        if(self::$_openOMP === true){
            Bd_Log::debug($strLog,0,null,1);
        }
        return self::_log(self::LOG_DEBUG, $strLog, $strModule, $strFile, $intLine, $intTraceLevel, $extra);
    }
    
    protected static function _log($intLogLevel, $strLog, $strModule, $strFile='', $intLine=0, $intTraceLevel=0, $extra=array())
    {
        $objLog = self::getModule($strModule);
        if ($objLog) {
            //检查是否需要记录
            if ($objLog->check($intLogLevel)) {
                if (empty($strFile)) {                
                    $arrRet = self::_getFileAndLine($intTraceLevel);
                    if (isset($arrRet['file'])) $strFile = $arrRet['file'];
                    if (isset($arrRet['line'])) $intLine = $arrRet['line'];
                } else {
                    $strFile = basename($strFile);
                }
                $intLogId = self::getLogId();
                return $objLog->log($intLogLevel, $strLog, $strFile, $intLine, $intLogId, $extra);
            }
        }
        
        return false;
    }
    
    protected static function _getFileAndLine($intLevel=0)
    {
        $arrTrace = debug_backtrace();
        $intDepth = 2 + $intLevel;
        $intTraceDepth = count($arrTrace);
        if ($intDepth > $intTraceDepth)
            $intDepth = $intTraceDepth;
        $arrRet = $arrTrace[$intDepth];
        if (isset($arrRet['file'])) $arrRet['file'] = basename($arrRet['file']);
        return $arrRet;
    }
    /**
     * TODO delete
     */
    protected static function _getLogId()
    {
        if (empty(self::$_intLogId)) {
            if (defined('REQUEST_ID')) {
                self::$_intLogId = REQUEST_ID;
            } else {
                $requestTime = gettimeofday();
                self::$_intLogId = intval($requestTime['sec'] * 100000 + $requestTime['usec'] / 10) & 0x7FFFFFFF;
            }
        }
        return self::$_intLogId;
    }
}
