<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file aclient.class.php
 * @author wangweibing(com@baidu.com)
 * @date 2010/12/09 18:03:45
 * @brief 
 *  
 **/

require_once(dirname(__FILE__) . "/utils/utils.php");
require_once(dirname(__FILE__) . "/frame/source.class.php");
require_once(dirname(__FILE__) . "/frame/protocol.class.php");
require_once(dirname(__FILE__) . "/frame/scheduler.class.php");
require_once(dirname(__FILE__) . "/../Zookeeper.php");
require_once(dirname(__FILE__) . "/../Schema.php");


class AClient {
    public static $global_conf = null;
    protected static $schema = null;
    private $source = null;
    private $protocol = null;
    private $scheduler = null;
    private $ready = false; 
    private $error = null;

    protected static function _getSchema() {
        if (!(self::$schema instanceof Ak_Schema)) {
            $def = array(
                'ctimeout' => array(
                    'base' => 'int',
                    'optional' => true,
                ),
                'wtimeout' => array(
                    'base' => 'int',
                    'optional' => true,
                ),
                'rtimeout' => array(
                    'base' => 'int',
                    'optional' => true,
                ),
                'retry' => array(
                    'base' => 'int',
                    'optional' => true,
                ),
                'timeoutconf' => array(
                    'base' => 'object',
                    'optional' => true,
                    'members' => array(
                        'ConnectTimeOut' => 'ctimeout',
                        'WriteTimeOut' => 'wtimeout',
                        'ReadTimeOut' => 'rtimeout',
                    ),
                ),
                'aclient_conf' => array(
                    'base' => 'object',
                    'members' => array(
                        'Source' => 'string',
                        'Protocol' => 'string',
                        'Scheduler' => 'string',
                        'HttpConf' => 'timeoutconf',
                        'NsheadConf' => 'timeoutconf',
                    ),
                ),
            );
            self::$schema = Ak_Schema::create($def);
        }
        return self::$schema;
             
    }

    public static function checkAClientConf($aclient_conf) {
        $schema = self::_getSchema();
        $aclient_conf = $schema->validate('aclient_conf', $aclient_conf, $ret);
        if ($ret != true) {
            Ak_Log::warning("aclient conf format error");
            return null;
        }
        return $aclient_conf;
    }

    function create_obj_from_conf($type, $conf){
        $name = $conf[$type];
        $file = dirname(__FILE__).strtolower("/$type/$name.class.php");
        $obj = AClientUtils::create_obj('AClient'.$name, 'AClient'.$type, $file);
        if($obj == null){
            AClientUtils::add_error("can not create $type $name");
            return null;
        }

        $ret = $obj->set_conf(@$conf[$name."Conf"]);
        if($ret != true){
            AClientUtils::add_error("$name Conf no correct");
            return null;
        }
        return $obj;
    }

    function _call($input){
        if($this->ready != true){
            AClientUtils::add_error('no available conf');
            return null;
        }

        $resources = $this->source->get_resources();
        if(empty($resources)){
            AClientUtils::add_error('no resource');
            return null;
        }

        $ret = $this->protocol->set_input($input);
        if($ret != true){
            AClientUtils::add_error('input format wrong');
            return null;
        }

        $ret = $this->scheduler->process($this->protocol,$resources);
        if($ret != true){
            AClientUtils::add_error('process failed');
            return null;
        }

        return $this->protocol->get_output();
    }

    protected function _set_timeout($proto_conf, $conf) {
        foreach ($proto_conf['services'] as $service_info) {
            $timeouts = array('ConnectTimeOut', 'WriteTimeOut', 'ReadTimeOut');
            foreach ($timeouts as $timeout) {
                if (!isset($conf[$timeout])) {
                    $conf[$timeout] = $service_info[$timeout];
                }
            }
        }
        return $conf;
    }

    function set_conf($conf){
        $this->ready = false;

        $conf = $this->checkAClientConf($conf);
        if ($conf == null) {
            return false;
        }

        $this->source = $this->create_obj_from_conf('Source', $conf);
        if($this->source == null){
            return false;
        }

        $proto_conf = $this->source->get_conf();
        if (is_array($proto_conf)) {
            $proto_index = $conf['Protocol'].'Conf';
            if (!isset($conf[$proto_index]) || is_null($conf[$proto_index])) {
                $conf[$proto_index] = array();
            }
            $conf[$proto_index] = $this->_set_timeout($proto_conf, $conf[$proto_index]);
        }

        $sche_index = $conf['Scheduler'].'Conf';
        if (!isset($conf[$sche_index]['ServiceRetry'])) {
            if (isset($proto_conf['services'])) {
                foreach ($proto_conf['services'] as $service_info) {
                    $conf[$sche_index]['ServiceRetry'] = $service_info['ServiceRetry'];
                }
            }
        }

        $this->protocol = $this->create_obj_from_conf('Protocol', $conf);
        if($this->protocol == null){
            return false;
        }

        $this->scheduler = $this->create_obj_from_conf('Scheduler', $conf);
        if($this->scheduler == null){
            return false;
        }

        $this->ready = true;
        return true;
    }

    public function Call($input){
        AClientUtils::clear_error();
        $output = $this->_call($input);
        $this->error = AClientUtils::get_error();
        return $output;
    }

    public function SetConf($conf){
        AClientUtils::clear_error();
        $ret = $this->set_conf($conf);
        $this->error = AClientUtils::get_error();
        return $ret;
    }

    public function GetLastError(){
        return $this->error;
    }

    public static function SetGlobalConf($conf){
        self::$global_conf=$conf;
        if (isset($conf['ZookeeperHost'])) {
            Ak_Zookeeper::setHost($conf['ZookeeperHost']);
        }
        if (isset($conf['ZookeeperBackupDir'])) {
            Ak_Zookeeper::setBackupDir($conf['ZookeeperBackupDir']);
        }
        if (isset($conf['ZookeeperDisabled']) && $conf['ZookeeperDisabled'] === true) {
            Ak_Zookeeper::useBackupOnly(true);
        }
    }
}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
