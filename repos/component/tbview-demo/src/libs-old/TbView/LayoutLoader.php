<?php
require_once('TbView/Layout.php');
require_once('TbView/ModuleResourceLoader.php');

class TbView_LayoutLoader extends TbView_ModuleLoader
{
	private $_options;
	
	/***
	 * $options�����������__component__��__widget__��__service__��
	 */
	public function __construct($scope, $rootPath, $options)
	{
		parent::__construct($scope, $rootPath);
		if(isset($options['__component__'])) $this->_options['__component__'] = $options['__component__'];
		if(isset($options['__widget__'])) $this->_options['__widget__'] = $options['__widget__'];
	}
	/***
	 * ����һ��layout ������ʵ��
	 * @param	$layoutName		·��
	 * @param	$scope		����ģ��
	 */
	public function load($layoutName, $blocks=NULL, $scope=NULL)
	{
		$_scope = empty($scope) ? $this->_localScope : $scope;//��ȡ��ʵ����Ĭ��ȡ��ǰ��
		
		if($this->_validateScope($_scope) === false){
			trigger_error('LayoutLoader::load : Can not load the layout - ['.$_scope.'/'.$layoutName.'] in this scope!', E_USER_WARNING);
			return null;
		}
		
		
		$_path = $this->_rootPath."$_scope/layout/$layoutName/$layoutName.php";	//��ʵ��layout·��
		$_moduleName = "$_scope/layout/$layoutName";	//���ڴ洢��ģ����
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