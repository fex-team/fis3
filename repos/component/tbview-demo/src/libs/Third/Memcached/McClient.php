<?php
/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file McClient.php
 * @author wangweibing(com@baidu.com)
 * @date 2011/05/13 14:47:43
 * @brief 
 *  
 **/

require_once(dirname(__FILE__) . "/AClient.php");
require_once(dirname(__FILE__) . "/Schema.php");
require_once(dirname(__FILE__) . "/Zookeeper.php");
require_once(dirname(__FILE__) . "/SpanIdcStrategy.php");

class Ak_McClient {
    protected static $schema = null;
    protected $conf = null;
    protected $zk_conf = null;
    protected $mc_list = null;            /**< memcached机房列表, 0为本机房 */
    protected $prefix = false;            /**< the last char is ignored     */
    protected $mc_list_aux = null;        /**< used by getServersByKey      */
    protected $idc_type = null;
    protected $server_lists = null;
    protected $span_idc = null;
    protected $init_acm_resource = false;
    protected static $MC_ERR = 1;
    protected $resources = null;
    protected $log_failed_server = false;
    const CACHE_RESOURCE = 'memcache_server_list';
    const ACM_RESOURCE = 'acm_server_name_list';
    const CACHE_AUX_RESOURCE = 'memcache_aux_server_list';

    // set strategy
    // 如果没有配置延迟删除，则只要有一个cache set失败就会认为是失败
    // 如果配置了延迟删除，则以延迟删除的结果为准
    const SET_STRICT = 0;
    // 只要有一个机房set成功就算成功,如果set失败则删除相应机房的数据
    const SET_NOSTRICT = 1;

    protected static $s_idc_index_name_map = array(
        1 => 'tc',
        2 => 'yf',
    );

