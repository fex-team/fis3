<?php
  require_once dirname(__FILE__) . '/../adapterUi.php';
    $contentType = array(".png"=>"image/png",
                         ".jpg"=>"image/jpeg",
                         ".swf"=>"application/x-shockwave-flash",
                         ".gif"=>"image/gif",
                         ".js"=>"text/javascript");
    /*重定向resorce*/
    $url = $_SERVER['SCRIPT_URL'] ? $_SERVER['SCRIPT_URL'] : $_SERVER['REQUEST_URI'];
    $url = preg_replace( '/\?.*/', "", $url);
    $resourceDir = WEBROOT_PATH.$url;
    $result = file_get_contents($resourceDir);
    $type = substr( $resourceDir, strrpos( $resourceDir, "." ) );
    $type = $contentType[$type];
    header( "Content-Type:$type;" );
    echo $result;
    exit;


?>
