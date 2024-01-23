<?php

require_once('TbView/Config/PhpSource.php'); //引用php模式的配置文件加载器
require_once('TbView/Domain.php'); //域名管理

/**
 * 资源配置表
 * 必须执行 init 方法才能正常使用
 */
class TbView_ResourceMap
{
	private $_rootPath = ''; //view路径
	private $_localScope; //当前处理模块
	private $_static_domain = ''; //静态文件域名
	private $_static_prefix = ''; //静态文件部署前缀
	private $_conf_loader; //配置加载器
	private $_commonDirname = ''; //common 模块的目录名
	private $_load_state = array(); //配置文件加载状态
	private $_domain_service = null; //域名管理服务
	private $_terminal_model = '';
	private $_map = array( //存储资源配置信息 resource.php
	);
	private $_loaded_mod_conf = array(); // 已经载入的模块配置文件标识
	private $_mod_conf = array(); // 存储模块配置信息 __mod_conf.php
	
	/**
	 * @param string view层的根目录
	 * @param string 当前所属模块
	 */
	public function __construct($view_root, $scope)
	{
		$this->_rootPath = $view_root;
		$this->_localScope = $scope;
		$this->_conf_loader = new TbView_Config_PhpSource();
		$this->_domain_service = new TbView_Domain();
		$this->_commonDirname = TbView_Conf::get('COMMON_DIRNAME');
		//默认加载本模块和common的配置
		$this->_loadResourceFile($scope);
		$this->_loadResourceFile($this->_commonDirname);
		/**
		 * 此处属 hack 行为，添加默认配置 by niuyao 2012.05.09
		 * 为向下兼容，保证资源加载工作能正常进行，避免UI全面修改 
		 * 默认用 common 模块下的 __resource_map_conf.php 来初始化系统
		 * 不进行额外的容错处理
		 */
		$init_conf = $this->_rootPath . '/' . $this->_commonDirname . '/__resource_map_conf.php';
		$options = $this->_conf_loader->load($init_conf);
		if($options === false){//保证配置文件丢失或异常时，系统仍正常工作
			$this->_static_domain = 'http://static.tieba.baidu.com/';
			$this->_static_prefix = 'tb/static-';
		}
		else{
			$this->init($options);
		}
		/****/
	}
	public function setTerminalModel ($model) {
		$this->_terminal_model = $model;
	}
	
	/***
	 * 获取静态文件域名
	 * @param string 资源名，为泛域名支持做准备
	 */
	public function getDomain($key, $resource){
		return $this->_domain_service->get($key, $resource);
	}
	
	/**
	 * 获取资源的真实路径
	 * @param string 资源名
	 * @param string 所属模块
	 * @param string 资源在服务器上的部署路径，兼容一些非常不容易改造的旧模块，比如 发贴逻辑-postor 
	 */
	public function path($res, $mod, $deploy_path = null)
	{
		$real_res = $res;
		if(!isset($this->_load_state[$mod])){
			$res_conf = $this->_loadResourceFile($mod);
		}
		$_map = $this->_map;
		if(isset($_map[$mod])){
			if(isset($_map[$mod]['tpl'][$res])){
				$real_res = $_map[$mod]['tpl'][$res];
			}
			else{
				$real_res = $res . '?v=' . $_map[$mod]['_default'];
			}
		}

		if ($real_res{0} == '/') {// 为了支持短url   /tb/_/md5...形式
			return $this->_static_domain . $real_res;
		}

		if($deploy_path == null){
			$deploy_path = $this->_static_prefix . $mod ;
		}
		return $this->_static_domain . $deploy_path . '/' . $real_res;
	}

	/**
	 * 获取资源的真实路径
	 * @param string 资源名
	 * @param string 所属模块
	 * @param boolen 返回是否带域名
	 */
	public function getRespath($res, $mod, $need_domain = true)
	{
		$real_res = $res;
		if(!isset($this->_load_state[$mod])){
			$res_conf = $this->_loadResourceFile($mod);
		}
		$_map = $this->_map;
		$model = $this->_terminal_model;
		if(isset($_map[$mod])){
			if(isset($_map[$mod]['tpl'][$res])){
				if ($model != '' && !empty($_map[$mod]['adp'][$res][$model])) {
					$real_res = $_map[$mod]['adp'][$res][$model];
				} else {
					$real_res = $_map[$mod]['tpl'][$res];
				}
				
			} else { 
				return false;
			}
		}
		
		if ($real_res{0} == '/') { // 为了支持短url   /tb/_/md5...形式
			return ($need_domain ? $this->_static_domain : '') . $real_res;
		}

		$deploy_path = $this->_static_prefix . $mod ;

		return ($need_domain ? $this->_static_domain : '') . $deploy_path . '/' . $real_res;
	}
	
	/**
	 * 获取本模块提供给 fis模块加载器的配置信息
	 */
	public function useForFisJsLoader(){
	}
	
	/**
	 * 加载一个模块的配置文件
	 * @param string 所属模块
	 */
	private function _loadResourceFile($mod)
	{
		$resource_file = $this->_rootPath . "/$mod/resource.php";
		$data = $this->_conf_loader->load($resource_file);
		$this->_load_state[$mod] = 1;
		if($data != false){
			$this->_map[$mod] = $data;
		}
		if (TbView_Conf::get('DYNAMIC_MERGE')) { // 如果使用服务器端静态文件合并 需要加载子模块资源
			$this->_mergeSubModRes($mod);		
		}
	}
	/**
	 * 加载一个模块的配置文件 __mod_conf.php
	 * @param string 所属模块
	 */
	private function _loadModConf($mod)
	{
		$conf_file = $this->_rootPath . "/$mod/__mod_conf.php";
		$data = $this->_conf_loader->load($conf_file);
		$this->_loaded_mod_conf[$mod] = 1;
		if($data != false){
			$this->_mod_conf[$mod] = $data;
		}
	}
	
