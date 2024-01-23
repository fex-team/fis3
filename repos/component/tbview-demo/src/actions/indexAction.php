<?php

define('USING_BIG_PIPE', true);

class indexAction extends Bingo_Action_Abstract
{

	private $strTplPath = 'frs';
	private $strTplName = 'index';
	private $arrData = array();
	
	public function execute() {
	
		//init
		Bingo_Page::init(array(
			'baseDir' => ROOT_PATH.'/template/'.$this->strTplPath,
			'debug'   => false,
			'outputType' => '.',
			'isXssSafe'  => true,
		));
		
		//BigPipe::setMode(BigPipe::NO_SCRIPT);
		//BigPipe::setMode(BigPipe::PIPE_LINE);
		BigPipe::setMode(BigPipe::QUICKLING);
		BigPipe::setFilter(array('fff'));
		
		//assign
		$this->arrData = &$data;
		foreach ($this->arrData as $strKey => $arrValue){
			Bingo_Page::assign($strKey,$arrValue);
		}
		
		//display
		Bingo_Page::setTpl($this->strTplName . '.php');
		Bingo_Page::buildPage();
	}
}