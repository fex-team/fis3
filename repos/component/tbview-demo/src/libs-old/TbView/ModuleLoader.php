<?php
require_once('TbView/ModuleResourceLoader.php');
require_once('TbView/TemplateLoader.php');

class TbView_ModuleLoader extends TbView_TemplateLoader
{
	protected $_tempLoader;
	protected $_sourceList;
	protected $_localScope;
	protected $_rootPath;
	protected $_commonDirname;//commonģ���Ŀ¼����֧���Զ���Ŀ¼�������������ƶ����ɵ�����
	protected $_loadResource = true;//�Ƿ������Դ����service�ӿ��õ�������service��������Ϊ������js��css��Դ���������ǵ���
	protected $_terminalModel = false;
	
	protected $_targetModules = array();//��Ҫȥ���ص�ģ�飬����������Ⱦ���� widget �� service
	protected $_renderMode = 'template';////��Ⱦģʽ��Ĭ��Ϊ tamplate ������ҳ��Ⱦ��ȡֵΪ module ����Ϊ��Ⱦָ��widget��service ��loader ����Ϊһ����ʹ�ã�ֻ��ѡ�� temlpate ģʽ���� singleģʽ���˲���Ҫ��������
	protected $_isEnable = true;//�Ƿ���Ч���ڵ�����Ⱦһ��ҳ���е�widgetʱ service ��Ҫ��ִֹ��
	
	
	public function __construct($scope, $rootPath, $defaultData=NULL)
	{
		$this->_rootPath = $rootPath;	//��·��
		$this->_localScope = $scope;	//��ǰ����ģ��
		$this->_sourceList = array();
		$this->_commonDirname = TbView_Conf::get('COMMON_DIRNAME');
		parent::__construct($defaultData);
	}
	
	
	/**
	 * �����Ƿ������ã��ڵ�����Ⱦ widget �� service �����ģʽ����Ҫ���ùر���һ��
	 * @param bool ���Ƿ���Ч
	 */
	public function setEnable($enable_state){
		$state = (bool) $enable_state;
		$this->_isEnable = $state;
	}
	
	/**
	 * ������Ҫ��Ⱦ��ģ�飨widget����service��
	 * QA widget����ӿڻ��߽���Ҫ��Ⱦ�ֲ�ҳ��ʱʹ��
	 * @param array ����Ⱦ��ģ���б�
	 */
	public function setTargetModules($module_list){
		if(count($module_list) > 0){
			$this->_targetModules = $module_list;
			$this->_renderMode = 'module';//��Ⱦģʽ����Ϊҳ�湦��ģ��
		}
	}
	public function setTerminalModel($model) {
		$this->_terminalModel = $model;
	}
	
	/***
	 * ����һ�������html
	 */	
	public function getHtml($moduleName,$data,$scope){
		$_html = '';
		ob_start();
		$this->load($moduleName, $data, $scope);//������Ҫʵ��load�ӿ�
		$_html = ob_get_contents();
		ob_end_clean();	
		return $_html;
	}
	
	/***
	 * ����һ�������module ���� php css �� js ���һὫ����ص���Դд��$sourceList
	 * �Ƕ��������������ķ�װ
	 */
	protected function _loadModule($moduleName, $php=NULL, $data=NULL, $needRequire=false)
	{
		if(isset($data) && isset($php))
			$this->setData($data);
		//����php
		if(isset($php) && is_string($php)){
			if ($this->_terminalModel) {
				$tmp = substr($php,0, -4) . '_' . $this->_terminalModel . '.php';
				if (is_file($tmp)) {
					$this->loadTemplate($tmp, $needRequire);
				} else {
					$this->loadTemplate($php, $needRequire);
				}
			} else {
				$this->loadTemplate($php, $needRequire);
			}
			
		}
		
		//д����Դ�б�
		$this->_sourceList[$moduleName] = array(
			'php' => $php,
		);
		
		//���ؾ�̬��Դ by niuyao
		if($this->_loadResource === true){
			TbView_ModuleResourceLoader::load($moduleName);
		}
	}
	
	/**
	 * ��֤Ҫ���ص�ģ���������Ƿ����ģ�黯�淶
	 * ֧������ģʽ(main/sub)��such as frs/aside��
	 * ������Ҫ�޸� ModuleResourceLoader.php ��֧�֣�by niuyao 2012.09.28
	 * @param string ģ��������
	 */
	protected function _validateScope($scope){
		$is_valid = false;
		$paths = explode('/',$scope);//
		
		$common_dirname = $this->_commonDirname;
		//echo "TbView_ModuleLoader@_validateScope : commonDirname=$common_dirname; scope=$scope <br />";
		if(count($paths) > 0){
			$main_scope = $paths[0];
			//echo "$scope :::: $main_scope  "; 
			if($main_scope === $this->_localScope || $main_scope === $this->_commonDirname){
				$is_valid = true;
			}
		}
		return $is_valid;
	}
	
	/**
	 * �ж��Ƿ���Ҫ��Ⱦһ��ģ��
	 * @param string ģ��������
	 * @param string ģ����
	 */
	protected function _needToRender($scope, $module){
		$is_need = true;
		if($this->_isEnable == true){
			if('module' === $this->_renderMode && !in_array($module , $this->_targetModules)){
				$is_need = false;
			}
		}
		else{
			$is_need = false;
		}
		return $is_need;
	}
	
	
	protected function _loadModuleOnce($moduleName, $php=NULL, $data=NULL, $needRequire=false)
	{
		if(!$this->getSource($moduleName)){
			$this->_loadModule($moduleName, $php, $data, $needRequire);
		}
	}
	protected function _getDefaultData()
	{
		return $this->_defaultData;
	}
	/***
	 * ��ȡ�Ѿ����ص�ģ�����Դ�б�
	 * ��û�д���moduleName��ʱ�� ��������sourceList
	 */
	public function getSource($moduleName=NULL)
	{
		if(!isset($moduleName))
			return $this->_sourceList;
		
		if(is_string($moduleName) && isset($this->_sourceList[$moduleName])){
			return $this->_sourceList[$moduleName];
		}else{
			return false;
		}
	}
}

/** end of file  TbView/ModuleLoader.php **/