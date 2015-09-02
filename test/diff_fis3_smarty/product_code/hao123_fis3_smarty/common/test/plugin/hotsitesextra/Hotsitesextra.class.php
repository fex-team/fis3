<?php


class Hotsitesextra {
    private $_mod_data_key;
    private $_mod_data_sub_key;

    public function __construct($config, $country){
        $this->_mod_data_key = $config['mod'];
        $this->_mod_data_sub_key = $config['dataKey'];
    }
    public function process(&$origin_data, $params){
        //加载用于merge的干预数据
        $data_path = dirname(__FILE__)."/../../";
        $data_prefix_path = $data_path."data/";
        if(empty($params) || empty($params['datapath'])){
            return false;
        }
        $data_path = $data_prefix_path . ltrim($params['datapath'], '/');
        include $data_path; //$root
        if(empty($root) || empty($root['body']) || empty($root['body'][$this->_mod_data_key])){ //plugin 不负责创建结构，只负责merge数据,必须要提前保证结构存在
            return false;
        }

        //对数据进行合并,只做单层的merge
        if(!empty($this->_mod_data_sub_key)){
            if(empty($origin_data[$this->_mod_data_key][$this->_mod_data_sub_key])){
                $origin_data[$this->_mod_data_key][$this->_mod_data_sub_key] = array();
            }
            $mod_data = &$origin_data[$this->_mod_data_key][$this->_mod_data_sub_key];
            $api_data = $root['body'][$this->_mod_data_key][$this->_mod_data_sub_key];
        } else {    //hotsites这里，暂时没有用到这块
            $mod_data = &$origin_data[$this->_mod_data_key];
            $api_data = $root['body'][$this->_mod_data_key];
        }
        foreach($api_data as $key=>$value){
            $mod_data[$key] = $value;
        }
    }
}
