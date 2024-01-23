<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/



/**
 * @file protocol/http.class.php
 * @author liuqingjun(com@baidu.com)
 * @date 2010/09/07 15:52:55
 * @brief 
 *  
 **/

require_once(dirname(__FILE__)."/../utils/socket.class.php");

class AClientHttp extends AClientProtocol {
    protected $HTTP_VERSION = 'HTTP/1.1';

    protected $req_method = 'GET';
    protected $req_path = '/';
    protected $req_host;

    protected $req_headers = array();
    protected $req_gets = array();
    protected $req_posts;
    protected $req_text = '';

    protected $res_text;
    protected $res_return_code = 0;
    protected $res_headers = array();
    protected $res_content_length;

    protected $sock;
    public function __construct(){
        $this->sock = new AClientSocket();
    }

    protected function add_header($title, $content) {
        $this->req_headers[$title] = $content;
    }

    protected function add_res_header($title, $content) {
        $this->res_headers[$title] = $content;
    }

    protected function add_post($title, $content) {
        if (!is_array($this->req_posts)) {
            $this->req_posts = array();
        }
        $this->req_posts[$title] = $content;
    }

    protected function set_post_text($text) {
        $this->req_posts = $text;
    }

    protected function add_get($title, $content) {
        $this->req_gets[$title] = $content;
    }

    protected function set_path($path) {
        $this->req_path = $path;
    }

    protected function post_to_string() {
        $p = null;
        if (is_array($this->req_posts)) {
            foreach ($this->req_posts as $key => $value) {
                if (!empty($p)) {
                    $p .= '&';
                }
                $p .= urlencode($key).'='.urlencode($value);
            }
            $this->add_header('Content-Type','application/x-www-form-urlencoded');
        } else if (!empty($this->req_posts)) {
            $p = $this->req_posts;
            $this->add_header('Content-Type','application/octet-stream');
        }
        $content_length = strlen($p);
        if ($content_length > 0) {
            $this->add_header('Content-Length', $content_length);
        }
        return $p;
    }

    protected function to_string() {
        $h = $g = $p = '';

        $p = $this->post_to_string();
        if (!empty($p)) {
            $this->req_method = 'POST';
        } else {
            $this->req_method = 'GET';
        }

        $no_question = true;
        if(strpos($this->req_path, '?') !== false) {
            $no_question = false;
        }
        foreach ($this->req_gets as $key => $value) {
            if ($no_question) {
                $g .= '?';
                $no_question = false;
            } else {
                $g .= '&';
            }
            $g .= urlencode($key).'='.urlencode($value);
        }

        foreach ($this->req_headers as $key => $value) {
            $h .= "$key: $value\r\n";
        }

        $str = "$this->req_method $this->req_path$g $this->HTTP_VERSION\r\n$h\r\n$p";
        return $str;
    }

    protected function get_headers() {
        return $this->res_headers;
    }

    protected function get_response() {
        return $this->res_text;
    }

    protected function get_return_code() {
        return $this->res_return_code;
    }

    protected function parse_res_header($str) {
        $http_header_regex = '/^HTTP\/1\.[10] [0-9]{3} .*\r\n(?:.*\r\n)*$/';
        if (preg_match($http_header_regex, $str) == 0) {
            return false;
        }
        $lines = preg_split('/[\r\n]/', $str, -1, PREG_SPLIT_NO_EMPTY);
        $initial_line = array_shift($lines);

        $h = explode(' ',$initial_line);
        $this->res_return_code = 0 + $h[1];

        foreach ($lines as $l) {
            $l = explode(':',$l,2);
            if (strtolower($l[0]) == 'content-length') {
                $this->res_content_length = 0 + $l[1];
            }
            $this->add_res_header(strtolower(urldecode(trim($l[0]))), urldecode(trim($l[1])));
        }
        return true;
    }

