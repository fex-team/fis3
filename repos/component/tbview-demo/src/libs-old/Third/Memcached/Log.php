<?php
/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file log.php
 * @author wangweibing(com@baidu.com)
 * @date 2011/05/18 10:34:53
 * @brief 
 *  
 **/

class Ak_Log {
    protected static $handler = array();
    protected static $depth = 0;
    protected static $buffer = array();
    protected static $limit = -1;
    protected static $log_notice = false;

    protected static function _writeLog($level, $str) {
        if (is_callable(@self::$handler[$level])) {
            call_user_func(self::$handler[$level], $str);
        } 
//         elseif (@is_callable('log_' . $level)) {
//             call_user_func('log_' . $level, $str);
//         }
//         elseif (@is_callable('Bd_Log::' . $level)) {
//             call_user_func('Bd_Log::' . $level, $str);
//         } 
//         elseif (@is_callable('CLogger::' . $level)) {
//             call_user_func('CLogger::' . $level, $str);
//         }
        elseif (is_callable('Bingo_Log::' . strtolower($level))) {
        	call_user_func('Bingo_Log::' . strtolower($level), $str);
        }
//         elseif (@is_callable('UB_LOG_' . strtoupper($level))) {
//             call_user_func('UB_LOG_' . strtoupper($level), '%s', $str);
//         }
//         else {
//             switch ($level) {
//             case 'debug':  //fall through
//             case 'notice':
//                 trigger_error($str, E_USER_NOTICE);
//                 break;
//             case 'warning':
//                 trigger_error($str, E_USER_WARNING);
//                 break;
//             default:
//                 trigger_error("unknow log level!! error msg: $str", E_USER_ERROR);
//                 break;
//             }
//         }
    }

    protected static function _doLog($level, $str) {
        if (self::$limit > 0) {
            $str = substr($str, 0, self::$limit);
        }
        if (self::$depth == 0) {
            self::_writeLog($level, $str);
        } else {
            self::$buffer[self::$depth][] = array($level, $str);
        }
    }

    public static function setHandler($level, $handler) {
        self::$handler[$level] = $handler;
    }

    public static function setLimit($limit) {
        self::$limit = $limit;
    }

    public static function warning($str) {
        self::_doLog('warning', $str);
    }

    public static function debug($str) {
        self::_doLog('debug', $str);
    }

    public static function notice($str) {
        self::_doLog('notice', $str);
    }

    public static function beginSub() {
        self::$depth++;
        self::$buffer[self::$depth] = array();
    }

    public static function endSub($need_log) {
        if (self::$depth <= 0) {
            self::_writeLog('warning', "can't endSub on depth " . self::$depth);
            return;
        }
        self::$depth--;
        if ($need_log) {
            foreach(self::$buffer[self::$depth + 1] as $item) {
                self::_doLog($item[0], $item[1]);
            }
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
