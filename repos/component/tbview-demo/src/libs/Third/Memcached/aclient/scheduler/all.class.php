<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/



/**
 * @file scheduler/all.class.php
 * @author liuqingjun(com@baidu.com)
 * @date 2010/10/25 17:24:24
 * @brief 
 *  
 **/

require_once(dirname(__FILE__)."/genericscheduler.class.php");

class AClientAll extends AClientGenericScheduler {
    protected $CHOOSE_NUM = -1;
}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
