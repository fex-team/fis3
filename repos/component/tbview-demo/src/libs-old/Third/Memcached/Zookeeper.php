<?php
/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/



/**
 * @file Zookeeper.php
 * @author wangweibing(com@baidu.com)
 * @date 2011/05/18 10:56:49
 * @brief 
 *  
 **/

require_once(dirname(__FILE__) . '/Log.php');
require_once(dirname(__FILE__) . '/LocalCache.php');

class Ak_Zookeeper {
    protected static $zk = null;
    protected static $host = null;
    // mod by cdz
    protected static $timeout = null; //not recommended, only reserved for Compatible
    protected static $retry_times = null; 
    protected static $backup_dir = null;
    protected static $use_backup_only = false;
    protected static $r_timeout = null; //ms
    protected static $w_timeout = null; //ms
    protected static $c_timeout = null; //ms

    public static function setTimeout($timeout_){ //not recommended, only reserved for Compatible
        if( !empty($timeout_) )
            self::$timeout = $timeout_;
    }

    // for timeout
    // 注意：与zk建立连接后，读写超时并不会严格生效!!
    public static function setCTimeout($ctimeout_){
        if( !empty($ctimeout_) )
            self::$c_timeout = $ctimeout_;
    }
    public static function setRTimeout($rtimeout_){
        if( !empty($rtimeout_) )
            self::$r_timeout = $rtimeout_;
    }
    public static function setWTimeout($wtimeout_){
        if( !empty($wtimeout_) )
            self::$w_timeout = $wtimeout_;
    }

    public static function setRetryTimes($retry_times_){
        if( !empty($retry_times_) )
            self::$retry_times = $retry_times_;
    }

    public static function setHost($host_) {
        if (is_array($host_)) {
            self::$host = implode(',', $host_);
        } else {
            self::$host = $host_;
        }
    }

    public static function setBackupDir($dir_){
        if( !empty($dir_) ){
            self::$backup_dir = $dir_;
        }
        else{
            // use default
            // ./var or DATA_PATH/ak(odp)
        }
    }

    public static function useBackupOnly($flag_ = false ){
        if( $flag_ === true ){
            self::$use_backup_only = true;
        }
    }

    private static function _checkConfig() {
        if (empty(self::$retry_times)) {
            self::$retry_times = 0;
        }
        if (empty(self::$timeout)) {
            self::$timeout = 1000;
        }
        if (empty(self::$c_timeout)) {
            self::$c_timeout = self::$timeout;
        }
        if (empty(self::$r_timeout)) {
            self::$r_timeout = 1000;
        }
        if (empty(self::$w_timeout)) {
            self::$w_timeout = 1000;
        }
    }

    private static function _getZk() {
        if (!(self::$zk instanceof Zookeeper)) {
            self::_checkConfig();
            self::$zk = new Zookeeper(self::$host, null, self::$c_timeout);
        }
        return self::$zk;
    }

    public static function get($path, $depth = 0, $max_retry_times = 0) {
        self::_checkConfig();
        $bounding_time = gettimeofday(true) + self::$r_timeout / 1000;
        return self::_get( $path, $depth, $max_retry_times, $bounding_time);
    }

    private static function _get($path, $depth, $max_retry_times, $bound_time) {
        $zk = self::_getZk();
        $host = self::$host;

        if( $max_retry_times < 0 ){
            return null;
        }

        do{
            if( gettimeofday(true) > $bound_time )
            {
                Ak_Log::warning("zookeeper get data timeout, host[$host] path[$path]");
                return null;
            }
            $json = @$zk->get($path);
            if ($json !== null){
                break;
            }
        }while( $max_retry_times-- > 0 );

        // if get success, $max_retry_times >= 0
        if( $max_retry_times < 0 )
        {
            Ak_Log::warning("zookeeper get data failed, host[$host] path[$path] data[$json]");
            return null;
        }

        $res = json_decode(trim($json), true);
        if( !is_array($res)){
            return null;
        }

        if ($depth <= 0) {
            return $res;
        }

        do{
            if( gettimeofday(true) > $bound_time )
            {
                Ak_Log::warning("zookeeper get data timeout, host[$host] path[$path]");
                return null;
            }
            $children = @$zk->getChildren($path);
            if( $children !== null && is_array($children)){
                break;
            }
        }while( $max_retry_times-- > 0 );

        if( $max_retry_times < 0 ){
            Ak_Log::warning("zookeeper get children failed, host[$host] path[$path]");
            return null;
        }

        sort($children);

        $res['children'] = array();
        foreach ($children as $child) {
            if( gettimeofday(true) > $bound_time )
            {
                Ak_Log::warning("zookeeper get data timeout, host[$host] path[$path]");
                return null;
            }
            $sub_path = $path . '/' . $child;
            $res['children'][$child] = self::_get($sub_path, $depth - 1, $max_retry_times, $bound_time);
        }

        return $res;
    }

