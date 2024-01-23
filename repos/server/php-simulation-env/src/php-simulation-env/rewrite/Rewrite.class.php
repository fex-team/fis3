<?php

// fis.baidu.com

require_once (dirname(__FILE__) . '/../constant.var.php');
require (dirname(__FILE__) . '/Rule.class.php');

interface RewriteHandle {
    public function process($file);
}

class Rewrite {
    private $_rules = array();
    private $_configDir;
    private $_charset;
    private $_factoryHandles = array();

    public function __construct($configDir, $charset = 'utf-8') {
        $this->_configDir = $configDir;
        $this->_charset = $charset;
    }

    public function addConfigFile($subpath) {
        $this->_parse($subpath);
    }

    public function addRewriteHandle($ext, RewriteHandle $handle) {
        $this->_factoryHandles[$ext] = $handle;
    }

    public function addRule($type, $reg, $value) {
        array_push($this->_rules, new Rule($type, $reg, $value));
    }

    private function _parse($configFile) {
        $file = $this->_configDir . '/' . $configFile;
        $realpath = realpath($file);
        Log::getLogger()->info('Rewrite config filepath: %s realpath: %s', $file, $realpath);
        if ($realpath) {
            $content = file_get_contents($realpath);
            $splitArr = explode("\n", $content);
            foreach($splitArr as $idx => $line) {
                $line = trim($line);
                if ($line === '') {
                    continue;
                }
                if ($line[0] === '#') {
                    Log::getLogger()->info('Rewrite._parse #%s is comment, content: %s', $idx + 1, $line);
                    continue;
                }
                Log::getLogger()->info('Rewrite._parse #%s, content: %s', $idx + 1, $line);
                $ok = preg_match('/#.*$/', $line, $match); 
                if ($ok) {
                    Log::getLogger()->info('Rewrite._parse earse comment: %s', $match[0]);
                    $line = preg_replace('/#.*$/', '', $line);
                }
                $splitLineArr = preg_split('/\s+/', $line);
                $this->addRule($splitLineArr[0], '/' . $splitLineArr[1] . '/', $splitLineArr[2]);
            }
        } else {
            Log::getLogger()->info('Rewrite config file not exists: %s', $realpath);
        }
    }

    public function rewriteProcess($target) {
        $targetFile = realpath($target);
        if (!$targetFile) {
            Log::getLogger()->warn('Rewrite.rewriteProcess the target file %s is not exists.', $target);
            return;
        }
        $ok = preg_match('@\.(\w+)$@', $targetFile, $match);
        if ($ok) {
            $MIME = require_once(ROOT . '/mimetype/mimetype.php');
            $ext = $match[1];
            Log::getLogger()->info('Rewrite.rewriteProcess the target file %s, Ext: %s', $targetFile, $ext);
            if ($ext === 'php') {
                require_once($targetFile);
            } else if (isset($this->_factoryHandles[$ext])) { 
                $handle = $this->_factoryHandles[$ext];
                $handle->process($targetFile);
            } else {
                $contentType = $MIME[$ext];
                if (!$contentType) {
                    $contentType = 'text/plain';
                }
                header('Content-Type: ' . $contentType . ';charset='.$this->_charset);
                Log::getLogger()->info('Rewrite.rewriteProcess the target file %s, Content-Type: %s', $targetFile, $contentType);
                echo file_get_contents($targetFile);
            }
        } else {
            header('Content-Type: text/plain; charset=' . $this->_charset);
            echo file_get_contents($targetFile);
        }
    }

    public function dispatch($strUrl = null) {
        $url = $strUrl;
        if (isset($_SERVER['REQUEST_URI'])) {
            $url = $_SERVER['REQUEST_URI'];
        }

        if (!$url) {
            return;
        }

        foreach ($this->_rules as $rule) {
            if ($rule->match($url)) {
                $target = $rule->fill($url);

                if ($rule->type !== Rule::REDIRECT) {
                    $target = preg_replace('@\?.*$@', '', $target);
                }

                Log::getLogger()->info('Rewirte.dispatch target %s', $target);
                
                if ($rule->type === Rule::REWRITE) {
                    $this->rewriteProcess(WWW_ROOT . '/' . $target);
                } else if ($rule->type === Rule::REDIRECT) {
                    header('Location: ' . $target);
                } else if ($rule->type === Rule::RENDER) {
                    //@TODO ugly, it's old code
                    if (isset($this->_factoryHandles['tpl'])) {
                        $handle = $this->_factoryHandles['tpl'];
                        $handle->process($target);
                    } else {
                        Log::getLogger()->warn('Rewirte.dispatch Not found process handle of the tpl template file.');
                    }
                }
                exit();
            }
        }
    }
}
