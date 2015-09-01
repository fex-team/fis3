<?php
require_once WEBROOT_PATH."smarty/Smarty.class.php";
class SimpleTemplate extends Smarty{
	
	private static $__instance;
    public  $cmsdata = array();
    public static function getInstance(){
        if(empty($__instance)){
            $__instance = new SimpleTemplate();
        }
        return $__instance;
    }

    public function __construct(){
		parent::__construct();
		 $default_conf = array(
	        'template_dir' => TEMPLATE_PATH,
	        'config_dir' => CONFIG_PATH,
	        'plugins_dir' => array( SMARTY_PLUGINS_DIR, FIS_SMARTY_PLUGINS_DIR ),
	        'left_delimiter' => '<%',
	        'right_delimiter' => '%>'
	    );
	    if(file_exists(WEBROOT_PATH . 'smarty.conf')){
	        $user_conf = parse_ini_file($this->normalize(WEBROOT_PATH . 'smarty.conf'));
	        if(!empty($user_conf)){
	            $default_conf = array_merge($default_conf, $user_conf);
	        }
	    }
	    $this->setTemplateDir($this->normalize($default_conf['template_dir']));
	    $this->setConfigDir($this->normalize($default_conf['config_dir']));
	    foreach ($default_conf['plugins_dir'] as $dir) {
	        $this->addPluginsDir($this->normalize($dir));
	    }
	    $this->setLeftDelimiter($default_conf['left_delimiter']);
	    $this->setRightDelimiter($default_conf['right_delimiter']);
    }
    public function show($tpl_name,$arrData = array(), $cache_id = null, $compile_id = null, $parent = null){
       $arrData =  array_merge($arrData,$this->cmsdata);
        $this->assign('root',$arrData);
        $this->display($tpl_name, $cache_id, $compile_id , $parent );
    }
	public function cacheShow($tpl_name,$arrData = array(), $cache_id = null, $compile_id = null, $parent = null, $cache_lifetime = -1){
		$this->caching = true;
		$this->cache_lifetime =  $cache_lifetime;
		$this->show($tpl_name,$arrData, $cache_id , $compile_id , $parent);
	}

	public function normalize($path) {
	    $normal_path = preg_replace(
	        array('/[\/\\\\]+/', '/\/\.\//', '/^\.\/|\/\.$/', '/\/$/'),
	        array('/', '/', '', ''),
	        $path
	    );
	    $path = $normal_path;
	    do {
	        $normal_path = $path;
	        $path = preg_replace('/[^\\/\\.]+\\/\\.\\.(?:\\/|$)/', '', $normal_path);
	    } while ($path != $normal_path);
	    $path = preg_replace('/\/$/', '', $path);
	    return $path;
	}
}