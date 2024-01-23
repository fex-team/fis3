<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/



/**
 * @file scheduler/random.class.php
 * @author liuqingjun(com@baidu.com)
 * @date 2010/10/25 15:08:00
 * @brief 
 *  
 **/

require_once(dirname(__FILE__)."/genericscheduler.class.php");

//randomly select a resource from the resource list
class AClientRandom extends AClientGenericScheduler {
    protected function before_choose() {
        shuffle($this->res);
    }
}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
