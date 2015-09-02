<?php
return array(
	//基本配置区域，建议用utf-8编码保存本文件。当然使用gbk也无影响。
	'TPL_LEFT_DELIMITER' 		=> '<%',  					//smarty左界符
	'TPL_RIGHT_DELIMITER' 		=> '%>', 					//smarty右界符
	'TPL_SUFFIX'				=> 'tpl',					//模板文件扩展名	
	'func_name_callback'		=> '/callback/',			//回调函数名，$callback(json)，正则匹配，防止多个变量名，不需要则可以关闭check_callback
	'name_callback'				=> 'callback',				//smarty.get.callback(json)，不需要则可以关闭check_callback
	
	//添加各场景开关检查功能，on 或者 off，默认为on，即全部要检查	
	'check_callback'			=> 'on',
	'check_html'				=> 'off',
	'check_js'					=> 'on',
	'check_data'				=> 'on',
	'check_path'				=> 'on',
	'check_event'				=> 'on',
	
	//各场景对应的安全转义函数，正则配置
	'escape_js' 				=> '/sp_escape_js|escape:("|\'?)javascript\1/',												//js转义函数配置
	'escape_html' 				=> '/sp_escape_html|escape:("|\'?)html\1|(escape$)|(escape\|)/',							//html转义函数配置
	'escape_event' 				=> '/sp_escape_event|escape:("|\'?)javascript\1\|escape:("|\'?)html\2/',					//标签事件属性值场景转义函数配置
	'escape_data' 				=> '/sp_escape_data/',																		//json数据转义配置
	'escape_path' 				=> '/sp_path|escape:("|\'?)url\1|escape:("|\'?)html\2|(escape$)|(escape\|)/',				//url属性里转义
	'escape_callback' 			=> '/sp_escape_callback/',																	//callback最小化转义
	
	//如果某个特定变量不需要转义，可以加上|escape:none ，正则配置
	'noescape' 					=> '/escape:[\'|\"]?none[\'|\"]?/',
	
	//全局白名单，变量名与正则匹配则可信，不对其进行检查,明妃，坤哥，如果你们从cms中读取的变量取了新的名称请把名称填写到这里
 	 'XSS_SAFE_VAR' 			=> array(								//安全变量列表，必须是正则，不包含$
		'/(?:body|html|head|value|hotSiteCon|listValue|entry|link|linksValue|defaultClass|data|sBoxTag|sysInfo|uaq|mod|root\.html\.content|country|host|root\.conf)/ies',
		'/(?:_pv|_num|_id)/ies'
	 ), 
	 //精确白名单，某特定文件名，或其内某个变量是完全可信的
	 'file_safe_var'			=>array(				//filename为相对路径（非中文），$varname为变量，表明filename下的所有$varname都是白名单。
		'filename::$varname'
	 )

);
?>