<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/



/**
 * @file frame/scheduler.class.php
 * @author liuqingjun(com@baidu.com)
 * @date 2010/10/25 11:01:10
 * @brief 
 *  
 **/

abstract class AClientScheduler {
    public abstract function set_conf($conf);

    public abstract function process($protocol, $resource);
}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
