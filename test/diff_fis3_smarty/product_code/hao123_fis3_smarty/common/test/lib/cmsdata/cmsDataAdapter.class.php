<?php

/*
* @descripton: 读取cms数据入口，通过url可改变使用json方式还是php的方式
*
* @filename: CmsDataAdapter.class.php  
* @author  : mozhuoying@baidu.com
* @date    : 2014-04-08
* @package : web-ui/lib/cms/
*
* @Copyright (c) 2014 BAIDU-GPM
*
*/
require_once LIB_PATH.'/cmsdata/cmsData.class.php';
require_once LIB_PATH.'/cmsdata/cmsJsondata.class.php';
class CmsDataAdapter{
  //
	static $localData_id = "localdata";
  //是否使用php数据
  static $useJson_id =  "usejson";
  //转换jsontophp
  static $jsonTophp = "jsontophp";
  //从服务器获取cms数据
  static $server = "http://cq01-rdqa-pool145.cq01.baidu.com:8088";
  static $serverDataUrl = '/productdata/getData?dataPath=data/';
  static $_query_string = "";


  //判断是否使用online或者本地数据
  static function isLocalData(){
    return self::urlDebug(self::$localData_id);
  }

    //判断是否使用online或者本地数据
  static function useJson(){
    return self::urlDebug(self::$useJson_id);
  }

    //判断是否使用online或者本地数据
  static function jsonTophp(){
    return self::urlDebug(self::$jsonTophp);
  }

  /**
   * 通过url检验切换不同的模式（1.是否使用本地数据 2.是否使用php数据）
   * @param  string  $id 检验url是否有指定的参数
   * @return bool 
   */
   //判断是否使用online或者本地数据
  static function urlDebug( $id ){
    //获取query_string以便判断是否开启smarty或者data调试模式
    if (isset($_SERVER['QUERY_STRING'])) {
      self::$_query_string = $_SERVER['QUERY_STRING'];
    }
     if (false !== strpos(self::$_query_string, $id)) {
        if (false !== strpos(self::$_query_string, $id . '=on')) {
            // enable debugging for this browser session
            setcookie($id, "");

        } elseif (false !== strpos(self::$_query_string, $id . '=off')) {
            // disable debugging for this browser session
            setcookie($id, "online",time()+3600*24*356);
            return false;
        }
     } else {
        if (isset($_COOKIE[$id]) && $_COOKIE[$id] === "online") {
              return false;
        }
     }
      return true;
  }



	/**
	 * 根据路径读取cms数据
	 * @param  string  $dataPath 读取的数据路径
	 * @return array 读取cms数据
	 */
    static function get( $dataPath ){
      //格式化路径
      $dataPath  =  self::useJson() ? str_replace(".php",".json",$dataPath) : str_replace(".json",".php",$dataPath);
      if( is_file(  $dataPath ) ){
        //使用json读取cms
        if( self::useJson() ){
          return CmsJsonData::get( $dataPath );
        //使用php读取数据
        } else {
          return CmsData::get( $dataPath );
        }
      } else {
        return array();
      }
      
    }
    /**
	 * 根据路径存储数据（该方法在本地调试fis抓取数据使用，线上不调用）
	 * @param  string  $dataPath 存储的数据路径
	 * @param  string  $content 存储的内容（json的方式传递）
	 * @return null
	 */
  static function save( $dataPath, $content, $forceUsePhp = false ){
  	if ( !empty($content) ){
      //使用json保存cms数据
        if( self::useJson() && !$forceUsePhp ){
          //保证文件后缀
          $dataPath = str_replace(".php",".json",$dataPath);
          return CmsJsonData::save($dataPath, $content);
        //使用php保存cms数据
        } else {
          //保证文件后缀
          $dataPath = str_replace(".json",".php",$dataPath);
          return CmsData::save($dataPath, $content);
        }
	  }
  }
  	/**
	 * 从服务器获取数据，并存储至本地，最后合并后返回cms数据（该方法在本地调试fis抓取数据使用，线上不调用）
	 * @param  string  $dataPath 		存储的数据路径
	 * @param  string  $serverdataPath  服务器获取的数据路径
	 * @param  array   $mergeArr        合并的数组    
	 * @return array
	 */
  static function saveAndGetOrMergeData( $dataPath, $serverdataPath, $mergeArr = array()  ){
    $root = self::get( $dataPath );
    //判断是否使用线上最新数据
    if ( !empty( $root ) && self::isLocalData() ) {
        //是否进行本地转换数据json to php,方便提测
        if ( self::jsonTophp() && self::useJson() ){
              self::save( $dataPath, json_encode( $root ), true );
        }

    } else{
      $root = file_get_contents( self::$server."/ar".self::$serverDataUrl.$serverdataPath );
      if ( !empty($root) ){
        self::save( $dataPath, $root );
        $root = json_decode( $root,true);
      } else{
        $root =  array();
      }
    }
    return self::array_merge_recursive_new($mergeArr, $root);
  }
  static function array_merge_recursive_new() {  
    $arrays = func_get_args();
    $base = array_shift($arrays);    
    foreach ($arrays as $array) {        
      reset($base); //important       
      while (list($key, $value) = @each($array)) {           
        if (is_array($value) && @is_array($base[$key])) {                
            $base[$key] = self::array_merge_recursive_new($base[$key], $value);      
        } 
        else {
            $base[$key] = $value;
        }       
       }   
    }   
    return $base;
  }
}

   
?>