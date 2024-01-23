<?php 

class TbView_ConfiguratorLoader {
	private static $page_feature;
	
	public static function setPageFeature($page_feature) {
		self::$page_feature = $page_feature;
	}
	
	/***
	 * @desc 加载一个component
	 * @param {Array} $options component类需要一个options参数
	 * @param {String} $componentName 模块名
	 * @param {String} $scope svn module名
	 */
	public static function load($configuratorName,$rootPath)
	{		
		$_attr = self::_getModulePathAndName($configuratorName,$rootPath);
		$_moduleName = $_attr['name'];
		$_phpPath = $_attr['path'];

		if(is_file($_phpPath)){//模板组件，仅加载资源并生成实例
			require_once $_phpPath;
			$configuratorClassName = $_attr['className'];//组件类名
			if(class_exists($configuratorClassName, false)){	//如果声明了组建类 则返回类实例，不采用auto_load机制
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