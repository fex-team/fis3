<?php
require_once('TbView/ModuleLoader.php');
require_once('TbView/WidgetLoader.php');

class TbView_ServiceLoader extends TbView_ModuleLoader
{
	/***
	 * ����һ��service
	 * @param	$serviceName		������
	 * @param	$data ���ݵ�����
	 * @param	$scope ��������
	 * @param	$loadResource	�Ƿ������Դ
	 */
	public function load($serviceName, $data=NULL, $scope=NULL, $loadResource = true)
	{
		$_scope = empty($scope) ? $this->_localScope : $scope;//��ȡ��ʵ����Ĭ��ȡ��ǰ��
		
		//����Ҫ�������д����÷�֧��Ҫ������ service ������Ⱦ
		if($this->_needToRender($_scope, $serviceName) === false){
			return false;
		}
		
		$_moduleName = "$_scope/service/$serviceName";	//���ڴ洢��ģ����
		$_phpPath = $this->_rootPath."$_scope/service/$serviceName/$serviceName.php";	//php·��
		
		//�趨 service �е�ʹ�õ� widget��component��layout ����������scope��service��ͬ��service����template
		$_component_loader = new TbView_ComponentLoader($_scope, $this->_rootPath);
		$_layout_loader = new TbView_LayoutLoader($_scope, $this->_rootPath, array(
		));//service �� layout �������������ģ�����֧������߼��� widget��component 
		$_widget_loader = new TbView_WidgetLoader($_scope, $this->_rootPath, array(
			'__component__' => $_component_loader,
			'__layout__' 		=> $_layout_loader,
		));
		$this->_defaultData['__component__'] = $_component_loader;
		$this->_defaultData['__widget__'] = $_widget_loader;
		$this->_defaultData['__layout__'] = $_layout_loader;
		
		$this->_loadResource = $loadResource;//������Դ����ģʽ
		$data['__data__'] = $data;//Ĭ����service��ͨ�� $__data__�����õ����������
		$this->_loadModule($_moduleName, $_phpPath, $data);
	}
}

/** end of file TbView/ServiceLoader.php **/