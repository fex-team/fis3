<?php
require_once 'Bingo/Action/Abstract.php';
abstract class Bingo_Action_Filter extends Bingo_Action_Abstract
{
    /**
     * 正常情况，也是默认情况，是接着执行下一个FilterAction
     * @var unknown_type
     */
    const FILTER_NEXT         = 1;
    /**
     * Filter结束，直接跳到直接处理请求的Action
     * @var unknown_type
     */
    const FILTER_END          = 2;
    /**
     * Filter结束并且跳过处理请求的Action，直接至此那个到EndActions链表
     * @var unknown_type
     */
    const FILTER_ACTION_END   = 3;
    /**
     * 直接跳出，后续的Filter、Action和EndAction链表都不再执行
     * @var unknown_type
     */
    const FILTER_ALL_END      = 4;
}