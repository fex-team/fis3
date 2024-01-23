<?php
require_once('TbView/ScriptPool.php');
/***
 * һЩ���õ�html������ܣ���¶��FE��View������ʹ��
 * ���о�̬��Դ���ز��֣��ļ�ʱ������������������ ResourceMapʵ��
 * ������ִ�� setResourceMap �������ܹ���
 */
class HTML
{
	static $_resource_map = null; //��Դ���ñ�
	static $_page_unit_map = null; //ҳ�浥Ԫ������
	static $_instance;
	const COMBO_MAX_FILES = 30;//combo����֧�ֵ�����ļ��ϲ��� 
	function __construct(){
	}
	
	/**
	 * ������Դ���ñ�����ܵ���
	 */
	public static function setResourceMap($object){
		if(self::$_resource_map == null){
			self::$_resource_map = $object;
		}
	}
	
	public static function getInstance(){//����
		if(!(self::$_instance instanceof self)) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}	
	
	/***
	 * �������ո�
	 * @param	int		$num	�ո����Ŀ
	 */
	public static function nbs($num=1)
	{
		while($num > 0){
			echo '&nbsp;';
			$num --;
		}
	}
	/***
	 * ��һ������ת����list����ʽ
	 * @param	array		$list	����
	 * @param	array		$props	ul������
	 */
	public static function ul($list, $props=null)
	{
		$_html = '<ul ';
		if(isset($props) && is_array($props)){
			foreach($props as $_key => $_val){
				$_html .= $_key.'="'.$_val.'" ';
			}
		}
		$_html .= '>';
		if(isset($list) && is_array($list)){
			foreach($list as $_list){
				$_html .= '<li>'.$_list.'</li>';
			}
		}
		$_html .= '</ul>';
		echo $_html;
	}
	/***
	 * �����������ģ�壬����������ַ���
	 * @param	string		$tpl	ģ���ַ���
	 * @param	array		$data	����
	 */
	public static function format($tpl, $data)
	{
		if(isset($data) && is_array($data)){
			$patten = array();
			foreach($data as $_key => $_val){
				$patten[$_key] = "/\{\?\=\s*".$_key."\s*\?\}/";
				$data[$_key] = str_replace('$','\$',$_val);
			}
			return preg_replace($patten, $data, $tpl);
		}else{
			return $tpl;
		}
	}
	
	/***
	 * ��ȡ��̬�ļ�����
	 * @param string ������ʶ
	 * @param string ��Դ����Ϊ������֧����׼��
	 */
	public static function getDomain($key, $res){
		return self::$_resource_map->getDomain($key, $res);
	}
	public static function combojs ($items) {
		$urls = self::_getUrls($items);
		$html = '';
		
		foreach ($urls as $url) {
			$html = $html . '<script src="' . self::$_resource_map->getDomain('static'). '??'. $url . '"></script>' . "\n";
		}
		return $html;
	}
	public static function combocss ($items) {
		$urls = self::_getUrls($items);
		$html = '';
		foreach ($urls as $url) {
			$html = $html . '<link rel="stylesheet" href="' . self::$_resource_map->getDomain('static'). '??'. $url . '" />' . "\n";		
		}
		return $html;
	}
	
	/**
	 * ���ݴ������Դ�����combo����Ĵ�������������������Ҫ���ص���Դurl
	 */
	private static function _getUrls ($items) {
		$is_string = is_string($items[0]);
		$urls = array();

		foreach ($items as $item) {
			if ($is_string) {
				$pos = strpos($item, '/');
				$item_path = substr($item, $pos+1);
				$item_scope = substr($item, 0, $pos);
			} else {
				$item_path = $item[0];
				$item_scope = $item[1];
			}

			$real_url = self::$_resource_map->getRespath($item_path, $item_scope, false);
			if ($real_url) {
				$urls[] =  $real_url;
			}
		}

		$urls_chunk = array_chunk($urls, self::COMBO_MAX_FILES);
		$result = array();	
		foreach ($urls_chunk as $urls) {
			$result[] = implode(",", $urls);
		}
		
		return $result;
	}
	
	/***
	 * ����һ��js
	 */
	public static function js($js, $mod, $props = NULL, $deploy_path = NULL)
	{
		$_url = self::$_resource_map->path($js, $mod, $deploy_path);//�ļ���ʵ�ĵ�ַ
		return '<script src="' . $_url . '"></script>' . "\n";
	}
	/***
	 * ����һ��js
	 */
	private static function _js($js, $mod)
	{
		$_url = self::$_resource_map->getRespath($js, $mod);//�ļ���ʵ�ĵ�ַ
		if (!$_url) {
			return '';
		} 
		return '<script src="' . $_url . '"></script>';
	}
	
