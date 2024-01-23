<?php 
/**
 * ��ʱ�������ڼ���һ�δ����ִ��ʱ�䡣
 * ʱ�䵥λ��us
 * calculate execution time
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package bingo
 * @since 2010-04-07
 *
 */
class Bingo_Timer
{
	/**
	 * ���ڴ���ʱ�����ݣ���ʼʱ��ͽ���ʱ��
	 * @var array
	 * {
	 * 		start : ��ʼʱ��
	 * 		end : ����ʱ��
	 * }
	 */
	protected static $_arrData = array();
	/**
	 * ִ�е�ʱ�䣬us��
	 * @var array
	 * {
	 * 		$strName => $intTimeUs
	 * }
	 */
	protected static $_arrExecutionTime = array();
	
	protected static $_intTimeS = null;
	/**
	 * ��ʱ��ʼ��
	 * @param string $strName
	 */
	public static function start($strName)
	{
		self::$_arrData[$strName]['end'] = self::$_arrData[$strName]['start'] = gettimeofday();
	}
	/**
	 * ��ʱ����
	 * @param string $strName
	 */
	public static function end($strName)
	{
		self::$_arrData[$strName]['end'] = gettimeofday();
	}
	/**
	 * ����ִ��ʱ�䣬���û��ָ��$strName���򷵻����е�ִ��ʱ�����ݡ�
	 * @param string $strName
	 */
	public static function calculate($strName='')
	{
		if (! empty($strName)) {
			return self::_calculateOne($strName);
		} else {
			return self::_calculateAll();
		}
	}
	
	public static function getTimes()
	{
		return self::$_arrExecutionTime;
	}
	
	public static function getNowTime()
	{
		if (is_null(self::$_intTimeS)) {
			self::$_intTimeS = time();
		}
		return self::$_intTimeS;
	}
	/**
	 * ����ʱ��
	 * @param unknown_type $intStart
	 * @param unknown_type $intEnd
	 */
	public static function getUtime($intStart, $intEnd)
	{
	    return ($intEnd['sec'] - $intStart['sec'])*1000*1000 + ($intEnd['usec'] - $intStart['usec']);
	}
	
	public static function toString($chr1=':', $chr2=' ')
	{
	    $arrRet = self::calculate();
	    if (empty($arrRet)) return '';
	    $strRet = '';
	    foreach ($arrRet as $strName => $strTimer) {
	        $strRet .= sprintf('%s%s%s%s',$strName, $chr1, $strTimer, $chr2);
	    }
	    $strRet = rtrim($strRet, $chr2);
	    return $strRet;
	}
	
	protected static function _calculateAll()
	{
		if (empty(self::$_arrData)) return array();
		foreach(self::$_arrData as $strName => $arrTime) {
			if (!isset(self::$_arrExecutionTime[$strName])) {
				self::$_arrExecutionTime[$strName] = self::_getUtime($arrTime['start'], $arrTime['end']);
			}
		}
		return self::$_arrExecutionTime;
	}
	
	protected static function _calculateOne($strName)
	{
		if (isset(self::$_arrExecutionTime[$strName])) {
			return self::$_arrExecutionTime[$strName];
		}		
		if (isset(self::$_arrData[$strName])) {
			self::$_arrExecutionTime[$strName] = self::_getUtime(self::$_arrData[$strName]['start'], self::$_arrData[$strName]['end']);
			return self::$_arrExecutionTime[$strName];
		}
		return 0;
	}
	
	protected static function _getUtime($time1,$time2)
	{
        return ($time2['sec'] - $time1['sec'])*1000*1000 + ($time2['usec'] - $time1['usec']);
	}
}