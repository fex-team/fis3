<?php 

class TbView_ConfiguratorLoader {
	private static $page_feature;
	
	public static function setPageFeature($page_feature) {
		self::$page_feature = $page_feature;
	}
	
	/***
	 * @desc ����һ��component
	 * @param {Array} $options component����Ҫһ��options����
	 * @param {String} $componentName ģ����
	 * @param {String} $scope svn module��
	 */
	public static function load($configuratorName,$rootPath)
	{		
		$_attr = self::_getModulePathAndName($configuratorName,$rootPath);
		$_moduleName = $_attr['name'];
		$_phpPath = $_attr['path'];

		if(is_file($_phpPath)){//ģ���������������Դ������ʵ��
			require_once $_phpPath;
			$configuratorClassName = $_attr['className'];//�������
			if(class_exists($configuratorClassName, false)){	//����������齨�� �򷵻���ʵ����������auto_load����
				call_user_func_array(array($configuratorClassName,'init'),array(self::$page_feature));
				return $configuratorClassName;
			}
		}
		return NULL;
	}
	
	private static function _getModulePathAndName($configuratorName,$rootPath){
		$_scope = 'common';
		$_componentPath = 'configurator';
		$_configurator = $configuratorName;
		$_rootPath = $rootPath;
		
		$_moduleName = "$_scope/$_componentPath/$_configurator";
		$_phpPath = $_rootPath."$_scope/$_componentPath/$_configurator.php";
		$_className = 'TbView_'.ucfirst($_scope).'_'.ucfirst($configuratorName);
		
		return array(
			'name' => $_moduleName,
			'path' => $_phpPath,
			'className' => $_className
		);
	}
}