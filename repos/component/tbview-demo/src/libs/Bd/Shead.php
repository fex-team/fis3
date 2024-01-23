<?php
/**
 * nshead pack and unpack
 * typedef struct shead_t
{
    u_int version;              //版本号
    u_int log_id;               //日志号
    char  provider[16];         //模块名
    u_int param1;               //保留参数1
    u_int param2;               //保留参数2

    u_int detail_len;           //后面数据长度.
}shead_t;
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package baidu
 * @since 2010-05-24
 */
class Bd_Shead
{
    protected static $_intVersion = 1;
    protected static $_strProvider = 'Bingo';
    protected static $_intParam1 = 0;
    protected static $_intParam2 = 0;
    
    CONST LEN = 36;
    /**
     * 设置shead相关参数
     * @param array $arrConfig
     */
    public static function setOptions($arrConfig)
    {
        if (isset($arrConfig['id'])) self::$_intId = intval($arrConfig['id']);
        if (isset($arrConfig['version'])) self::$_intVersion = intval($arrConfig['version']);
        if (isset($arrConfig['param1'])) self::$_intParam1 = intval($arrConfig['param1']);
        if (isset($arrConfig['param2'])) self::$_intParam2 = intval($arrConfig['param2']);
    }
    /**
     * shead打包
     * 
     * @param int $intBodyLen
     * @param int $intReserved
     */
    public static function pack ($intBodyLen)
    {
        require_once 'Bingo/Log.php';
        $intLogID = Bingo_Log::getLogId();
        //pack打包
        $strRet = pack("L*", self::$_intVersion, $intLogID);
        $strRet .= pack("a16", self::$_strProvider);
        $strRet .= pack("L*", self::$_intParam1, self::$_intParam2, $intBodyLen);
        return $strRet;
    }
    /**
     * shead解包
     * @param String $strNshead
     */
    public static function unpack($strShead)
    {
        return unpack('Sid/Sversion/Ilogid/a16provider/Iparam1/Iparam2/Idetail_len', $strShead);
    }
    
}