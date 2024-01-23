<?php
/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file LocalCache.php
 * @author wangweibing(com@baidu.com)
 * @date 2011/05/18 11:01:16
 * @brief 
 *  
 **/

require_once(dirname(__FILE__) . "/Log.php");

class Ak_LocalCache {
    protected static $dir = null;
    protected static $depth = 2;

    protected static function _keyToFile($key)
    {
        $dir = self::$dir;
        if ($dir == null) {
            if (defined('IS_ODP')) {
                $dir = DATA_PATH.'/ak';
            } else {
                $dir = dirname(__FILE__).'/var';
            }
        }

        $md5 = md5($key);
        for($i = 0; $i < self::$depth; $i++) {
            $dir .= '/' . $md5[$i];
        }
        
        if (!file_exists($dir)) {
            $ret = mkdir($dir, 0755, true);
            if ($ret != true) {
                Ak_Log::warning("make dir[$dir] failed");
                return null;
            }
        }
        return $dir . '/' . $md5 . '.php';
    }    

    public static function setDir($dir) {
        self::$dir = $dir;
    }

    public static function set($key, $value, $expire = -1)
    {
        $file = self::_keyToFile($key);

        if ($expire == 0) {
            return true;
        }
        if ($expire > 0) {
            $refresh_time = gettimeofday(true) + $expire;
        } else {
            $refresh_time = null;
        }

        $value = array(
        	'refresh_time' => $refresh_time,
        	'data' => $value,
        );
        $content = "<?php \n//key:$key\n return " . var_export($value,true) . ";\n \x3F>";

        $temp_file = $file . "_" . getmypid();
        $ret = file_put_contents($temp_file, $content);
        $ret = $ret && rename($temp_file, $file);
        return $ret;
    }

    public static function get($key)
    {
        $file = self::_keyToFile($key);

        if (!file_exists($file)) {
            return null;
        }

        $value = @include($file);

        if ( is_array($value) && isset($value['data']) ) {
            if (isset($value['refresh_time']) && $value['refresh_time'] < gettimeofday(true)) {
                return null;
            }
            return $value['data'];
        }
        return null;
    }

    public static function delete($key) {
        $file = self::_keyToFile($key);
        if (file_exists($file)) {
            @unlink($file);
            return true;
        } else {
            return false;
        }
    }

}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
