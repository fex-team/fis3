<?php
require_once 'Bingo/Action/Abstract.php';
abstract class Bingo_Action_Filter extends Bingo_Action_Abstract
{
    /**
     * ���������Ҳ��Ĭ��������ǽ���ִ����һ��FilterAction
     * @var unknown_type
     */
    const FILTER_NEXT         = 1;
    /**
     * Filter������ֱ������ֱ�Ӵ��������Action
     * @var unknown_type
     */
    const FILTER_END          = 2;
    /**
     * Filter���������������������Action��ֱ�������Ǹ���EndActions����
     * @var unknown_type
     */
    const FILTER_ACTION_END   = 3;
    /**
     * ֱ��������������Filter��Action��EndAction��������ִ��
     * @var unknown_type
     */
    const FILTER_ALL_END      = 4;
}