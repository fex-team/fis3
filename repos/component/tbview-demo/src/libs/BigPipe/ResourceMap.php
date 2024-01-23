<?php

/**
 * 资源配置表
 * 必须执行 init 方法才能正常使用
 */

class BigPipe_ResourceMap
{
	private static $_map = array(); //存储资源配置信息 resource.php
	
	private $_root = null; //view路径
	private $_namespace = null; //静态资源命名空间
	private $_static_domain = ''; //静态文件域名
	private $_static_prefix = ''; //静态文件部署前缀
	private $_conf_loader; //配置加载器
	private $_domain_service = null; //域名管理服务
	
	private $_loaded = array(); //缓存加载过的资源
	
	private $_collection = array(); //收集输出
	
	//adapter
	public function __call($name, $arguments){}
	
	/**
	 * @param string view层的根目录
	 * @param string 当前所属模块
	 */
	public function __construct($view_root, $namespace)
	{
		$this->_root = $view_root;
		$this->_namespace = $namespace;
		$this->_domain_service = new TbView_Domain();
		$commonDirname = TbView_Conf::get('COMMON_DIRNAME');
		
		//默认加载本模块和common的配置
		$this->_loadResourceFile($namespace);
		$this->_loadResourceFile($commonDirname);
		
		//外部文件配置domain
		$init_conf = $this->_root . '/' . $namespace . '/__resource_map_conf.php';
		$this->_conf_loader = new TbView_Config_PhpSource();
		$options = $this->_conf_loader->load($init_conf);
		if($options === false){//保证配置文件丢失或异常时，系统仍正常工作
			$this->_static_domain = 'http://static.tieba.baidu.com/';
			$this->_static_prefix = 'tb/static-';
		} else{
			$this->init($options);
		}
	}
	
	/**
	 * 加载一个模块的配置文件
	 * @param string 所属模块
	 */
	private function _loadResourceFile($namespace)
	{
		if(!isset(self::$_map[$namespace])){
			$resource_file = "{$this->_root}/{$namespace}/{$namespace}-map.json";
			if(file_exists($resource_file)){
				$json = file_get_contents($resource_file);
				self::$_map[$namespace] = json_decode($json, true);
			} else {
				//trigger_error
			}
		}
	}
	
	/**
	 * 初始化资源配置表，给bingo框架在view初始化中调用
	 * @param array 可设置 domain static_prefix
	 */
	public function init($opt)
	{
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
	
	public function import($id, $namespace = null)
	{
		$pos = strpos($id, ':');
		if($pos === false){
			if($namespace == null){
				//trigger_error('invalid id ' . $id, E_USER_NOTICE);
				return false;
			} else {
				$id = $namespace . ':' . $id;
			}
		} else {
			$namespace = substr($id, 0, $pos);
		}
		
		if($namespace !== 'common' && $namespace !== $this->_namespace){
			//trigger_error('cross module load resource [' . $id . '] from [' . $this->_namespace . ']', E_USER_NOTICE);
			return false;
		}
		
		//load cache
		if(isset($this->_loaded[$id])){
			return $this->_loaded[$id];
		}
		
		$uri = false;
		if(isset(self::$_map[$namespace])){
			$map = &self::$_map[$namespace];
			$res = $map['res'][$id];
			if(isset($res)){
				$type = $res['type'];
				unset($res['type']);
				$pkgId = $res['pkg'];
				$uri = $res['uri'];
				$isStatic = $type === 'js' || $type === 'css';
				$this->_loaded[$id] = $uri;
				if($isStatic && isset($pkgId)){
					$pkg = $map['pkg'][$pkgId];
					if(isset($pkg)){
						$this->_collection['pkg'][$pkgId] = $pkg;
					}
					foreach($pkg['deps'] as $depsId){
						$this->import($depsId);
					}
				}
				foreach($res['deps'] as $depsId){
					$this->import($depsId);
				}
				if($isStatic){
					$res['id'] = $id;
					$this->_collection['res'][$type][] = $res;
				}
			}
			unset($map);
		}
		return $uri;
	}
	
	public function addScript($code, $name){
		$this->_collection['script'][$name] .= $code;
	}
	
	public function getScript($name, $clean = true){
		$codes = $this->_collection['script'][$name];
		if($clean){
			unset($this->_collection['script'][$name]);
		}
		return $codes;
	}
	
	public function getCollection(){
		return $this->_collection;
	}
	
	/***
	 * 获取静态文件域名
	 * @param string 资源名，为泛域名支持做准备
	 */
	public function getDomain($key, $resource){
		return $this->_domain_service->get($key, $resource);
	}
}

/**end of file TbView/ResourceMap.php **/

