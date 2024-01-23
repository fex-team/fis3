<?php
require_once('TbView/ScriptPool.php');
/***
 * 一些常用的html输出功能，暴露给FE在View代码中使用
 * 其中静态资源加载部分，文件时间戳、域名输出等依赖 ResourceMap实现
 * 必须先执行 setResourceMap 操作才能工作
 */
class HTML
{
	static $_resource_map = null; //资源配置表
	static $_page_unit_map = null; //页面单元的配置
	static $_instance;
	const COMBO_MAX_FILES = 30;//combo服务支持的最大文件合并数 
	function __construct(){
	}
	
	/**
	 * 设置资源配置表，给框架调用
	 */
	public static function setResourceMap($object){
		if(self::$_resource_map == null){
			self::$_resource_map = $object;
		}
	}
	
	public static function getInstance(){//单例
		if(!(self::$_instance instanceof self)) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}	
	
	/***
	 * 输出多个空格
	 * @param	int		$num	空格的数目
	 */
	public static function nbs($num=1)
	{
		while($num > 0){
			echo '&nbsp;';
			$num --;
		}
	}
	/***
	 * 将一个数组转换成list的形式
	 * @param	array		$list	数据
	 * @param	array		$props	ul的属性
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
	 * 将数据填充入模板，返回填充后的字符串
	 * @param	string		$tpl	模板字符串
	 * @param	array		$data	数据
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
	 * 获取静态文件域名
	 * @param string 域名标识
	 * @param string 资源名，为泛域名支持做准备
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
	 * 根据传入的资源，结合combo服务的处理能力，构造最终需要加载的资源url
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
	 * 加载一个js
	 */
	public static function js($js, $mod, $props = NULL, $deploy_path = NULL)
	{
		$_url = self::$_resource_map->path($js, $mod, $deploy_path);//文件真实的地址
		return '<script src="' . $_url . '"></script>' . "\n";
	}
	/***
	 * 加载一个js
	 */
	private static function _js($js, $mod)
	{
		$_url = self::$_resource_map->getRespath($js, $mod);//文件真实的地址
		if (!$_url) {
			return '';
		} 
		return '<script src="' . $_url . '"></script>';
	}
	
	/***
	 * 加载一个css
	 */
	public static function css($css, $mod, $deploy_path = NULL)
	{
		$_url = self::$_resource_map->path($css, $mod, $deploy_path);//需要依赖resourceMap获取文件真实的地址路径
		return '<link rel="stylesheet" href="' . $_url . '" />' . "\n";
	}
	private static function _css($css, $mod)
	{
		$_url = self::$_resource_map->getRespath($css, $mod);//需要依赖resourceMap获取文件真实的地址路径
		if (!$_url) {
			return '';
		} 
		return '<link rel="stylesheet" href="' . $_url . '" />';
	}
	
	/**
	 * 给页面html骨架 layout 调用，输出view再执行过程中自动加载的css，css中图片路径的问题，暂不进行线下合并
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
	 * 给页面html骨架 layout 调用，输出view再执行过程中自动加载的js
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
	 * 给页面输出数据
	 */
	public static function pushData($key, $array){
		return '<code class=".' . $key . '">' . json($array) . '</code>';
	}
	
	/***
	 * 加载一张图片
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
	 * 加载flash文件
	 */
	public static function swf($url)
	{
		
	}
	
	
	/******* Begin 脚本输出相关 ******/
	/**
	 * 开始输出脚本
	 */
	public static function scriptStart($level="normal"){
		TbView_ScriptPool::scriptStart($level);
	}
	
	/**
	 * 结束输出脚本
	 */
	public static function scriptEnd(){
		TbView_ScriptPool::scriptEnd();
	}
	
	/**
	 * 字符串形式输出脚本
	 */
	public static function addScript($str, $level="normal"){
		TbView_ScriptPool::add($str, $level);
	}
	
	/**
	 * 给页面html骨架 layout 调用，获取缓存池中存储的脚本
	 */
	public static function getScript($level="normal"){
		return TbView_ScriptPool::get($level);
	}
	/******* End 脚本输出相关 ******/
	
	
	/**
	 * 获取一个资源的真实地址，模块名为NULL时，直接生成追加默认版本信息的url
	 * @param string 资源名
	 * @param string 所属模块
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
	 * 返回当前模块的默认版本信息
	 */
	public static function version(){
		return self::$_resource_map->getDefaultVersion();
	}
	
	/**
	 * 返回json形式的PageUnit数据
	 */
	public static function getPageUnitData() {
		$script_fragment = '<script>';
		$page_unit_data = TbView_PageUnitLoader::loadData();
		/* $page_unit_data不需要h转义，因为不会生成</script>，
		 * 由于bingo的转义方法不会进行二次转义，故转义后再进行反转义反而会引起xss
		 */
		$json_unit_data = empty($page_unit_data)? '{}' : json($page_unit_data);	
		$script_fragment .= "PageUnitData=$json_unit_data;";
		$script_fragment .= "</script>\n";
		return $script_fragment;
	}
}

/** End of file TbView/Html.php **/