    protected static function _getSchema() {
        if (!(self::$schema instanceof Ak_Schema)) {
            $def = array(
                'mc_expire' => array(
                    'base' => 'int',
                    'min' => 0,
                    'default' => 0,
                ),
                'zk_expire' => array(
                    'base' => 'int',
                    'min' => 1,
                    'default' => 60,
                ),
                'bool_true' => array(
                    'base' => 'bool',
                    'default' => true,
                ),
                'bool_false' => array(
                    'base' => 'bool',
                    'default' => false,
                ),
                'zk_host' => array(
                    'base' => 'string',
                    'optional' => true,
                ),
                'ctimeoutopt' => array(
                    'base' => 'int',
                    'max' => 1000,
                    'optional' => true,
                ),
                'ptimeoutopt' => array(
                    'base' => 'int',
                    'max' => 1000,
                    'optional' => true,
                ),
                'wtimeoutopt' => array(
                    'base' => 'int',
                    'max' => 5000,
                    'optional' => true,
                ),
                'rtimeoutopt' => array(
                    'base' => 'int',
                    'max' => 5000,
                    'optional' => true,
                ),
                'backfill_key_count' => array(
                    'base' => 'int',
                    'default' => 0,
                ),
                'ctimeoutdef' => array(
                    'base' => 'int',
                    'max' => 1000,
                    'default' => 20,
                ),
                'ptimeoutdef' => array(
                    'base' => 'int',
                    'max' => 1000,
                    'default' => 20,
                ),
                'wtimeoutdef' => array(
                    'base' => 'int',
                    'max' => 5000,
                    'default' => 100,
                ),
                'rtimeoutdef' => array(
                    'base' => 'int',
                    'max' => 5000,
                    'default' => 500,
                ),
                'acm_ctimeout' => array(
                    'base' => 'int', 
                    'max' => 10000,
                    'default' => 20,
                ),
                'acm_rtimeout' => array(
                    'base' => 'int',
                    'max' => 10000,
                    'default' => 500,
                ),
                'acm_wtimeout' => array(
                    'base' => 'int',
                    'max' => 10000,
                    'default' => 100,
                ),
                'strategy_index' => array(
                    'base' => 'int',
                    'default' => 0,
                ),
                'mc_conf' => array(
                    'base' => 'object',
                    'members' => array(
                        'pid' => 'string',
                        'zk_host' => 'zk_host',
                        'zk_path' => 'string',
                        'zk_expire' => 'zk_expire',
                        'default_expire' => 'mc_expire',
                        //'curr_idc' => 'string',
                        'span_idc_strategy_index' => 'strategy_index',
                        'delete_directly' => 'bool_true',
                        'delete_delay' => 'bool_true',
                        'compression' => 'bool_true',
                        'log_failed_server' => 'bool_false',
                        'connect_timeout' => 'ctimeoutopt',
                        'poll_timeout' => 'ptimeoutopt',
                        'send_timeout' => 'wtimeoutopt',
                        'recv_timeout' => 'rtimeoutopt',
                        'acm_connect_timeout' => 'acm_ctimeout',
                        'acm_read_timeout' => 'acm_rtimeout',
                        'acm_write_timeout' => 'acm_wtimeout',
                    ),
                ),

                'idc_type' => array(
                    'base' => 'string',
                    'in' => array('none', 'self', 'all'),
                ),
                'server' => array(
                    'base' => 'object',
                    'members' => array(
                        'ip' => 'string',
                        'port' => 'int',
                        //'weight' => 'int',
                    ),
                    'alias' => array(
                        'Port' => 'port',
                        'host' => 'ip',
                    ),
                ),
                'servers' => array(
                    'base' => 'dict',
                    'key_type' => 'string',
                    'value_type' => 'server',
                ),
                'servers_omit_key_type' => array(
                    'base' => 'dict',
                    'key_type' => 'any',
                    'value_type' => 'server',
                    'min_size' => 1,
                ),
                'server_list' => array(
                    'base' => 'object',
                    'members' => array(
                        'idc' => 'string',
                        'children' => 'servers',
                    ),
                ),
                'server_lists' => array(
                    'base' => 'dict',
                    'key_type' => 'string',
                    'value_type' => 'server_list',
                ),
                'zk_conf' => array(
                    'base' => 'object',
                    'members' => array(
                        'delete_cmd' => 'int',
                        'idc_type' => 'idc_type',
                        'idc_num' => 'int',
                        'connect_timeout' => 'ctimeoutopt',
                        'poll_timeout' => 'ptimeoutopt',
                        'send_timeout' => 'wtimeoutopt',
                        'recv_timeout' => 'rtimeoutopt',
                        'max_backfill_key_count' => 'backfill_key_count',
                        'children' => 'server_lists',
                    ),
                ),
                'zk_global_conf' => array(
                    'base' => 'object',
                    'members' => array(
                        'connect_timeout' => 'ctimeoutdef',
                        'poll_timeout' => 'ptimeoutdef',
                        'send_timeout' => 'wtimeoutdef',
                        'recv_timeout' => 'rtimeoutdef',
                    ),
                ),
                'idcs_type' => array(
                    'base' => 'dict',
                    'key_type' => 'int',
                    'value_type' => 'string',
                    'min_size' => 1,
                ),
                'idcs_list' => array(
                    'base' => 'dict',
                    'key_type' => 'int',
                    'value_type' => 'idcs_type',
                    'min_size' => 1,
                ),
                'idc_strategy' => array(
                    'base' => 'dict',
                    'key_type' => 'string',
                    'value_type' => 'idcs_list',
                    'min_size' => 1,
                ),
                'idc_strategy_array' => array(
                    'base' => 'dict',
                    'key_type' => 'int',
                    'value_type' => 'idc_strategy',
                    'min_size' => 1,
                ),
                'idc_strategy_conf' => array(
                    'base' => 'object',
                    'members' => array(
                        'span_idc_strategy' => 'idc_strategy_array',
                    ),
                ),
                'acm_idc_num' => array(
                    'base' => 'int',
                    'min' => 1,
                    'default' => 1,
                ),
                'acm_server_list' => array(
                    'base' => 'dict',
                    'key_type' => 'string',
                    'value_type' => 'server',
                    'min_size' => 1,
                ),
                'acm_service' => array(
                    'base' => 'object',
                    'members' => array(
                        'idc' => 'string',
                        'children' => 'acm_server_list',
                    ),
                ),
                'acm_service_list' => array(
                    'base' => 'dict',
                    'key_type' => 'string',
                    'value_type' => 'acm_service',
                    'min_size' => 1,
                ),
                'acm_conf' => array(
                    'base' => 'object',
                    'members' => array(
                        'acm_idc_num' => 'int',
                        'children' => 'acm_service_list',
                    ),
                ),
            );

            self::$schema = Ak_Schema::create($def);
        }
        return self::$schema;
    }

    protected static function _get_log_str($str, $mc = false, $log_failed_server = false, $key = null) {
        if ($mc instanceof Memcached) {
            $mc_msg = $mc->getResultMessage();
            if ($log_failed_server) {
                $server = self::_getServerByKey($mc, $key, $log_failed_server);
                $str .= " host[{$server['host']}] port[{$server['port']}]";
            }
            $str .= ", memcached result[$mc_msg]"; 
        }
        return $str;
    }

    protected static function _debug($str, $mc = false, $log_failed_server = false, $key = null) {
        Ak_Log::debug(self::_get_log_str($str, $mc, $log_failed_server, $key));
    }

    protected static function _warning($str, $mc = false, $log_failed_server = false, $key = null) {
        Ak_Log::warning(self::_get_log_str($str, $mc, $log_failed_server, $key));
    }

    protected static function _checkZkConf($zk_conf, $schema_name) {
        $schema = self::_getSchema();
        $zk_conf = $schema->validate($schema_name, $zk_conf, $ret);
        if ($ret != true) {
            self::_warning("zk conf format error schema_name[$schema_name]");
        }
        return $zk_conf;
    }

    public static function checkZkConf($zk_conf) {
        return self::_checkZkConf($zk_conf, 'zk_conf');
    }

    public static function checkZkGlobalConf($zk_conf) {
        return self::_checkZkConf($zk_conf, 'zk_global_conf');
    }

    public static function checkSpanIdcStrategyConf($zk_conf) {
        return self::_checkZkConf($zk_conf, 'idc_strategy_conf');
    }