    public function set_conf($conf){
        $this->sock->set_timeout($conf['ConnectTimeOut'], $conf['WriteTimeOut'], $conf['ReadTimeOut']);
        $this->sock->set_retry($conf['ConnectRetry']);
        return true;
    }

    public function set_input($input){
        //calculate path
        $path = $input['url'];
        if (!isset($input['url'])) {
            return false;
        }
        if (strpos($path, '?') === false && !empty($input['get'])) {
            $path .= '?';
        } else {
            $path .= '&';
        }
        if(is_array($input['get'])) {
            foreach ($input['get'] as $k => $v) {
                $path .= urlencode($k).'='.urlencode($v).'&';
            }
        }

        //calculate POST data
        if (isset($input['data']) || is_array($input['post'])) {
            $method = 'POST';
            if (isset($input['data'])) {
                $post = $input['data'];
                //set post data
                if (!isset($input['header']['Content-Type'])) {
                    $input['header']['Content-Type'] = 'application/octet-stream';
                }
            } else {
                $post = '';
                foreach ($input['post'] as $k => $v) {
                    $post .= urlencode($k).'='.urlencode($v).'&';
                }
                if (!isset($input['header']['Content-Type'])) {
                    $input['header']['Content-Type'] = 'application/x-www-form-urlencoded';
                }
            }
            $input['header']['Content-Length'] = strlen($post);
        } else {
            $method = 'GET';
        }

        //header
        if (!isset($input['header']['Host'])) {
            $input['header']['Host'] = 'webserver';
        }
        $headers = '';
        foreach($input['header'] as $k => $v) {
            $headers .= "$k: $v\r\n";
        }

        $str = "$method $path $this->HTTP_VERSION\r\n$headers\r\n$post";
        $this->req_text = $str;
        return true;
    }

    public function get_output(){
        return array(
            'code'=>$this->get_return_code(),
            'data'=>$this->get_response(),
        );
    }

    public function connect($ip, $port){
        return $this->sock->connect($ip, $port);
    }

    public function send(){
        $sock = &$this->sock;
        if (!empty($this->req_text)) {
            /*$host = $sock->getHost();
            $port = $sock->getPort();
            $this->req_host = $host;
            $this->req_host .= ($port == 80)? '' : ":$port";
            $this->add_header('Host', $this->req_host);
            $this->req_text = $this->to_string();*/

            $ret = $sock->send($this->req_text, strlen($this->req_text));
            return $ret == strlen($this->req_text);
        }
        return false;
    }

    /*private function receive_line_reliable($sock) {
        $str = '';
        while (true) {
            $line = $sock->receive_line();
            if ($line === false) {
                return false;
            }
            $str .= $line;
            if (substr($line, -2) == "\r\n") {
                return $str;
            }
        }
    }*/

    public function receive(){
        $sock = &$this->sock;
        $headers = '';
        while (($line = $sock->receive_line()) != false) {
            //while (($line = $this->receive_line_reliable($sock)) != false) {
            $headers .= $line;
            if ($line == "\r\n") {
                break;
            }
        }

        $this->res_content_length = null;
        $this->res_headers = array();
        if ($this->parse_res_header($headers) == false) {
            return false;
        }

        //read response text
        if ($this->res_content_length !== null) {
            //content length specified
            $this->res_text = $sock->receive($this->res_content_length);
        } else if (strpos($this->res_headers['transfer-encoding'], 'chunked') !== false) {
            //chunked encoding method
            $res = '';
            $temp = '';
            while(($line = $sock->receive_line()) != false) {
                $match = '';
                if (preg_match('/[0-9a-fA-F]+/', $line, $match) == 0) {
                    //error here
                    return false;
                }
                $len = hexdec($match[0]);
                if ($len == 0) {
                    break;
                }
                $res .= $sock->receive($len);

                //after each chunk, a \r\n will be sent
                $filler = $sock->receive(2);
                if ($filler != "\r\n") {
                    //error here;
                    return false;
                }
            }
            $this->res_text = $res;
        }
        return true;
    }

}

/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
