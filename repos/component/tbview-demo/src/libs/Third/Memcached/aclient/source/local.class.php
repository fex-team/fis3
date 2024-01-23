<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file source/local.class.php
 * @author wangweibing(com@baidu.com)
 * @date 2010/12/10 17:59:25
 * @brief 
 *  
 **/

class AClientLocal extends AClientSource {
    protected $server;
    public function set_conf($conf){
        $this->server = null;
        $server = $conf['Server'];
        if(!is_array($server)){
            return false;
        }
        foreach($server as &$s){
            if(!empty($s['IP'])){
                $s['ip'] = $s['IP'];
                unset($s['IP']);
            }
            if(!empty($s['Port'])){
                $s['port'] = $s['Port'];
                unset($s['Port']);
            }
        }
        $this->server = $server;
        return true;
    }

    public function get_resources(){
        return $this->server;
    }

    public function get_conf(){
        return null;
    }
}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
