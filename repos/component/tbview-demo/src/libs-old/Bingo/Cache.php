<?php 
/**
 * ���洦�����ù���ģʽ���ṩ��5�ִ洢���档
 * ע�⣺�û�����ʺ�������cache������memcache֮��ķֲ�ʽcache����ʱû���ṩ������֧�֡�
 * static : request�����󣩼������ڴ���global�����������ڵĻ��棬�ȽϺ��ʡ�����˵time()��IP��ַ�ȵȡ�
 * apc/eacc: ����cache���ʺ�������С���ݵĵ���cache��
 * file : ����cache���ʺ������������ģ������ٵ�cache������˵output����dict֮��ġ�
 * source :����Դ�뻺�档�Ƚ��ʺ���php��������Ļ��档
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
     * ���õĻ�������
     *
     * @var array
     */
    protected static $_arrEngines = array('apc', 'eacc', 'file', 'source', 'static', 'memcached', 'zcache');
    /**
     * Ĭ������
     *
     * @var string
     */
    protected static $_strDefaultEngine = 'file';
    /**
     * ����ģʽ��factoryһ��cache engine
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
     * ����Ĭ�ϵ�cache engine
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