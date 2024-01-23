<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/



/**
 * @file scheduler/first.class.php
 * @author liuqingjun(com@baidu.com)
 * @date 2010/10/25 12:30:43
 * @brief 
 *  
 **/

require_once(dirname(__FILE__)."/genericscheduler.class.php");

//inherits from generic scheduler
//will always choose the first usable defined resource
class AClientFirst extends AClientGenericScheduler {
}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
