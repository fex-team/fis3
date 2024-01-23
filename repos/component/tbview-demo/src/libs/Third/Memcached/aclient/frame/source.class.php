<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file frame/source.class.php
 * @author wangweibing(com@baidu.com)
 * @date 2010/12/10 17:40:59
 * @brief 
 *  
 **/

abstract class AClientSource {
    public abstract function set_conf($conf);

    public abstract function get_resources();
}


/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
