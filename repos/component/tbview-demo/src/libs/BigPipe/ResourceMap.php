<?php

/**
 * ��Դ���ñ�
 * ����ִ�� init ������������ʹ��
 */

class BigPipe_ResourceMap
{
	private static $_map = array(); //�洢��Դ������Ϣ resource.php
	
	private $_root = null; //view·��
	private $_namespace = null; //��̬��Դ�����ռ�
	private $_static_domain = ''; //��̬�ļ�����
	private $_static_prefix = ''; //��̬�ļ�����ǰ׺
	private $_conf_loader; //���ü�����
	private $_domain_service = null; //�����������
	
	private $_loaded = array(); //������ع�����Դ
	
	private $_collection = array(); //�ռ����
	
	//adapter
	public function __call($name, $arguments){}
	
	/**
	 * @param string view��ĸ�Ŀ¼
	 * @param string ��ǰ����ģ��
	 */
	public function __construct($view_root, $namespace)
	{
		$this->_root = $view_root;
		$this->_namespace = $namespace;
		$this->_domain_service = new TbView_Domain();
		$commonDirname = TbView_Conf::get('COMMON_DIRNAME');
		
		//Ĭ�ϼ��ر�ģ���common������
		$this->_loadResourceFile($namespace);
		$this->_loadResourceFile($commonDirname);
		
		//�ⲿ�ļ�����domain
		$init_conf = $this->_root . '/' . $namespace . '/__resource_map_conf.php';
		$this->_conf_loader = new TbView_Config_PhpSource();
		$options = $this->_conf_loader->load($init_conf);
		if($options === false){//��֤�����ļ���ʧ���쳣ʱ��ϵͳ����������
			$this->_static_domain = 'http://static.tieba.baidu.com/';
			$this->_static_prefix = 'tb/static-';
		} else{
			$this->init($options);
		}
	}
	
	/**
	 * ����һ��ģ��������ļ�
	 * @param string ����ģ��
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
	 * ��ʼ����Դ���ñ���bingo�����view��ʼ���е���
	 * @param array ������ domain static_prefix
	 */
	public function init($opt)
	{
		if(!isset($opt['domain'])){
			$opt['domain'] = array(
				'static' => 'http://localhost/',
			);
		}
		$this->_domain_service->add($opt['domain']); //��ʼ����������
		$this->_static_domain = $opt['domain']['static']; //��ʼ����̬�ļ���������
		if(isset($opt['static_prefix'])){//��ʼ����̬��Դǰ׺
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
	 * ��ȡ��̬�ļ�����
	 * @param string ��Դ����Ϊ������֧����׼��
	 */
	public function getDomain($key, $resource){
		return $this->_domain_service->get($key, $resource);
	}
}

/**end of file TbView/ResourceMap.php **/

