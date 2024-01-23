<?php

class TbView_PageUnit {
	private $_data = array();
	private $_is_display = 1;
	private $_rootPath = '';
	public function __construct($widgetName, $scope, $rootPath){
		$this->_rootPath = $rootPath;
		$page_configurator_class = TbView_ConfiguratorLoader::load('PageConfigurator',$this->_rootPath);
		if (is_null($page_configurator_class)) return;
		$_data = call_user_func_array(array($page_configurator_class,'getWidgetData'),array($widgetName, $scope));
		if(!$_data) return;
		$this->_is_display = $_data["display"];
		$this->_data = $_data["widget_data"];
	}
	/**
	 * @desc 调用配置平台数据
	 * @param	{string}	$unit_id			单元id
	 * @param	{array}		$unit_properties	单元标签属性
	 */
	public function load($unit_id, $unit_properties=NULL){
		if(!$this->_data[$unit_id]) return NULL;
		$_data = $this->_data[$unit_id];
		
		//加上属性
		if($unit_properties && is_array($unit_properties) && count($unit_properties)){
			$_properties_str = "";
			foreach($unit_properties as $key => $val){
				$_properties_str .= ($key.'="'.$val.'" ');
			}
			$_data = preg_replace("/^(\<[a-zA-Z]+)/", "$1 ".$_properties_str, $_data);
		}
		
		return $_data;
	}
	public function getIsDisplay(){
		return $this->_is_display;
	}
};