	/**
	 * 加载子模块资源并进行合并
	 * @param string 模块名
	 */
	private function _mergeSubModRes ($mod) {
		$sub_mods = $this->_getSubmoduleList($mod);
		
		if (!$sub_mods) { // 没有子模块直接返回
			return false;
		}

		$des_tpl = $this->_map[$mod]['dependency']['tpl'];
		$des_js = $this->_map[$mod]['dependency']['js'];
		$tpl = $this->_map[$mod]['tpl'];
		$page_unit = isset($this->_map[$mod]['page_unit']) ? $this->_map[$mod]['page_unit'] : array();
		foreach ($sub_mods as $sub_mod) {
			$data = $this->_conf_loader->load($this->_rootPath .$mod.'/resource_'.$sub_mod.'.php'); // 加载子模块资源配置文件
			
			if ($data) {
				$des_tpl = array_merge($des_tpl, $data['dependency']['tpl']);// 合并依赖关系
				$tpl = array_merge($tpl, $data['tpl']); // 合并文件真实地址对应关系
				$page_unit = array_merge((isset($page_unit)?$page_unit:array()),(isset($data['page_unit'])?$data['page_unit']:array()));
				if (($mod === $this->_localScope || $mod === $this->_commonDirname) && !empty($data['dependency']['js'])) {
					$des_js = array_merge($des_js, $data['dependency']['js']);
				}			
			}
		}
		$this->_map[$mod]['dependency']['tpl'] = $des_tpl;
		$this->_map[$mod]['dependency']['js'] = array_unique($des_js);
		$this->_map[$mod]['tpl'] = $tpl;
		$this->_map[$mod]['page_unit'] = $page_unit;
		
	}
	
	/**
	 * 获取子模块列表
	 * @return array example : array('list', 'aside', 'head', 'star', 'live')
	 */
	private function _getSubmoduleList($mod){
		if (!isset($this->_loaded_mod_conf[$mod])) {
			$this->_loadModConf($mod);
		}
		if (!empty($this->_mod_conf[$mod]['SUBMODULE_LIST'])) {
			return $this->_mod_conf[$mod]['SUBMODULE_LIST'];
		} else { // 这个else分支是为了兼容上线中间状态
			return $this->_conf_loader->load($this->_rootPath.$mod.'/sub_mod_list.php');// 加载子模块列表文件
		}
		return false;
	}
	
	public function getResMapValue($mod,$key) {
		return $this->_map[$mod][$key];
	}

	/**
	 * 获取模板资源依赖 注意：此方法不支持跨模块调用依赖获取，所以不能用于service
	 * @param string 模板路径 例如 template/rich  
	 * @param string 所属域（即模块名） 目前只为本模块
	 */
	public function getModuleDependency ($modPath, $scope) { 
		$des = array();
		$this->_getDes($modPath, $scope, &$des);
		$des[] =  $scope . '/' . $modPath;
		return $des;
	}
	private function _getDes ($modPath, $scope, $result) {
		$directDes = $this->_getDirectDes($modPath, $scope);
		
		if (!empty($directDes)) {
			foreach ($directDes as $item) {
				if (in_array($item, $result)) {
					continue;
				}
				$pos = strpos($item, '/');
				$item_path = substr($item, $pos+1);
				$item_scope = substr($item, 0, $pos);

				$this->_getDes($item_path, $item_scope, &$result);
				$result[] = $item;
			}
		}
	
	}

	private function _getDirectDes ($modPath, $scope) {
		if(!isset($this->_load_state[$scope])){
			$this->_loadResourceFile($scope);
		}
		return $this->_map[$scope]['dependency']['tpl'][$modPath];
	}
	
	/**
	 * 初始化资源配置表，给bingo框架在view初始化中调用
	 * @param array 可设置 domain static_prefix
	 */
	public function init($opt){
		if(!isset($opt['domain'])){
			$opt['domain'] = array(
				'static' => 'http://localhost/',
			);
		}
		$this->_domain_service->add($opt['domain']); //初始化域名服务
		$this->_static_domain = $opt['domain']['static']; //初始化静态文件域名服务
		if(isset($opt['static_prefix'])){//初始化静态资源前缀
			$this->_static_prefix = $opt['static_prefix'];
		}
	}
	
	/**
	 * 返回模块的默认版本信息
	 **/
	public function getDefaultVersion(){
		$scope = $this->_localScope;
		return $this->_map[$scope]['_default'];
	}
	/**
	 * 返回本模块使用js动态加载js文件的时间戳
	 **/
	public function getJsStamp () {
		$result = array();
		$js_des = array_unique(array_merge($this->_map[$this->_localScope]['dependency']['js'], $this->_map[$this->_commonDirname]['dependency']['js']));
		
		$map = $this->_map;

		foreach ($js_des as $item) {
			$pos = strpos($item, '/');
			$item_path = substr($item, $pos+1);
			$item_scope = substr($item, 0, $pos);
			$real_path = $map[$item_scope]['tpl'][$item_path];
			if ($real_path) {
				if ($real_path{0} == '/') {
					$result[$item] = $real_path;
				} else {
					$result[$item] = basename($real_path);
				}                    
			}
		}
		return $result;
	}

	public function getCommonlogicVersion () {
		$version = $this->_map['common'];
		if (!empty($version)) {
			$result = array();
			foreach ($version['tpl'] as $key => $value){
				if (strpos($key,"component/commonLogic/common/") !== false){
					$result[$key] = $value;
				}
			}
		}
		return $result;
	}
}

/**end of file TbView/ResourceMap.php **/


