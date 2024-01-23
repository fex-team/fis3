<?php
/**
 * 文件缓存
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-23
 * @package Bingo
 *
 */
require_once 'Bingo/Cache/File/Abstract.php';
class Bingo_Cache_File extends Bingo_Cache_File_Abstract
{
	/**
     * 是否调用serialize方式序列化内容
     *
     * @var bool
     */
    protected $_bolSerialize = false;
    /**
     * 缓存文件夹层数
     *
     * @var int
     */
    protected $_intFilePathLevel = 0;
    /**
     * 内容校验回调函数
     *
     * @var unknown_type
     */
    protected $_validatorCallback = false;
    /**
     * 是否对头部信息进行加密。
     * @var unknown_type
     */
    protected $_bolEncodeHead = false;
    
    protected $_intStaticHeadLen = 64;
    
    protected $_intHeadLen = 128;
    
    public function __construct($config=array())
    {
        $this->setOptions($config);
    }
        
    public function get($strKey)
    {
        $strFileName = $this->_getFileNameByKey($strKey);        
        if (is_file($strFileName) && is_readable($strFileName) )
        { 
            //获取文件大小
            $_intFileLen = filesize($strFileName);
            if ( $_intFileLen > $this->_intHeadLen)
            {
            	$fp = fopen($strFileName, 'rb');
            	if (!$fp) return false;
            	//文件加锁
            	flock($fp, LOCK_SH);            	
            	//读取头
            	$strHead = fread($fp,$this->_intHeadLen);     
            	if (! $strHead)
            	{
            		//解锁，退出
            		flock($fp,LOCK_UN);
            		fclose($fp);
            		return false;       	
            	}
            	//里面存储了一些头部信息,$_validator是校验数据，防止数据被破坏
            	$strStaticHead = substr($strHead, 0, $this->_intStaticHeadLen);
            	list($_intEndTime, $_bolSerialize, $_validator) = explode(':', $strStaticHead);
            	if ( $_intEndTime>0 && $this->_getNowTime()> $_intEndTime )
            	{
            		//过期
            		flock($fp,LOCK_UN);
            		fclose($fp);
            		@unlink($strFileName);
            	}
            	else 
            	{
            		//没有过期
            		$strData = fread($fp, $_intFileLen-$this->_intHeadLen);
            		flock($fp,LOCK_UN);
            		fclose($fp);
            		if (! $strData)
            		{            			
            			return FALSE;  
            		}
            		if ( $_validator!= 0 )
            		{
            			//TODO校验数据是否正确
            		}
            		if ( $_bolSerialize )
            		{
            			//需要反序列化
            			if($_boolRs = unserialize($strData))
            			{
            				$strData = $_boolRs;
            			}
            		}
            		return $strData;
            	}
            }
            else 
            {
            	//文件长度不对
            	@unlink($strFileName);
            }
        }
        return FALSE;        
    }
    
    public function set($strKey, $mixValue, $intLifeTime=NULL)
    {
        $strFileName = $this->_getFileNameByKey($strKey);        
        if ( FALSE == $strFileName) return FALSE;
        if (is_null($intLifeTime))$intLifeTime = $this->_intLifeTime;
        /**
         * 序列化
         */
        $_bolSerialize = $this->_bolSerialize;
        if ($_bolSerialize) 
        {
            $mixValue = serialize($mixValue);
        }       
        else 
        {
        	if ( !is_scalar($mixValue) )
        	{
            	//非标量需要强制序列化
            	$mixValue = serialize($mixValue);
            	$_bolSerialize = TRUE;
        	} 
        }        
        //产生文件头信息
        $_strValidator = '';
        if ( is_callable($this->_validatorCallback) )
        {
        	$_strValidator = call_user_func_array($this->_validatorCallback, $mixValue);
        }
        $strHead = $this->_buildHead($intLifeTime, $_bolSerialize, $this->_validatorCallback, $_strValidator);
        //写入数据
        return file_put_contents($strFileName, $strHead . $mixValue, LOCK_EX);
    }
    
    public function remove($strKey)
    {
        $strFileName = $this->_getFileNameByKey($strKey);
        if ( is_file($strFileName) )
        {
            @unlink($strFileName);
        }
        return TRUE;
    }
	public function setOptions($arrConfig)
    {
        if (isset($arrConfig['level'])) $this->_intFilePathLevel = intval($arrConfig['level']);
        if (isset($arrConfig['dir']))
        {
            $this->setCacheDir($arrConfig['dir']);
        }
        if (isset($arrConfig['lifeTime'])) $this->_intLifeTime = intval($arrConfig['lifeTime']);
        if (isset($arrConfig['serialize'])) $this->_bolSerialize = (bool)$arrConfig['serialize'];
        if (isset($arrConfig['encode_head'])) $this->_bolEncodeHead = (bool)$arrConfig['encode_head'];
        if (isset($arrConfig['validator'])) $this->setValidator($arrConfig['validator']);
        if (isset($arrConfig['encode'])) $this->setFileNameCallback($arrConfig['encode']);
    }
	/**
     * 设置内容校验的回调函数
     *
     * @param callback $callback
     */
    public function setValidator( $callback )
    {
    	if ( is_callable($callback) )
    	{
    		$this->_validatorCallback = $callback;
    	}
    }
    
    protected function _buildHead($intLifeTime, $bolSerialize, $bolValiator, $strValidator)
    {
    	if ( TRUE === $this->_bolEncodeHead)
    	{
    		//TODO
    		$head = '';
    	}
    	else
    	{
    		if ( $intLifeTime ==0 )
    		{
    			$head = '0';
    		}
    		else 
    		{
    			$head = $this->_getNowTime() + $intLifeTime;
    		}
    		$head .= ':' . intval($bolSerialize) . ':';
    		if ( FALSE == $bolValiator)
    		{
    			$head .= '0:';
    		}
    		else 
    		{
    			$head .= $bolValiator .':';
    		}
    		$head = str_pad($head, $this->_intStaticHeadLen);
    		//附加上加密串
    		$head = str_pad($head . $strValidator, $this->_intHeadLen);
    	}
    	return $head;
    }
            
    protected function _getFileNameByKey($strKey)
    {
        $strMd5 = md5($strKey);
        $_intLevel = $this->_intFilePathLevel;
        $strPath = $this->_strCacheDir . DIRECTORY_SEPARATOR;
        if ($_intLevel>0)
        {            
            for ($i=0; $i<$_intLevel; ++$i)
            {
                $strPath .= substr($strMd5, $i*2, 2) . DIRECTORY_SEPARATOR;
                if ( !is_dir($strPath) || !file_exists($strPath) )
                {
                    //mkdir
                    @mkdir($strPath, 0755, TRUE);
                }
            }
        }
        return $strPath . $strMd5 . $this->_strFileExtension;
    }
}