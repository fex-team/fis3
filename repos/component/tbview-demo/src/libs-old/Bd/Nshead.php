<?php
/**
 * nshead pack and unpack
 * typedef struct _nshead_t
            {        
                unsigned short id;
                unsigned short version;         
                unsigned int   log_id;
                char           provider[16];
                unsigned int   magic_num;
                unsigned int   reserved;
                unsigned int   body_len;
            } nshead_t;
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package baidu
 * @since 2010-05-24
 */
class Bd_Nshead
{
    protected static $_intVersion = 1;
    protected static $_strProvider = 'Bingo';
    protected static $_intMagicNum = 0xfb709394;
    protected static $_intId = 0;
    protected static $_intReserved = 0;
    
    const RESERVED_MCPACK = 1000;
    const RESERVED_STRUCT = 0;
    /**
     * 设置nshead相关参数
     * @param array $arrConfig
     */
    public static function setOptions($arrConfig)
    {
        if (isset($arrConfig['id'])) self::$_intId = intval($arrConfig['id']);
        if (isset($arrConfig['version'])) self::$_intVersion = intval($arrConfig['version']);
        if (isset($arrConfig['magic_num'])) self::$_intMagicNum = intval($arrConfig['magic_num']);
        if (isset($arrConfig['provider'])) self::$_strProvider = $arrConfig['provider'];
        if (isset($arrConfig['reserved'])) self::$_intReserved = intval($arrConfig['reserved']);
    }
    /**
     * nshead打包
     * 
     * @param int $intBodyLen
     * @param int $intReserved
     */
    public static function pack ($intBodyLen, $intReserved = null)
    {
        require_once 'Bingo/Log.php';
        $intLogID = Bingo_Log::getLogId();
        if (is_null($intReserved)) {
            $intReserved = self::$_intReserved;
        }
        //pack打包
        return pack('SSIa16III', self::$_intId, self::$_intVersion, $intLogID, 
            self::$_strProvider, self::$_intMagicNum, $intReserved, $intBodyLen);
    }
    /**
     * nshead解包
     * @param String $strNshead
     */
    public static function unpack($strNshead)
    {
        return unpack('Sid/Sversion/Ilogid/a16provider/Imagic_num/Ireserved/Ibody_len', $strNshead);
    }
    
}