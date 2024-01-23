<?php
/**
 * 域名管理
 */
class TbView_Domain{

	private $_domain = array(
	);
	
	/**
	 * 添加域名，会被覆盖
	 * @param array 域名数组
	 */
	public function add($array){
		foreach($array as $key => $value){
			$this->_domain[$key] = $value;
		}
	}
	
	/**
	 * 获取域名
	 * @param string 域名标识
	 * @param 
	 */
	public function get($key, $res){
		if(isset($this->_domain[$key])){
			return $this->_domain[$key];
		}
		else{
			return '';
		}
	}
	
	/**
	 * 获取所有域名配置
	 */
	public function getAll(){
		return $this->_domain;
	}
}

/** end of file TbView/Domain.php **/