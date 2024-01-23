<?php
require_once('TbView/ModuleLoader.php');
require_once('TbView/PageUnit.php');

class TbView_WidgetLoader extends TbView_ModuleLoader
{
	/***
	 * $options�����������__component__��
	 */
	 
	/***
	 * ����һ��widget
	 */
	public function load($widgetName, $data, $scope=NULL)
	{
		$_scope = empty($scope) ? $this->_localScope : $scope;//��ȡ��ʵ����Ĭ��ȡ��ǰ��
		
		//��������Լ���ģ�����commonģ�� ���������
		if($this->_validateScope($_scope) === false){
			$local_scope = $this->_localScope;
			trigger_error("WidgetLoader::load : Can not load the widget - [$scope/$widgetName] in this scope : $local_scope!", E_USER_WARNING);
			return false;
		}
		
		//����Ҫ�������д����÷�֧��Ҫ������ widget ������Ⱦ
		if($this->_needToRender($_scope, $widgetName) === false){
			return false;
		}
		
		
		$_moduleName = "$_scope/widget/$widgetName";	//���ڴ洢��ģ����
		$_phpPath = $this->_rootPath."$_scope/widget/$widgetName/$widgetName.php";	//php·��
		
		$page_unit = new TbView_PageUnit($widgetName, $_scope, $this->_rootPath); //page_unitʵ����
		//����ʾ
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
			//���������widget����û��ģ���ļ���������������־Ӱ�����Ϸ���
			//trigger_error("[TbView][Load]: Can not find the script for - [${_moduleName}]; script : $_phpPath", E_USER_WARNING);
		}
		//echo "<b>[Load][Widget]: $_moduleName</b><br>";
		
	}
	
	/**
	 * ����Widget��layout������
	 */
	public function setLayoutLoader($layoutLoader){
		$this->_defaultData['__layout__'] = $layoutLoader;
	}
}

/** end of file TbView/WidgetLoader.php **/