<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file protocol/http.class.php
 * @author wangweibing(com@baidu.com)
 * @date 2010/12/20 13:28:53
 * @brief 
 *  
 **/

define('ACLIENT_HTTP_DEFAULT_TIMEOUT', 1);
require_once(dirname(__FILE__).'/../../RequestId.php');

class AClientHttp extends AClientProtocol {
    protected $connect_timeout = ACLIENT_HTTP_DEFAULT_TIMEOUT;        ///< 单位s  
    protected $write_timeout = ACLIENT_HTTP_DEFAULT_TIMEOUT;        ///< 单位s  
    protected $read_timeout = ACLIENT_HTTP_DEFAULT_TIMEOUT;        ///< 单位s  

    protected $url = '';
    protected $data = '';
    protected $is_post = false;
    protected $header = array();

    protected $output = null;

    function ms_to_second($time_ms){
        $time_ms = $time_ms / 1000;
        if($time_ms <= 0){
            $time_ms = ACLIENT_HTTP_DEFAULT_TIMEOUT;
        }
        return $time_ms;
    }

    public function set_conf($conf){
        $this->connect_timeout = $this->ms_to_second($conf['ConnectTimeOut']);
        $this->write_timeout = $this->ms_to_second($conf['WriteTimeOut']);
        $this->read_timeout = $this->ms_to_second($conf['ReadTimeOut']);
        return true;
    }

    public function set_input($input) {
        $this->header = array();

        //calculate path
        $path = $input['url'];
        $input['get']['client_id'] = Ak_RequestId::getClientId();
        $input['get']['req_id'] = Ak_RequestId::getReqId();
        if(is_array(@$input['get']) && !empty($input['get'])) {
            if (strpos($path, '?') === false) {
                $path .= '?';
            } else {
                $path .= '&';
            }
            foreach ($input['get'] as $k => $v) {
                $path .= urlencode($k).'='.urlencode($v).'&';
            }
        }
        $this->url = $path;

        //calculate POST data
        if (isset($input['data']) || is_array(@$input['post'])) {
            if (isset($input['data'])) {
                $post = $input['data'];
                $this->header[] = 'Content-Type: application/octet-stream';
            } else {
                $post = '';
                foreach ($input['post'] as $k => $v) {
                    $post .= urlencode($k).'='.urlencode($v).'&';
                }
                $this->header[] = 'Content-Type: application/x-www-form-urlencoded';
            }
            $this->is_post = true;
        }
        else{
            $this->is_post = false;
        }
        $this->data = $post;
        return true;
    }

    public function get_output(){
        return $this->output;
    }
    
    public function connect($ip, $port){
        return false;
    }

    public function send(){
        return false;
    }

    public function receive(){
        return false;
    }

    public function process($ip, $port){
        $url = 'http://'.$ip.':'.$port.'/'.$this->url;
        $conn_timeout = $this->connect_timeout;
        $conn_timeout = $conn_timeout < 1 ? 1 : (int)$conn_timeout;
        $timeout = $this->connect_timeout + $this->write_timeout + $this->read_timeout;
        $timeout = $timeout < 1 ? 1 : (int)$timeout;
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $this->header);
        if($this->is_post) {
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $this->data);
        }
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, $conn_timeout);
        curl_setopt($curl, CURLOPT_TIMEOUT, $timeout );
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_BINARYTRANSFER, 1);
        $output=curl_exec($curl);
        if(!is_string($output)) {
            if(curl_errno($curl) == CURLE_COULDNT_CONNECT) {
                AClientUtils::add_error("connect ip[$ip] port[$port] failed");
                return AClientProtocol::$CONNECT_FAILED;
            }
            else{
                AClientUtils::add_error(curl_error($curl));
                return AClientProtocol::$OTHER_FAILED;
            }
        }

        $code=curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);
        $this->output = array(
            'code'=>$code,
            'data'=>$output,
        );
        return AClientProtocol::$SUCCESS;
    }
}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
