<?php
require_once('TbView/ModuleLoader.php');

class TbView_ComponentLoader extends TbView_ModuleLoader
{
	/***
	 * @desc ����һ��component��ֻ���ô��룬����ʵ��������
	 * @param {String} $componentName ģ����
	 * @param {String} $scope svn module��
	 */
	public function import($componentName, $scope=NULL)
	{	
		$_scope = empty($scope) ? $this->_localScope : $scope;//��ȡ��ʵ����Ĭ��ȡ��ǰ��
		
		if($this->_validateScope($_scope) === false){
			$local_scope = $this->_localScope;
			trigger_error("ComponentLoader::load : Can not load the component - [$scope/$componentName.] in this scope!", E_USER_WARNING);
			return NULL;
		}
		
		$_attr = $this->_getModulePathAndName($componentName, $_scope);
		
		$_moduleName = $_attr['name'];
		$_phpPath = $_attr['path'];
		
		if(is_file($_phpPath)){
			$this->_loadModule($_moduleName, $_phpPath, NULL, true);
		}
		else{
			trigger_error("[TbView][Load]: Can not find the script for - [${_moduleName}]", E_USER_WARNING);
			return false;
		}
		
	}
	
	/***
	 * @desc ����һ��component
	 * @param {Array} $options component����Ҫһ��options����
	 * @param {String} $componentName ģ����
	 * @param {String} $scope svn module��
	 */
	public function load($componentName, $options=NULL, $scope=NULL)
	{
		$_scope = empty($scope) ? $this->_localScope : $scope;//��ȡ��ʵ����Ĭ��ȡ��ǰ��
		
		if($this->_validateScope($_scope) === false){
			$local_scope = $this->_localScope;
			trigger_error("ComponentLoader::load : Can not load the component - [$scope/$componentName.] in this scope!", E_USER_WARNING);
			return NULL;
		}
		
		$_attr = $this->_getModulePathAndName($componentName, $_scope);
		$_moduleName = $_attr['name'];
		$_phpPath = $_attr['path'];
		
		$_instance = null;//Ҫ���ص�ʵ��
		
		if(is_file($_phpPath)){//ģ���������������Դ������ʵ��
			$componentClassName = $_attr['className'];//�������
			if(class_exists($componentClassName, false)){	//����������齨�� �򷵻���ʵ����������auto_load����
				$_instance = new $componentClassName($options);
			} else {
				$this->_loadModule($_moduleName, $_phpPath, $options);
				if(class_exists($componentClassName, false)){	//����������齨�� �򷵻���ʵ����������auto_load����
					$_instance = new $componentClassName($options);
				}
			}
		}
		else{//��JS�������������Դ
			$_phpPath = NULL;
			$this->_loadModuleOnce($_moduleName, $_phpPath, NULL);
		}
		TbView_PageUnitLoader::pickPageUnit("component/$componentName",$_scope);	//js�ķ�ʽ����PageUnit��component�г��ֵ�����ܶ࣬��Ҳ�ṩ֧�֡���֧����componentģ���е���PageUnit
		
		return $_instance;
	}
	
	private function _checkstr($str, $needle){ 
		return false;
		$tmparray = explode($needle,$str); 
		if(count($tmparray)>1){ 
			return true; 
		} else{ 
			return false; 
		} 
	} 
	
	private function _getModulePathAndName($componentName, $scope){
		if(!$this->_checkstr($componentName, '/')){
			$_componentPath = 'component';
			$_component = $componentName;
		}else{
			preg_match('/([\/\w]*)\/([^\/]*)$/', $componentName, $_matcher);
			$_componentPath = $_matcher[1];
			$_component = $_matcher[2];
		}
		
		$_moduleName = "$scope/$_componentPath/$_component";
		$_phpPath = $this->_rootPath."$scope/$_componentPath/$_component/$_component.php";
		$_className = ($_componentPath === "component")?('TbView_'.ucfirst($scope).'_'.ucfirst($componentName)):('TbView_' . ucfirst($scope).'_'.ucfirst($_componentPath).'_'.ucfirst($componentName));
		
		return array(
			'name' => $_moduleName,
			'path' => $_phpPath,
			'className' => $_className
		);
	}
	
}

/**end of file TbView/ComponentLoader.php **/