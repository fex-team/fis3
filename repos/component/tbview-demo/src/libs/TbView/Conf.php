<?php
/**
 * 配置信息
 * 暂只包括debug模式
 */
class TbView_Conf{
	private static $_conf = array(
		'DEBUG' => false, //是否debug模式
		'COMMON_DIRNAME' => 'common',//common 域的目录名，默认为common
		'DYNAMIC_MERGE' => false, // 是否使用静态文件服务器端合并，如果开启，则不会加载模板的__page__资源，会将所依赖的文件动态进行合并
		'TERMINAL_DIF' => false,  // 是否使用差异化， 无线需求针对不同机型加载不同模块的静态资源
		'RUNTIME_MERGE' => false, // 运行时决定加载资源文件
	);
	/**
	 * 设置debug状态
	 * @param bool 是否开启debug
	 */
	public static function debug($boolFlag){
		self::$_conf['DEBUG'] = $boolFlag;
	}
	
	/**
	 * 是否debug状态
	 */
	public static function isDebug(){
		if(self::$_conf['DEBUG'] === true){
			return true;
		}
		else{
			return false;
		}
	}
	
	/**
	 * 设置配置信息
	 * @param string 配置项名称
	 * @param string 配置项取值
	 */
	public static function set($key = '', $value = ''){
		//echo "TbView_Conf::set; $key -> $value";
		if(isset(self::$_conf[$key])){
			self::$_conf[$key] = $value;
		}
	}
	
	/**
	 * 读取配置项
	 * @param string 配置项名称
	 */
	public static function get($key = ''){
		return isset(self::$_conf[$key]) ? self::$_conf[$key] : null;
	}
	
}

/** end of file TbView/Conf.php **/