    public static function getCached($path, $depth = 0, $expire = 60, $user_def = null) {
        $zk_key = "Ak_Zookeeper." . $path . "." . $depth;
        $zk_bak_key = $zk_key . ".bak";

        if( !(self::$backup_dir === null) ){
            AK_LocalCache::setDir(self::$backup_dir);
            $zk_lock_dir = self::$backup_dir;
        }else{
            $zk_lock_dir = defined('IS_ODP') ? DATA_PATH.'/ak' : dirname(__FILE__).'/var';
        }


        $res = Ak_LocalCache::get($zk_key);
        if (is_array($res)) {
            return $res;
        }

        if (!file_exists($zk_lock_dir)) {
            mkdir($zk_lock_dir);
        }

        $zk_lock = $zk_lock_dir.'/zk_lock';
        $fd = fopen($zk_lock, 'a+b');
        if (!flock($fd, LOCK_EX)) {
            Ak_Log::warning("zk lock failed");
            fclose($fd);
            return null;
        }

        $res = Ak_LocalCache::get($zk_key);
        if (!is_array($res)) {
            $bak = Ak_LocalCache::get($zk_bak_key);
            if (!empty($bak) && is_array($bak)) {
                Ak_LocalCache::set($zk_key, $bak, $expire);
            } else {
                $bak = null;
            }
            flock($fd, LOCK_UN);

            if(self::$use_backup_only){
                $res = null;
            }else{
                // for null bak, add by cdz
                if( $bak === null ){
                    Ak_Log::warning( "local-cached file is empty, waiting to get from zk..." );
                    $bak_zk_lock = $zk_lock_dir.'/'.'bak_zk_lock';
                    $bak_fd = fopen( $bak_zk_lock, 'a+b' );
                    // non-block lock
                    if (!flock($bak_fd, LOCK_EX|LOCK_NB, $eWouldBlock) || $eWouldBlock) {
                        Ak_Log::warning("zk lock failed, path[$path], eWouldBlock[$eWouldBlock]");
                        fclose($bak_fd);
                        return null;
                    }
                    $res = Ak_LocalCache::get($zk_key);
                    if (!is_array($res)) {
                        $bak = Ak_LocalCache::get($zk_bak_key);
                        if (!empty($bak) && is_array($bak)) {
                            Ak_LocalCache::set($zk_key, $bak, $expire);
                            flock($bak_fd, LOCK_UN);
                            fclose($bak_fd);
                        } else {
                            $bak = null;
                        }

                        $res = self::get($path, $depth, self::$retry_times);
                        if (is_callable($user_def)) {
                            $res = call_user_func($user_def, $res);
                        }
                    }
                }
                else{
                    // still need to get
                    $res = self::get($path, $depth, self::$retry_times);
                    if (is_callable($user_def)) {
                        $res = call_user_func($user_def, $res);
                    }
                }
            }

            if (!empty($res) && is_array($res)) {
                Ak_LocalCache::set($zk_bak_key, $res, -1);
                Ak_LocalCache::set($zk_key, $res, $expire);
                if( $bak === null ){
                    Ak_Log::warning( "getting data from zk done, local-cached file created" );
                    if( !self::$use_backup_only ){
                        flock($bak_fd, LOCK_UN );
                        fclose($bak_fd);
                    }
                }
            } else {
                self::$zk = null;
                if( empty($bak) )
                {
                    if( self::$use_backup_only )
                        Ak_Log::warning( "FATAL ERROR: zk is disabled and cached file is empty" );
                    else
                    {
                        Ak_Log::warning( "FATAL ERROR: get from zk failed and cached file is empty too, data[NULL]" );
                        flock($bak_fd, LOCK_UN );
                        fclose($bak_fd);
                    }
                    fclose($fd);
                    return null;
                }
                if( !self::$use_backup_only )
                    Ak_Log::warning("Using cached data[".var_export($bak, true)."] instead");
                $res = $bak;
            }
        }else {
            flock($fd, LOCK_UN);
        }

        fclose($fd);

        return $res;
    }

    public static function set($path, $value) {
        $zk = self::_getZk();

        if ($value === array()) {
            // for C module, C do not recognize '[]'
            $json = '{}';
        } else {
            $json = json_encode($value);
        }

        if (!$zk->exists($path)) {
            $acl = array(
                array(
                    'perms' => 31,
                    'scheme' => 'world',
                    'id' => 'anyone',
                ),
            );
            $ret = $zk->create($path, $json, $acl);
        } else {
            $ret = $zk->set($path, $json);
        }
        return $ret;
    }

    public static function delete($path) {
        $zk = self::_getZk();

        $children = $zk->getChildren($path);
        foreach ($children as $child) {
            $subpath = $path . '/' . $child;
            self::delete($subpath);
        }

        $zk->delete($path);
    }

    public static function deleteChildren($path) {
        $zk = self::_getZk();

        $children = $zk->getChildren($path);
        foreach ($children as $child) {
            $subpath = $path . '/' . $child;
            self::delete($subpath);
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
