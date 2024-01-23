<?php
/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file Op.php
 * @author wangweibing(com@baidu.com)
 * @date 2011/06/08 15:13:09
 * @brief 
 *  
 **/

class Ak_Op {
    protected $conf = array();
    protected $db = array();
    protected $confirm_before = false;
    protected $confirm_after = false;
    //protected $confirm_each = false;
    protected $confirm_retry = false;
    protected $confirm_modify = false;
    protected $zk_path = "";

    protected function __construct() {
    }

    public static function create($conf) {
        $op = new Ak_Op();
        $op->conf = $conf;
        Ak_Zookeeper::setHost($conf['zk_host']);
        Ak_Log::setHandler('warning', 'Ak_Op::error');
        //mysqli_report(MYSQLI_REPORT_ALL ^ MYSQLI_REPORT_INDEX);
        //foreach ($conf['db'] as $name => $info) {
        //    $db = new mysqli($info['db_host'], $info['db_user'], $info['db_pass'], $info['db_name'], $info['db_port']);
        //    $db->set_charset("utf8");
        //    $op->db[$name] = $db;
        //}
        return $op;
    }

    public static function error($str) {
        throw new Exception($str);
    }

    public function setConfirm($str) {
        $this->confirm_before = strpos($str, 'b') !== false;
        $this->confirm_after  = strpos($str, 'a') !== false;
        //$this->confirm_each   = strpos($str, 'e') !== false;
        $this->confirm_retry  = strpos($str, 'r') !== false;
        $this->confirm_modify  = strpos($str, 'm') !== false;
    }

    public function choose($str, $options) {
        $this->show($str . "\n");
        do {
            foreach ($options as $k => $v) {
                $this->show("输入 $k 则 $v ;");
            }
            $s = fgets(STDIN);
            $s = $s[0];
        } while (!isset($options[$s]));
        return $s;
    }

    public function confirm($str) {
        $this->show($str . "\n");
        $this->show("按回车继续：");
        $s = fgets(STDIN);
        return;
    }

    public function show($str) {
        if (isset($this->conf['encoding'])) {
            $str = iconv('utf8', $this->conf['encoding'], $str);
        }
        echo $str;
    }

    public function toIp($host) {
        $pos = strpos($host, '@');
        if ($pos !== false) {
            $host = substr($host, $pos + 1);
        }
        if (preg_match('/^(\d{1,3}\.){3}\d{1,3}$/', $host)) {
            return $host;
        } else {
            return gethostbyname($host);
        }
    }

    public function getRalConf($param) {
        $conf = array (
            'name' => $param['service'],
            'services' => array (
                $param['service'] => array (
                    'SuperStrategy' => array (
                        'Balance' => 'Consistency',
                        'ConnectQueueSize' => 100,
                        'ConnectX1' => 10,
                        'ConnectX2' => 40,
                        'ConnectY2' => 6,
                        'ConnextY1' => 95,
                        'CrossRoom' => 'Off',
                        'HealthyBackupThreshold' => 3,
                        'HealthyCheckTime' => 3,
                        'HealthyMinRate' => 0.1,
                        'HealthyQueueSize' => 100,
                        'HealthyTimeout' => 100,
                    ),
                    'converter' => array (
                        'name' => $param['converter'],
                    ),
                    'protocol' => array (
                        'name' => $param['protocol'],
                    ),
                    'service_conn_type' => 0,
                    'service_ctimeout' => 500,
                    'service_name' => $param['service'],
                    'service_port' => 8086,
                    'service_rtimeout' => 5000,
                    'service_wtimeout' => 5000,
                ),
            ),
        );
        return $conf;
    }

    public function __call($method, $param) {
        $js = json_encode($param);
        if ($this->confirm_before) {
            $this->confirm($msg);
        } else {
            $this->show($msg . "\n");
        }

        do {
            try {
                $ret = call_user_func_array(array($this, "_$method"), $param);
            } catch (Exception $e) {
                $this->show($e->getMessage() . "\n");
                $ret = false;
            }

            if ($ret === false) {
                if ($this->confirm_retry) {
                    $str = "执行 $method 失败！参数：$js\n";
                    $opt = array(
                        'r' => '重试',
                        'i' => '忽略',
                    );
                    $res = $this->choose($str, $opt);
                    if ($res == 'i') {
                        $ret = true;
                    }
                } else {
                    $this->show("执行 $method 失败！参数：$js");
                    exit();
                } 
            } else {
                if ($this->confirm_after) {
                    $str = "执行 $method 完毕，参数：$js";
                    $opt = array(
                        'r' => '重试',
                        'c' => '继续',
                    );
                    $res = $this->choose($str, $opt);
                    if ($res == 'r') {
                        $ret = false;
                    }
                }
            }
        } while ($ret === false);
        return $ret;
    }

