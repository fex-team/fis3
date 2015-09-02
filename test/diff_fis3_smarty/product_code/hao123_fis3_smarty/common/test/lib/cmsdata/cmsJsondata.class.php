<?php
/*
* @descripton: 以json的方式读取cms数据类
*
* @filename: cmsData.class.php  
* @author  : mozhuoying@baidu.com
* @date    : 2014-04-08
* @package : web-ui/lib/cms/
*
* @Copyright (c) 2014 BAIDU-GPM
*
*/
class CmsJsonData{
    //读取cms数据（json方式）
    static function get( $dataPath ){

      if( is_file(  $dataPath ) ){
        $data = json_decode( file_get_contents( $dataPath ), true );
        //json格式有错误
        if( is_null( $data ) ){
            echo "big brother,please check your json data in $dataPath";
            exit;
        }
        return $data;
      } else {
        return array();
      }
      
    }
    
      //存储cms数据至本地（json方式）
  static function save( $dataPath, $content ){
    $content =  JSONFormat::format( $content );
    //保证数据所在目录的存在
    mkdir( dirname( $dataPath ) , 0777, true);
    file_put_contents( $dataPath, $content );
  }

}

   
?>