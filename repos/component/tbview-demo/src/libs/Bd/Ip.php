<?php

class Bd_Ip
{
    public static function getClientIp()
    {
        $uip = '';
        if(getenv('HTTP_X_FORWARDED_FOR') && strcasecmp(getenv('HTTP_X_FORWARDED_FOR'), 'unknown')) {
            $uip = getenv('HTTP_X_FORWARDED_FOR');
            strpos($uip, ',') && list($uip) = explode(',', $uip);
        } else if(getenv('HTTP_CLIENT_IP') && strcasecmp(getenv('HTTP_CLIENT_IP'), 'unknown')) {
            $uip = getenv('HTTP_CLIENT_IP');
        } else if(getenv('REMOTE_ADDR') && strcasecmp(getenv('REMOTE_ADDR'), 'unknown')) {
            $uip = getenv('REMOTE_ADDR');
        } else if(isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], 'unknown')) {
            $uip = $_SERVER['REMOTE_ADDR'];
        }
        return $uip;
    }

    public static function getUserIp() {
        $uip = '';
        if(isset($_SERVER['HTTP_X_BD_USERIP']) && $_SERVER['HTTP_X_BD_USERIP'] && strcasecmp($_SERVER['HTTP_X_BD_USERIP'], 'unknown')) {
            $uip = $_SERVER['HTTP_X_BD_USERIP'];
        } else {
            $uip = self::getClientIp();
        }
        return $uip;
    }

    public static function getFrontendIp() {
        if (isset($_SERVER['REMOTE_ADDR']))
            return $_SERVER['REMOTE_ADDR'];
        return '';
    }

    public static function getLocalIp() {
        if (isset($_SERVER['SERVER_ADDR']))
            return $_SERVER['SERVER_ADDR'];
        return '';
    }
}

?>
