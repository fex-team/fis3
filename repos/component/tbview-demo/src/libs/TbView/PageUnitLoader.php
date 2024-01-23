<?php
	class TbView_PageUnitLoader {
		private static $_page_unit_set = array();	//PageUnit集合
		private static $_resource_map;
		/**
		 * 初始化方法
		 */
		public static function init($resource_map) {
			self::$_resource_map = $resource_map;
		}
		
		public static function loadData() {
			$page_unit_list = self::_getPageUnitList();
			return self::_getPageUnitContentArr($page_unit_list);
		}
                
		/**
		 * 查找当前widget(component,template,layout)所需的PageUnit，添加到$_page_unit_set中
		 */
		public static function pickPageUnit($module_name,$scope) {
			$page_unit_res_data = self::_getResDataFromResMap($scope,self::$_resource_map);
			$page_units = $page_unit_res_data[$module_name];
			if (!empty($page_units)) {
				foreach ($page_units as $one_page_unit) {
					self::$_page_unit_set[$one_page_unit] = 1;
				}
			}
		}
		
		private static function _getResDataFromResMap($mod,$resource_map) {
			return $resource_map->getResMapValue($mod,'page_unit');
		}
		
		/**
		 * 从resource map中抽取unit_id
		 */
		private static function _gatherPageUnitsFromResData($page_unit_res_data) {
			$ret_list = array();
			if (!empty($page_unit_res_data)) {
				foreach ($page_unit_res_data as $widget_path => $unit_list) {
					if (!empty($unit_list)) {
						foreach ($unit_list as $unit_id) {
							array_push($ret_list,$unit_id);
						}
					}
				}
			}
			return $ret_list;
		}

		/**
		 * 获取需要转成js形式的PageUnit列表
		 */
		private static function _getPageUnitList() {
			$page_unit_list = array_keys(self::$_page_unit_set);
			return $page_unit_list;
		}
		
		/**
		 * 取得PageUnit的值，并以键值对的形式返回
		 */
		private static function _getPageUnitContentArr($page_unit_list) {
			$unit_content_arr = array();
			if (empty($page_unit_list) || !class_exists('TbView_Common_PageConfigurator')) return $unit_content_arr;
			foreach ($page_unit_list as $unit_id) {
				$unit_content = TbView_Common_PageConfigurator::getPageUnit($unit_id);
				if (!is_null($unit_content)) {
					$unit_content_arr[$unit_id] = $unit_content;
				}
			}
			return $unit_content_arr;
		}
	}