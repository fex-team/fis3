<?php
/**
 * �ļ�����
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-23
 * @package Bingo
 *
 */
require_once 'Bingo/Cache/File/Abstract.php';
class Bingo_Cache_File extends Bingo_Cache_File_Abstract
{
	/**
     * �Ƿ����serialize��ʽ���л�����
     *
     * @var bool
     */
    protected $_bolSerialize = false;
    /**
     * �����ļ��в���
     *
     * @var int
     */
    protected $_intFilePathLevel = 0;
    /**
     * ����У��ص�����
     *
     * @var unknown_type
     */
    protected $_validatorCallback = false;
    /**
     * �Ƿ��ͷ����Ϣ���м��ܡ�
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
            //��ȡ�ļ���С
            $_intFileLen = filesize($strFileName);
            if ( $_intFileLen > $this->_intHeadLen)
            {
            	$fp = fopen($strFileName, 'rb');
            	if (!$fp) return false;
            	//�ļ�����
            	flock($fp, LOCK_SH);            	
            	//��ȡͷ
            	$strHead = fread($fp,$this->_intHeadLen);     
            	if (! $strHead)
            	{
            		//�������˳�
            		flock($fp,LOCK_UN);
            		fclose($fp);
            		return false;       	
            	}
            	//����洢��һЩͷ����Ϣ,$_validator��У�����ݣ���ֹ���ݱ��ƻ�
            	$strStaticHead = substr($strHead, 0, $this->_intStaticHeadLen);
            	list($_intEndTime, $_bolSerialize, $_validator) = explode(':', $strStaticHead);
            	if ( $_intEndTime>0 && $this->_getNowTime()> $_intEndTime )
            	{
            		//����
            		flock($fp,LOCK_UN);
            		fclose($fp);
            		@unlink($strFileName);
            	}
            	else 
            	{
            		//û�й���
            		$strData = fread($fp, $_intFileLen-$this->_intHeadLen);
            		flock($fp,LOCK_UN);
            		fclose($fp);
            		if (! $strData)
            		{            			
            			return FALSE;  
            		}
            		if ( $_validator!= 0 )
            		{
            			//TODOУ�������Ƿ���ȷ
            		}
            		if ( $_bolSerialize )
            		{
            			//��Ҫ�����л�
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
            	//�ļ����Ȳ���
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
         * ���л�
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
            	//�Ǳ�����Ҫǿ�����л�
            	$mixValue = serialize($mixValue);
            	$_bolSerialize = TRUE;
        	} 
        }        
        //�����ļ�ͷ��Ϣ
        $_strValidator = '';
        if ( is_callable($this->_validatorCallback) )
        {
        	$_strValidator = call_user_func_array($this->_validatorCallback, $mixValue);
        }
        $strHead = $this->_buildHead($intLifeTime, $_bolSerialize, $this->_validatorCallback, $_strValidator);
        //д������
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
     * ��������У��Ļص�����
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
    		//�����ϼ��ܴ�
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