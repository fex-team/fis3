<?php
/**
 * Zcache集群
 * @author chenyuzhe <chenyuzhe01@baidu.com>
 * @since 2011-09-20
 * @package Bingo
 *
 */
require_once 'Bingo/Cache/Cluster/Abstract.php';
require_once 'Bingo/Cache/Cluster/CacheDef.php';
require_once 'Bingo/Cache/Cluster/Zcache.php';
require_once 'Bingo/Config.php';
require_once 'Bingo/Log.php';
class Bingo_Cache_Zcache extends Bingo_Cache_Cluster_Abstract
{
    protected $_conf = NULL;
    protected $_zcacheAdapter = NULL;
    
    public function __construct($arrConfig=array())
    {       
        $this->_conf = new ZcacheAdapterConf();
        $this->setOptions($arrConfig);
        $this->_zcacheAdapter = new CZcacheAdapter($this->_conf);
    }
        
    public function add($strKey, $mixValue, $intLifeTime=0)
    {
        if(is_null($strKey)){
            Bingo_Log::warning('add :Param error Key is null', $this->_strLogModule);
            return CACHE_ERR_PARAM;
        }
        if(is_null($mixValue)){
            Bingo_Log::warning('add :Param error Value is null', $this->_strLogModule);
            return CACHE_ERR_PARAM;
        }
        $ret = $this->_zcacheAdapter->addOne($strKey,NULL,$mixValue,$intLifeTime,0,0);
        if(CACHE_OK==$ret){
            return CACHE_OK;
        }
        else {
            return CACHE_FAIL;
        }
    }
    
    public function set($strKey, $mixValue, $intLifeTime=0)
    {
        return CACHE_ERR_NOTSUPPORT;
    }
    
    //get出错统一返回NULL
    public function get($strKey)
    {
        if(is_null($strKey)){
            Bingo_Log::warning('get :Param error Key is null', $this->_strLogModule);
            //return CACHE_ERR_PARAM;
            return NULL;
        }
        return $this->_zcacheAdapter->getOne($strKey,NULL,0,0);
    }
    
    public function remove($strKey)
    {
        if(is_null($strKey)){
            Bingo_Log::warning('remove :Param error Key is null', $this->_strLogModule);
            return CACHE_ERR_PARAM;
        }
        $ret=$this->_zcacheAdapter->deleteOne($strKey,NULL,0,0,0);
        if(CACHE_OK==$ret){
            return CACHE_OK;
        }
        else {
            return CACHE_FAIL;
        }
        
    }
    
    public function addExt($strKey, $strSubKey ,$mixValue, $intLifeTime=0)
    {
        if(is_null($strKey)){
            Bingo_Log::warning('addExt :Param error Key is null', $this->_strLogModule);
            return CACHE_ERR_PARAM;
        }
        if(is_null($mixValue)){
            Bingo_Log::warning('addExt :Param error Value is null', $this->_strLogModule);
            return CACHE_ERR_PARAM;
        }
        $ret=$this->_zcacheAdapter->addOne($strKey,$strSubKey,$mixValue,$intLifeTime,0,0);
        if(CACHE_OK==$ret){
            return CACHE_OK;
        }
        else {
            return CACHE_FAIL;
        }
    }
    
    public function getExt($strKey, $strSubKey)
    {
        if(is_null($strKey)){
            Bingo_Log::warning('getExt :Param error Key is null', $this->_strLogModule);
            return CACHE_ERR_PARAM;
        }
        return $this->_zcacheAdapter->getOne($strKey,$strSubKey,0,0);
    }
    
    public function removeExt($strKey, $strSubKey)
    {
        if(is_null($strKey)){
            Bingo_Log::warning('removeExt :Param error Key is null', $this->_strLogModule);
            return CACHE_ERR_PARAM;
        }
        $ret=$this->_zcacheAdapter->deleteOne($strKey,$strSubKey,0,0,0);
        if(CACHE_OK==$ret){
            return CACHE_OK;
        }
        else {
            return CACHE_FAIL;
        }
    }
    
    public function multipleGet($arrKey)
    {
        return $this->_zcacheAdapter->getMultiple($arrKey,0,0);
    }
    
    public function multipleSet($arrKey)
    {
        return CACHE_ERR_NOTSUPPORT;
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
           $arrConf = $confReader->get('zcache');
       }
       
       if (isset($arrConf['product_name']))
           $this->_conf->arrPName = array(0 =>$arrConf['product_name']);
       if (isset($arrConf['token']))
           $this->_conf->arrToken = array(0 =>$arrConf['token']);
       if (isset($arrConf['conn_timeout']))
           $this->_conf->CONNTIMEOUT = $arrConf['conn_timeout'];
       if (isset($arrConf['retry_time']))
           $this->_conf->RETRYTIME = $arrConf['retry_time'];
       if (isset($arrConf['mcpack_version']))
           $this->_conf->MCPACK_VERSION = $arrConf['mcpack_version'];
       if (isset($arrConf['persistent']))
           $this->_conf->PERSISTENT = $arrConf['persistent'];
       if (isset($arrConf['current_conf']))
           $this->_conf->CURRENT_CONF = $arrConf['current_conf'];
       if (isset($arrConf['zcache_agent_server']))
           $this->_conf->arrZcacheAgentServer = $arrConf['zcache_agent_server'];
    }
}