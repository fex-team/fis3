<?php

class Rule {
    // rewrite <reg> <router.php>
    const REWRITE = 0;
    // redirect <reg> <url>
    const REDIRECT = 1;
    // template <reg> <relative path of a template file>
    const RENDER = 2; 

    public $type;
    public $reg;
    public $value;

    private $_rel = array();
    
    public function __construct($type, $reg, $value) {
        if (is_numeric($type)) {
            $this->type = $type;
        } else if (is_string($type) && trim($type) !== '') {
            $this->type = $this->_parse($type);
        } else {
            Log::getLogger()->error(new Exception('Rule `type` must be asign.'));
        }

        $this->reg = $reg;
        $this->value = $value;
    }

    private function _parse($strType) {
        $strType = strtolower($strType);
        $ret = null;
        switch($strType) {
        case 'rewrite':
            $ret = Rule::REWRITE;
            break;
        case 'redirect':
            $ret = Rule::REDIRECT;
            break;
        case 'template':
            $ret = Rule::RENDER;
            break;
        }

        if ($ret === null) {
            throw new Exception('Rule `type` must be rewrite or template or redirect');
        }

        return $ret;
    }

    public function match($url) {
        $ok = preg_match($this->reg, $url, $match);
        Log::getLogger()->info('Rewrite.Rule.match reg: %s url: %s, matchCount: %s', $this->reg, $url, $ok);
        if (!$ok) {
            $match = null;
        }
        return $match;
    }

    public function fill($url) {
        $match = $this->match($url);
        $this->_rel = $match;
        $ret = $this->value;
        if ($match) {
            $ret = preg_replace_callback('/\$(\d+|&)/', array($this, 'replaceDefine'), $this->value);
        }
        $this->_rel = array();
        return $ret;
    }

    public function replaceDefine($match) {
        $idx = $match[1];

        if ($idx === '&') {
            return $this->_rel[0];
        } else if (isset($this->_rel[$idx])) {
            return $this->_rel[$idx];
        }

        return $match[0];
    }
}
