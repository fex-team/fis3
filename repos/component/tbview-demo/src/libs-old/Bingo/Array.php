<?php
/**
 * ���麯����װ����Ҫ���ṩһЩ���ײȿӺ����ķ�װ��
 * @author lichao <lichao@baidu.com>
 * @since 2013-03-13
 * @package bingo
 *
 */
class Bingo_Array
{
   	/**
     * ������������������ֵ��Ĭ�ϲ���ǿ�����Ͳ��ҡ�
	 * in_array(0,array('a','b')) == true; ԭ�����������õ�������ʶ�������������⡣
     *
     * @param mixed $needle
     * @param array $arrHaystack
     * @param bool $boolStrict
     * @return bool 
     */
	public static function in_array($needle, $arrHaystack, $bookStrict=true)
	{
		return in_array($needle, $arrHaystack, $bookStrict);
	}
    
}    
