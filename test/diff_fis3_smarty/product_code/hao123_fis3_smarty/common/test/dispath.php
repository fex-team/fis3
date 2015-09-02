<?php
/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id$:URLDispathAtion.class.php,2012/08/25 18:02:45
 * 
 **************************************************************************/
/**
 * @author mozhuoying(mozhuoying@baidu.com)
 * @date 2012/08/25 18:02:45
 * @brief 
 *  
 **/
	class Cms{
		static $isTestEnv;
		static $dataDir = "";
		static $dataPrivate = "";
			//测试环境使用url,线上环境使用host
		static $country;
		static $host ;
		static $dataRoot = "";
		//跟进url判断是否使用本地data.php
		static $islocalData = true;
		//请求本地的数据为json
		static $dataName = "data.json";
		static $jsonFormat ;
		//
		static $_query_string = "";
		//请求服务器的数据为php
		static $serverDataName = "data.php";
		
		static $cmsData = array();
		
	

        static function get() {
        	$args = array();
        	$uiPath = dirname(__FILE__)."/";
            $pageRoot = "";
			//appache与lighttpd的获取url的方式不一样
			$url = parse_url( $_SERVER['SCRIPT_URL'] ? $_SERVER['SCRIPT_URL'] : $_SERVER['REQUEST_URI'] );
			//潜规则1.lighttpd会把查询参数带上，所以需要去掉2.注意这里的是.html也能访问，因为历史原因使用.html统计
			$url = preg_replace('/\.html$/', "", $url["path"]);
			$ip = $_SERVER['SERVER_ADDR'] ? $_SERVER['SERVER_ADDR'] : "0.0.0.0";
			//为controller设置属性isTestEnv,以便别是否是测试环境
			$isTestEnv = true;
			//通过UA匹配iphone和android手机适配移动版或mobile参数等于true,当pc参数为true时均进入pc版
			//注意：暂时无法区分android pad
			$isMobile = $_GET['pc'] != true && ($_GET['mobile'] == true || preg_match('/iphone|android/i', $_SERVER['HTTP_USER_AGENT']));
			//手机访问域名还是浏览器访问,缺省是web类型
			$hostType = $isMobile ? "m" : "web";
			$pageFound = false;
			//手机版的前缀，默认是m
			$mobileHostPrefix = "m";
			$host = $_SERVER['HTTP_HOST'];
			//ip转换为host
			$pathseg = explode('/',trim($url,'/'));
			$dataDir = "";
			//过滤空串
			$pathseg = array_filter( $pathseg );
			$count = count($pathseg);
			//检测ui目录下面是否有对应国家的ui根目录(先url,后host)
			//只检测host,else(url)在迁移到www.hao123.com的时候或者测试环境中使用
			if( ($dir=explode( '.', $host)) && !$isTestEnv ){
				//潜规则:线上的test域名test.tw.hao123.com实际上是tw.hao123.com
				if ( $dir[0] === "test" ) {
					$dir = array_slice($dir,1);
				}
				//手机类型的域名
				if( $dir[0] === $mobileHostPrefix ) {
					$isMobile = true;
					$hostType = $dir[0];
					$pageRoot = $dataDir = $hostType."/".$dir[1]."/";
					$country = $dir[1];
					//有ui的根目录的情况
					$pageFound = is_dir( $uiPath.$pageRoot);
				//web
				} else {
					$pageRoot = $dataDir =  $hostType."/".$dir[0]."/";
					$country = $dir[0];
					$pageFound = is_dir( $uiPath.$pageRoot);
				}
				$dataRoot = $dataDir;
			//为了方便迁移到www.hao123.com，并且方便在测试环境中才使用url映射host,目前暂时只支持测试环境
			} else if( !empty($pathseg[0]) ) {
				//手机类型的域名
				if( $pathseg[0] === $mobileHostPrefix ) {
					$isMobile = true;
					$hostType = $pathseg[0];
					if ( !empty($pathseg[1]) ) {
						$country = $pathseg[1];
						$pageRoot = $dataDir = $pathseg[0]."/".$pathseg[1]."/";
						$pageFound = is_dir( $uiPath.$pageRoot);
						$pathseg = array_slice($pathseg, 2);
						$count = count($pathseg);
					}
				//web
				} else {
					$reffer = $_SERVER['HTTP_REFERER'];
					if( strlen( $pathseg[0] ) > 2){
						$reffer = parse_url( $reffer );
						$reffer_path = explode("/", $reffer['path']);
						$pathseg[0] = $reffer_path[1];
					}
					$pageRoot = $dataDir =  $hostType."/".$pathseg[0]."/";
					$country = $pathseg[0];
					//$dataDir = $hostType."/".$dataDir;
					$pathseg = array_slice($pathseg, 1);
					$count = count($pathseg);
				
					$pageFound = is_dir( $uiPath.$pageRoot);

				}
				$dataRoot = $dataDir;
			}	
			$dataDir = rtrim( $dataDir.implode("/", $pathseg), "/")."/";
				//如果是首页，放到目录/index中
			$dataDir = $count>0 ? $dataDir : $dataDir."index/";
			//为controller设置属性isTestEnv,以便别是否是测试环境
			//记录对应的data.json所在的Template路径，默认与ui对应
			self::$dataDir = rtrim( $dataDir, "/")."/";
			self::$dataPrivate = "";
			//测试环境使用url,线上环境使用host
			self::$country = $country;
			self::$host = $host;
			self::$dataRoot = rtrim( $dataRoot, "/")."/";

			self::getCms();

			return self::$cmsData;
		}
		//检测是否开启smarty调试模式
		static function isSmartyDebug(){
			//是否开启smarty调试模式
			$smarty_debug_id = "debug";
            if (false !== strpos(self::$_query_string, $smarty_debug_id)) {
                if (false !== strpos(self::$_query_string, $smarty_debug_id . '=on')) {
                    // enable debugging for this browser session
                    setcookie('FIS_DEBUG', "YlwtSmt",time()+3600*24*356);
                } elseif (false !== strpos(self::$_query_string, $smarty_debug_id . '=off')) {
                    // disable debugging for this browser session
                    setcookie('FIS_DEBUG', "",time()+3600*24*356);
                }
            }
		}

		static function array_merge_recursive_new() {  
			    $arrays = func_get_args();
			    $base = array_shift($arrays);    
			    foreach ($arrays as $array) {        
			      reset($base); //important       
			      while (list($key, $value) = @each($array)) {           
			        if (is_array($value) && @is_array($base[$key])) {                
			            $base[$key] = self::array_merge_recursive_new($base[$key], $value);      
			        } 
			        else {
			            $base[$key] = $value;
			        }       
			       }   
			    }   
			    return $base;
  		}
		static function getCms(){
			$dataRoot = dirname(__FILE__)."/";
			
			
			$privateDataDir =  DATA_ROOT.self::$dataDir;
			$publicDataDir =  DATA_ROOT.rtrim(self::$dataRoot,"/")."/base/";
			$dataName = "data.php";

			//指定data的路径(仅能指定同目录下私有数据)
			$assignDataName =  $_GET["data"];
			if( !empty( $assignDataName ) ){
				$dataName = $assignDataName.".php";
			}
			//复制url的参数值到$root.urlparam中
			$arr = array( "urlparam"=>array_merge($_GET,$_POST) );
			//set smarty 
			$sysInfo = array(
				"baseDataDir" => $publicDataDir."data\.php",
				"privateDataDir" => $privateDataDir."data\.php",
				"templateRoot" => TEMPLATE_PATH,
				"country" => self::$country,
				"host" => self::$host
			);
			//获取query_string以便判断是否开启smarty或者data调试模式
			if (isset($_SERVER['QUERY_STRING'])) {
                self::$_query_string = $_SERVER['QUERY_STRING'];
            }
            //判断是否启动smarty调试
            self::isSmartyDebug();
            

            

			//所有data都有一个公共data,先把公共的data加载到cmsdata中
			$severBaseDataPath = rtrim(self::$dataRoot,"/")."/base/". self::$serverDataName;
			$localBaseDataPath = $publicDataDir.self::$dataName;
			$arr = CmsDataAdapter::saveAndGetOrMergeData( $localBaseDataPath, $severBaseDataPath, $arr );

			//如果指定私有数据路径使用私有数据
			if( strpos(self::$dataDir, 'fetchwidget') !== false ){
				 $assignDir = $_GET['dataDir'];
				 if( !$assignDir ){
				 	$assignDir = "index";
				 }
				 $privateDataDir = DATA_ROOT.self::$dataRoot.$assignDir."/";
			}

			$severPrivateDataPath = self::$dataDir.self::$serverDataName;
			$localPrivateDataPath = $privateDataDir.self::$dataName;

			$arrTmp = CmsDataAdapter::saveAndGetOrMergeData( $localPrivateDataPath, $severPrivateDataPath, $arrTmp );
		
			if( !empty( $arrTmp['head']['privateBaseData'] ) ){
				$serverPrivateBaseDataPath = $arrTmp["head"]["privateBaseData"];
				$localPrivateBaseDataPath =DATA_ROOT.$arrTmp["head"]["privateBaseData"];
				
				$arr = CmsDataAdapter::saveAndGetOrMergeData( $localPrivateBaseDataPath, $serverPrivateBaseDataPath, $arr );
				
			}
			$arr = self::array_merge_recursive_new($arr,$arrTmp);
			//这个数据流程为总base-》指定base-》页面数据
			$severPrivateDataPath = self::$dataDir.self::$serverDataName;
			$localPrivateDataPath = $privateDataDir.self::$dataName;

			//支持选择性的三层数据继承 遗留bug ,这个数据流程为总base->页面数据-》指定base
			if( !empty($arr["head"]["baseData"]) ){
				$baseData = $sysInfo["privateDataDir"] =   DATA_ROOT.$arr["head"]["baseData"];
				$severPrivateDataPath = $arr["head"]["baseData"];
				$arr = CmsDataAdapter::saveAndGetOrMergeData( $baseData, $severPrivateDataPath, $arr );
			}


			//支持第三层数据继承，为了抽样
			$sample = empty($_GET['sample']) ? "" : $_GET['sample'];
                        if( !empty($sample) && !empty($arr["head"]["sample"][$sample])) {
                ////////////////////////////
                //支持子通道（返回功能）
                $sub_channel_cookie = 'sample_channel_'.$sample;//=back';
                $sub_sample_name = $_COOKIE[$sub_channel_cookie];
                if(!empty($sub_sample_name)){
                    $sample = $sample.'_'.$sub_sample_name;  //'searchtest' => 'searchtest_back'
                }
                /////////////////

				$sampleDir = ltrim($arr["head"]["sample"][$sample],"/");
				$sampleDataPath = $sysInfo["privateDataDir"] =   DATA_ROOT.$sampleDir;
				//fis需要转移"."为"\."
				$sysInfo["privateDataDir"]  = str_replace('data.php','data\\.php',$sysInfo["privateDataDir"]);
				$baseData = $sysInfo["privateDataDir"] =   DATA_ROOT.$arr["head"]["baseData"];
				$serverSampleDataPath = $sampleDir;
				$arr = CmsDataAdapter::saveAndGetOrMergeData( $sampleDataPath, $serverSampleDataPath, $arr );
			}

			///////////////////////////////////////////////////////
            //支持读取外部数据的插件机制
            if(isset($arr['body']['extendDataPlugin']) && $arr['body']['extendDataPlugin']['on']){
                $extend_data_plugins = $arr['body']['extendDataPlugin']['plugins'];   //
                /*array(
                    array(
                        'start' => 0,
                        'end' => 2395212684,
                        'sample_name' => '',
                        'params' => '{}',
                        'name' => 'recommendhottab'
                    )
                );*/

                $action_time = time();
                foreach($extend_data_plugins as $api_plugin){
                    if($api_plugin['need_baiduid'] && empty($_COOKIE['BAIDUID'])){   //判断是否有baiduid
                        continue;
                    }
                    if($api_plugin['start'] <= $action_time &&  $action_time <= $api_plugin['end']){    //判断插件生效时间,用timestamp
                      //正式开始引入插件处理
                      $params = $api_plugin['params'];
                      if(!empty($params)) {
                          try{
                              $params = json_decode($params, true);
                          }catch(Exception $e){
                              $params = array();
                          }
                      } else {
                          $params = array();
                      }
                      $api_plugin_name = $api_plugin['name'];
                      $api_plugin_class = ucfirst($api_plugin_name);
                      try{
                          $api_plugin_config = include_once($dataRoot . 'plugin/'. $api_plugin_name .'/'. $api_plugin_class. '.inc.php');
                      } catch(Exception $e){
                          //TODO LOG
                          continue;
                      }
                      if(empty($api_plugin_config)){
                          continue;    //配置不合法，退出
                      }
                      try{
                          include_once $dataRoot . '/plugin/'.$api_plugin_name .'/'.$api_plugin_class .'.class.php';
                      } catch(Exception $e){
                          //TODO LOG
                          continue;
                      }
                      if(!class_exists($api_plugin_class)){
                          continue;    //类加载有问题，退出
                      }
                      $api_plugin_instance = new $api_plugin_class($api_plugin_config, $sysInfo['country']);
                      if(empty($api_plugin_instance)){
                          continue;    //初始化失败，退出
                      }
                      $ret = $api_plugin_instance->process($arr['body'], $params);   //执行数据干预
                      if($ret === false){
                          //LOG
                      }
                  }
              }
            }

			//smarty extend（为了选择布局）不能用条件判断语句，但是可以使用变量
			$layoutRoot = "web/base/layout/";
			$sysInfo['layout'] = empty( $arr["head"]["layout"] ) ? "home/page/layout/layout-index.tpl" :$arr["head"]["layout"];
			// 把cookie记录到smarty变量中，方便前端模板调用
            $baiduId = $sysInfo["baiduid"] = isset($_COOKIE["FLASHID"]) ? $_COOKIE["FLASHID"]: (isset($_COOKIE["BAIDUID"]) ? $_COOKIE["BAIDUID"]:"");
            $sysInfo["serverTime"] = time();

            //测试环境，需要置空cdn
            $arr["head"]["cdn"] = "";
			if ( !empty($baiduId) && extension_loaded("decodecookie") ){
				$sysInfo["baiduidCt"] = decodecookie($baiduId);
			} else{
				$sysInfo["baiduidCt"] = $sysInfo["serverTime"];
			}
			self::$cmsData = array(
				"sysInfo" => $sysInfo,
				"root"=> $arr
			);
		}


	}


?>