<?php
class TbView_ScriptPool
{
	private static $_actionLevel = 'normal';
	private static $_staticPool = array(
		'important' => array(), //��Ҫ����
		'normal' => array(), //��ͨ����
		'optional' => array(), //�޹ؽ�Ҫ��
	);
	
	public function __construct()
	{
	}
	/***
	 * @desc �����Ҫ�����script
	 * @param {String} $level important or normal ��ʶscript�����ȼ�
	 */
	public static function add($script, $level="normal")
	{
		if(!isset(self::$_staticPool[$level])) return;
		self::$_staticPool[$level][] = $script;
	}
	/***
	 * @desc ��ʼ���block�����script
	 */
	public static function scriptStart($level="normal")
	{
		self::$_actionLevel = $level;
		ob_start();
	}
	/***
	 * @desc �������block�����script
	 */
	public static function scriptEnd()
	{
		$content = ob_get_contents();
		ob_end_clean();
		self::add($content, self::$_actionLevel);
	}
	/***
	 * @desc ��ȡscript
	 * @level {String} $level important or narmal ��Ҫ��ȡ��script���ȼ�
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