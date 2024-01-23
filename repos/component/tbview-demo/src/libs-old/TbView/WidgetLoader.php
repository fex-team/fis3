<?php
require_once('TbView/ModuleLoader.php');
require_once('TbView/PageUnit.php');

class TbView_WidgetLoader extends TbView_ModuleLoader
{
	/***
	 * $options参数必须包含__component__项
	 */
	 
	/***
	 * 加载一个widget
	 */
	public function load($widgetName, $data, $scope=NULL)
	{
		$_scope = empty($scope) ? $this->_localScope : $scope;//获取真实的域，默认取当前域
		
		//如果不是自己的模块或者common模块 则不允许调用
		if($this->_validateScope($_scope) === false){
			$local_scope = $this->_localScope;
			trigger_error("WidgetLoader::load : Can not load the widget - [$scope/$widgetName] in this scope : $local_scope!", E_USER_WARNING);
			return false;
		}
		
		//不需要处理不尽行处理，该分支主要服务于 widget 独立渲染
		if($this->_needToRender($_scope, $widgetName) === false){
			return false;
		}
		
		
		$_moduleName = "$_scope/widget/$widgetName";	//用于存储的模块名
		$_phpPath = $this->_rootPath."$_scope/widget/$widgetName/$widgetName.php";	//php路径
		
		$page_unit = new TbView_PageUnit($widgetName, $_scope, $this->_rootPath); //page_unit实例化
		//不显示
		if(!$page_unit->getIsDisplay()){
			return;
		}
		
		if(!isset($data) || !is_array($data)){
			$data = array();
		}
		
		$data["__page_unit__"] = $page_unit;
		TbView_PageUnitLoader::pickPageUnit("widget/$widgetName",$_scope);
		
		if(is_file($_phpPath)){
			$this->_loadModule($_moduleName, $_phpPath, $data);
		}
		else{
			//特殊情况下widget可能没有模板文件，避免打出错误日志影响线上服务
			//trigger_error("[TbView][Load]: Can not find the script for - [${_moduleName}]; script : $_phpPath", E_USER_WARNING);
		}
		//echo "<b>[Load][Widget]: $_moduleName</b><br>";
		
	}
	
	/**
	 * 设置Widget的layout加载器
	 */
	public function setLayoutLoader($layoutLoader){
		$this->_defaultData['__layout__'] = $layoutLoader;
	}
}

/** end of file TbView/WidgetLoader.php **/