    protected static function _to_string_rec($data) {
        if (is_array($data)) {
            $ret = array();
            foreach ($data as $k => $v) {
                $k = (string)$k;
                $v = self::_to_string_rec($v);
                $ret[$k] = $v;
            }
            return $ret;
        } else {
            return (string)$data;
        }
    }

    private function _dbGet($name, $sql) {
        $db = $this->db[$name];
        $res = $db->query($sql);
        $arr = array();
        while ($item = $res->fetch_assoc()) {
            $arr[] = $item;
        }
        if (empty($arr)) {
            return false;
        }
        return $arr;
    }

    protected function _dbSet($name, $sql) {
        $db = $this->db[$name];
        $res = $db->query($sql);
        return $res;
    }

    protected function _dbInsert($name, $table, $item) {
        $db = $this->db[$name];
        $keys = array();
        $values = array();
        foreach ($item as $key => $value) {
            $keys[] = $key;
            $values[] = "'" . $db->real_escape_string($value) . "'";
        }
        $key_str = implode(',', $keys);
        $value_str = implode(',', $values);
        $sql = "insert into $table ($key_str) values ($value_str)";
        $res = $db->query($sql);
        return $res;
    }

    protected function _dbSelect($name, $table, $item) {
        $db = $this->db[$name];
        $keys = array();
        foreach ($item as $key => $value) {
            $keys[] = $key . "='" . $db->real_escape_string($value) . "'";
        }
        $key_str = implode(' and ', $keys);
        $sql = "select * from $table where $key_str";
        return $this->_dbGet($name, $sql);
    }

    protected function _dbDelete($name, $table, $item) {
        $db = $this->db[$name];
        $keys = array();
        foreach ($item as $key => $value) {
            $keys[] = $key . "='" . $db->real_escape_string($value) . "'";
        }
        $key_str = implode(' and ', $keys);
        $sql = "delete from $table where $key_str";
        return $db->query($sql);
    }

    public function zkCd($path) {
        $this->zk_path = $path;
    }

    private function _zkGet($path) {
        return Ak_Zookeeper::get($this->zk_path . $path, 9);
    }

    protected function _zkSet($path, $data) {
        return Ak_Zookeeper::set($this->zk_path . $path, $data);
    }

    protected function _zkDelete($path) {
        return Ak_Zookeeper::delete($this->zk_path . $path);
    }

    protected function _zkDeleteChildren($path) {
        return Ak_Zookeeper::deleteChildren($this->zk_path . $path);
    }

    protected function _sh($cmd) {
        $ret = system($cmd, $ret_num);
        if ($ret === false || $ret_num != 0) {
            return false;
        }
        return true;
    }

    protected function _ssh($hosts, $cmd) {
        if (!is_array($hosts)) {
            $hosts = array($hosts);
        }
        foreach ($hosts as $host) {
            $ret = system("ssh $host '$cmd'", $ret_num);
            if ($ret === false || $ret_num != 0) {
                return false;
            }
        }
        return true;
    }

    protected function _scpFromHost($hosts, $from, $to) {
        if (!is_array($hosts)) {
            $hosts = array($hosts);
        }
        foreach ($hosts as $host) {
            $ret = system("scp -r $host:$from $to", $ret_num);
            if ($ret === false || $ret_num != 0) {
                return false;
            }
        }
        return true;
    }

    protected function _scp($hosts, $from, $to) {
        if (!is_array($hosts)) {
            $hosts = array($hosts);
        }
        foreach ($hosts as $host) {
            $ret = system("scp -r $from $host:$to", $ret_num);
            if ($ret === false || $ret_num != 0) {
                return false;
            }
        }
        return true;
    }

    protected function _getProd($from, $to) {
        $expect = "spawn scp -r getprod@product.scm.baidu.com:$from $to; expect -exact \"password:\"; send -- \"getprod\r\";expect eof";
        system("export LD_LIBRARY_PATH=.; ./expect -c '$expect';");
    }

    protected function _modify($in, $out, $data) {
        $tpl = new Smarty();
        $tpl->template_dir = $this->conf['template_dir'];
        $tpl->compile_dir = $this->conf['compile_dir'];

        if (file_exists("$tpl->template_dir/$in")) {
            system("cp $tpl->template_dir/$in $out");
        } else {
            system("cp $in $out");
        }
        system("opcp $out");

        foreach ($data as $k => $v) {
            $v = self::_to_string_rec($v);
            $tpl->assign($k, $v);
        }
        $str = $tpl->fetch($in);
        file_put_contents($out, $str);

        if ($this->confirm_modify) {
            system("opdiff $out");
            $this->confirm("");
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
