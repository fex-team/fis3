<?php
/**
 * config基类
 * @author xuliqiang@baidu.com
 * @since 2009-10-21
 * @package config
 *
 */
abstract class Bingo_Config_Abstract
{    
	protected $_strFileName = '';
	
	protected $_arrData = array();
	
	protected $_bolEnableCache = false;
	
	protected $_objCacheEngine = NULL;
	/**
	 * 是否启用自动更新，在原配置文件更新的时候，自动失效cache
	 * 有一定的成本
	 *
	 * @var bool
	 */
	protected $_bolAutoRefresh = false;
	/**
	 * 是否采用序列化
	 *
	 * @var bool
	 */
	protected $_bolSerialize = false;
	
	abstract public function setOptions($arrConfig);
	
	abstract public function load($strFileName=NULL);
	
	protected function _cacheLoad($strFileName, $callback, $strCacheKey=NULL)
	{
	    $bolRemoveCache = false;
	    if (is_null($strCacheKey))$strCacheKey = $strFileName;
	    if ($this->_bolEnableCache) {
	        //启用了cache
	        $objCache = $this->_objCacheEngine;
	        $_mixCacheData = $objCache->get($strCacheKey);
	        if ($_mixCacheData){
	            //命中cache，
	            if ($this->_bolSerialize) {
	            	$_bolRet = unserialize($_mixCacheData);
	            	if ($_bolRet) $_mixCacheData = $_bolRet;
	            }
	            if ($this->_bolAutoRefresh) {
	                //启用了自动更新，检查是否需要自动更新
	                $_intLastFileTime = filemtime($strFileName);
	                if ($_intLastFileTime && $_intLastFileTime != $_mixCacheData['lastFileTime'] ) {
	                    //需要更新，删除缓存
	                    $bolRemoveCache = true;
	                    $_mixCacheData = $_mixCacheData['data'];
	                    //$objCache->remove($strCacheKey);
	                } else {
	                    $this->_arrData = $_mixCacheData['data'];        
	                    return $this->_arrData;       	                
	                }
	            } else  {
	                $this->_arrData = $_mixCacheData;	 
	                return $this->_arrData;                
	            }	      
	        }
	    }
	    if (is_callable($callback)) {
	        call_user_func_array($callback, array($strFileName));
	    }
	    if ( is_null($this->_arrData) || $this->_arrData === false) {
	        //配置文件解析失败，加载老的cache数据
	        if ($this->_bolEnableCache && $_mixCacheData) {
	            trigger_error('Config parse file failure, load default from cache!fileName['.
                    $strFileName.']', E_USER_WARNING);
                $this->_arrData = $_mixCacheData;
	            return true;
	        }
	    }
	    if ($bolRemoveCache) {
	        //清空老的cache文件
	        $objCache->remove($strCacheKey);
	    }
	    if ($this->_bolEnableCache && $this->_arrData)
	    {
	        //save,是否启用了自动更新，如果是则需要保存文件的最后修改时间
	        if ($this->_bolAutoRefresh)
	        {
	            $_intLastFileTime = filemtime($strFileName);
	            if (! $_intLastFileTime) $_intLastFileTime = $this->_getNowTime();
	            $_mixCacheData = array(
	                'lastFileTime' => $_intLastFileTime,
	                'data' => $this->_arrData,
	            );
	        }
	        else 
	        {
	            $_mixCacheData = $this->_arrData;
	        }
	        if ($this->_bolSerialize) $_mixCacheData = serialize($_mixCacheData);
	        $this->_objCacheEngine->set($strCacheKey, $_mixCacheData);
	    }	    
	    return true;
	}
	
	protected function _setOptions($arrConfig)
	{
	    if (isset($arrConfig['cache']))
	    {
	        $this->setCacheEngine($arrConfig['cache']);
	    } 
	    if (isset($arrConfig['autoRefresh']))
	    {
	        $this->setAutoRefresh($arrConfig['autoRefresh']);
	    }
	    if (isset($arrConfig['serialize']))
	    {
	        $this->setSerialize($arrConfig['serialize']);
	    }
	}
	
	public function setAutoRefresh($_autoRefresh)
	{
	    $this->_bolAutoRefresh = (bool)$_autoRefresh;
	}
	
	public function setSerialize($_serialize)
	{
	    $this->_bolSerialize = (bool)$_serialize;
	}
	
    public function get($strKey,$mixDefaultValue=false)
	{
		if (empty($this->_arrData)) {
			return $mixDefaultValue;
		}
		if (empty($strKey)) {
			return $this->_arrData;
		}
		$arrKeys = explode('.', $strKey);
		if (! empty($arrKeys)) {
			$_value = $this->_getItemFromArray($arrKeys, $this->_arrData);
			if ($_value === false) {
				
			} else {
			    return $_value;
			}
		}
		return $mixDefaultValue;
	}
	/**
	 * TODO
	 *
	 */
	abstract public function save($fileName=NULL); 
	
	public function setCacheEngine($cacheEngine)
	{
	    if (is_subclass_of($cacheEngine, 'Bingo_Cache_Abstract'))
	    {
	        $this->_objCacheEngine = $cacheEngine;
	        $this->_bolEnableCache = true;
	    }
	}
	
	public function setFileName($strFileName)
	{
	    if ( is_file($strFileName) && is_readable($strFileName) ) {
	        $this->_strFileName = $strFileName;
	    }
	}
	
	protected function _getItemFromArray($arrKeys, $arrData)
	{
		if (is_array($arrKeys) && is_array($arrData) ) {			
			$_tmpVar = $arrData;
			foreach ($arrKeys as $key) {
				if (array_key_exists($key, $_tmpVar)) {
					$_tmpVar = $_tmpVar[$key];
				} else  {
					//can not find
					return false;
				}
			}
			return $_tmpVar;
		}
		return false;
	}
	
	public function getData()
	{
		return $this->_arrData;
	}
	protected function _getNowTime()
    {
    	require_once 'Bingo/Timer.php';
    	return Bingo_Timer::getNowTime();
    }
}