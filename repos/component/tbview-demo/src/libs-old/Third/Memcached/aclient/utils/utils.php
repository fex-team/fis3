<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/



/**
 * @file frame/utils.php
 * @author liuqingjun(com@baidu.com)
 * @date 2010/09/13 14:54:34
 * @brief 
 *  
 **/

define('ACLIENT_VAR_DIR', dirname(__FILE__)."/../var/");
require_once(dirname(__FILE__) . "/../../Log.php");

class AClientUtils {
    
    /*
     * dump an object to a file, the object will be serialized automatically
     * $var is the object to be dumped
     *
     * this function is thread safe
     */
    public static function dump_to_file($var, $filename, $path) {
        $file = $path . '/' . $filename;
        $fd = fopen($file, 'a+b');
        if (flock($fd, LOCK_EX)) {
            ftruncate($fd, 0);
            fwrite($fd, serialize($var));
            flock($fd, LOCK_UN);

            fclose($fd);
            return true;
        } else {
            //could not get lock
            fclose($fd);
            return false;
        }
    }

    /*
     * retrieve previously dumped object from a file
     * $filename = filename specified in dump_to_file
     *
     * this function is thread safe
     */
    public static function retrieve_from_file($filename, $path) {
        $file = $path . '/' . $filename;
        if (!file_exists($file)) {
            return null;
        }
        $fd = fopen($file, 'rb');
        if (flock($fd, LOCK_SH)) {
            $data = fread($fd, filesize($file));
            $var = unserialize($data);
            flock($fd, LOCK_UN);

            fclose($fd);
            return $var;
        } else {
            //could not get lock
            fclose($fd);
            return null;
        }
    }

    /*
    public static function set_key($key, $value, $ttl ) {
        $ret = eaccelerator_put($key, serialize($value), $ttl);
        if($ret != true){
            self::add_error("eaccelerator put key[$key] falied");
        }
        return $ret;
    }
     */

    /*
     * store object in file cache.
     * $key is the key to be stored
     */
    public static function set_key($key, $value, $lifeTime=-1)
    {
        $fileName = self::key_to_file($key);
        if($lifeTime == 0) {
            return true;
        }
        if ($lifeTime>0) {
            $refresh_time = gettimeofday(true) + $lifeTime;
        } else {
            $refresh_time = null;
        }
        $value = array(
        	'refresh_time'=>$refresh_time,
        	'data'=>$value,
        );
        $value = "<?php \n return " . var_export($value,true) . ";\n \x3F>";
        return file_put_contents($fileName,$value,LOCK_EX);
    }

    /*
    public static function get_key($key) {
        $data = eaccelerator_get($key);
        if (is_string($data)) {
            return unserialize($data);
        }
        return null;
    }*/

    /*
     * retrieve a key from file cache
     * see also set_key
     */
    public static function get_key($key)
    {
        $fileName = self::key_to_file($key);

        $fd = @fopen($fileName, 'rb');
        if (!is_resource($fd)) {
            return null;
        }
        if (!flock($fd, LOCK_SH)) {
            return null;
        }

        $value = include($fileName);
        flock($fd, LOCK_UN);

        if ( is_array($value) && isset($value['data']) ) {
            if (isset($value['refresh_time']) && $value['refresh_time'] < gettimeofday(true)) {
        //        @unlink($fileName);
                return null;
            }
            return $value['data'];
        }
        return null;
    }

    public static function remove_key($key)
    {
        $fileName = self::key_to_file($key);
        if (file_exists($fileName))
        {
            @unlink($fileName);
        }
    }

    static function key_to_file($key)
    {
        if (!file_exists(ACLIENT_VAR_DIR)) {
            mkdir(ACLIENT_VAR_DIR);
        }
        return ACLIENT_VAR_DIR . '/' . rawurlencode($key) . '.php';
    }    

    public static function ip_distance($ip1, $ip2) {
        $val1 = ip2long($ip1);
        $val2 = ip2long($ip2);
        if ($val1 > $val2) {
            return $val1 - $val2;
        } else {
            return $val2 - $val1;
        }
    }

    public static function ip_xor($ip1, $ip2) {
        $val1 = ip2long($ip1);
        $val2 = ip2long($ip2);
        return $val1 ^ $val2;
    }

    static $err_info=null;

    static function _warning($str) {
        printf($str . "\n");
    }
    public static function clear_error(){
        self::$err_info=array();
        self::$err_info['message']='';
    }

    public static function add_error($msg){
        Ak_Log::warning($msg);
        self::$err_info['message'].="$msg; ";
    }

    public static function get_error(){
        return self::$err_info;
    }

    public static function create_obj($class_name, $base_name, $file){
        if(!file_exists($file)){
            return null;
        }
        require_once($file);
        if(!class_exists($class_name)) {
            return null;
        }
        $obj = new $class_name();
        if ($obj instanceof $base_name) {
            return $obj;
        }
        else{
            return null;
        }
    }

    public static function int2uint(&$val){
        if($val < 0){
            $val = $val & 0xffffffff;
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
