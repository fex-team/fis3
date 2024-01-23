<?php
require_once('TbView/Conf.php');
class TbView_ModuleResourceLoader
{
	private static $_rootPath = ''; //��·��
	private static $_resourceMap = NULL;
	private static $_moduleList = array(); //ģ���б�
	private static $_localScope = '';//��ǰ�������ģ��
	private static $_curTemplate = '';//��ǰ����Ⱦ��ģ�����ƣ�������������ģ����
	private static $_resource = array( //��Դ��Ϣ
			'css'	=> array(), //js�ļ�
			'js'	=> array(), //css�ļ�
		);
	private static $_modules = array(//��ǰģ�������ص�ģ�黯Ԫ�أ��ص��עservice��template
			'template'	=> array(),
			'service' 	=> array(),
		);
	private static $_merge_conf = array(//�洢��Դ�ϲ�������Ϣ
      //'module' => array(),
    );


	/**
	 * ���ø�·����������������
	 */
	public static function setRootPath($path){
		self::$_rootPath = $path;
	}
	
	/**
	 * ������Ⱦ��ģ�����������ڵ���ģ��ʱ���ã��ýӿ��Ѿ���������������¼��ǰ��Ⱦ��ģ�壬�������� by niuyao��2012.06.19
	 * @param string $templateName ��ǰ����Ⱦ��ģ��
	 */
	public static function setCurTemplate($templateName){
		if(!empty($templateName)){
			self::$_curTemplate = $templateName;
		}
	}
	public static function setResourceMap ($resourceMap) {
		self::$_resourceMap = $resourceMap;
	}
	
	/**
	 * ���õ�ǰ�����ģ�飬������������
	 * @param string $scope ���õ�ǰ�������ģ��
	 */
	public static function setLocalScope($scope){
		self::$_localScope = $scope;
	}
	
	/**
	 * �� HTML ������ã���ȡ���й����������õ�css��Դ
	 */
	public static function getCss()
	{
		$ret = self::$_resource['css'];
		return $ret;
	}
	
	/**
	 * �� HTML ������ã���ȡ���й����������õ�JS��Դ
	 */
	public static function getJs()
	{
		$ret = self::$_resource['js'];
		return $ret;
	}
	
	/**
	 * ����һ�������ģ�飨template��layout��widget�ȣ��ľ�̬��Դ����ģ�����������
	 * @param string $modulePath	ģ��·��
	 * @param string $runtimeType	��ǰ���л��������� 
	 */
	public static function load($modulePath){
		//ʹ��bigpipe�ľ�̬��Դ������
		if(constant('USING_BIG_PIPE')){
			return;
		}
		if(isset(self::$_moduleList[$modulePath])){//�Ѽ��ع�
			return;
		}
		self::$_moduleList[$modulePath] = 'loaded';

		$paths = explode('/', $modulePath);
		$len = count($paths);
		$scope = $paths[0];//��һ��Ϊ��
		$type = $paths[1];//�ڶ���Ϊ����
		$modName = $paths[$len - 1];//���һ��Ϊ����
		
		$is_debug = TbView_Conf::isDebug();
		self::$_modules[$type] = $modulePath;//��¼�����ص�ģ��
				
		if($is_debug === true){
			if(TbView_Conf::get('COMMON_DIRNAME') !== $scope){//debugģʽ�£���commonģ�����Դ������Ҫ����
				$js_file = self::$_rootPath . $modulePath . "/$modName.js"; //js�ļ�
				$css_file = self::$_rootPath . $modulePath . "/$modName.css"; //css�ļ�

				self::_loadResource($js_file, $scope, 'js');
				self::_loadResource($css_file, $scope, 'css');
			}
		} else if (TbView_Conf::get('RUNTIME_MERGE')) {
			self::_addMoudleResource($modulePath);			
		}else if (TbView_Conf::get('DYNAMIC_MERGE')) { // ʹ�ö�̬�ϲ�
			if ('template' === $type) {
				$des = self::$_resourceMap->getModuleDependency($type.'/'.$modName, $scope);				
				foreach ($des as $item) {
					self::_addMoudleResource($item);
				}
			}
		} else if ('template' === $type || 'service' === $type){
			self::_addMoudleResource($modulePath, true);
		}
	}
	
	/**
	 * ����һ���ļ�������������������Ҫ���ص��ļ�������debugģʽ����Ч
	 * �������ϺͲ��Ի��������ļ����ǵ�ģʽ��������ɾ���κ��ļ�
	 * ����һ����Դ��svn�����ɾ���������Դ��ڣ���ĳЩ����»���ֶ�������ļ������
	 * JSȫ����ģ�黯��ǰ��Ҫ����������������ֻ����մ����ļ�����������ɾ��
	 * 
	 * @param string �ļ���
	 * @param string ��/ģ����
	 * @param string ��Դ����
	 */
	private static function _loadResource($file, $scope, $type){
		if(is_file($file)){
			//echo "<p><b>[Load][Resource]: Find recource : $scope : $res, load it!</b><p>";
			self::_loadResourceMergeConf($scope);//��ȡ��Դ�ֹ��ϲ�����
			$res = str_replace(self::$_rootPath . $scope . '/', '' , $file);
			
			if(isset(self::$_merge_conf[$scope][$res])){//����һ����Դ�ɶ����Դ�ϲ����ɵ����
				$list = self::$_merge_conf[$scope][$res];
				foreach($list as $item){
					self::$_resource[$type][] = array($item, $scope);
				}
			}
			else{
				self::$_resource[$type][] = array($res, $scope);
			}
		}
	}
	
	/**
	 * ����һ��ģ�����Դ�ϲ�������Ϣ
	 * @param string ��/ģ����
	 */
	private static function _loadResourceMergeConf($scope){
		if(!isset(self::$_merge_conf[$scope])){
			$file = self::$_rootPath . "$scope/__merge_conf.php";
			if(is_file($file)){
				self::$_merge_conf[$scope] = include($file);
			}
			else{
				self::$_merge_conf[$scope] = array();
			}
		}
	}

	/**
	 * ����ģ��ľ�̬��Դ
	 * @param string ģ��·�� ���� frs/widget/thread_list
	 * @param boolen ��Դ���Ƿ�ʹ��__page__ Ĭ��ʹ��ģ����
	 */
	private static function _addMoudleResource ($modulePath, $usePageName = false) {
		$paths = explode('/', $modulePath);
		$scope = $paths[0];//��һ��Ϊ��
		$modName = $paths[2];//���һ��Ϊ����

		if ($usePageName) {
			$fileName = '__page__';
		} else {
			$fileName = $modName;
		}
		
		self::$_resource['css'][] = array($paths[1]. '/'. $modName . '/' . $fileName. '.css', $scope);
		self::$_resource['js'][] = array($paths[1]. '/'. $modName . '/' . $fileName. '.js', $scope);
	}
}

/** end of file TbView/TbView_ModuleResourceLoader.php **/