    public static function checkAcmConf($zk_conf) {
        return self::_checkZkConf($zk_conf, 'acm_conf');
    }

    protected static function _get_raw_mc($conf, $server_list) {
        $mc = new Memcached;
        $mc->setOption(Memcached::OPT_BINARY_PROTOCOL, true);
        $mc->setOption(Memcached::OPT_TCP_NODELAY, true);
        $mc->setOption(Memcached::OPT_NO_BLOCK, true);
        $mc->setOption(Memcached::OPT_CONNECT_TIMEOUT, $conf['connect_timeout']);
        $mc->setOption(Memcached::OPT_POLL_TIMEOUT, $conf['poll_timeout']);
        $mc->setOption(Memcached::OPT_SEND_TIMEOUT, $conf['send_timeout']);
        $mc->setOption(Memcached::OPT_RECV_TIMEOUT, $conf['recv_timeout']);
        $mc->setOption(Memcached::OPT_COMPRESSION, $conf['compression']);
        //$mc->setOption(Memcached::OPT_SERIALIZER, Memcached::SERIALIZER_IGBINARY);
        $mc->setOption(Memcached::OPT_DISTRIBUTION, Memcached::DISTRIBUTION_CONSISTENT);
        $mc->setOption(Memcached::OPT_LIBKETAMA_COMPATIBLE, true);
        /*          
        $mc->setOption(Memcached::OPT_PREFIX_KEY, $conf['prefix']);
        if (isset($conf['prefix'])) {
            // default the last byte is ignored 
            $mc->setOption(Memcached::OPT_PREFIX_KEY, $conf['prefix'].'a');
        }
        //*/
        $servers = array();
        foreach ($server_list as $server) {
            $servers[] = array($server['ip'], $server['port'], $server['weight']);
        }
        $mc->addServers($servers);

        return $mc;
    }

    protected static function _get_server_lists(&$conf, &$zk_conf) {
        $conf_file = $conf['pid'].'_conf_file';
        $cached_conf_file = Ak_LocalCache::get($conf_file);
        if ($conf != null && $conf === $cached_conf_file['raw_conf']) {
            $conf = $cached_conf_file['validated_conf'];
        } else {
            $schema = self::_getSchema();
            $raw_conf = $conf;
            $conf = $schema->validate('mc_conf', $conf, $ret);
            if ($ret != true) {
                self::_warning("conf format error");
                return null;
            }
            $cached_conf_file['raw_conf'] = $raw_conf;
            $cached_conf_file['validated_conf'] = $conf;
            Ak_LocalCache::set($conf_file, $cached_conf_file);
        }

        $pid = $conf['pid'];
        $zk_path = $conf['zk_path'];
        $zk_expire = $conf['zk_expire'];
        $zk_global_path = "$zk_path/product";
        $zk_global_conf = Ak_Zookeeper::getCached($zk_global_path, 0, $zk_expire, 'Ak_McClient::checkZkGlobalConf');
        $zk_conf_path = "$zk_path/product/$pid";
        $zk_conf = Ak_Zookeeper::getCached($zk_conf_path, 2, $zk_expire, 'Ak_McClient::checkZkConf');
        if (!is_array($zk_conf)) {
            return null;
        }

        $def_conf_items = array('connect_timeout', 'poll_timeout', 'send_timeout', 'recv_timeout');
        foreach ($def_conf_items as $item) {
            if (is_null($conf[$item])) {
                $conf[$item] = is_null($zk_conf[$item]) ? $zk_global_conf[$item] : $zk_conf[$item];
            }
        }
        $idc_type = $zk_conf['idc_type'];
        $curr_idc = $conf['curr_idc'] - 1;
        if ($idc_type == "none") {
            $zk_conf['idc_num'] = 1;
            $curr_idc = 0;
        }
        $idc_num = $zk_conf['idc_num'];

        $server_lists = array();
        for($i = 0; $i < $idc_num; $i++) {
            //$idc = $cur_mc_first ? ($i + $curr_idc) % $idc_num + 1 : $i + 1;
            $idc = $i + 1;
            $server_list = @$zk_conf['children']['server_list' . $idc];
            if (!is_array($server_list)) {
                self::_warning("server list[$idc] error");
                return null;
            }
            $server_lists[] = $server_list;
        }

        return $server_lists;
    }

