<?php
ini_set('display_errors', 1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

$root = dirname(__FILE__) . DIRECTORY_SEPARATOR;
require_once $root . "rewrite" . DIRECTORY_SEPARATOR . "Rewrite.php";
require_once $root . "fisdata" . DIRECTORY_SEPARATOR . "TestData.class.php";

TestData::init();

$path = $_SERVER['REQUEST_URI'];

function fis_debug_render_smarty($tpl = null, $data = array()) {
    $root = dirname(__FILE__) . DIRECTORY_SEPARATOR;
    $path = str_replace($root, '', $tpl);
    if (!$tpl) {
        $path = $_SERVER['REQUEST_URI'];
        $split = explode('/', $path);

        $len = count($split);

        if(($pos = strpos($path, '?')) !== false){
            $path = substr($path, 0, $pos);
        }
        //替换调最后的/
        $path = preg_replace('/\/$/', '', $path);
        if(1 === $len){
            $path .= '/index.tpl';
            $tpl = $root . 'template' . $path;
        } else {
            array_shift($split);
            $namespace = array_shift($split);
            //fis:namespace:page/index.tpl
            $tpl = 'fis:'.$namespace.':'.implode('/', $split) . '.tpl';
            //var_dump($tpl);
            //exit();
        }
    }

    require_once ($root . 'smarty/Smarty.class.php');
    $smarty = new Smarty();
    $default_conf = array(
        'template_dir' => 'template',
        'config_dir' => 'config',
        'plugins_dir' => array( 'plugin' ),
        'left_delimiter' => '{%',
        'right_delimiter' => '%}'
    );
    if(file_exists($root . 'smarty.conf')){
        $user_conf = parse_ini_file($root . 'smarty.conf');
        if(!empty($user_conf)){
            $default_conf = array_merge($default_conf, $user_conf);
        }
    }
    $smarty->setTemplateDir($root . $default_conf['template_dir']);
    $smarty->setConfigDir($root . $default_conf['config_dir']);
    foreach ($default_conf['plugins_dir'] as $dir) {
        $smarty->addPluginsDir($root . $dir);
    }
    $smarty->setLeftDelimiter($default_conf['left_delimiter']);
    $smarty->setRightDelimiter($default_conf['right_delimiter']);
    TestData::renderHelper($smarty, $tpl);
}

function fis_debug_template_rewrite_rule($rewrite, $url, $root, $matches){
    if(file_exists($root . 'template/' . $rewrite)){
        header('Content-Type: text/html');
        fis_debug_render_smarty($rewrite);
    } else {
        Rewrite::header(404);
    }
}

Rewrite::addRewriteRule('template', 'fis_debug_template_rewrite_rule');
if(!Rewrite::match($path)) {
    if(($pos = strpos($path, '?')) !== false){
        $path = substr($path, 0, $pos);
    }
    if('/' === $path){
        echo 'index';
    } else {
        $len = strlen($path) - 1;
        if('/' === $path{$len}){
            $path = substr($path, 0, $len);
        }
        $split = explode('/', $path);
        if('static' === $split[1]){
            $file = $root . substr($path, 1);
            if(is_file($file)){
                $content_type = 'Content-Type: ';
                $pos = strrpos($file, '.');
                if(false !== $pos){
                    $ext = substr($file, $pos + 1);
                    $MIME = array(
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
                        'woff' => 'image/woff',
                        'xml' => 'text/xml',
                        'xls' => 'application/vnd.ms-excel',
                        'xq' => 'text/xml',
                        'xql' => 'text/xml',
                        'xquery' => 'text/xml',
                        'xsd' => 'text/xml',
                        'xsl' => 'text/xml',
                        'xslt' => 'text/xml'
                    );
                    $content_type .= $MIME[$ext] ? $MIME[$ext] : 'application/x-' . $ext;
                } else {
                    $content_type .= 'text/plain';
                }
                header($content_type);
                echo file_get_contents($file);
            } else {
                Rewrite::header(404);
            }
        } else {
            fis_debug_render_smarty();
        }
    }
}
