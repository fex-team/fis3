<?php
    $contentType = array(".png"=>"image/png",
                         ".jpg"=>"image/jpeg",
                         ".swf"=>"application/x-shockwave-flash",
                         ".gif"=>"image/gif");
    /*重定向resorce*/
    $url = $_SERVER['SCRIPT_URL'] ? $_SERVER['SCRIPT_URL'] : $_SERVER['REQUEST_URI'];
    $url = preg_replace( '/\?.*/', "", $url);
    $resource_url = "http://br.hao123.com{$url}";
    $resourceDir = dirname(__FILE__).$url;
    if ( !is_file($resourceDir) ){
    	$ch = curl_init();
    	curl_setopt($ch,  CURLOPT_URL, $resource_url);
    	curl_setopt($ch,  CURLOPT_RETURNTRANSFER, true);
    	curl_setopt($ch,  CURLOPT_BINARYTRANSFER, true);
    	curl_setopt($ch,  CURLOPT_SSL_VERIFYPEER, false);
    	curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    	$result = curl_exec($ch);
    	if( $result != false ){
    		//建立目录
    		$lastPos = strrpos($resourceDir, "/");
    		$dir = substr($resourceDir, 0, $lastPos);
    		mkdir($dir,0777,true);
    		//建立文件
			file_put_contents($resourceDir, $result);
			echo $result;
			exit;
    	}

    	//建立目录

    } else{
      $result = file_get_contents($resourceDir);
      $type = substr( $resourceDir, strrpos( $resourceDir, "." ) );
      $type = $contentType[$type];
      header( "Content-Type:$type;" );
      echo $result;
      exit;
    }


?>
