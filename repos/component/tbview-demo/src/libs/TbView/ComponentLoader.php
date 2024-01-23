<?php
require_once('TbView/ModuleLoader.php');

class TbView_ComponentLoader extends TbView_ModuleLoader
{
	/***
	 * @desc 加载一个component，只引用代码，不会实例化对象
	 * @param {String} $componentName 模块名
	 * @param {String} $scope svn module名
	 */
	public function import($componentName, $scope=NULL)
	{	
		$_scope = empty($scope) ? $this->_localScope : $scope;//获取真实的域，默认取当前域
		
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
	 * @desc 加载一个component
	 * @param {Array} $options component类需要一个options参数
	 * @param {String} $componentName 模块名
	 * @param {String} $scope svn module名
	 */
	public function load($componentName, $options=NULL, $scope=NULL)
	{
		$_scope = empty($scope) ? $this->_localScope : $scope;//获取真实的域，默认取当前域
		
		if($this->_validateScope($_scope) === false){
			$local_scope = $this->_localScope;
			trigger_error("ComponentLoader::load : Can not load the component - [$scope/$componentName.] in this scope!", E_USER_WARNING);
			return NULL;
		}
		
		$_attr = $this->_getModulePathAndName($componentName, $_scope);
		$_moduleName = $_attr['name'];
		$_phpPath = $_attr['path'];
		
		$_instance = null;//要返回的实例
		
		if(is_file($_phpPath)){//模板组件，仅加载资源并生成实例
			$componentClassName = $_attr['className'];//组件类名
			if(class_exists($componentClassName, false)){	//如果声明了组建类 则返回类实例，不采用auto_load机制
				$_instance = new $componentClassName($options);
			} else {
				$this->_loadModule($_moduleName, $_phpPath, $options);
				if(class_exists($componentClassName, false)){	//如果声明了组建类 则返回类实例，不采用auto_load机制
					$_instance = new $componentClassName($options);
				}
			}
		}
		else{//纯JS组件，仅加载资源
			$_phpPath = NULL;
			$this->_loadModuleOnce($_moduleName, $_phpPath, NULL);
		}
		TbView_PageUnitLoader::pickPageUnit("component/$componentName",$_scope);	//js的方式调用PageUnit在component中出现的情况很多，故也提供支持。不支持在component模板中调用PageUnit
		
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