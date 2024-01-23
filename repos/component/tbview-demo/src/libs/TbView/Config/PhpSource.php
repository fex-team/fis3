<?php

/**
 * php数组源码形式的配置文件加载器
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
		else{//文件不存在，只能给出提示，不能 trigger_error
			//trigger_error("[TbView][Load][Config] : File not exists : $file  <br />", E_USER_NOTICE);
		}
		return false;
	}
}

/**end of file TbView/Config/PhpSource.php **/