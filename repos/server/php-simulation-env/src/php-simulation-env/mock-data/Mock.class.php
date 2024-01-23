<?php
// fis.baidu.com

// use component
require_once(dirname(__FILE__) . '/../constant.var.php');
require_once(dirname(__FILE__) . '/../log/Log.class.php');
require_once(dirname(__FILE__) . '/../util/Util.class.php');

require(dirname(__FILE__) . '/File.class.php');
require(dirname(__FILE__) . '/filetype/PHP.class.php');
require(dirname(__FILE__) . '/filetype/JSON.class.php');

class Mock {
    static public $logger = null; //logger
    static public $encoding = 'utf-8';
    static public $testPath;
    static public $wwwRoot;
    static public $filetype = array(
        '.php',
        '.json'
    );

    static public function init($root, $encoding = 'utf-8', array $opt = array()) {
        Mock::$logger = Log::getLogger();
        $root = Util::normalizePath($root);
        Mock::$wwwRoot = $root;
        Mock::$testPath = $root . '/test';

        //set encoding
        Mock::setEncoding($encoding);
    }

    static public function setEncoding($encoding) {
        Mock::$encoding = $encoding;
    }

    static public function setTestPath($root) {
        $root = Util::normalizePath($root);
        Mock::$testPath = $root;
    }

    static public function getData($subpath) {
        $subpath = Util::normalizePath($subpath);
        Mock::$logger->debug('start get data path: %s', $subpath);
        $file = new File($subpath);
        $ret = array();
        foreach (Mock::$filetype as $type) {
            $testFilePath = Util::normalizePath(Mock::$testPath . '/' . $file->getFilePathNoExt() . $type);
            Mock::$logger->debug('fetch test data path: %s type: %s', $testFilePath, $type);
            if (file_exists($testFilePath)) {
                if ($type == '.php') {
                    $testFile = new PHP($testFilePath);
                } else if ($type == '.json') {
                    $testFile = new JSON($testFilePath, array(
                        'encoding' => Mock::$encoding
                    ));
                }
                $ret = $testFile->getData();
                break;
            }
        }
        return $ret;
    }
}
