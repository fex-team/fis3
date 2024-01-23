<?php
/**
 * Memcached集群
 * @author chenyuzhe <chenyuzhe01@baidu.com>
 * @since 2011-09-22
 * @package Bingo
 *
 */
require_once 'Bingo/Cache/Cluster/Abstract.php';
require_once 'Bingo/Cache/Cluster/CacheDef.php';
require_once 'Bingo/Cache/Cluster/Memcached.php';
require_once 'Bingo/Config.php';
require_once 'Bingo/Log.php';


class Bingo_Cache_Memcached extends Bingo_Cache_Cluster_Abstract
{
    protected $_conf = NULL;
    protected $_ak_McClient = NULL;  
    protected $_initTime = 0;
    
    /**
	 * memcached集群初始化
	 *
	 * @param $arrConfig 数组（配置文件的路径和文件名）
	 * eg:array('confPath'=>'/home/forum/conf/','confFileName'=>'cache_conf.php')
	 */
    public function __construct($arrConfig=array())
    {         
        $this->_conf = array();
        
        if(isset($arrConfig['confPath']) && isset($arrConfig['confFileName'])){
            $this->setOptions($arrConfig);
        }
        elseif( isset($arrConfig['conf'] )){
            $this->setOptionsByConfigure($arrConfig['conf']);
        }
        
        if ( defined('MODULE') ){
            ral_set_log(RAL_LOG_MODULE, MODULE);
        }else{
            ral_set_log(RAL_LOG_MODULE, 'default');
        }
        
        $startTime = gettimeofday();
        if (isset($this->_conf['zk_host'])){
            //设置zookeeper机器地址
            Ak_Zookeeper::setHost($this->_conf['zk_host']);
            Ak_AClient::SetGlobalConf(array('ZookeeperHost' => $this->_conf['zk_host']));
            
            $this->_ak_McClient = Ak_McClient::create($this->_conf);
        }
        $endTime = gettimeofday();
        $this->_initTime = ceil( Bingo_Timer::getUtime($startTime,$endTime)/1000 );
    }
    
    private function __notice($method,$read)
    {
        $log = array(
                'service' => $this->_conf['pid'],
        		'method' => $method,
        		'prot' => 'memcached',
        		'cost' => $this->_initTime + $read,
        		'init' => $this->_initTime,
        		'read' => $read,
        		'write' => 0,
        );
        	
        ral_write_log(RAL_LOG_SUM_SUCC, 'Memcached', $log);
    }
    
    private function __warning($method,$read,$err_no,$err_info)
    {
    	$log = array(
    	        'service' => $this->_conf['pid'],
    			'method' => $method,
    			'prot' => 'memcached',
    			'cost' => $this->_initTime + $read,
    			'init' => $this->_initTime,
    			'read' => $read,
    			'write' => 0,
    	        'err_no' => $err_no,
    	        'err_info' => $err_info,
    	);
    	 
    	ral_write_log(RAL_LOG_SUM_FAIL, 'Memcached', $log);
    }
    
	public function isEnable()
    {
    	if(is_null($this->_ak_McClient)){
            return false;
        }
        else{
        	return true;
        }
    }
        
    public function add($strKey, $mixValue, $intLifeTime=NULL)
    {
        if(is_null($strKey)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Key is null');
            return CACHE_ERR_PARAM;
        }
        if(is_null($mixValue)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Value is null');
            return CACHE_ERR_PARAM;
        }
        if(is_null($this->_ak_McClient)){
            $this->__warning(__FUNCTION__, 0, CACHE_APIPLUS_INIT_FAIL, 'Cache init error');
            return CACHE_APIPLUS_INIT_FAIL;
        }
        
        $startTime = gettimeofday();
        $ret=$this->_ak_McClient->add($strKey, $mixValue, $intLifeTime);
        $endTime = gettimeofday();
        $time = ceil( Bingo_Timer::getUtime($startTime,$endTime)/1000 );
        
        if (true==$ret) {
            $this->__notice(__FUNCTION__, $time);
            return CACHE_OK;
        }
        else {
            $this->__warning(__FUNCTION__, $time, CACHE_FAIL, 'Add cache error');
            return CACHE_FAIL;
        }
    }
    
    public function set($strKey, $mixValue, $intLifeTime=NULL)
    {
        if(is_null($strKey)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Key is null');
            return CACHE_ERR_PARAM;
        }
        if(is_null($mixValue)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Value is null');
            return CACHE_ERR_PARAM;
        }
        if(is_null($this->_ak_McClient)){
            $this->__warning(__FUNCTION__, 0, CACHE_APIPLUS_INIT_FAIL, 'Cache init error');
            return CACHE_APIPLUS_INIT_FAIL;
        }
        $startTime = gettimeofday();
        $ret=$this->_ak_McClient->set($strKey, $mixValue, $intLifeTime);
        $endTime = gettimeofday();
        $time = ceil( Bingo_Timer::getUtime($startTime,$endTime)/1000 );
        
        if (true==$ret) {
            $this->__notice(__FUNCTION__, $time);
            return CACHE_OK;
        }
        else {
            $this->__warning(__FUNCTION__, $time, CACHE_FAIL, 'Set cache error');
            return CACHE_FAIL;
        }
    }
    
