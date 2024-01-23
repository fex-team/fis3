<?php
/**
 * �ļ��໺��ӿ�
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-23
 * @package Bingo
 *
 */
require_once 'Bingo/Cache/Abstract.php';
abstract class Bingo_Cache_File_Abstract extends Bingo_Cache_Abstract  
{
	/**
     * ����Ŀ¼
     *
     * @var string
     */
    protected $_strCacheDir = './';
    /**
     * ��Чʱ����0��ʾ��Զ��ʧЧ
     *
     * @var int
     */
    protected $_intLifeTime = 900;//15 min   
    /**
     * �����ļ���׺
     *
     * @var string
     */
    protected $_strFileExtension = '.php';
    /**
     * �ļ������ܵĺ���
     *
     * @var callback
     */
    protected $_encodeFileNameCallback = 'rawurlencode';

    /**
     * �����ļ�����callback
     *
     * @param callback $callback
     */
    public function setFileNameCallback($callback)
    {
    	if ( is_callable($callback) )
    	{
    		$this->_encodeFileNameCallback = $callback;
    	}
    }
    /**
     * ��ȡ�Ϸ����ļ���
     *
     * @param string $key
     * @return string
     */
    public function getEncodeFileName($strKey)
    {
    	return call_user_func_array($this->_encodeFileNameCallback,array($strKey));
    }
    /**
     * ���û���Ŀ¼
     *
     * @param unknown_type $dir
     */
	public function setCacheDir($strDir)
    {
        if ( is_dir($strDir) && file_exists($strDir) && is_writable($strDir))
        {
            $this->_strCacheDir = rtrim($strDir, DIRECTORY_SEPARATOR);
        }
        else 
        {
        	trigger_error('setCacheDir:' . $strDir . ' is invalid!', E_USER_WARNING);
        }
    }
}