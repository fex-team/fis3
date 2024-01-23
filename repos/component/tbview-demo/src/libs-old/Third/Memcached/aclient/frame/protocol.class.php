<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/



/**
 * @file frame/protocol.class.php
 * @author liuqingjun(com@baidu.com)
 * @date 2010/09/08 10:53:00
 * @brief 
 *  
 **/

abstract class AClientProtocol {
    public static $SUCCESS = 0;
    public static $CONNECT_FAILED = -1;
    public static $OTHER_FAILED = -99;

    //set config
    abstract public function set_conf($conf);

    //set input data for this protocol to send
    abstract public function set_input($input);

    //get output data received
    abstract public function get_output();

    //connect to resource
    abstract public function connect($ip,$port);

    //send input data
    abstract public function send();

    //receive output data
    abstract public function receive();

    //connect, send and receive
    public function process($ip, $port){
        $ret = $this->connect($ip, $port);
        if($ret != true){
            AClientUtils::add_error("connect ip[$ip] port[$port] failed");
            return self::$CONNECT_FAILED;
        }

        $ret = $this->send();
        if($ret != true){
            AClientUtils::add_error("send to ip[$ip] port[$port] failed");
            return self::$OTHER_FAILED;
        }

        $ret = $this->receive();
        if($ret != true){
            AClientUtils::add_error("receive from ip[$ip] port[$port] failed");
            return self::$OTHER_FAILED;
        }

        return self::$SUCCESS;
    }

}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