    //get出错统一返回NULL
    public function get($strKey)
    {
        if(is_null($strKey)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Key is null');
            return NULL;
        }
        if(is_null($this->_ak_McClient)){
            $this->__warning(__FUNCTION__, 0, CACHE_APIPLUS_INIT_FAIL, 'Cache init error');
            return NULL;
        }
        $startTime = gettimeofday();
        $ret = $this->_ak_McClient->get($strKey);
        $endTime = gettimeofday();
        $time = ceil( Bingo_Timer::getUtime($startTime,$endTime)/1000 );
        
        $this->__notice(__FUNCTION__, $time);
        
        if($ret === false){
            return NULL;
        }
        return $ret;
    }
    
    public function remove($strKey)
    {
        if(is_null($strKey)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Key is null');
            return CACHE_ERR_PARAM;
        }
        if(is_null($this->_ak_McClient)){
            $this->__warning(__FUNCTION__, 0, CACHE_APIPLUS_INIT_FAIL, 'Cache init error');
            return CACHE_APIPLUS_INIT_FAIL;
        }
        
        $startTime = gettimeofday();
        $ret= $this->_ak_McClient->delete($strKey);
        $endTime = gettimeofday();
        $time = ceil( Bingo_Timer::getUtime($startTime,$endTime)/1000 );
              
        if (true==$ret) {
            $this->__notice(__FUNCTION__, $time);
            return CACHE_OK;
        }
        else {
            $this->__warning(__FUNCTION__, $time, CACHE_FAIL, 'Remove cache error');
            return CACHE_FAIL;
        }
    }
    
    public function addExt($strKey, $strSubKey ,$mixValue, $intLifeTime=NULL)
    {
        if(is_null($strKey)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Key is null');
            return CACHE_ERR_PARAM;
        }
        if(is_null($mixValue)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Value is null');
            return CACHE_ERR_PARAM;
        }
        if(is_null($this->_ak_McClient)){
            $this->__warning(__FUNCTION__, 0, CACHE_APIPLUS_INIT_FAIL, 'Cache init error');
            return CACHE_APIPLUS_INIT_FAIL;
        }
        
        $startTime = gettimeofday();
        $ret=$this->_ak_McClient->addChild($strKey, $strSubKey, $mixValue, $intLifeTime);
        $endTime = gettimeofday();
        $time = ceil( Bingo_Timer::getUtime($startTime,$endTime)/1000 );
         
        if (true==$ret) {
            $this->__notice(__FUNCTION__, $time);
            return CACHE_OK;
        }
        else {
            $this->__warning(__FUNCTION__, $time, CACHE_FAIL, 'Add cache error');
            return CACHE_FAIL;
        }
    }
    
    public function getExt($strKey, $strSubKey)
    {
        if(is_null($strKey)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Key is null');
            return CACHE_ERR_PARAM;
        }
        if(is_null($this->_ak_McClient)){
            $this->__warning(__FUNCTION__, 0, CACHE_APIPLUS_INIT_FAIL, 'Cache init error');
            return NULL;
        }
        
        $startTime = gettimeofday();
        $ret = $this->_ak_McClient->getChild($strKey, $strSubKey);
        $endTime = gettimeofday();
        $time = ceil( Bingo_Timer::getUtime($startTime,$endTime)/1000 );
        
        $this->__notice(__FUNCTION__, $time);
        
        return $ret;
    }
    
    public function removeExt($strKey, $strSubKey)
    {
        if(is_null($strKey)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Key is null');
            return CACHE_ERR_PARAM;
        }
        if(is_null($this->_ak_McClient)){
            $this->__warning('removeExt', 0, CACHE_APIPLUS_INIT_FAIL, 'Cache init error');
            return CACHE_APIPLUS_INIT_FAIL;
        }
        
        $startTime = gettimeofday();
        $ret= $this->_ak_McClient->deleteChild($strKey, $strSubKey);
        $endTime = gettimeofday();
        $time = ceil( Bingo_Timer::getUtime($startTime,$endTime)/1000 );
        
        
        
        if (true==$ret) {
            $this->__notice(__FUNCTION__, $time);
            return CACHE_OK;
        }
        else {
            $this->__warning(__FUNCTION__, $time, CACHE_FAIL, 'Remove cache error');
            return CACHE_FAIL;
        }
    }
    
    public function multipleGet($arrKey)
    {
        if(!isset($arrKey) || !is_array($arrKey) || empty($arrKey)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Key is null');
            return NULL;
        }
        if(is_null($this->_ak_McClient)){
            $this->__warning(__FUNCTION__, 0, CACHE_APIPLUS_INIT_FAIL, 'Cache init error');
        	return NULL;
        }
        
        $startTime = gettimeofday();
        $ret = $this->_ak_McClient->getMulti($arrKey);
        $endTime = gettimeofday();
        $time = ceil( Bingo_Timer::getUtime($startTime,$endTime)/1000 );
        
        $this->__notice(__FUNCTION__, $time);
        
        return $ret;
    }
    
