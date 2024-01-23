<?php

class FISTranslate {
    static public $locale;
    static public $config_dir;
    static public $lang_map = array();

    static public function init($locale, $modules, $config_dir) {
        self::$locale = $locale;
        self::$config_dir = $config_dir;
        foreach ($modules as $namespace) {
            self::register($namespace);
        }
    }

    /**
     * 收集语言文件，包括所有当前环境中模块的数据
     */
    static public function register($namespace) {
        $namespace = trim($namespace);
        foreach (self::$config_dir as $dir) {
            $locale = self::$locale ? '.' . self::$locale : ''; 
            $prefix = preg_replace('/[\\/\\\\]+/', '/', $dir . '/lang/' . $namespace . $locale);

            if (is_file($prefix . '.php')) {
                self::$lang_map[self::$locale] = require_once($prefix . '.php');
            } else if (is_file($prefix . '.json')) {
                self::$lang_map[self::$locale] = json_decode(file_get_contents($prefix . '.json'), true);
            }
        }
    }

    static public function getText($string) {
        foreach (self::$lang_map as $l => $items) {
            if (isset($items[$string])) {
                $res = $items[$string];
                if ($res) {
                    return $res;
                }
                return $string;
            }
        }
        return $string;
    }

}


/**
 * 翻译函数
 * @access global
 * @name __
 */
function __($string) {
    return FISTranslate::getText($string);
}
