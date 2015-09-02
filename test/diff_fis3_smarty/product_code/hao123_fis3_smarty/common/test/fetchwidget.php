<?php

    class FetchWidget extends adapterUi{
        function index(){
            $widgetName = $_GET['name'];
            $path = explode( ":", $widgetName );
            $path = implode( "/", $path );

            header("Content-type:text/html;charset=UTF-8");
            if( !empty( $this->cmsdata['head']['forceCompile'] ) ){
                $smarty->force_compile = true;
            }
            $this->smarty->display($path);
        }
    }

    $controller = new FetchWidget();
    $controller->index();


?>