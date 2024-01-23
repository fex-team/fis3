<?php
require_once('TbView/Layout.php');
require_once('TbView/ModuleResourceLoader.php');

class TbView_LayoutLoader extends TbView_ModuleLoader
{
	private $_options;
	
	/***
	 * $options参数必须包含__component__、__widget__、__service__项
	 */
	public function __construct($scope, $rootPath, $options)
	{
		parent::__construct($scope, $rootPath);
		if(isset($options['__component__'])) $this->_options['__component__'] = $options['__component__'];
		if(isset($options['__widget__'])) $this->_options['__widget__'] = $options['__widget__'];
	}
	/***
	 * 加载一个layout 并返回实例
	 * @param	$layoutName		路径
	 * @param	$scope		所在模块
	 */
	public function load($layoutName, $blocks=NULL, $scope=NULL)
	{
		$_scope = empty($scope) ? $this->_localScope : $scope;//获取真实的域，默认取当前域
		
		if($this->_validateScope($_scope) === false){
			trigger_error('LayoutLoader::load : Can not load the layout - ['.$_scope.'/'.$layoutName.'] in this scope!', E_USER_WARNING);
			return null;
		}
		
		
		$_path = $this->_rootPath."$_scope/layout/$layoutName/$layoutName.php";	//真实的layout路径
		$_moduleName = "$_scope/layout/$layoutName";	//用于存储的模块名
		//echo "<b>[Load][Layout]: $_moduleName</b><br>";
		TbView_ModuleResourceLoader::load($_moduleName);
		$tpl_path = $this->_rootPath . '/' . $this->_localScope . '/template/';
		$_layout = new TbView_Layout($_path, $tpl_path, $this->_options);
		
		if(isset($blocks) && is_array($blocks))
			$_layout->setBlock($blocks);
		
		return $_layout;
	}
}

/** end of file TbView/LayoutLoader.php **/