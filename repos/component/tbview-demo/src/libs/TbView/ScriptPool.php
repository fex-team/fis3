<?php
class TbView_ScriptPool
{
	private static $_actionLevel = 'normal';
	private static $_staticPool = array(
		'important' => array(), //重要级别
		'normal' => array(), //普通级别
		'optional' => array(), //无关紧要的
	);
	
	public function __construct()
	{
	}
	/***
	 * @desc 添加需要输出的script
	 * @param {String} $level important or normal 标识script的优先级
	 */
	public static function add($script, $level="normal")
	{
		if(!isset(self::$_staticPool[$level])) return;
		self::$_staticPool[$level][] = $script;
	}
	/***
	 * @desc 开始添加block区域的script
	 */
	public static function scriptStart($level="normal")
	{
		self::$_actionLevel = $level;
		ob_start();
	}
	/***
	 * @desc 结束添加block区域的script
	 */
	public static function scriptEnd()
	{
		$content = ob_get_contents();
		ob_end_clean();
		self::add($content, self::$_actionLevel);
	}
	/***
	 * @desc 获取script
	 * @level {String} $level important or narmal 需要获取的script优先级
	 */
	public static function get($level)
	{
		
		if(!isset(self::$_staticPool[$level]) || count(self::$_staticPool[$level]) <= 0){
			return '';
		}
		
		$_html = '';
		foreach(self::$_staticPool[$level] as $_script)
		{
			$_html .= $_script;
		}
		return $_html;
	}
}

/** end of file TbView/ScriptPool.php **/