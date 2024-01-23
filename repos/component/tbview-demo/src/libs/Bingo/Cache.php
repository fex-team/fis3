<?php 
/**
 * 缓存处理，采用工厂模式，提供了5种存储引擎。
 * 注意：该缓存库适合做单机cache。对于memcache之类的分布式cache，暂时没有提供引擎来支持。
 * static : request（请求）级别。用于处理global变量和请求内的缓存，比较合适。比如说time()，IP地址等等。
 * apc/eacc: 单机cache。适合做大量小数据的单机cache。
 * file : 单机cache。适合做大数据量的，更新少的cache，比如说output或者dict之类的。
 * source :采用源码缓存。比较适合做php数组变量的缓存。
 * 
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-04-24
 * @package cache
 *
 */
require_once 'Bingo/Cache/Abstract.php';
class Bingo_Cache
{
    /**
     * 启用的缓存引擎
     *
     * @var array
     */
    protected static $_arrEngines = array('apc', 'eacc', 'file', 'source', 'static', 'memcached', 'zcache');
    /**
     * 默认引擎
     *
     * @var string
     */
    protected static $_strDefaultEngine = 'file';
    /**
     * 工厂模式，factory一个cache engine
     *
     * @param string $engine
     * @param array $options
     * @return AbstractCacheEngine
     */
    public static function factory($strEngine='', $arrOptions=array())
    {
    	if (! empty($strEngine)) {
        	$strEngine = strtolower($strEngine);
    	}
    	if (!in_array($strEngine, self::$_arrEngines))
        {
            $strEngine = self::$_strDefaultEngine;
        }
        switch ($strEngine)
        {
            case 'apc':
                require_once 'Bingo/Cache/Apc.php';
                $objEngine = new Bingo_Cache_Apc($arrOptions);
                break;
            case 'eacc':
                require_once 'Bingo/Cache/Eacc.php';
                $objEngine = new Bingo_Cache_Eacc($arrOptions);
                break;            
            case 'source':
                require_once 'Bingo/Cache/File/Source.php';
                $objEngine = new Bingo_Cache_File_Source($arrOptions);
                break;
            case 'static':
                require_once 'Bingo/Cache/Static.php';
                $objEngine = new Bingo_Cache_Static($arrOptions);
                break;
            case 'memcached':
                require_once 'Bingo/Cache/Memcached.php';
                $objEngine = new Bingo_Cache_Memcached($arrOptions);
                break;
            case 'zcache':
                require_once 'Bingo/Cache/Zcache.php';
                $objEngine = new Bingo_Cache_Zcache($arrOptions);
                break;
            case 'file':
            default:
                require_once 'Bingo/Cache/File.php';
                $objEngine = new Bingo_Cache_File($arrOptions);
                break;
        }
        return $objEngine;
    }
    /**
     * 设置默认的cache engine
     *
     * @param string $engine
     */
    public static function setDefaultEngine($strEngine)
    {
        if (in_array($strEngine, self::$_arrEngines))
        {
            self::$_strDefaultEngine = $strEngine;
        }
        return TRUE;
    }
}