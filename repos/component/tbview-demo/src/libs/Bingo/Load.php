<?php
/***************************************************************************
 * 
 * Copyright (c) 2009 Baidu.com, Inc. All Rights Reserved
 * $Id: autoload.php,v 1.4 2009/07/22 11:16:35 hongdk Exp $ 
 * 
 **************************************************************************/
 
 
 
/**
 * @file autoload.php
 * @author hongdingkun@baidu.com
 * @modify xuliqiang <xuliqiang@baidu.com>
 * @since 2009/06/24 12:00:40
 * @version $Revision: 1.4 $ 
 * @brief 
 *  
 **/
class Bingo_Load {
	
	private $_classPath;		  /**< class映射路径       */
	private $_registered;		  /**< 是否已经注册       */
	private $_dirs;		          /**< 需要自动加载的目录       */
	private static $_cachePath;		  /**< 缓存所在目录       */
	private static $_cacheFileName;		  /**< 缓存文件名        */
	private static $_instance = null;		  /**< 实例对象，保证单例       */

	/**
	 * @brief 构造函数
	 *
	 * @return  public function 
	 * @retval   
	 * @date 2009/07/09 11:46:14
	**/
	protected function __construct ($cache_path) {
		$this->_classPath = array ();
		$this->_registered = false;
		$this->_dirs = array ();
		self :: $_cachePath = $cache_path;
		self :: $_cacheFileName = false;
	}
	
	public static function getInstance ($cache_path='./') {
		if (!isset(self :: $_instance)) {
			self :: $_instance = new self ($cache_path);
			self :: $_instance->_register ();
		}
		return self :: $_instance;
	}
	
	/**
	 * @brief 注册autoload
	 *
	 * @return  public function 
	 * @retval   
	 * @date 2009/07/09 11:46:33
	**/
	public function _register () {
		if (true === $this->_registered) {
			return true;
		}
		if (false === spl_autoload_register(array(self::getInstance(), 'autoLoad'))) {
			return false;
		}
		/*if (false === spl_autoload_register(array(self::getInstance(), 'nextAutoLoad'))) {
			spl_autoload_unregister(array(self::getInstance(), 'autoLoad'));
			return false;
		}*/
		return true;
	}
	

	/**
	 * @brief 自动加载
	 *
	 * @return  public function 
	 * @retval   
	 * @date 2009/07/09 11:46:56
	**/
	public function autoLoad ($class_name) {
		$res = false;
		
		if (isset ($this->_classPath[$class_name])) {
			$res = include_once ($this->_classPath[$class_name]);
		}

		//如果找不到这个类或者类不存在，则尝试重启遍历文件夹
		if (false === $res || false === class_exists($class_name)) {
			$this->_reload ();  //清除cache
			
			//再次加载
			if (isset ($this->_classPath[$class_name])) {
				$res = include_once ($this->_classPath[$class_name]);
			}
		}
		return $res;
	}
	
	/**
	 * @brief 自动加载  
	 *
	 * @return  public function 
	 * @retval   
	 * @date 2009/07/09 11:46:56
	**/
	
	public function add ($dir_name,$force = false) {
		if (false === $force && self :: _cacheFileValid ($dir_name)) {
			$classPath = self :: _getClassPathFromCache ($dir_name);	
		}
		else {
			$classPath = self :: _getClassPath ($dir_name);  //生成class文件
			
			if (!is_dir (self :: $_cachePath)) {
				return false;
			}
			//一下将生成的数组导出并存放到临时文件
			$str = var_export ($classPath,true);
			$str = "<?php\n\$tmpClassPath = \n".$str.";\n?>";
			$final_file = self :: _getCacheFileName ($dir_name);
			$tmp_class_file = $final_file.".bak".rand();
			file_put_contents ($tmp_class_file,$str);
			
			//以下将临时文件修改为实际文件
			if (file_exists($tmp_class_file)) {
				@rename ($tmp_class_file,$final_file);
			}
			if (file_exists ($tmp_class_file)) {
				unlink ($tmp_class_file);
			}
		}
		foreach ($classPath as $key => $value) {
			if (isset ($this->_classPath[$key])) {
				$old_time = filemtime ($this->_classPath[$key]);
				$new_time = filemtime ($value);
				//echo "$key $old_time $new_time\n<br>";
				if ($old_time > $new_time) {
					continue;
				}
			}
			$this->_classPath[$key] = $value;
		}
		$this->_dirs [] = $dir_name;
		self :: $_cacheFileName = false;
	}
	
