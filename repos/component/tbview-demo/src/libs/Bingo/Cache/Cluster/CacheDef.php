<?php 

//默认配置文件信息
define('DEFAULT_CONF_PATH','./conf/');
define('DEFAULT_CONF_FILENAME','cache_conf.php');


//错误号定义
define('CACHE_OK' , 0);
define('CACHE_ERR_PARAM' , 1);                       //参数错误
define('CACHE_ERR_NOT_AUTH' , 2);                    //没有验证
define('CACHE_ERR_BUF_NOT_ENOUGH' , 3);              //外界buf空间不够
define('CACHE_ERR_EXIST' , 4);                       //已存在
define('CACHE_ERR_NOT_EXIST' , 5);                   //不存在
define('CACHE_ERR_BLOCK_NOT_EXIST' , 6);             //块不存在，可能发送迁移了
define('CACHE_ERR_PRODUCT_NOT_EXIST' , 7);           //产品线不存在 
define('CACHE_ERR_BUSY' , 8);                        //服务端繁忙
define('CACHE_ERR_FROZEN_DELETE' , 9);               //删除延时策略被启用
define('CACHE_ERR_BLOCK_UPDATED' , 10);              //块最后更新时间改变了
define('CACHE_ERR_TIMEOUT' , 11);                    //处理超时
define('CACHE_ERR_NET' , 12);                        //网络错误
define('CACHE_ERR_MEM' , 13);                        //内存错误
define('CACHE_ERR_DISK' , 14);                       //磁盘错误
define('CACHE_ERR_METASERVER' , 15);
define('CACHE_ERR_CACHESERVER' , 16);
define('CACHE_ERR_LIB' , 17);
define('CACHE_ERR_PART_SUC' , 18);                   //冗余操作部分成功
define('CACHE_ERR_BLOCK_WRONG_STATE' , 19);          //块状态不正确
define('CACHE_APIPLUS_INIT_FAIL' , 20);              //api初始化错误
define('CACHE_ERR_NOTSUPPORT' , 21);                 //不支持该操作
define('CACHE_FAIL' , 22);                           //操作失败