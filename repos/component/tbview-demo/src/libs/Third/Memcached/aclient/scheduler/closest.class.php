<?php
/***************************************************************************
 * 
 * Copyright (c) 2010 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/



/**
 * @file scheduler/closest.class.php
 * @author liuqingjun(com@baidu.com)
 * @date 2010/10/26 12:03:24
 * @brief 
 *  
 **/

require_once(dirname(__FILE__)."/genericscheduler.class.php");

//will try to choose the closest resource
//however, when the resource was chosen short before,
//it will try to choose another resource which 
//has not been chosen in the near past
//
//please review the algorithm
class AClientClosest extends AClientGenericScheduler {

    //get local ip, to be used when calculate ip distance
    protected function get_local_ip() {
        return $_SERVER['SERVER_ADDR'];
    }

    //get score of a resource.
    //ip distance is the xor of two ip addresses
    //resource with highest score will be chosen first
    protected function get_score($res) {
        $ip_distance = AClientUtils::ip_xor($res['ip'], $this->get_local_ip());
        if ($ip_distance == 0) {
            return 0;
        } elseif ($ip_distance <= 0x000000ff) {
            return 1;
        } elseif ($ip_distance <= 0x0000ffff) {
            return 2;
        } elseif ($ip_distance <= 0x00ffffff) {
            return 3;
        } else {
            return 4;
        }
        //return $this->get_score_from_param($ip_distance, $time_passed);
    }

    protected function score_comparison($a, $b) {
        if ($a['score'] == $b['score'])
            return 0;
        return ($a['score'] > $b['score']) ? 1 : -1;
    }

    protected function before_choose() {
        foreach ($this->res as &$res) {
            $res['score'] = $this->get_score($res);
        }

        shuffle($this->res);
        usort($this->res, array('self','score_comparison'));
    }

    public function set_conf($conf){
        $ret = parent::set_conf($conf);
        if ($ret != true) {
            return false;
        }
        return true;
    }
}




/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
