<?php
/**
 * Config配置文件处理类。
 * 1、目前支持三种形式的配置文件: PHP原生数据array、INI文件、百度的configure格式文件
 * 2、支持cache。默认采用static缓存，可以自定义缓存（比如文件，eacc，apc等等）。
 * 3、支持自动加载，自动更新。
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
	 * 产生一个config类，根据$fileType来确定。
	 *
	 * @param 配置文件的路径或者数组 $filePath
	 * @param 文件类型，ini,array,xml,config $fileType
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