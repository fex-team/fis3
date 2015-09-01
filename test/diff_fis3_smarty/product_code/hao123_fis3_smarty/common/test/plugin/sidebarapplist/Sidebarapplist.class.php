<?php

class Sidebarapplist {

    private function _data_merge (&$origin_data, $merge_data) {
        //数据merge方法
        if(empty($origin_data)) {
            $origin_data = array();
        }
        $mod_data = &$origin_data;

        foreach ($merge_data as $key => $value) {
            $mod_data[$key] = $value;
        }
    }

    public function process(&$origin_data, $params){
        $data_path = dirname(__FILE__)."/../../";
        $data_prefix_path = $data_path."data/";
        if(empty($params) || empty($params['datapath'])){
            return false;
        }
        $data_path = $data_prefix_path . ltrim($params['datapath'], '/');

        // root
        if( !file_exists( $data_path ) ) {
            return false;
        }
        include_once $data_path;

        if(empty($root) || empty($root['sidebar'])){ //只针对sidebar的applist数据，保证其中有sidebar字段
            return false;
        }

        //将sidebar字段merge进$root.body
        $this->_data_merge($origin_data['sidebar'], $root['sidebar']);

        //如果有defaultApp字段，则merge进$root.body
        if(!empty($params['datakey'])) {
            foreach ($params['datakey'] as $value) {
                $this->_data_merge($origin_data[$value], $root[$value]);
            }
        }

        //合并mis数据
        if(!empty($params['misdatapath'])) {
            $mis_data_path = $data_prefix_path . ltrim($params['misdatapath'], '/');
            if( file_exists( $mis_data_path ) ) {
                include_once $mis_data_path;
                // 合并sidebar list数据
                foreach ($root['sidebar']['list'] as $item) {
                    $origin_data['sidebar']['list'][]= $item;
                }
                // 合并sidebar气泡数据
                foreach ($root['sidebar']['guideBubble']['list'] as $item) {
                    $origin_data['sidebar']['guideBubble']['list'][]= $item;
                }
            }
        }
    }
}
