<?php
// fis.baidu.com

/**
 * Log
 */
class Log {

    const INFO = 0x00000001;
    const DEBUG = 0x00000010;
    const WARN = 0x0000100;
    const ERROR = 0x00001000;
    const ALL = 0x00001111;

    public $fd = 'php://stdout';
    public $level = 0;
    public $prefix = '';
    public $requestUrl = '';
    static private $_logger = null;

    public function __construct($config) {
        if (isset($config['fd'])) {
            $this->fd = $config['fd'];
        }

        if (isset($config['level'])) {
            $this->level = $config['level'];
        }

        if (isset($config['prefix'])) {
            $this->prefix = $config['prefix'];
        }

        if (isset($config['requestUrl'])) {
            $this->requestUrl = $config['requestUrl'];
        }
    }

    static public function getLogger(array $config = array()) {
        if (!Log::$_logger) {
            Log::$_logger = new Log($config);
        }
        return Log::$_logger;
    }

    private function _log($level, $format, $messages) {
        assert(is_array($messages));
        if ($level & $this->level) {
            if (is_file($this->fd)) {
                $mtime = filemtime($this->fd);
                if (time() >= $mtime + 3600 * 24) {
                    file_put_contents($this->fd . '-' . date('Y-m-d', $mtime + 3600 * 24), file_get_contents($this->fd));
                    file_put_contents($this->fd, ''); //reset
                }
            }
            array_unshift($messages, $format);
            file_put_contents($this->fd, sprintf(
                "%s %s %s [%s]\n",
                $this->prefix,
                date('Y-m-d H:i:s'),
                call_user_func_array('sprintf', $messages),
                $this->requestUrl
            ), FILE_APPEND);
        }
    }

    public function info() {
        $fnArgs = func_get_args();
        assert(count($fnArgs) >= 1);
        if (count($fnArgs) == 1) {
            array_unshift($fnArgs, '%s');
        }
        //format
        $format = '[INFO] ' . array_shift($fnArgs);
        $this->_log(Log::INFO, $format, $fnArgs);
    }

    public function debug() {
        $fnArgs = func_get_args();
        assert(count($fnArgs) >= 1);
        if (count($fnArgs) == 1) {
            array_unshift($fnArgs, '%s');
        }
        //format
        $format = '[DEBUG] ' . array_shift($fnArgs);
        $this->_log(Log::DEBUG, $format, $fnArgs);
    }

    public function warn() {
        $fnArgs = func_get_args();
        assert(count($fnArgs) >= 1);
        if (count($fnArgs) == 1) {
            array_unshift($fnArgs, '%s');
        }
        //format
        $format = '[WARN] ' . array_shift($fnArgs);
        $this->_log(Log::WARN, $format, $fnArgs);
    }

    public function error(Exception $err) {
        //format
        $this->_log(
            Log::ERROR,
            '[ERROR] %s',
            array(
                sprintf('MSG: %s, TRACE: %s', $err->getMessage(), implode('----', $err->getTrace()))
            )
        );
    }
}