	/***
	 * ����һ��css
	 */
	public static function css($css, $mod, $deploy_path = NULL)
	{
		$_url = self::$_resource_map->path($css, $mod, $deploy_path);//��Ҫ����resourceMap��ȡ�ļ���ʵ�ĵ�ַ·��
		return '<link rel="stylesheet" href="' . $_url . '" />' . "\n";
	}
	private static function _css($css, $mod)
	{
		$_url = self::$_resource_map->getRespath($css, $mod);//��Ҫ����resourceMap��ȡ�ļ���ʵ�ĵ�ַ·��
		if (!$_url) {
			return '';
		} 
		return '<link rel="stylesheet" href="' . $_url . '" />';
	}
	
	/**
	 * ��ҳ��html�Ǽ� layout ���ã����view��ִ�й������Զ����ص�css��css��ͼƬ·�������⣬�ݲ��������ºϲ�
	 */
	public static function getCss(){
		$list = TbView_ModuleResourceLoader::getCss();
		
		if (TbView_Conf::get('DYNAMIC_MERGE')) {
			return self::combocss($list);
		} else {
			$html = array();
			foreach($list as $item){
				$html[] = self::_css($item[0], $item[1]);
			}
			return implode("\n", $html);
		}
		
	}
	
	/**
	 * ��ҳ��html�Ǽ� layout ���ã����view��ִ�й������Զ����ص�js
	 */
	public static function getJs(){
		$list = TbView_ModuleResourceLoader::getJs();
		
		if (TbView_Conf::get('DYNAMIC_MERGE')) {
			return self::combojs($list);
		} else {
			$hmlt = array();
			foreach($list as $item){
				$html[] = self::_js($item[0], $item[1]);
			}
			return implode("\n", $html);
		}
		
	}

	public static function getJsStamp () {
		return _json(self::$_resource_map->getJsStamp());
	}
	public static function getCommonlogicVersion () {
		return _json(self::$_resource_map->getCommonlogicVersion());
	}
	/**
	 * ��ҳ���������
	 */
	public static function pushData($key, $array){
		return '<code class=".' . $key . '">' . json($array) . '</code>';
	}
	
	/***
	 * ����һ��ͼƬ
	 */
	public static function img($url, $props)
	{
		$_url = $url;
		$_srrprops = '';
		if(isset($props) && is_array($props)){
			foreach($props as $_key => $_val){
				$_strprops .= $_key.'="'.$_val.'" ';
			}
		}
		echo '<img src="'.$_url.'" '.$_strprops.'/>';
	}
	/***
	 * ����flash�ļ�
	 */
	public static function swf($url)
	{
		
	}
	
	
	/******* Begin �ű������� ******/
	/**
	 * ��ʼ����ű�
	 */
	public static function scriptStart($level="normal"){
		TbView_ScriptPool::scriptStart($level);
	}
	
	/**
	 * ��������ű�
	 */
	public static function scriptEnd(){
		TbView_ScriptPool::scriptEnd();
	}
	
	/**
	 * �ַ�����ʽ����ű�
	 */
	public static function addScript($str, $level="normal"){
		TbView_ScriptPool::add($str, $level);
	}
	
	/**
	 * ��ҳ��html�Ǽ� layout ���ã���ȡ������д洢�Ľű�
	 */
	public static function getScript($level="normal"){
		return TbView_ScriptPool::get($level);
	}
	/******* End �ű������� ******/
	
	
	/**
	 * ��ȡһ����Դ����ʵ��ַ��ģ����ΪNULLʱ��ֱ������׷��Ĭ�ϰ汾��Ϣ��url
	 * @param string ��Դ��
	 * @param string ����ģ��
	 */
	public static function realurl($res, $mod = NULL, $deploy_path = NULL){
		$url = '';
		$res_map = self::$_resource_map;
		$domain = $res_map->getDomain('static');
		$version = $res_map->getDefaultVersion();
		if($mod == NULL){
			$url = $domain . $res . '?v=' . $version;
		}
		else{
			$url = $res_map->path($res, $mod, $deploy_path);
		}
		return $url;
	}
	
	/**
	 * ���ص�ǰģ���Ĭ�ϰ汾��Ϣ
	 */
	public static function version(){
		return self::$_resource_map->getDefaultVersion();
	}
	
	/**
	 * ����json��ʽ��PageUnit����
	 */
	public static function getPageUnitData() {
		$script_fragment = '<script>';
		$page_unit_data = TbView_PageUnitLoader::loadData();
		/* $page_unit_data����Ҫhת�壬��Ϊ��������</script>��
		 * ����bingo��ת�巽��������ж���ת�壬��ת����ٽ��з�ת�巴��������xss
		 */
		$json_unit_data = empty($page_unit_data)? '{}' : json($page_unit_data);	
		$script_fragment .= "PageUnitData=$json_unit_data;";
		$script_fragment .= "</script>\n";
		return $script_fragment;
	}
}

/** End of file TbView/Html.php **/
