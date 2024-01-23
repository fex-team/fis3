<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/



/**
 * @file protocol/nshead.class.php
 * @author wangweibing(com@baidu.com)
 * @date 2010/09/08 10:53:00
 * @brief 
 *  
 **/

require_once(dirname(__FILE__)."/../utils/socket.class.php");

class AClientNshead extends AClientProtocol
{
    private static $head_len = 36;
    private static $id = 0;
    private static $version = 1;
    private static $provider = 'aclient';
    private static $magic_num = 0xfb709394;

    protected $sock;
    public function __construct(){
        $this->sock = new AClientSocket();
    }

    /**
     * get trans_logid
     *
     * @return: logid
     * @author: wangshaoquan
     * @info: copy logic from qstat
     */
    static function get_logid()
    {
        $arr = gettimeofday();
        return ((($arr['sec']*100000 + $arr['usec']/10) & 0x7FFFFFFF) | 0x80000000);
    }

    /**
     * nshead打包
     *
     * @return: pack of nshead
     * @param Array $head
     */
    static function pack ($head)
    {
        return pack('SSIa16III', $head['id'], $head['version'], $head['log_id'], 
            $head['provider'], $head['magic_num'], $head['reserved'], $head['body_len']);
    }

    /**
     * nshead解包
     *
     * @return: Array of nshead
     * @param String $str_head
     */
    static function unpack($str_head)
    {
        $pack = unpack('Sid/Sversion/Ilog_id/a16provider/Imagic_num/Ireserved/Ibody_len', $str_head);
        AClientUtils::int2uint($pack['log_id']);
        AClientUtils::int2uint($pack['magic_num']);
        AClientUtils::int2uint($pack['reserved']);
        AClientUtils::int2uint($pack['body_len']);
        return $pack;
    }

    private $input = null;
    private $str_send = null;
    private $output = null;

    public function set_conf($conf){
        $this->sock->set_timeout($conf['ConnectTimeOut'], $conf['ReadTimeOut'], $conf['WriteTimeOut']);
        return true;
    }

    public function set_input($input){

        $head = array();
        $head['id'] = isset($input['id']) ? (int)$input['id'] : self::$id;
        $head['version'] = isset($input['version']) ? (int)$input['version'] : self::$version;
        $head['provider'] = isset($input['provider']) ? (string)$input['provider'] : self::$provider;
        $head['log_id'] = isset($input['log_id']) ? (int)$input['log_id'] : self::get_logid();
        $head['reserved'] = isset($input['reserved']) ? (int)$input['reserved'] : 0;
        $head['magic_num'] = self::$magic_num;
        $head['body_len'] = strlen($input['body']);

        $this->input = $head;
        $head_str = $this->pack($head);
        if(!is_string($head_str)){
            return false;
        }
        $this->str_send = $head_str.$input['body'];
        return true;
    }

    public function get_output(){
        return $this->output;
    }

    public function connect($ip, $port){
        return $this->sock->connect($ip, $port);
    }

    public function send(){
        $sock = &$this->sock;
        $ret = $sock->send($this->str_send,strlen($this->str_send));
        return $ret == strlen($this->str_send);
    }

    public function receive(){
        $sock = &$this->sock;
        $head = $sock->receive(self::$head_len);
        if(!is_string($head) || strlen($head) != self::$head_len){
            return false;
        }

        $output = &$this->output;
        $output = $this->unpack($head);
        $len = $output['body_len'];
        if(!is_integer($len) || $len<0 || $output['magic_num'] != $this->input['magic_num'] ){
            AClientUtils::add_error("receive head[$head] error");
            return false;
        }

        $body = $sock->receive($len);
        if(!is_string($body) || strlen($body) != $len){
            return false;
        }

        $output['body'] = $body;
        return true;
    }

}