    public function multipleSet($arrKeyValue)
    {  
        if(!isset($arrKeyValue) || !is_array($arrKeyValue) || empty($arrKeyValue)){
            $this->__warning(__FUNCTION__, 0, CACHE_ERR_PARAM, 'Param error Key or Value is null');
            return CACHE_ERR_PARAM;
        }
        if(is_null($this->_ak_McClient)){
            $this->__warning(__FUNCTION__, 0, CACHE_APIPLUS_INIT_FAIL, 'Cache init error');
        	return CACHE_APIPLUS_INIT_FAIL;
        }
        
        $startTime = gettimeofday();
        $ret=$this->_ak_McClient->setMulti($arrKeyValue);
        $endTime = gettimeofday();
        $time = ceil( Bingo_Timer::getUtime($startTime,$endTime)/1000 );
        
        if (true==$ret) {
            $this->__notice(__FUNCTION__, $time);
        	return CACHE_OK;
        }
        else {
            $this->__warning(__FUNCTION__, $time, CACHE_FAIL, 'Multiset cache error');
        	return CACHE_FAIL;
        }
    }
    
    public function setOptions($arrConfig)
    {      
        if( isset($arrConfig['confPath']) ){
            $strDir=$arrConfig['confPath'];
        }
        else{
            $strDir=DEFAULT_CONF_PATH;
        }
        if( isset($arrConfig['confFileName']) ){
            $strFileName=$arrConfig['confFileName'];
        }
        else{
            $strFileName=DEFAULT_CONF_FILENAME;
        }
        
       $confReader = Bingo_Config::factory('array',array(
                                                    'fileName'=>$strDir.$strFileName,
                                                    'autoRefresh'=>false,
       ));
       
       if ($confReader){   
           $arrConf = $confReader->get('memcached');
       }
       
       if (isset($arrConf['product_name']))
           $this->_conf['pid'] = $arrConf['product_name'];
       if (isset($arrConf['zk_path']))
           $this->_conf['zk_path'] = $arrConf['zk_path'];
       if (isset($arrConf['zk_expire']))
           $this->_conf['zk_expire'] = $arrConf['zk_expire'];
       if (isset($arrConf['curr_idc']))
           $this->_conf['curr_idc'] = $arrConf['curr_idc'];
       if (isset($arrConf['default_expire']))
           $this->_conf['default_expire'] = $arrConf['default_expire'];
       if (isset($arrConf['delete_directly']))
           $this->_conf['delete_directly'] = $arrConf['delete_directly'];
       if (isset($arrConf['delete_delay']))
           $this->_conf['delete_delay'] = $arrConf['delete_delay'];
       if (isset($arrConf['zk_host']))
           $this->_conf['zk_host'] = implode(',', $arrConf['zk_host']);
       if (isset($arrConf['compression']))
           	$this->_conf['compression'] = (bool)$arrConf['compression'];
       
    }
    
	public function setOptionsByConfigure($arrConfig)
    {
    	if (isset($arrConfig['Pid']))
    		$this->_conf['pid'] = $arrConfig['Pid'];
    	if (isset($arrConfig['ZKPath']))
    		$this->_conf['zk_path'] = $arrConfig['ZKPath'];
    	if (isset($arrConfig['ZKExpire']))
    		$this->_conf['zk_expire'] = intval($arrConfig['ZKExpire']);
    	if (isset($arrConfig['CurrIdc']))
    		$this->_conf['curr_idc'] = $arrConfig['CurrIdc'];
    	if (isset($arrConfig['SpanIdcStrategyIndex']))
    		$this->_conf['span_idc_strategy_index'] = intval($arrConfig['SpanIdcStrategyIndex']);
    	if (isset($arrConfig['DefaultExpire']))
    		$this->_conf['default_expire'] = intval($arrConfig['DefaultExpire']);
    	if (isset($arrConfig['DeleteDirectly']))
    		$this->_conf['delete_directly'] = (bool)$arrConfig['DeleteDirectly'];
    	if (isset($arrConfig['DeleteDelay']))
    		$this->_conf['delete_delay'] = (bool)$arrConfig['DeleteDelay'];
    	if (isset($arrConfig['ZKHost']))
    		$this->_conf['zk_host'] = $arrConfig['ZKHost'];
    	if (isset($arrConfig['ConnectTimeout']))
    		$this->_conf['connect_timeout'] = intval($arrConfig['ConnectTimeout']);
    	if (isset($arrConfig['PollTimeout']))
    		$this->_conf['poll_timeout'] = intval($arrConfig['PollTimeout']);
    	if (isset($arrConfig['WriteTimeout']))
    		$this->_conf['send_timeout'] = intval($arrConfig['WriteTimeout']);
    	if (isset($arrConfig['ReadTimeout']))
    		$this->_conf['recv_timeout'] = intval($arrConfig['ReadTimeout']);
    	if (isset($arrConfig['compression']))
    		$this->_conf['compression'] = (bool)$arrConfig['compression'];
    	 
    }
}