    public static function create($conf) {
        if (!isset($conf['curr_idc'])) {
            $conf['curr_idc'] = 'tc';
        } else if (!is_string($conf['curr_idc']) && !is_int($conf['curr_idc'])) {
            Ak_Log::warning("curr_idc format error! must be int(deperacated) or string(recommand)");
            return null;
        }
        if (is_int($conf['curr_idc']) && array_key_exists($conf['curr_idc'], self::$s_idc_index_name_map)) {
            $conf['curr_idc'] = self::$s_idc_index_name_map[$conf['curr_idc']];
        }
        if (($server_lists = self::_get_server_lists($conf, $zk_conf)) == null) {
            self::_warning("get server_lists error!");
            return null;
        }

        if (is_string($conf['zk_host'])) {
            Ak_Zookeeper::setHost($conf['zk_host']);
        }
        $mcc = new Ak_McClient();
        $mcc->conf = $conf;
        $mcc->log_failed_server = $conf['log_failed_server'];
        $mcc->zk_conf = $zk_conf;
        $mcc->idc_type = $zk_conf['idc_type'];
        $mcc->span_idc = self::_initSpanIdcStrategy($conf);
        $mcc->server_lists = $server_lists;
        if ($mcc->span_idc == null) {
            Ak_Log::warning("create SpanIdcStrategy failed!");
            return null;
        }
        foreach ($server_lists as $idc_index => $server_list) {
            $resource = array('idc_index' => $idc_index, 'sl' => $server_list);
            $mcc->span_idc->registerResource(self::CACHE_RESOURCE, $server_list['idc'], $resource);
        }
        if (isset($conf['prefix'])) {
            $mcc->prefix = $conf['prefix'];
        }
        return $mcc;
    }

    protected function _initSpanIdcStrategy($conf) {
        $zk_path = $conf['zk_path'];
        $zk_expire = $conf['zk_expire'];
        $strategy = Ak_Zookeeper::getCached($zk_path, 0, $zk_expire, 'Ak_McClient::checkSpanIdcStrategyConf');
        if (!is_array($strategy)) {
            return null;
        }
        $span_idc = new Ak_SpanIdcStrategy();
        $span_idc->registerStrategy($strategy['span_idc_strategy']);
        return $span_idc;
    }

    protected static function _getServerByKey($mc, $key, $log_failed_server) {
        //old memcached.so may core caused by double free bug
        if ($log_failed_server) {
            $server = $mc->getServerByKey($key);
        } else {
            $server = array('host' => '', 'port' => '');
        }
        return $server;
    }

    protected function _add($mc, $key, $value, $expire) {
        if ($mc == null) {
            self::_warning("curr_idc[".$this->conf['curr_idc']."] get mc is null");
            return false;
        }
        $ret = $mc->add($key, $value, $expire);
        if ($ret === false && $mc->getResultCode() != Memcached::RES_NOTSTORED && $mc->getResultCode() != Memcached::RES_DATA_EXISTS) {
            self::_warning("add key[$key] value[$value] error", $mc, $this->log_failed_server, $key);
            return false;
        } else if ($mc->getResultCode() == Memcached::RES_DATA_EXISTS) {
            self::_debug("add key[$key] value[$value] error", $mc, $this->log_failed_server, $key);
            return false;
        }
        return true;
    }

    // get server_list$index mc 
    protected function _get_mc_by_index($index) {
        return  self::_get_raw_mc($this->conf, $this->server_lists[$index]['children']);
    }

    protected function _getAuxMcByOrder($index) {
        return $this->_getMcByOrder($index, true);
    }

    protected function _getMcByOrder($index, $aux_mc = false) {
        if ($this->resources == null) {
            if ($aux_mc) {
                $this->resources = $this->span_idc->getResource($this->conf['span_idc_strategy_index'], self::CACHE_AUX_RESOURCE, $this->conf['curr_idc']);
            } else {
                $this->resources = $this->span_idc->getResource($this->conf['span_idc_strategy_index'], self::CACHE_RESOURCE, $this->conf['curr_idc']);
            }
        }
        if ($index < 0 || $index >= count($this->resources)) {
            return null;
        }
        if ($aux_mc) {
            if (empty($this->mc_aux_list[$index])) {
                $this->mc_aux_list[$index] = self::_get_raw_mc($this->conf, $this->resources[$index]['sl']['children']);
            }
            return $this->mc_aux_list[$index];
        } else {
            if (empty($this->mc_list[$index])) {
                $this->mc_list[$index] = self::_get_raw_mc($this->conf, $this->resources[$index]['sl']['children']);
            }
            return $this->mc_list[$index];
        }
    }

    protected function _getIdcIndexByOrder($index) {
        return $this->resources[$index]['idc_index'];
    }

    protected function _get($mc, $key) {
        if ($mc == null) {
            self::_warning("curr_idc[".$this->conf['curr_idc']."] get mc is null");
            return false;
        }
        $ret = $mc->get($key);
        if ($ret === false && $mc->getResultCode() != Memcached::RES_NOTFOUND) {
            self::_warning("get key[$key] error", $mc, $this->log_failed_server, $key);
        }
        return $ret;
    }

    protected function _set($mc, $key, $value, $expire) {
        if ($mc == null) {
            self::_warning("curr_idc[".$this->conf['curr_idc']."] get mc is null");
            return false;
        }
        $ret = $mc->set($key, $value, $expire);
        if ($ret === false) {
            self::_warning("set key[$key] value[$value] error", $mc, $this->log_failed_server, $key);
            return false;
        }
        return true;
    }

    protected function _setMulti($mc, $items, $expire) {
        if ($mc == null) {
            self::_warning("curr_idc[".$this->conf['curr_idc']."] get mc is null");
            return false;
        }
        $ret = $mc->setMulti($items, $expire);
        if ($ret === false) {
            self::_warning("setMulti items[".json_encode($items)."] error", $mc);
            return false;
        }
        return true;
    }

