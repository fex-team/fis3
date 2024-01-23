<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
require_once(dirname(__FILE__) . '/../../Schema.php');
 
 
/**
 * @file source/galileo.class.php
 * @author wangweibing(com@baidu.com)
 * @date 2010/12/10 17:57:34
 * @brief 
 *  
 **/

class AClientGalileo extends AClientSource {
    protected static $schema = null;
    protected $zk_update_time;
    protected $zk_path;
    protected $zk_conf;

    protected static function _getSchema() {
        if (!(self::$schema instanceof Ak_Schema)) {
            $def = array(
                'server' => array(
                    'base' => 'object',
                    'members' => array(
                        'ip' => 'string',
                        'port' => 'int',
                    ),
                    'alias' => array(
                        'Port' => 'port',
                    ),
                ),
                'servers' => array(
                    'base' => 'dict',
                    'min_size' => 1,
                    'key_type' => 'string',
                    'value_type' => 'server',
                ),
                'converter' => array(
                    'base' => 'object',
                    'members' => array(
                        'name' => 'string',
                    ),
                ),
                'protocol' => array(
                    'base' => 'object',
                    'members' => array(
                        'name' => 'string',
                    ),
                ),
                'retry' => array(
                    'base' => 'int', 
                    'default' => 0,
                ),
                'service' => array(
                    'base' => 'object',
                    'members' => array(
                        'converter' => 'converter',
                        'protocol' => 'protocol',
                        'ConnectTimeOut' => 'int',
                        'service_name' => 'string',
                        'service_port' => 'int',
                        'service_retry' => 'retry',
                        'ReadTimeOut' => 'int',
                        'WriteTimeOut' => 'int',
                        'ServiceRetry' => 'retry',
                    ),
                    'alias' => array(
                        'service_ctimeout' => 'ConnectTimeOut',
                        'service_rtimeout' => 'ReadTimeOut',
                        'service_wtimeout' => 'WriteTimeOut',
                        'service_retry' => 'ServiceRetry',
                    ),
                ),
                'services' => array(
                    'base' => 'dict',
                    'key_type' => 'string',
                    'value_type' => 'service',
                ),
                'server_list' => array(
                    'base' => 'object',
                    'members' => array(
                        'children' => 'servers',
                        'name' => 'string',
                        'services' => 'services',
                    ),
                ),
            );

            self::$schema = Ak_Schema::create($def);
        }
        return self::$schema;
    }

    public static function checkZkConf($zk_conf) {
        $schema = self::_getSchema();
        $zk_conf = $schema->validate('server_list', $zk_conf, $ret);
        if ($ret != true) {
            Ak_Log::warning("zk conf format error");
        }
        return $zk_conf;
    }

    public function set_conf($conf){
        $this->zk_path = $conf['Path'];

        $gconf = &AClient::$global_conf;
        $this->zk_update_time = @(int)$gconf['ZookeeperUpdateTime'];
        if($this->zk_update_time <= 0){
            $this->zk_update_time = 10;
        }

        return true;
    }

    public function get_resources(){
        return $this->zk_conf['children'];
    }

    public function get_conf(){
        $this->zk_conf = Ak_Zookeeper::getCached($this->zk_path, 1, $this->zk_update_time, 'AClientGalileo::checkZkConf');
        return $this->zk_conf;
    }
}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
