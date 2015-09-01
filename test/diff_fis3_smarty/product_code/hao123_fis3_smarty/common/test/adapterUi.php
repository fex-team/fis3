<?php
/*
 *desciption:adapterUi.php fis适配器，用来适配web ui
 *
 *@finename:adapterUi.class.php
 *@author  :mozhuoyinng@baidu.com
 *@date    :2014-2-26
 *@modify  :
 *
 *@Copyright (c) 2014 BAIDU-GPM
 *
 */

require_once dirname(__FILE__) . '/dispath.php';
class adapterUi{
	public $smarty = "";
	public $cmsdata = "";
	function __construct(){
		$this->_before();
	}
	function _before(){
		$this->smarty = SimpleTemplate::getInstance();
		$this->urlParam = array_merge($_GET, $_POST);
		//重置country
		$host = $_SERVER['HTTP_HOST'];
		$host = explode( '.', $host);
		if( !preg_match('/\d/', $host[0]) ){
			$this->country = $host[0];
		}
		//cms数据merge
		$this->cmsData();
	}

	function cmsData(){
		$cmsData = Cms::get();
		$rootData = $cmsData['root'];
		$sysData = $cmsData['sysInfo'];
		if(!is_array($rootData)){
	    	$rootData = json_decode($rootData,true);
		}

		if(!is_array($sysData)){
	    	$sysData = json_decode($sysData,true);
		}
		$this->smarty->cmsdata = $rootData;
		$this->cmsdata = $rootData;
		$this->smarty->assign('root',$rootData);
		$this->smarty->assign('body',$rootData['body']);
		$this->smarty->assign('head',$rootData['head']);
		$this->smarty->assign('foot',$rootData['foot']);
		$this->smarty->assign('sysInfo',$sysData);
	}

	
}