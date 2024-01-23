<?php
require_once('TbView/TemplateLoader.php');

class TbView_Layout extends TbView_TemplateLoader
{
	private $_path;
	private $_tplPath;
	/***
	 * @param	$path		layout的路径
	 * @param	$tplPath layout能加载的template的路径
	 * @param	$options	必须包含 __component__、__widget__
	 */
	public function __construct($path, $tplPath, $options)
	{
		$this->_path = $path;
		$this->_tplPath = $tplPath;
		parent::__construct($options);
	}
	/***
	 * 渲染layout
	 */
	public function render()
	{
		$this->loadTemplate($this->_path);
	}
	/***
	 * 加载一个模板 作为一个键值对应的数据 此模板可以自定义数据
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
	 * 为了更友好的接口名。。
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