<?php 
/**
 * PHP文件缓存接口
 * @author xuliqiang@baidu.com
 * @since 2009-10-17
 * @package cache
 *
 */
require_once 'Bingo/Cache/File/Abstract.php';
class Bingo_Cache_File_Source extends Bingo_Cache_File_Abstract 
{
    public function __construct( $arrConfig = array() )
    {
        $this->setOptions($arrConfig);
    }
    
    public function setOptions($arrConfig)
    {
        if (isset($arrConfig['dir']))
        {
            $this->setCacheDir($arrConfig['dir']);
        }
        if (isset($arrConfig['lifeTime']))
        {
        	$this->_intLifeTime = intval($arrConfig['lifeTime']);
        }
        if (isset($arrConfig['encode'])) $this->setFileNameCallback($arrConfig['encode']);
    }
    
    public function get($strKey)
    {
        $strFileName = $this->_getFileNameByKey($strKey);
        if (is_file($strFileName))
        {
            $arrValue = include($strFileName);
            if ( is_array($arrValue) && isset($arrValue['head']) && isset($arrValue['data']) )
            {
            	$arrHead = $arrValue['head'];
            	if ( isset($arrHead['need_refresh']) && ( TRUE === $arrHead['need_refresh']) )
            	{
            		//需要进行更新检查
            		if ( $arrHead['refresh_time'] < $this->_getNowTime() )
            		{
            			//需要更新
            			if (is_file($strFileName))
            			{
            				@unlink($strFileName);
            			}
            			return false;
            		}
            	}
            	return $arrValue['data'];
            }
        }
        return false;
    }
    
    public function set($strKey, $mixValue, $intLifeTime=NULL)
    {
        $strFileName = $this->_getFileNameByKey($strKey);
        if (is_null($intLifeTime)) $intLifeTime = $this->_intLifeTime;
        $mixValue = array(
        	'head' => $this->_buildHead($intLifeTime),
        	'data' => $mixValue,
        );
        $mixValue = "<?php \r\n return " . var_export($mixValue,true) . ";\r\n ?>";
        return file_put_contents($strFileName, $mixValue, LOCK_EX);
    }
    
    public function remove($strKey)
    {
        $strFileName = $this->_getFileNameByKey($strKey);
        if (is_file($strFileName))
        {
            @unlink($strFileName);
        }
    }
        
    protected function _getFileNameByKey($strKey)
    {
        return $this->_strCacheDir . DIRECTORY_SEPARATOR . $this->getEncodeFileName($strKey) . $this->_strFileExtension;
    }    
    
    protected function _buildHead($intLifeTime)
    {
    	if ($intLifeTime>0)
    	{
    		return array(
    			'need_refresh' => true,
    			'refresh_time' => $this->_getNowTime()+$intLifeTime,
    		);
    	}
    	else 
    	{
    		return array(
    			'need_refresh' => false,
    		);
    	}
    }
}
