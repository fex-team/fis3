<?php
    $root_dir = dirname(__FILE__)."/apidata/";
	$apiMap = array(
        "br" => "http://api.gus.hao123.com",
        "ar" => "http://api.gar.hao123.com",
        "id" => "http://api.gid.hao123.com",
        "vn" => "http://api.gid.hao123.com",
        "tw" => "http://api.gid.hao123.com",
        "th" => "http://api.gid.hao123.com",
        "jp" => "http://api.gid.hao123.com",
    );
    $path_url = $_SERVER['SCRIPT_URL'] ? $_SERVER['SCRIPT_URL'] : $_SERVER['REQUEST_URI'];
    $reffer = $_SERVER['HTTP_REFERER'];
    $reffer = parse_url( $reffer );
    $reffer_path = explode("/", $reffer['path']);
    $country = $reffer_path[1];
    $api_url = $apiMap[$country];
    $api_file_name = parse_url($path_url);
    $api_file_name = $api_file_name['query'];
    //过滤去掉jsonp字段和_
    $api_file_name = preg_replace('/&(jsonp|_)=[^&]+/i','',$api_file_name) ;
    //检测本地是否有数据
    if( is_file( $root_dir . $api_file_name.".json") ){
        echo file_get_contents( $root_dir . $api_file_name.".json" );
    } else {
      $data = file_get_contents( $api_url.$path_url );
      //如果目录不存在
      if( !is_dir( $root_dir ) ){
        //建立目录
        mkdir($root_dir,0777,true);
      }
      file_put_contents( $root_dir . $api_file_name.".json" , $data);
      echo $data;
    }
