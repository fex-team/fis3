<?php
/**
 * @brief class for data sending/recving via socket
 *
 * using block mode, with timeout set
 * total timeout is approximately judged
 *
 * @example
 *
 **/

define('ACLIENT_DEFAULT_TIMEOUT',1);
class AClientSocket
{
    protected $connect_timeout = ACLIENT_DEFAULT_TIMEOUT;
    protected $read_timeout = ACLIENT_DEFAULT_TIMEOUT;
    protected $write_timeout = ACLIENT_DEFAULT_TIMEOUT;
    protected $retry = 3;
    protected $connect_type = 0;

    protected $_sock;

    public function __construct(){

    }

    function ms_to_second($time_ms){
        $time_ms = (float)$time_ms / 1000;
        if($time_ms <= 0){
            $time_ms = ACLIENT_DEFAULT_TIMEOUT;
        }
        return $time_ms;
    }

    function set_sock_timeout($timeout){
        $timeout = (int)($timeout * 1000000);
        $second = $timeout / 1000000;
        $us = $timeout % 1000000;
        stream_set_timeout($this->_sock, $second, $us);
    }

    public function __destruct() {
        $this->close();
    }

    public function close() {
        if (is_resource($this->_sock)) {
            fclose($this->_sock);
            $this->_sock = null;
        }
    }

    public function set_connect_type($connect_type){
        if($connect_type == 'Long'){
            $this->connect_type = 1;
        }
        else{
            $this->connect_type = 0;
        }
    }

    public function set_retry($retry){
        $retry = (int)$retry;
        if($retry >= 1){
            $this->retry = $retry;
        }
    }

    public function set_timeout($connect_timeout, $read_timeout, $write_timeout) {
        $this->connect_timeout = $this->ms_to_second($connect_timeout);
        $this->read_timeout = $this->ms_to_second($read_timeout);
        $this->write_timeout = $this->ms_to_second($write_timeout);
    }

    public function set_resource($resource) {
        $this->close();
        if (is_resource($resource)) {
            $this->_sock = $resource;
            return true;
        }
        return false;
    }

    public function connect($ip, $port, $timeout = null, $retry = null) {
        $this->close();
        $timeout = is_null($timeout) ? $this->connect_timeout : $this->ms_to_second($timeout);
        $retry = is_null($retry) ? $this->retry : $retry;

        for($i = 0; $i < $retry; $i++) {
            $this->_sock = @fsockopen($ip, $port, $err_no, $err_msg, $timeout);
            if(is_resource($this->_sock)){
                break;
            }
        }
        if (!is_resource($this->_sock)) {
            return false;
        }

        stream_set_blocking($this->_sock, true);
        return true; 
    }

    public function send($data, $length, $timeout = null) {
        if ($length < 0){
            return false;
        }
        $timeout = is_null($timeout) ? $this->write_timeout : $this->ms_to_second($timeout);
        $this->set_sock_timeout($timeout);

        $sent = fwrite($this->_sock, $data, $length);
        if ($sent == $length) {
            return true;
        } 
        else {
            return false;
        }
    }

    public function receive($length, $timeout = null) {
        if ($length < 0){
            return null;
        }
        $timeout = is_null($timeout) ? $this->read_timeout : $this->ms_to_second($timeout);
        $this->set_sock_timeout($timeout);

        $strData    = '';
        $intLeft    = $length;
        $tmStart    = gettimeofday(true);

        while ($intLeft > 0) {
            $strReceived = fread($this->_sock, $intLeft);
            $intReceived = strlen($strReceived);
            if (0 == $intReceived) {
                return null;
            } 
            else if ($intReceived > 0 && $intReceived <= $intLeft) {
                $strData .= $strReceived;
                $intLeft -= $intReceived;
            } 
            else {
                return null;
            }

            $tmCurrent = gettimeofday(true);
            if ($tmCurrent-$tmStart > $timeout) {
                return null;
            }
        }
        return $strData;
    }

    public function receive_line($max_length = null, $timeout = null) {
        if ($max_length < 0){
            return null;
        }
        $timeout = is_null($timeout) ? $this->read_timeout : $this->ms_to_second($timeout);
        $this->set_sock_timeout($timeout);

        $strData    = '';
        $intLeft    = ($max_length == null)? null : $max_length - 1;
        $tmStart    = gettimeofday(true);

        while ($intLeft == null || $intLeft > 0) {
            if ($intLeft == null) {
                $strReceived = fgets($this->_sock);
            } else {
                $strReceived = fgets($this->_sock, $intLeft);
            }
            if ($strReceived == false || $strReceived == "") {
                //error or end reached
                if ($strData != '') {
                    return $strData;
                } else {
                    return null;
                }
            }
            $intReceived = strlen($strReceived);
            if (0 == $intReceived) {
            }
            else if ($intReceived > 0) {
                $strData .= $strReceived;
                if ($intLeft != null && $intReceived <= $intLeft) {
                    $intLeft -= $intReceived;
                }
            } 
            else {
                return null;
            }
            if (strpos($strData, "\n") !== false) {
                break;
            }
            // manual timeout checking
            $tmCurrent = gettimeofday(true);
            if ($tmCurrent-$tmStart > $timeout) {
                return $strData;
            }
        }
        return $strData;

    }

    public function get_last_error() {
        if (!is_resource($this->_sock)) {
            return "err_no[-1] err_msg[invalid sock]";
        }
        $intErrorNo         = socket_last_error($this->_sock);
        $strErrorMessage    = socket_strerror($intErrorNo);
        return "err_no[$intErrorNo] err_msg[$strErrorMessage]";
    }

}

/* vim: set et ts=4 */
?>