    protected function _getMulti($mc, $keys) {
        if ($mc == null) {
            self::_warning("curr_idc[".$this->conf['curr_idc']."] get mc is null");
            return false;
        }
        $ret = $mc->getMulti($keys);
        if ($ret === false && $mc->getResultCode() != Memcached::RES_NOTFOUND) {
            self::_warning("get keys[".json_encode($keys)."] error", $mc);
        }
        return $ret;
    }

    protected function _getMultiByKey($mc, $server_key, $keys) {
        if ($mc == null) {
            self::_warning("curr_idc[".$this->conf['curr_idc']."] get mc is null");
            return false;
        }
        $ret = $mc->getMultiByKey($server_key, $keys);
        if ($ret === false && $mc->getResultCode() != Memcached::RES_NOTFOUND) {
            self::_warning("get server_key[$server_key],keys[".json_encode($keys)."] error", $mc);
        }
        return $ret;
    }

    protected function _delete($mc, $key) {
        if ($mc == null) {
            self::_warning("curr_idc[".$this->conf['curr_idc']."] get mc is null");
            return false;
        }
        $ret = $mc->delete($key);
        if ($ret === false && $mc->getResultCode() != Memcached::RES_NOTFOUND) {
            self::_warning("delete key[$key] error", $mc, $this->log_failed_server, $key);
            return false;
        }
        return true;
    }

    public function add($key, $value, $expire = null) {
        return $this->addImp($key, $value, $expire); 
    }

    public function get($key) {
        return $this->getImp($key);
    }

    // 在SET_NOSTRICT时，如果只是部分机房删除失败，会对删除失败的机房进行立即删除和延迟删除，如果是所有机房都set失败，则不会进行任何操作，直接返回失败。
    public function set($key, $value, $expire = null, $set_strategy = SET_STRICT) {
        return $this->setImp($key, $value, $expire, $set_strategy); 
    }

    public function delete($key) {
        return $this->deleteImp($key); 
    } 

    public function getLastError() {
        $res = array();
        foreach ($this->mc_list as $mc) {
            if ($mc->getResultCode() != Memcached::RES_SUCCESS && $mc->getResultCode() != Memcached::RES_NOTFOUND) {
                $res['err_no'] = self::$MC_ERR;
                $res['err_msg'] .= $mc->getResultMessage().";";
            }
        }
        if (!isset($res['err_no'])) {
            $res['err_no'] = 0;
        }
        return $res;
    } 

    protected function addImp($key, $value, $expire = null, $is_sub_key = false) {
        if (!$is_sub_key) {
            $key = $this->prefix.$key;
        }
        if (is_null($expire)) {
            $expire = @$this->conf['default_expire'];
        }

        switch ($this->idc_type) {
        case "none": 
        case "self":
            return $this->_add($this->_getMcByOrder(0), $key, $value, $expire);
        case "all":
            $ret_all = false;
            for ($i = 0; $i < $this->zk_conf['idc_num']; ++$i) {
                $mc = $this->_getMcByOrder($i);
                if ($mc == null) {
                    continue;
                }
                $ret_all = $this->_add($mc, $key, $value, $expire) || $ret_all;
            }
            return $ret_all;
        default:
            self::_warning("conf error, no such idc_type(".($this->idc_type).")");
            return false;
        }
    }

    protected function getImp($key, $is_sub_key = false) {
        if (!$is_sub_key) {
            $key = $this->prefix.$key;
        }
        switch ($this->idc_type) {
        case "none": 
        case "self":
            return $this->_get($this->_getMcByOrder(0), $key);
        case "all":
            $first_mc = $this->_getMcByOrder(0);
            $ret = $this->_get($first_mc, $key);
            if ($ret !== false) {
                return $ret;
            }
            if (@$this->zk_conf['clearing']) {
                return false;
            }
            for ($i = 1; $i < $this->zk_conf['idc_num']; ++$i) {
                $mc = $this->_getMcByOrder($i);
                if ($mc == null) {
                    continue;
                }
                $ret = $this->_get($mc, $key);
                if ($ret !== false) {
                    if (@$this->zk_conf['restoring']) {
                        if (isset($this->conf['default_expire'])) {
                            $expire = $this->conf['default_expire'];
                            $this->_add($first_mc, $key, $ret, $expire);
                        } else {
                            $this->_add($first_mc, $key, $ret);
                        }
                    }
                    return $ret;
                }
            }
            return false;
        default:
            self::_warning("conf error, no such idc_type(".($this->idc_type).")");
            return false;
        }
    }

