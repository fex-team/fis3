<?php
/**
 * Config�����ļ������ࡣ
 * 1��Ŀǰ֧��������ʽ�������ļ�: PHPԭ������array��INI�ļ����ٶȵ�configure��ʽ�ļ�
 * 2��֧��cache��Ĭ�ϲ���static���棬�����Զ��建�棨�����ļ���eacc��apc�ȵȣ���
 * 3��֧���Զ����أ��Զ����¡�
 * 
 * @author xuliqiang@baidu.com
 * @package config
 * @since 2009-10-21
 * 
 *
 */
require_once 'Bingo/Config/Abstract.php';
class Bingo_Config
{
	private static $_arrConfigTypes = array('ini', 'array', 'configure', 'text', 'txt', 'json');
	
	/**
	 * ����һ��config�࣬����$fileType��ȷ����
	 *
	 * @param �����ļ���·���������� $filePath
	 * @param �ļ����ͣ�ini,array,xml,config $fileType
	 * @return FALSE/Object
	 */
	public static function factory($strType, $arrConfig=array())
	{
		$strType = strtolower($strType);
		if (! in_array($strType, self::$_arrConfigTypes)) {
			trigger_error('Bingo_Config type invalid!type=' . $strType, E_USER_WARNING);
			return false;
		}
		$objConfig = null;
		switch ($strType)
		{
		    case 'txt':
		    case 'text':
		        require_once 'Bingo/Config/Text.php';
				$objConfig = new Bingo_Config_Text($arrConfig);
		        break;
			case 'ini':
				require_once 'Bingo/Config/Ini.php';
				$objConfig = new Bingo_Config_Ini($arrConfig);
				break;
			case 'array':
				require_once 'Bingo/Config/Array.php';
				$objConfig = new Bingo_Config_Array($arrConfig);
				break;
			case 'json':
			    require_once 'Bingo/Config/Json.php';
			    $objConfig = new Bingo_Config_Json($arrConfig);
			    break;
			case 'configure':
			default:
				require_once 'Bingo/Config/Configure.php';
				$objConfig = new Bingo_Config_Configure($arrConfig);
				break;
		}
		if (! is_null($objConfig) && method_exists($objConfig, 'load') ) {
			$objConfig->load();
		}
		return $objConfig;
	}
}