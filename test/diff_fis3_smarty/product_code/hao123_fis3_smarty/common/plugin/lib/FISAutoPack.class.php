<?php
if (!class_exists('FISResource')) require_once(dirname(__FILE__) . '/FISResource.class.php');

/**
 * FIS自动打包页面静态资源统计脚本
 * 提供API给产品线使用，统计页面中使用的静态资源，区分是否首屏
 */
class FISAutoPack {

    private static $VER = 2;  //统计版本，用来log切分时候区分
    private static $sampleRate = 1;  //采样率,默认0.1，贴吧等产品线PV较大
    private static $fid = "";    //项目ID
    private static $pageName = "";   //页面名称
    private static $fsFinish = false;  //是否完成首屏
    public  static $usedStatics = array('first_screen'=> array(),'other'=> array());  //静态资源数组

    //设置fis id 一般为项目ID
    public static function setFid($fid){
        self::$fid = $fid;
    }

    //获取fis id
    public static function getFid(){
        return self::$fid;
    }

    //设置采样率
    public static function setSampleRate($rate){
        self::$sampleRate = $rate;
    }

    //获取采样率
    public static function getSampleRate(){
        return self::$sampleRate;
    }

    //根据采样率判断是否命中
    private static function isSample($sample){
        $tmp_sample = rand(1, 10000) / 10000;
        return $sample >= $tmp_sample;
    }
 
    //获取页面名称
    public static function getPageName(){
        return self::$pageName;
    }

    //设置页面名称
    public static function setPageName($page){
        self::$pageName = $page;
    }


    public static function addHashTable($strId, $smarty){
        $staticInfo = FISResource::getStaticInfo($strId, $smarty);
        if($staticInfo['hash']){
            self::addStatic($staticInfo['hash']);
        }
    }


    //添加静态资源,首屏完成之后添加的资源标记为非首屏资源
    public static function addStatic($hash){
        $type = self::$fsFinish ? "other" : "first_screen"; //是否是首屏资源
        self::$usedStatics[$type][]  = $hash;             
    }

    //设置是否已完成首屏
    public static function setFRender(){
        self::$fsFinish = true;
    }

    //获取渲染到前端的js统计代码
    public static function getCountUrl(){
        $code = "";
        $sampleRate = self::getSampleRate();
        $fid = self::getFid();
        if(self::isSample($sampleRate) && $fid){           
            $pageName = self::getPageName();
            //去重,另外如果资源同时存在于首屏与非首屏中，当成首屏资源
            $first_screen = array_filter(array_unique(self::$usedStatics['first_screen']));
            $other        = array_filter(array_unique(self::$usedStatics['other']));
            if(count($other) >0){
                foreach ($other as $k => $val) {
                    if(in_array($val, $first_screen) ){
                        unset($other[$k]);
                    }
                }
            }

            if (count($first_screen) >0 || count($other) >0 ) {
                $timeStamp  = time();
                $hashStr    = '';
                $fsStr      = implode(',', $first_screen);
                $otherStr   = implode(',', $other);
                $hashStr  .=  ($fsStr . $otherStr);

                $code .= '(new Image()).src="http://static.tieba.baidu.com/tb/pms/img/st.gif?pid=242&v=' . self::$VER . '&fs=' . $fsStr . "&otherStr=" . $otherStr .  "&page=" . $pageName  . '&sid=' . $timeStamp . '&hash=<STATIC_HASH>' . '&fid=' . $fid . '";';
                $code = str_replace("<STATIC_HASH>", substr(md5($hashStr), 0, 10), $code);
            }
        }
        return $code;
    }
}