    protected function setImp($key, $value, $expire, $set_strategy, $main_key = null, $sub_key = null) {
        if ($sub_key === null) {
            $key = $this->prefix.$key;
        }
        if (is_null($expire)) {
            $expire = @$this->conf['default_expire'];
        }

        $set_count = 0;
        $fail_list = array();
        switch ($this->idc_type) {
        case "none": 
        case "self":
            $ret = $this->_set($this->_getMcByOrder(0), $key, $value, $expire);
            ++$set_count;
            if (!$ret) {
                $fail_list[] = $this->_getIdcIndexByOrder(0);
            }
            break;
        case "all":
            for ($i = 0; $i < $this->zk_conf['idc_num']; ++$i) {
                $mc = $this->_getMcByOrder($i);
                if ($mc == null) {
                    continue;
                }
                $ret = $this->_set($mc, $key, $value, $expire);
                ++$set_count;
                if (!$ret) {
                    $fail_list[] = $this->_getIdcIndexByOrder($i);
                }
            }
            break;
        default:
            self::_warning("conf error, no such idc_type(".($this->idc_type).")");
            return false;
        }

        // call direct delete
        $set_some_fail = (count($fail_list) > 0 && count($fail_list) < $set_count);
        if ($set_strategy == SET_NOSTRICT && $set_some_fail) {
            foreach ($fail_list as $mc_index) {
                $this->_delete($this->_getMcByOrder($mc_index), $key);
            }
        }

        $ret_all = true;
        // call delete delay
        if ($this->conf['set_call_delete_delay']) {
            $ret_all = $this->_call_acm($key, $main_key, $sub_key);
        } else {
            if (count($fail_list) > 0) {
                $this->_call_acm($key, $main_key, $sub_key, $fail_list);
            }
            if ($set_strategy == SET_STRICT && count($fail_list) > 0) {
                $ret_all = false;
            }
            if ($set_strategy == SET_NOSTRICT && count($fail_list) == $set_count) {
                $ret_all = false;
            }
        }

        return $ret_all;
    }

    public function setMulti($items) {
        $set_strategy = SET_STRICT;
        if ($this->prefix) {
            foreach ($items as $k => $v) {
                $tmp_items[$this->prefix.$k] = $v;
            }
            $items = $tmp_items;
        }

        if (is_null($expire)) {
            $expire = @$this->conf['default_expire'];
        }

        $set_count = 0;
        $fail_list = array();
        switch ($this->idc_type) {
        case "none": 
        case "self":
            $ret = $this->_setMulti($this->_getMcByOrder(0), $items, $expire);
            ++$set_count;
            if (!$ret) {
                $fail_list[] = $this->_getIdcIndexByOrder(0);
            }
            break;
        case "all":
            for ($i = 0; $i < $this->zk_conf['idc_num']; ++$i) {
                $mc = $this->_getMcByOrder($i);
                if ($mc == null) {
                    continue;
                }
                $ret = $this->_setMulti($mc, $items, $expire);
                ++$set_count;
                if (!$ret) {
                    $fail_list[] = $this->_getIdcIndexByOrder($i);
                }
            }
            break;
        default:
            self::_warning("conf error, no such idc_type(".($this->idc_type).")");
            return false;
        }

        // call direct delete
        $set_some_fail = (count($fail_list) > 0 && count($fail_list) < $set_count);
        if ($set_strategy == SET_NOSTRICT && $set_some_fail) {
            foreach ($fail_list as $mc_index) {
                $this->_delete($this->_getMcByOrder($mc_index), $key);
            }
        }

        $ret_all = true;
        // call delete delay
        if ($this->conf['set_call_delete_delay']) {
            foreach ($items as $key => $value) {
                $ret_all = $this->_call_acm($key, $key) && $ret_all;
            }
        } else {
            if (count($fail_list) > 0) {
                foreach ($items as $key => $value) {
                    $this->_call_acm($key, $key, null, $fail_list);
                }
            }
            if ($set_strategy == SET_STRICT && count($fail_list) > 0) {
                $ret_all = false;
            }
            if ($set_strategy == SET_NOSTRICT && count($fail_list) == $set_count) {
                $ret_all = false;
            }
        }

        return $ret_all;
    }

    public function getMulti($keys) {
        if ($this->prefix) {
            foreach ($keys as &$one_key) {
                $one_key = $this->prefix.$one_key;
            }
        }
        switch ($this->idc_type) {
        case "none": 
        case "self":
            return $this->_getMulti($this->_getMcByOrder(0), $keys);
        case "all":
            $left_keys = $keys;
            $first_mc = $this->_getMcByOrder(0);
            $ret = array();
            $one_res = $this->_getMulti($first_mc, $keys);
            $exist_keys = array();
            if ($one_res !== false) {
                foreach($one_res as $k => $v) {
                    $ret[$k] = $v;
                }
                // 可能memcached.so返回的数据结构有问题 
                //$ret = array_merge($ret, $one_res);
                $exist_keys = array_keys($one_res);
                $left_keys = array_diff($left_keys, $exist_keys);
                if (count($left_keys) <= 0) {
                    return $ret;
                }
            }
            if (@$this->zk_conf['clearing']) {
                return $ret;
            }
            for ($i = 1; $i < $this->zk_conf['idc_num']; ++$i) {
                $mc = $this->_getMcByOrder($i);
                if ($mc == null) {
                    continue;
                }
                $one_res = $this->_getMulti($mc, $left_keys);
                if ($one_res !== false) {
                    foreach($one_res as $k => $v) {
                        $ret[$k] = $v;
                    }
                    //$ret = array_merge($ret, $one_res);
                    $left_keys = array_diff($left_keys, array_keys($one_res));
                    if (count($left_keys) <= 0) {
                        break;
                    }
                }
            }
            if (@$this->zk_conf['restoring']) {
                $diff_keys = array_diff(array_keys((array)$ret), (array)$exist_keys);
                $backfill_count = 0;
                foreach ($diff_keys as $key) {
                    if ($backfill_count++ >= $this->zk_conf['max_backfill_key_count']) {
                        break;
                    }
                    if (isset($this->conf['default_expire'])) {
                        $expire = $this->conf['default_expire'];
                        $this->_add($first_mc, $key, $ret[$key], $expire);
                    } else {
                        $this->_add($first_mc, $key, $ret[$key]);
                    }
                }
            }
            return $ret;
        default:
            self::_warning("conf error, no such idc_type(".($this->idc_type).")");
            return false;
        }
    }

