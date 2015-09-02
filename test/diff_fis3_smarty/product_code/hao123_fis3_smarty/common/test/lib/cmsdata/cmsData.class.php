<?php
/*
* @descripton: 以php数组的方式读取cms数据类
*
* @filename: cmsData.class.php  
* @author  : mozhuoying@baidu.com
* @date    : 2014-04-08
* @package : web-ui/lib/cms/
*
* @Copyright (c) 2014 BAIDU-GPM
*
*/
class CmsData{

	/**
	 * 根据路径读取cms数据
	 * @param  string  $dataPath 读取的数据路径
	 * @return array 读取cms数据
	 */
    static function get( $dataPath ){

      if( is_file(  $dataPath ) ){
      	include_once $dataPath;
      	return $root;
      } else {
        return array();
      }
      
    }
    /**
	 * 根据路径存储数据（该方法在本地调试fis抓取数据使用，线上不调用）
	 * @param  string  $dataPath 存储的数据路径
	 * @param  string  $content 存储的内容（json的方式传递）
	 * @return null
	 */
  static function save( $dataPath, $content ){
  	if ( !empty( $content ) ){
  		//写入本地文件
  		$phpData = sprintf("<?php \$root= %s \n?>",var_export(json_decode( $content,true),true));
  		//建立目录
  		mkdir( dirname( $dataPath ) , 0777, true );
  		//建立文件
  		file_put_contents( $dataPath, $phpData );
	  }
  }
  	
  /**
	 * 递归合并数组把b合并到a
	 * @param  array   合并的base 数组（a）
	 * @param  array   需合并的数组(b)
	 * @return array
	 */
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
}

   
?>