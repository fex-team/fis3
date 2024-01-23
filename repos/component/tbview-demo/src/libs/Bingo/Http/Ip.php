<?php
/**
 * HTTP IP��
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2010-03-01
 * @package bingo2.0
 * @example 
 * $strIp = Bingo_Http_Ip::getConnectIp();
 * $strIp = Bingo_Http_Ip::getUserClientIp();
 */
class Bingo_Http_Ip
{
    /**
     * ֱ������WEB����������ʵIP��������ô����򷵻ص��Ǵ���IP��
     *
     * @var string
     */
    private static $_strConnectIp = null;
    /**
     * �û��ͻ��˵�IP����Ҫ��ȫ�����м�������Դ��ڷ��ա���IP��ַ���ܱ��û�α��
     * ���������ο�http://com.baidu.com/twiki/bin/view/Ns/Get_Ip_Notice
     *
     * @var string
     */
    private static $_strUserClientIp = null;
    /**
     * ��ȡ����WEB����������ʵIP��������ô����򷵻ص��Ǵ���IP��
     *
     * @param string $strDefaultIp Ĭ��IP��ַ
     * @param bool $hasTransmit �Ƿ�ǰ����transmit
     * @return string
     */
    public static function getConnectIp ($strDefaultIp = '0.0.0.0', $hasTransmit = true)
    {
        if (is_null(self::$_strConnectIp)) {
            //��ȡIP
            $strIp = '';
            if (! $hasTransmit && isset($_SERVER['REMOTE_ADDR']) ){
            	//û��transmit������ѡ��REMOTE_ADDR
            	$strIp = strip_tags($_SERVER['REMOTE_ADDR']);
            } elseif (isset($_SERVER['HTTP_CLIENTIP'])) {
                //transmit ���е�
                $strIp = strip_tags($_SERVER['HTTP_CLIENTIP']);
            } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $strIp = $_SERVER['HTTP_X_FORWARDED_FOR'];
                //��ȡ���һ��
                $strIp = strip_tags(trim($strIp));
                $intPos = strrpos($strIp, ',');
                if ($intPos > 0) {
                    $strIp = substr($strIp, $intPos + 1);
                }
            } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
                $strIp = strip_tags($_SERVER['HTTP_CLIENT_IP']);
            } elseif (isset($_SERVER['REMOTE_ADDR'])) {
                $strIp = strip_tags($_SERVER['REMOTE_ADDR']);
            }
            $strIp = trim($strIp);
            if (! ip2long($strIp)) {
                //IP��ַ���Ϸ�
                $strIp = $strDefaultIp;
            }
            self::$_strConnectIp = $strIp;
        }
        return self::$_strConnectIp;
    }
    /**
     * ��ȡ�û��ͻ��˵�IP��ַ����IP��ַ���ܱ��û�α��
     *
     * @param stringĬ��IP��ַ $strDefaultIp
     * @return string
     */
    public static function getUserClientIp ($strDefaultIp = '0.0.0.0')
    {
        if (is_null(self::$_strUserClientIp)) {
            $strIp = '';
            if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $strIp = strip_tags($_SERVER['HTTP_X_FORWARDED_FOR']);
                //��ȡ��һ��
                $intPos = strpos($strIp, ',');
                if ($intPos > 0) {
                    $strIp = substr($strIp, 0, $intPos);
                }
            } elseif (isset($_SERVER['HTTP_CLIENTIP'])) {
                //transmit����
                $strIp = strip_tags($_SERVER['HTTP_CLIENTIP']);
            } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
                $strIp = strip_tags($_SERVER['HTTP_CLIENT_IP']);
            } elseif (isset($_SERVER['REMOTE_ADDR'])) {
                $strIp = strip_tags($_SERVER['REMOTE_ADDR']);
            }
            $strIp = trim($strIp);
            if (! ip2long($strIp)) {
                $strIp = $strDefaultIp;
            }
            self::$_strUserClientIp = $strIp;
        }
        return self::$_strUserClientIp;
    }
    
    public static function long2ip($intNum) {   
        $tmp = (double)$intNum;
        return sprintf('%u.%u.%u.%u', $tmp & 0xFF, (($tmp >> 8) & 0xFF), 
            (($tmp >> 16) & 0xFF), (($tmp >> 24) & 0xFF));
    }

    public static function ip2long($ip) {
        $n = ip2long($ip);
        /** convert to network order */
        $n = (($n & 0xFF) << 24) | ((($n >> 8) & 0xFF) << 16) 
            | ((($n >> 16) & 0xFF) << 8) | (($n >> 24) & 0xFF);
        return $n; 
    }
}