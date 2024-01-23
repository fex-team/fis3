<?php
/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file RequestId.php
 * @author lishiyu(com@baidu.com)
 * @date 2011/12/15 23:27:14
 * @brief 
 *  
 **/
class Ak_RequestId {
    public static function getClientId() {
        if (isset($_SERVER['SERVER_ADDR'])) {
            $server_name = $_SERVER['SERVER_ADDR'];
        } else if (isset($_SERVER['SERVER_NAME'])) {
            $server_name = $_SERVER['SERVER_NAME'];
        } else if (isset($_SERVER['HOSTNAME'])) {
            $server_name = $_SERVER['HOSTNAME'];
        } else {
            $server_name = php_uname('n');
        }
        return $server_name.'#'.getmypid();
    }

    public static function getReqId() {
        $time = gettimeofday();
        return $time['sec'] * 1000000 + $time['usec'];
    }
}

