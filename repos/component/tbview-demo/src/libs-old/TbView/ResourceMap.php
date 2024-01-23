<?php

require_once('TbView/Config/PhpSource.php'); //����phpģʽ�������ļ�������
require_once('TbView/Domain.php'); //��������

/**
 * ��Դ���ñ�
 * ����ִ�� init ������������ʹ��
 */
class TbView_ResourceMap
{
	private $_rootPath = ''; //view·��
	private $_localScope; //��ǰ����ģ��
	private $_static_domain = ''; //��̬�ļ�����
	private $_static_prefix = ''; //��̬�ļ�����ǰ׺
	private $_conf_loader; //���ü�����
	private $_commonDirname = ''; //common ģ���Ŀ¼��
	private $_load_state = array(); //�����ļ�����״̬
	private $_domain_service = null; //�����������
	private $_terminal_model = '';
	private $_map = array( //�洢��Դ������Ϣ resource.php
	);
	private $_loaded_mod_conf = array(); // �Ѿ������ģ�������ļ���ʶ
	private $_mod_conf = array(); // �洢ģ��������Ϣ __mod_conf.php
	
	/**
	 * @param string view��ĸ�Ŀ¼
	 * @param string ��ǰ����ģ��
	 */
	public function __construct($view_root, $scope)
	{
		$this->_rootPath = $view_root;
		$this->_localScope = $scope;
		$this->_conf_loader = new TbView_Config_PhpSource();
		$this->_domain_service = new TbView_Domain();
		$this->_commonDirname = TbView_Conf::get('COMMON_DIRNAME');
		//Ĭ�ϼ��ر�ģ���common������
		$this->_loadResourceFile($scope);
		$this->_loadResourceFile($this->_commonDirname);
		/**
		 * �˴��� hack ��Ϊ�����Ĭ������ by niuyao 2012.05.09
		 * Ϊ���¼��ݣ���֤��Դ���ع������������У�����UIȫ���޸� 
		 * Ĭ���� common ģ���µ� __resource_map_conf.php ����ʼ��ϵͳ
		 * �����ж�����ݴ���
		 */
		$init_conf = $this->_rootPath . '/' . $this->_commonDirname . '/__resource_map_conf.php';
		$options = $this->_conf_loader->load($init_conf);
		if($options === false){//��֤�����ļ���ʧ���쳣ʱ��ϵͳ����������
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
	 * ��ȡ��̬�ļ�����
	 * @param string ��Դ����Ϊ������֧����׼��
	 */
	public function getDomain($key, $resource){
		return $this->_domain_service->get($key, $resource);
	}
	
	/**
	 * ��ȡ��Դ����ʵ·��
	 * @param string ��Դ��
	 * @param string ����ģ��
	 * @param string ��Դ�ڷ������ϵĲ���·��������һЩ�ǳ������׸���ľ�ģ�飬���� �����߼�-postor 
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

		if ($real_res{0} == '/') {// Ϊ��֧�ֶ�url   /tb/_/md5...��ʽ
			return $this->_static_domain . $real_res;
		}

		if($deploy_path == null){
			$deploy_path = $this->_static_prefix . $mod ;
		}
		return $this->_static_domain . $deploy_path . '/' . $real_res;
	}

	/**
	 * ��ȡ��Դ����ʵ·��
	 * @param string ��Դ��
	 * @param string ����ģ��
	 * @param boolen �����Ƿ������
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
		
		if ($real_res{0} == '/') { // Ϊ��֧�ֶ�url   /tb/_/md5...��ʽ
			return ($need_domain ? $this->_static_domain : '') . $real_res;
		}

		$deploy_path = $this->_static_prefix . $mod ;

		return ($need_domain ? $this->_static_domain : '') . $deploy_path . '/' . $real_res;
	}
	
	/**
	 * ��ȡ��ģ���ṩ�� fisģ���������������Ϣ
	 */
	public function useForFisJsLoader(){
	}
	
	/**
	 * ����һ��ģ��������ļ�
	 * @param string ����ģ��
	 */
	private function _loadResourceFile($mod)
	{
		$resource_file = $this->_rootPath . "/$mod/resource.php";
		$data = $this->_conf_loader->load($resource_file);
		$this->_load_state[$mod] = 1;
		if($data != false){
			$this->_map[$mod] = $data;
		}
		if (TbView_Conf::get('DYNAMIC_MERGE')) { // ���ʹ�÷������˾�̬�ļ��ϲ� ��Ҫ������ģ����Դ
			$this->_mergeSubModRes($mod);		
		}
	}
	/**
	 * ����һ��ģ��������ļ� __mod_conf.php
	 * @param string ����ģ��
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
	 * ������ģ����Դ�����кϲ�
	 * @param string ģ����
	 */
	private function _mergeSubModRes ($mod) {
		$sub_mods = $this->_getSubmoduleList($mod);
		
		if (!$sub_mods) { // û����ģ��ֱ�ӷ���
			return false;
		}

		$des_tpl = $this->_map[$mod]['dependency']['tpl'];
		$des_js = $this->_map[$mod]['dependency']['js'];
		$tpl = $this->_map[$mod]['tpl'];
		$page_unit = isset($this->_map[$mod]['page_unit']) ? $this->_map[$mod]['page_unit'] : array();
		foreach ($sub_mods as $sub_mod) {
			$data = $this->_conf_loader->load($this->_rootPath .$mod.'/resource_'.$sub_mod.'.php'); // ������ģ����Դ�����ļ�
			
			if ($data) {
				$des_tpl = array_merge($des_tpl, $data['dependency']['tpl']);// �ϲ�������ϵ
				$tpl = array_merge($tpl, $data['tpl']); // �ϲ��ļ���ʵ��ַ��Ӧ��ϵ
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
	 * ��ȡ��ģ���б�
	 * @return array example : array('list', 'aside', 'head', 'star', 'live')
	 */
	private function _getSubmoduleList($mod){
		if (!isset($this->_loaded_mod_conf[$mod])) {
			$this->_loadModConf($mod);
		}
		if (!empty($this->_mod_conf[$mod]['SUBMODULE_LIST'])) {
			return $this->_mod_conf[$mod]['SUBMODULE_LIST'];
		} else { // ���else��֧��Ϊ�˼��������м�״̬
			return $this->_conf_loader->load($this->_rootPath.$mod.'/sub_mod_list.php');// ������ģ���б��ļ�
		}
		return false;
	}
	
	public function getResMapValue($mod,$key) {
		return $this->_map[$mod][$key];
	}

	/**
	 * ��ȡģ����Դ���� ע�⣺�˷�����֧�ֿ�ģ�����������ȡ�����Բ�������service
	 * @param string ģ��·�� ���� template/rich  
	 * @param string �����򣨼�ģ������ ĿǰֻΪ��ģ��
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
	 * ��ʼ����Դ���ñ���bingo�����view��ʼ���е���
	 * @param array ������ domain static_prefix
	 */
	public function init($opt){
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
	
	/**
	 * ����ģ���Ĭ�ϰ汾��Ϣ
	 **/
	public function getDefaultVersion(){
		$scope = $this->_localScope;
		return $this->_map[$scope]['_default'];
	}
	/**
	 * ���ر�ģ��ʹ��js��̬����js�ļ���ʱ���
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


