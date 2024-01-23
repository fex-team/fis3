<?php
/**
 * ������Ϣ
 * ��ֻ����debugģʽ
 */
class TbView_Conf{
	private static $_conf = array(
		'DEBUG' => false, //�Ƿ�debugģʽ
		'COMMON_DIRNAME' => 'common',//common ���Ŀ¼����Ĭ��Ϊcommon
		'DYNAMIC_MERGE' => false, // �Ƿ�ʹ�þ�̬�ļ��������˺ϲ�������������򲻻����ģ���__page__��Դ���Ὣ���������ļ���̬���кϲ�
		'TERMINAL_DIF' => false,  // �Ƿ�ʹ�ò��컯�� ����������Բ�ͬ���ͼ��ز�ͬģ��ľ�̬��Դ
		'RUNTIME_MERGE' => false, // ����ʱ����������Դ�ļ�
	);
	/**
	 * ����debug״̬
	 * @param bool �Ƿ���debug
	 */
	public static function debug($boolFlag){
		self::$_conf['DEBUG'] = $boolFlag;
	}
	
	/**
	 * �Ƿ�debug״̬
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
	 * ����������Ϣ
	 * @param string ����������
	 * @param string ������ȡֵ
	 */
	public static function set($key = '', $value = ''){
		//echo "TbView_Conf::set; $key -> $value";
		if(isset(self::$_conf[$key])){
			self::$_conf[$key] = $value;
		}
	}
	
	/**
	 * ��ȡ������
	 * @param string ����������
	 */
	public static function get($key = ''){
		return isset(self::$_conf[$key]) ? self::$_conf[$key] : null;
	}
	
}

/** end of file TbView/Conf.php **/