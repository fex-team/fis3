<?php
/**
 * 主站首页模块外部api数据插件配置文件
 */
return  array(
    //'name' => 'recommendhottab',
    'type' => 'personal',   //personal,common,sample 用于标识插件的类别，方便后续框架做统一化处理
    'mod' => 'recommand',   //声明需要干预的模块及数据标识,一般跟CMS中的$root.body.{$mod}对应
    'dataKey' => 'mods',    //特殊情况需要干预的是子key
    //'dataProcess' => 'edit',    //add,del,edit,merge    描述数据获得后，处理方式; 本插件中是edit
    'dataSource' => array('redis'), //db,redis,memcached,file,api 用于注册数据获取源，方便后续框架做统一初始化
    //'actionChain' => array('process'),  //执行行为序列,便用组合操作
    'cache' => false        //5(s), 0(s) 执行缓存的逻辑，这里因针对个人，是不需要的
);
