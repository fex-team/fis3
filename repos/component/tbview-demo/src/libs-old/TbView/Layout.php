<?php
require_once('TbView/TemplateLoader.php');

class TbView_Layout extends TbView_TemplateLoader
{
	private $_path;
	private $_tplPath;
	/***
	 * @param	$path		layout��·��
	 * @param	$tplPath layout�ܼ��ص�template��·��
	 * @param	$options	������� __component__��__widget__
	 */
	public function __construct($path, $tplPath, $options)
	{
		$this->_path = $path;
		$this->_tplPath = $tplPath;
		parent::__construct($options);
	}
	/***
	 * ��Ⱦlayout
	 */
	public function render()
	{
		$this->loadTemplate($this->_path);
	}
	/***
	 * ����һ��ģ�� ��Ϊһ����ֵ��Ӧ������ ��ģ������Զ�������
	 */
	public function load($key, $path, $data=NULL)
	{
		$this->setData($data);
		$_path = $this->_tplPath . $path;
		
		if(isset($data) && is_array($data))
			extract($data);
			
		if(is_file($_path)){
			ob_start();
			include($_path);
			$_buffer = ob_get_clean();
			$this->setData($key, $_buffer);
		}else{
			trigger_error("Layout::load : file is invalid! ${_path}", E_USER_WARNING);
		}
	}
	/***
	 * Ϊ�˸��ѺõĽӿ�������
	 */
	public function setBlock($block, $value=1)
	{
		$this->setData($block, $value);
	}
	public function startBlock($block)
	{
		$this->blockDataStart($block);
	}
	public function endBlock()
	{
		$this->blockDataEnd();
	}
}

/** end of TbView/Layout.php **/