<?php
/**
 * ��������
 */
class TbView_Domain{

	private $_domain = array(
	);
	
	/**
	 * ����������ᱻ����
	 * @param array ��������
	 */
	public function add($array){
		foreach($array as $key => $value){
			$this->_domain[$key] = $value;
		}
	}
	
	/**
	 * ��ȡ����
	 * @param string ������ʶ
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
	 * ��ȡ������������
	 */
	public function getAll(){
		return $this->_domain;
	}
}

/** end of file TbView/Domain.php **/