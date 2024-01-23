<?php
/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file Omp.php
 * @author luhaixia(com@baidu.com)
 * @date 2012/07/31 14:12:15
 * @brief 
 *  
 **/
class Bd_Omp{
    private $_begTime = 0;
    private $_endTime = 0;
    private $_xhprofEnable = false;
    private $strMoudle = null;

    public function __construct($strMoudle = null){
        $this->strMoudle = $strMoudle;
    }

    /**
     * @brief 设置Module接口
     *
     * @return  public function 
     * @retval   
     * @see 
     * @note 
     * @author luhaixia
     * @date 2012/08/21 14:51:03
    **/
    public function setModuleName($strMoudle){
        if($strMoudle !== NULL){
            $this->strMoudle = $strMoudle;
            $this->initModuleName();
        }
    }

    /**
     * @brief 启动OMP，初始化OMP日志字段，启动计时器，启动xhprof
     *
     * @return  public function 
     * @retval   
     * @see 
     * @note 
     * @author luhaixia
     * @date 2012/07/31 14:13:58
    **/
    public function start(){
        $this->_begTime = intval(microtime(true)*1000); 
        self::initOmpLog();
        $this->initModuleName();
        $this->addOmpLog();
        $this->xhprofStart();
    }

    /**
     * @brief 结束OMP，打印日志，结束计时器统计耗时，dumpxhprof数据
     *
     * @return  public  function 
     * @retval   
     * @see 
     * @note 
     * @author luhaixia
     * @date 2012/07/31 14:15:27
    **/
    public  function stop(){
        //计算cost,单位ms
        $this->_endTime = intval(microtime(true)*1000);
        $cost = intval(($this->_endTime - $this->_begTime));
        Bd_Log::addNotice('cost', $cost);
        $this->xhprofStop();
    }

    /**
     * @brief 初始化OMP字段
     *
     * @return  private function 
     * @retval   
     * @see 
     * @note 
     * @author luhaixia
     * @date 2012/07/31 14:26:12
    **/
    public static function initOmpLog(){
		//获取LogId
        if(!defined('LOG_ID')){
            Bd_Log::genLogID();
        }
        if(!defined('UNIQID')){
            if(getenv('HTTP_X_BD_UNIQID')){
                define('UNIQID', trim(getenv('HTTP_X_BD_UNIQID')));
            }else{
                define('UNIQID', 0);
            }
        }
		//获取Product
        if(!defined('PRODUCT')){
            if(getenv('HTTP_X_BD_PRODUCT')){
                define('PRODUCT', trim(getenv('HTTP_X_BD_PRODUCT')));
            }else{
                define('PRODUCT', 'ORP');
            }
        }
		//获取subsys
        if(!defined('SUBSYS')){
            if(getenv('HTTP_X_BD_SUBSYS')){
                define('SUBSYS', trim(getenv('HTTP_X_BD_SUBSYS')));
            }elseif(isset($_REQUEST['subsys'])){
                define('SUBSYS', strval($_REQUEST['subsys']));
            }else{
                define('SUBSYS', 'ORP');
            }
        }
    }
    private function addOmpLog(){
        $tmp = gettimeofday();
        $optime = $tmp['sec'].'.'.intval($tmp['usec']/1000);
        Bd_Log::addNotice('optime', $optime);
        Bd_Log::addNotice('client_ip', Bd_Ip::getClientIp());
        Bd_Log::addNotice('local_ip', Bd_Ip::getLocalIp());
        Bd_Log::addNotice('product', defined('PRODUCT') ? PRODUCT : 'ORP');
        Bd_Log::addNotice('subsys', defined('SUBSYS') ? SUBSYS : 'ORP');
        Bd_Log::addNotice('module', defined('MODULE') ? MODULE : 'ORP');
        Bd_Log::addNotice('uniqid', defined('UNIQID') ? UNIQID : 0);
        $cgId = function_exists('ral_get_cgid') ? ral_get_cgid() : 0;
        Bd_Log::addNotice('cgid', $cgId);
    }

    /**
     * @brief 初始化MODULE宏
     *
     * @return  private function 
     * @retval   
     * @see 
     * @note 
     * @author luhaixia
     * @date 2012/08/21 14:48:18
    **/
    private function initModuleName(){
        if(!defined('MODULE')){
            if($this->strMoudle == null){
                if(defined('IS_ODP')){
                    define('MODULE', APP);
                }
            }else{
                define('MODULE', $this->strMoudle);
            }
        }
    }

        /**
     * @brief start xhprof, 支持手动启动，且必须内网ip才能手动启动
     *
     * @return  private function 
     * @retval   
     * @see 
     * @note 
     * @author luhaixia
     * @date 2012/07/31 14:30:55
    **/
    private function xhprofStart(){
        if(isset($_GET['xhprof_enable']) && $_GET['xhprof_enable']){
            //判断userip是否在白名单内
            if($this->userIpValid()){
                $this->_xhprofEnable = true;
            }
        }
        if($this->_xhprofEnable){
            xhprof_enable();
        }
    }

    /**
     * @brief 检查userip是否在白名单内
     *
     * @return  private function 
     * @retval   
     * @see 
     * @note 
     * @author luhaixia
     * @date 2012/07/31 14:33:43
    **/
    private function userIpValid(){
        $userIp = Bd_Ip::getUserIp();
        $validIpList = Bd_Conf::getConf('omp/iplist');
        if(is_array($validIpList)){
            foreach($validIpList as $ip){
                if($userIp == $ip['IP']){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @brief 如果开启了xhprof，则打印xhprof信息
     *
     * @return  private function 
     * @retval   
     * @see 
     * @note 
     * @author luhaixia
     * @date 2012/07/31 14:36:17
    **/
    private function xhprofStop(){
        if($this->_xhprofEnable){
            $data = xhprof_disable();
            $this->dumpXhprofInfo($data);
        }
    }

    private function dumpXhprofInfo($arrData){
        $arrArgs = array();
        $arrArgs['xhprof'] = json_encode($arrData);
        $arrArgs['product']= PRODUCT;
        $arrArgs['subsys'] = SUBSYS;
        $arrArgs['module'] = MODULE;
        $logStr = $this->getLogString($arrArgs);
        $strLogFileName = Bd_Log::getLogPath()."/".Bd_Log::getLogPrefix()."/".Bd_Log::getLogPrefix().".xhprof";
		return  file_put_contents($strLogFileName, $logStr, FILE_APPEND);
    }

	private function getLogString($arrArgs){
        $prefix = Bd_Log::getLogPrefix();
		$str  = 'XHPROF: ' . strftime('%m-%d %H:%M:%S') . ' ' . $prefix . ' * ' . posix_getpid();
	    $str .=	' [logid=' . LOG_ID;
	    $args = array();
		foreach($arrArgs as $key => $value){
			$args[] = rawurlencode($key).'='.rawurlencode($value);
        }       
	    $str .= ' '.implode(' ', $args)."]\n"; 
        return $str;
    }


}


/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
