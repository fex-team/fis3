<?php

/**
 * php����Դ����ʽ�������ļ�������
 */
class TbView_Config_PhpSource{

	function __construct(){
		
	}
	
	public function load($file){
		if(file_exists($file)){
			$ret = include($file);
			if(is_array($ret)){
				return $ret;
			}
			else{
				//trigger_error("[TbView][Load][Config] : not php array : $file  <br />", E_USER_NOTICE);
			}
		}
		else{//�ļ������ڣ�ֻ�ܸ�����ʾ������ trigger_error
			//trigger_error("[TbView][Load][Config] : File not exists : $file  <br />", E_USER_NOTICE);
		}
		return false;
	}
}

/**end of file TbView/Config/PhpSource.php **/