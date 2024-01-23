<?php
/**
 * 文件类缓存接口
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-23
 * @package Bingo
 *
 */
require_once 'Bingo/Cache/Abstract.php';
abstract class Bingo_Cache_File_Abstract extends Bingo_Cache_Abstract  
{
	/**
     * 缓存目录
     *
     * @var string
     */
    protected $_strCacheDir = './';
    /**
     * 有效时长，0表示永远不失效
     *
     * @var int
     */
    protected $_intLifeTime = 900;//15 min   
    /**
     * 缓存文件后缀
     *
     * @var string
     */
    protected $_strFileExtension = '.php';
    /**
     * 文件名加密的函数
     *
     * @var callback
     */
    protected $_encodeFileNameCallback = 'rawurlencode';

    /**
     * 设置文件名的callback
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
     * 获取合法的文件名
     *
     * @param string $key
     * @return string
     */
    public function getEncodeFileName($strKey)
    {
    	return call_user_func_array($this->_encodeFileNameCallback,array($strKey));
    }
    /**
     * 设置缓存目录
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