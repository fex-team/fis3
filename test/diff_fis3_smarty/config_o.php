<?php
header("constent-type:text/html;charset=utf-8");
/** 根目录地址 */
if(!defined('DIFF_ROOT_PATH')) define('DIFF_ROOT_PATH', str_replace('\\', '/', dirname(__FILE__)) . '/');
/** 定义和产品线相关的产出目录 */
if(!defined('WENKU_PATH')) define('WENKU_PATH',DIFF_ROOT_PATH.'product_output/wenku_svn_fis3_smarty/' );
if(!defined('BATMAN_PATH')) define('BATMAN_PATH',DIFF_ROOT_PATH.'product_output/tieba/' );
//if(!defined('PLACE_PATH')) define('PLACE_PATH',DIFF_ROOT_PATH.'product_output/place/' );
if(!defined('TIEBA_PATH')) define('TIEBA_PATH',DIFF_ROOT_PATH.'product_output/image/' );
if(!defined('HAO123_PATH')) define('HAO123_PATH',DIFF_ROOT_PATH.'product_output/hao123_fis3_smarty/' );
//if(!defined('SUPERMAN_PATH')) define('SUPERMAN_PATH',DIFF_ROOT_PATH.'product_output/superman/' );

$config = array(
    'product'=>array(      //产品线目录
        'wenku'=>array(
            'name'=>'wenku',
            'newoutputdir' => WENKU_PATH.'output_o_new',    //使用新版本编译后的产出
            'oldoutputdir' => WENKU_PATH.'output_o_old',  //使用旧版本编译后的产出
            "modules" =>"bookeditor", //待编译的模块
            'result' => WENKU_PATH.'result/'
        ),
        'image'=>array(
            'name'=>'image',
            'newoutputdir' => TIEBA_PATH.'output_o_new',    //使用新版本编译后的产出
            'oldoutputdir' => TIEBA_PATH.'output_o_old',  //使用旧版本编译后的产出
            "modules" =>"wisepad", //待编译的模块
            'result' => TIEBA_PATH.'result/'
        ),
        'tieba_orcp'=>array(
            'name'=>'tieba_orcp',
            'newoutputdir' => BATMAN_PATH.'output_o_new',    //使用新版本编译后的产出
            'oldoutputdir' => BATMAN_PATH.'output_o_old',  //使用旧版本编译后的产出
           "modules" =>"orcp-common,orcp-admin,orcp-online,orcp-machine" //待编译的模块
        ),
//        'place'=>array(
//            'name'=>'place',
//            'newoutputdir' => PLACE_PATH.'output_o_new',    //使用新版本编译后的产出
//            'oldoutputdir' => PLACE_PATH.'output_o_old',  //使用旧版本编译后的产出
//            "modules" =>"admin,beauty,cater,common,detail,hotel,movie,scope" //待编译的模块
//        ),
        'hao123'=>array(
            'name'=>'hao123',
            'newoutputdir' => HAO123_PATH.'output_o_new',    //使用新版本编译后的产出
            'oldoutputdir' => HAO123_PATH.'output_o_old',  //使用旧版本编译后的产出
            "modules" =>"common,home,lv2" //待编译的模块
        )
//        'superman'=>array(
//            'name'=>'superman',
//            'newoutputdir' => SUPERMAN_PATH.'output_o_new',    //使用新版本编译后的产出
//            'oldoutputdir' => SUPERMAN_PATH.'output_o_old',  //使用旧版本编译后的产出
//            "modules" =>"transit,place,common,index,addr,feedback,drive,walk,third,taxi,user" //待编译的模块
//        )
    ),
    'smarty' => array(
        'dir' => DIFF_ROOT_PATH.'./libs/smarty-3.1.5',
        'templatedir' =>DIFF_ROOT_PATH. 'result_o/'
    ),
    'output' => array(
        'newoutputdir' => 'output_o_new',    //使用新版本编译后的产出
        'oldoutputdir' => 'output_o_old',  //使用旧版本编译后的产出
    ),
    'url' =>"http://10.48.30.87:8088/"
);
