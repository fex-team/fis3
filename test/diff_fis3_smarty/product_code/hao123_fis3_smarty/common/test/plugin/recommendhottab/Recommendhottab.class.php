<?php
/**
 * 通用个性化的推荐数据，干预主站首页的热区侧边栏TAB模块
 * 个性化那边会将数据推送到[个性化Redis]中，针对每个用户定义一个优选的TAB，从而针对cms的数据配置进行调整
 */


// require_once CONFIG_PATH . '/GlobalEnvConfig.class.php';
// require_once(LIB_PATH."/redis/Redis.php");

class Recommendhottab {
    const KEY_PREFIX = 'Rec_indexTabDis_';
    private $recomRedis;
    private $_redis_key_user;
    private $_mod_data_key;
    private $_mod_data_sub_key;
    private $_cache_time;

    public function __construct($config, $country){
        return; // 本地开发环境不使用该插件，构造时直接退出。
        //[[[[[[[[[ 选取redis 的逻辑
        $baiduid   = $_COOKIE['BAIDUID'];
        $baiduid = str_replace(':FG=1', '', $baiduid);  //remove endix
        //用多套redis,根据Cookie16进制的尾号来选：(0~7 第一套:0) (8~F 第二套:1) 
        $num = substr($baiduid, -1, 1);
        $num = hexdec($num);    //!! 注意需要做16进制处理
        if($num < 8) {
            $suite = 0;
        } else {
            $suite = 1;
        }
        if(!$this->initRecomRedis($suite)){
            //todo error
        }
        //]]]]]]]]]]
        $this->_redis_key_user = self::KEY_PREFIX . $country .'_'. $baiduid;
        $this->_mod_data_key = $config['mod'];
        $this->_mod_data_sub_key = $config['dataKey'];
    }
    /**
     * @params $origin_data {array} 用于干预的源数据
     * @params $params {array} 配置的行为参数
     */
    public function process(&$origin_data, $params){
        if(!is_object($this->recomRedis)){
            return;
        }
        try{
            $read_redis = $this->recomRedis->getRedis(false); //选slave读
            //从推荐中获取数据
            $recom_data_list = $read_redis->zRevRange($this->_redis_key_user, 0, -1);
            //避免Redis上不了
        }catch(Exception $e){
            return;
        }
        //$recom_data_list = array('games');  //TODO!!!!!!!!!!!!!!!!
        if(empty($recom_data_list)){
            return;
        }
        //根据推荐的数据，调整TAB数据的排序
        if(!empty($this->_mod_data_sub_key)){
            $mod_data = &$origin_data[$this->_mod_data_key][$this->_mod_data_sub_key];
        } else {
            $mod_data = &$origin_data[$this->_mod_data_key];
        }
        $tmp_data = $mod_data;
        $mod_data = array();    //重置
        $mod_key_list = array();
        //根据权重选出排序
        foreach($recom_data_list as $mod_key){
            foreach($tmp_data as $mod){
                if($mod['type'] === $mod_key){    //TODO: game --> games
                    $mod_data[] = $mod;
                    $mod_key_list[] = $mod_key;
                } 
            }
        }
        foreach($tmp_data as $mod){
            if(!in_array($mod['type'], $mod_key_list)){ //未处理的才加入
                $mod_data[] = $mod;
                $mod_key_list[] = $mod['type'];
            }
        }
        unset($tmp_data);
        unset($mod_data);
        unset($origin_data);
    }
    /**
     * 个性化推荐用的Redis； 这个配置跟其他的不一样,是多个Redis组的
     * @params {Number} $suite 选择哪个组
    */ 
    protected function initRecomRedis($suite=0) {
        $env = GlobalEnv::Env;
        $redisConfig = GlobalConfig::$recomRedisConfig[$env];
        try {
            $redis_source = new Air_Redis($redisConfig[$suite]);
        } catch (Exception $error) {
            return false;
        }
        $this->recomRedis = $redis_source;  //TODO 奇怪，如果这里直接getRedis，后面的操作会反馈closed,立即操作则可心
        return true;
    }   
    function __destruct() {
    }
}