	/**
	 * @brief 重新加载缓存文件
	 *
	 * @return  private function 
	 * @retval   
	 * @date 2009/07/09 11:49:00
	**/
	private function _reload () {
		if (count($this->_dirs) == 0) {
			return true;
		}
		$dirs = $this->_dirs;
		$this->_dirs = array ();
		$this->_classPath = array ();
		foreach ($dirs as $dir_name) {
			$this->add ($dir_name,true);
		}
	}

	private static function _getClassPathFromCache ($dir_name) {
		$file = self :: _getCacheFileName ($dir_name);
		include ($file);
		return $tmpClassPath;
	}

	private static function _cacheFileValid ($dir_name) {
		$file = self :: _getCacheFileName ($dir_name);
		if (!file_exists ($file)) {
			return false;
		}
		return true;
	}

	private static function _getCacheFileName ($dir_name) {
		if (false === self :: $_cacheFileName) {
			self :: $_cacheFileName = self :: $_cachePath.'/'.
				md5($dir_name).'.auto.php';
		}
		return self :: $_cacheFileName;
	}

	private static function _getClassPath ($dir_name) {
		$files = self :: _getAllFiles ($dir_name);
		$classPath = self :: _buildClassPath ($files);
		return $classPath;
	}
	
	/**
	 * @brief   对给定的一组文件，找到其中存在的class并得到class->file的映射 
	 *
	 * @return  private static function 
	 * @retval   
	 * @date 2009/07/09 11:49:34
	**/
	private static function _buildClassPath ($files) {
		$classPath = array ();
		foreach ($files as $per) {
			$tail = substr ($per,strlen($per)-4,4);
			if ($tail === ".php" || $tail === ".inc") {
				preg_match_all('~^\s*(?:abstract\s+|final\s+)?(?:class|interface)\s+(\w+)~mi',
					file_get_contents($per), $res);
				if (count($res[1]) == 0) {
					continue;
				}
				foreach ($res[1] as $value) {
					$tmp = trim($value);
					if ($tmp !== "") {
						if (isset($classPath[$tmp])) {
							$old_time = filemtime ($classPath[$tmp]);
							$new_time = filemtime ($per);
							if ($old_time > $new_time) {
								continue;
							}
						}
						$classPath [$tmp] = $per;
					}
				}
			}
		}
		return $classPath;	
	}

	/**
	 * @brief 获取文件夹下的所有文件
	 * @desc  考虑到php本身对递过层次的限制，为避免core dump，此处采用广搜遍历
	 *
	 * @return  private static function 
	 * @retval   
	 * @date 2009/07/09 11:52:32
	**/
	private static function _getAllFiles ($dir) {
		$first = 0;
        $last = 1;
        $queue = array 
			(
				0 => $dir
            );
        $files = array ();
        while ($first < $last) {
			$value = $queue[$first++];
			if (!is_dir($value)) {
				if (file_exists($value)) {
					array_push($files,$value);   
				}
			}
            else {
				$arr = scandir ($value);
				if (count($arr) == 0) {
					continue;
				}
                foreach ($arr as $per) {
					if ($per === "." || $per === "..") {
						continue;
					}
					$tmp = $value."/".$per;
					$queue[$last++] = $tmp;
				}   
            }   
        }
		return $files;
	}   

}
/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */