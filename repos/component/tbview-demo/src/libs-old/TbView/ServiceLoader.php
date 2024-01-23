<?php
require_once('TbView/ModuleLoader.php');
require_once('TbView/WidgetLoader.php');

class TbView_ServiceLoader extends TbView_ModuleLoader
{
	/***
	 * 加载一个service
	 * @param	$serviceName		服务名
	 * @param	$data 传递的数据
	 * @param	$scope 所属的域
	 * @param	$loadResource	是否加载资源
	 */
	public function load($serviceName, $data=NULL, $scope=NULL, $loadResource = true)
	{
		$_scope = empty($scope) ? $this->_localScope : $scope;//获取真实的域，默认取当前域
		
		//不需要处理不尽行处理，该分支主要服务于 service 独立渲染
		if($this->_needToRender($_scope, $serviceName) === false){
			return false;
		}
		
		$_moduleName = "$_scope/service/$serviceName";	//用于存储的模块名
		$_phpPath = $this->_rootPath."$_scope/service/$serviceName/$serviceName.php";	//php路径
		
		//设定 service 中的使用的 widget、component、layout 加载器，其scope和service相同，service更像template
		$_component_loader = new TbView_ComponentLoader($_scope, $this->_rootPath);
		$_layout_loader = new TbView_LayoutLoader($_scope, $this->_rootPath, array(
		));//service 的 layout 做成最轻量级的，不再支持在里边加载 widget、component 
		$_widget_loader = new TbView_WidgetLoader($_scope, $this->_rootPath, array(
			'__component__' => $_component_loader,
			'__layout__' 		=> $_layout_loader,
		));
		$this->_defaultData['__component__'] = $_component_loader;
		$this->_defaultData['__widget__'] = $_widget_loader;
		$this->_defaultData['__layout__'] = $_layout_loader;
		
		$this->_loadResource = $loadResource;//设置资源加载模式
		$data['__data__'] = $data;//默认在service中通过 $__data__即可拿到传入的数据
		$this->_loadModule($_moduleName, $_phpPath, $data);
	}
}

/** end of file TbView/ServiceLoader.php **/