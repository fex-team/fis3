<?php
if (!defined('WWW_ROOT')) define('WWW_ROOT', realpath(dirname(__FILE__) . '/../') . DIRECTORY_SEPARATOR);
if (!defined('ROOT')) define('ROOT', dirname(__FILE__) . DIRECTORY_SEPARATOR);
if (!defined('PLUGIN_ROOT')) define('PLUGIN_ROOT', ROOT . DIRECTORY_SEPARATOR . 'plugin' . DIRECTORY_SEPARATOR);
if (!defined('LIBS_ROOT')) define('LIBS_ROOT', ROOT . DIRECTORY_SEPARATOR . 'libs' . DIRECTORY_SEPARATOR);

require_once LIBS_ROOT . 'Util.class.php';
require_once ROOT . 'Manager.class.php';
require_once ROOT . 'FISData.class.php';
require_once PLUGIN_ROOT . 'plugins.php';

class TestData {

    static private $_data_queue = array();
    static private $_flush_data_queue = array();

    private static $MIME = array(
        'bmp' => 'image/bmp',
        'css' => 'text/css',
        'doc' => 'application/msword',
        'dtd' => 'text/xml',
        'gif' => 'image/gif',
        'hta' => 'application/hta',
        'htc' => 'text/x-component',
        'htm' => 'text/html',
        'html' => 'text/html',
        'xhtml' => 'text/html',
        'ico' => 'image/x-icon',
        'jpe' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'jpg' => 'image/jpeg',
        'js' => 'text/javascript',
        'json' => 'application/json',
        'mocha' => 'text/javascript',
        'mp3' => 'audio/mp3',
        'mp4' => 'video/mpeg4',
        'mpeg' => 'video/mpg',
        'mpg' => 'video/mpg',
        'manifest' => 'text/cache-manifest',
        'pdf' => 'application/pdf',
        'png' => 'image/png',
        'ppt' => 'application/vnd.ms-powerpoint',
        'rmvb' => 'application/vnd.rn-realmedia-vbr',
        'rm' => 'application/vnd.rn-realmedia',
        'rtf' => 'application/msword',
        'svg' => 'image/svg+xml',
        'swf' => 'application/x-shockwave-flash',
        'tif' => 'image/tiff',
        'tiff' => 'image/tiff',
        'txt' => 'text/plain',
        'vml' => 'text/xml',
        'vxml' => 'text/xml',
        'wav' => 'audio/wav',
        'wma' => 'audio/x-ms-wma',
        'wmv' => 'video/x-ms-wmv',
        'xml' => 'text/xml',
        'xls' => 'application/vnd.ms-excel',
        'xq' => 'text/xml',
        'xql' => 'text/xml',
        'xquery' => 'text/xml',
        'xsd' => 'text/xml',
        'xsl' => 'text/xml',
        'xslt' => 'text/xml'
    );


    public static function register(FISData $data_instance) {
        self::$_data_queue[$data_instance->getDatatype()] = $data_instance;
    }

    public static function init() {
        self::register(new FISPHPData());
        self::register(new FISJSONData());
        self::register(new FISAdocData());

        self::$_flush_data_queue = array(); //暂时只需要一份数据
        $datatype = $_COOKIE['FIS_DEBUG_DATATYPE'];
        $flush_data = self::$_data_queue[$datatype];
        if (!$flush_data) {
            $flush_data = current(self::$_data_queue);
        }
        if ($flush_data) {
            self::$_flush_data_queue[] = $flush_data;
        }

        self::router();
    }

    public static function renderHelper($template_instance, $candidate_tmpl) {
        //support fis:test:page/index.tpl
        $test_id = $candidate_tmpl;
        if (strpos($test_id, ':') != false) {
            $info = explode(':', $test_id);
            if (count($info) == 3) {
                $test_id = $info[1] . '/' . $info[2];
            }
        }
        if (isset($_COOKIE['FIS_DEBUG_DATA']) && $_COOKIE['FIS_DEBUG_DATA'] === '4f10e208f47bfb4d35a5e6f115a6df1a') {
            //如果cookie值FIS_DEBUG_DATA存在，并且值为fis的md5，则渲染数据查看界面
            $manager = new Manager(self::$_data_queue, $test_id);
            $manager->render();
        }

        foreach (self::$_flush_data_queue as $data_instance) {
            $template_instance->assign($data_instance->getData($test_id));
        }

        $template_instance->display($candidate_tmpl);
    }

    public static function router() {
        $request_uri = $_SERVER['REQUEST_URI'];
        $pos = strpos($request_uri, '?');
        if ($pos !== false) {
            $request_uri = substr($request_uri, 0, $pos);
        }
        $uris = explode('/', $request_uri);
        if ($uris[1] == 'fisdata') {
            if ($uris[2] == 'static') {
                $uri_file = realpath(WWW_ROOT . $request_uri);
                if (is_file($uri_file)) {
                    $info = pathinfo($uri_file);
                    header("Content-Type: " . self::$MIME[$info['extension']]);
                    echo file_get_contents($uri_file);
                    exit;
                }
            } else {
                self::doAction($uris[2]);
            }
        }
    }

    private static function doAction($action) {
        $params = $_POST;
        foreach (self::$_flush_data_queue as $data_instance) {
            if (method_exists($data_instance, $action)) {
                call_user_func_array(array($data_instance, $action), array('params' => $params));
            }
        }
        exit();
    }
}