    protected function getMultiByKey($server_key, $keys) {
        if ($this->prefix) {
            foreach ($keys as &$key) {
                $key = $this->prefix.$key;
            }
        }
        switch ($this->idc_type) {
        case "none": 
        case "self":
            return $this->_getMultiByKey($this->_getMcByOrder(0), $server_key, $keys);
        case "all":
            $left_keys = $keys;
            $ret = array();
            for ($i = 0; $i < $this->zk_conf['idc_num']; ++$i) {
                $mc = $this->_getMcByOrder($i);
                if ($mc == null) {
                    continue;
                }
                $one_res = $this->_getMultiByKey($mc, $server_key, $keys);
                if ($one_res !== false) {
                    $ret = array_merge($ret, $one_res);
                    $left_keys = array_diff($left_keys, array_keys($one_res));
                    if (count($left_keys) > 0) {
                        continue;
                    }
                    return $ret;
                }
            }
            if (count($ret) <= 0 && $ret === false) {
                return false;
            }
            return $ret;
        default:
            self::_warning("conf error, no such idc_type(".($this->idc_type).")");
            return false;
        }
    }

    protected function _call_acm($key, $main_key, $sub_key = null, $idc_list = null) {
        if ($idc_list === null) {
            $idc_list = array();
            for ($i = 0; $i < $this->zk_conf['idc_num']; $i++) {
                $idc_list[] = $i;
            }
        }
        if ($sub_key !== null) {
            return $this->call_acm($idc_list, $key, $main_key, $sub_key);
        } else {
            return $this->call_acm($idc_list, $key, $key);
        }
    }

    protected function call_acm($idc_list, $group_key, $key, $sub_key = null) {
        $acm_zk_path = $this->conf['zk_path'] . '/acm';
        $zk_expire = $this->conf['zk_expire'];
        $acm_conf = Ak_Zookeeper::getCached($acm_zk_path, 2, $zk_expire, 'Ak_McClient::checkAcmConf');
        if (!is_array($acm_conf)) {
            Ak_Log::warning("acm zk conf formate error!");
            return false;
        }
        for ($i = 1; $i <= $acm_conf['acm_idc_num']; ++$i) {
            $server_name = "server$i";
            if (!is_array($acm_conf['children'][$server_name])) {
                Ak_Log::warning("acm $server_name not exist!");
                continue;
            }
            $server_conf = $acm_conf['children'][$server_name];
            $this->span_idc->registerResource(self::ACM_RESOURCE, $server_conf['idc'], $server_name);
        }
        $resources = $this->span_idc->getResource($this->conf['span_idc_strategy_index'], self::ACM_RESOURCE, $this->conf['curr_idc']);
        if (count($resources) == 0) {
            Ak_Log::warning("get resources is empty!");
            return false;
        }
        foreach ($resources as $server_name) {
            $acm_path = $this->conf['zk_path'] . "/acm/$server_name";
            $aclient_conf = array(
                'Source'=>'Galileo',
                'Protocol'=>'Nshead',
                'Scheduler'=>'Closest',
                'GalileoConf' => array(
                    'Path' => $acm_path,
                ),
                'ClosestConf' => array(
                    'AlwaysRetry' => true,
                ),
                'NsheadConf'=>array(    ///<  Nshead通信的配置
                    'ConnectTimeOut'=>$this->conf['acm_connect_timeout'],
                    'WriteTimeOut'=>$this->conf['acm_write_timeout'],
                    'ReadTimeOut'=>$this->conf['acm_read_timeout'],
                ),
            );
            $client = new Ak_AClient();
            $client->SetConf($aclient_conf);
            $data = array(
                'command_no' => $this->zk_conf['delete_cmd'],
                'pid' => $this->conf['pid'],
                'group_key' => (string)$group_key,
                'key' => (string)$key,
                'idc_list' => $idc_list,
            );
            if ($sub_key !== null) {
                $data['has_sub_key'] = 1;
                $data['sub_key'] = $sub_key;
            }
            $input = array(
                'body' => mc_pack_array2pack($data, PHP_MC_PACK_V2),
            );
            $output = $client->Call($input);
            if ($output == null) {
                Ak_Log::warning("aclient call acm [$server_name] failed");
            } else {
                $res = mc_pack_pack2array($output['body']);
                if ($res['error_no'] !== 0) {
                    Ak_Log::warning("call acm [$server_name] output err_no is {$res['errno']}");
                } else {
                    return true;
                }
            }
        }
        return false;

    }

