<?php
// fis.baidu.com

class File {
    public $filepath = '';
    public $ext = '';
    public $rExt = '';
    public $filename = '';
    public $encoding = 'utf-8';

    public function __construct ($filepath, $options = array()) {
        if (isset($options['encoding']) && 
            is_string($options['encoding']) &&
            $options['encoding'] != ''
        ) {
            $this->encoding = $options['encoding'];
        }
        $this->_prepare($filepath);
    }

    public function getFilePathNoExt() {
        return str_replace($this->rExt, '', $this->filepath);
    }

    private function _prepare($filepath) {
        $filepath = Util::normalizePath($filepath);
        assert($filepath != false);
        $this->filepath = $filepath;

        //for get file ext.
        $ok = preg_match('@.*\.([\w]+)$@', $filepath, $match);
        if ($ok && isset($match[1])) {
            $this->rExt = '.' . $match[1];
            $this->ext = $match[1];
        } else {
            Mock::$logger->warn("the file has no ext.");
        }
    }
}