    protected function deleteImp($key, $main_key = null, $sub_key = null) {
        if ($sub_key === null) {
            $key = $this->prefix.$key;
        }
        $ret_all = true;
        if ($this->conf['delete_directly']) {
            for ($i = 0; $i < $this->zk_conf['idc_num']; ++$i) {
                $mc = $this->_getMcByOrder($i);
                if ($mc == null) {
                    continue;
                }
                $ret = $this->_delete($mc, $key);
                $ret_all = $ret_all && $ret;
            }
        }

        if ($this->conf['delete_delay']) {
            $ret_all = $this->_call_acm($key, $main_key, $sub_key);
        }
        return $ret_all;
    }

    protected function _getSubKey($main_key, $sub_key) {
        $val = $this->get($main_key);
        if ($val === false) {
            $time = gettimeofday();
            $val = $time['sec'] * 1000000 + $time['usec'];
            $this->add($main_key, $val, 0);
        }
        return $this->prefix.$main_key . "_" . $val . "_" . $sub_key;
    }

    public function addChild($main_key, $sub_key, $value, $expire = null) {
        $key = $this->_getSubKey($main_key, $sub_key);
        return $this->addImp($key, $value, $expire, true);
    }

    public function getChild($main_key, $sub_key) {
        $key = $this->_getSubKey($main_key, $sub_key);
        return $this->getImp($key, true);
    }

    public function setChild($main_key, $sub_key, $value, $expire = null, $set_strategy = SET_STRICT) {
        $key = $this->_getSubKey($main_key, $sub_key);
        return $this->setImp($key, $value, $expire, $set_strategy, $this->prefix.$main_key, $sub_key);
    }

    public function deleteChild($main_key, $sub_key) {
        $key = $this->_getSubKey($main_key, $sub_key);
        return $this->deleteImp($key, $this->prefix.$main_key, $sub_key);
    }

    public function getServersByKey($key) {
        if ($this->mc_list_aux == null) {
            if (($server_lists = self::_get_server_lists($this->conf, $this->zk_conf)) == null) {
                self::_warning("create get_server_lists error!");
                return null;
            }
            foreach ($server_lists as $idc_index => $server_list) {
                $resource = array('idc_index' => $idc_index, 'sl' => $server_list);
                $this->span_idc->registerResource(self::CACHE_AUX_RESOURCE, $server_list['idc'], $resource);
            }
        }
        $res = array();
        switch ($this->idc_type) {
        case "none": 
            $mc = $this->_getAuxMcByOrder(0);
            $res[] = $mc->getServerByKey($key);
            break;
        case "self":
            $mc = $this->_getAuxMcByOrder(0);
            $res[] = $mc->getServerByKey($key);
            break;
        case "all":
            for ($i = 0; $i < $this->zk_conf['idc_num']; ++$i) {
                $mc = $this->_getAuxMcByOrder($i);
                if ($mc == null) {
                    continue;
                }
                $server = $mc->getServerByKey($key);
                $res[] = $server;
            }
            break;
        default:
            return null;
        }

        return $res;
    }

    private static function _sendCmd($sock, $cmd) {
        $cmd .= "\r\n";
        fwrite($sock, $cmd, strlen($cmd));
        $res = '';
        while ($str = fread($sock, 2 * 1024 * 1024)) {
            $res .= $str;
            if (substr($res, -5) == "END\r\n") {
                break;
            }
        }
        return $res;
    }

    public static function enumKeys($ip, $port, $callback, $step = 0) {
        $sock = fsockopen($ip, $port, $err_no, $err_msg, 2);
        if (!is_resource($sock)) {
            Ak_Log::warning("connect ip[$ip] port[$port] failed");
            return null;
        }

        $slabs = self::_sendCmd($sock, 'stats items');
        $lines = explode("\n", $slabs);
        $nslab = (count($lines) - 2) / 8;
        $nkey = array();
        for ($i = 0; $i < $nslab; $i++) {
            $line = $lines[$i * 8];
            list($v1, $v2, $num) = explode(' ', $line);
            list($v1, $slab, $v3) = explode(':', $v2);
            $nkey[$slab] = (int)$num;
        }

        foreach ($nkey as $slab => $n) {
            $start = 0;
            while ($start < $n) {
                $keys = self::_sendCmd($sock, "stats cachedump $slab $step");
                $keys = explode("\n", $keys);
                $c = count($keys) - 2;
                if ($c == 0) {
                    break;
                }
                $key_arr = array();
                for ($i = 0; $i < $c; $i++) {
                    $key = $keys[$i];
                    $key = explode(' ', $key);
                    $key = $key[1];
                    $key_arr[] = $key;
                }
                call_user_func($callback, $key_arr);
                $start += $c;
            }
        }
        //reset last item
        self::_sendCmd($sock, "stats cachedump 0 0");
    }

}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
