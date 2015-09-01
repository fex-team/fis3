<?php
touch(__FILE__);

class ResourceAPI {
    /**
     * @var array
     */
    public static $map = array();
    public static $registered = false;

    private static $map_path = array();
    private static $collection = array();
    private static $processed_symbol = array();
    private static $cdn = '';

    public static function reset(){
        self::$registered = false;
        unset(self::$map);
        unset(self::$map_path);
        unset(self::$collection);
        unset(self::$processed_symbol);
        unset(self::$cdn);
    }

    public function registerMapPath($path, $module, $key = 'pc2'){
        self::$map_path[$key][$module] = $path;
    }

    private function loadMap($module, $key = 'pc2'){
        $map = &self::$map_path;
        if(isset($map[$key][$module])){
            include($map[$key][$module]);
            return true;
        } else {
            trigger_error("Unregistered module map [{$module}].", E_USER_WARNING);
            return false;
        }
    }

    public function setCdn($cdn){
        self::$cdn = $cdn;
    }

    public static function addSymbol($id, $module, $framework = 'pc2'){
        if(isset(self::$processed_symbol[$id])) return;
        self::$processed_symbol[$id] = true;
        if(!isset(self::$map[$framework][$module]) && !self::loadMap($module, $framework)){
            //加载模块map文件失败
            trigger_error("Unknown [{$module}] map.", E_USER_WARNING);
            return;
        }
        if(!isset(self::$map[$framework][$module]['resource'][$id])){
            trigger_error("Unknown resource [{$id}].", E_USER_WARNING);
            return;
        }
        $map = &self::$map[$framework][$module];
        $info = &$map['resource'][$id];
        $ext = $info['ext'];
        //找到收集的map
        if(!isset(self::$collection[$ext])){
            self::$collection[$ext] = array(
                'html' => array('', ''),
                'symbols' => array()
            );
        }
        //如果是lib，先探测是否在common里
        if($info['is_lib']){
            if((isset(self::$map[$framework]['common']) || self::loadMap('common',$framework)) && isset(self::$map[$framework]['common']['resource'][$id])){
                $map = &self::$map[$framework]['common'];
                $info = &$map['resource'][$id];
            }
        }
        $collections = &self::$collection[$ext];
        //加载依赖文件
        foreach($info['requires'] as &$require){
            //if(isset($collections['symbols'][$id])) continue;
            self::addSymbol($require[0], $require[1], $framework);
        }
        //如果方案中已经有了，就退出
        if($collections['symbols'][$id]) return;
        //获取包id
        $pacakges_id = $map['resource'][$id]['packages'];

        if($pacakges_id){
            //如果有包，就用这个包
            $info = &$map['package'][$pacakges_id];
            $collections['symbols'] = array_merge($collections['symbols'], $info['symbols_map']);
        } else {
            //无包就用单独文件
            $collections['symbols'][$id] = 1;
        }
        $collections['html'] = self::renderResource($info, $collections['html']);
    }

    private static function renderResource(&$info, $ret = array('', '')){
        $crlf = "\n";
        $html = '';
        if($info['ext'] == 'js'){
            if($info['is_sync']){
                $html = $crlf . '<script type="text/javascript" src="' . self::$cdn . $info['uri'] . '">'.'</script>';
            } else {
                if(isset($info['symbols'])){
                    $html = $crlf . '<script type="text/javascript">F._fileMap({\'' . self::$cdn . $info['uri'] . '\' : [\'' . implode("','", $info['symbols']) . '\']});</script>';
                } else {
                    $html = $crlf . '<script type="text/javascript">F._fileMap({\'' . self::$cdn . $info['uri'] . '\' : [\'' . $info['id'] . '\']});</script>';
                }
            }
        } else if($info['ext'] == 'css') {
            $html = $crlf . '<link rel="stylesheet" type="text/css" href="' . self::$cdn . $info['uri'] . '" />';
        }
        if($info['module'] == 'common'){
            $ret[0] .= $html;
        } else {
            $ret[1] .= $html;
        }
        return $ret;
    }

    public function registerResourceMap($map, $module, $key = 'pc2') {
        self::$map[$key][$module] = &$map;
    }

    public static function renderResponse($output){
        $ret = '';

        $collection = &self::$collection['css'];
        if($collection){
            $ret .= $collection['html'][0] . $collection['html'][1];
        }

        $collection = &self::$collection['js'];
        if($collection){
            $ret .= $collection['html'][0] . $collection['html'][1];
        }
        return str_replace('<!--([==FIS_REQUIRE_FILE_MAP_PLACEHOLDER==])-->', $ret, $output);
    }
}


function smarty_compiler_fis_require($params, Smarty $smarty){
    $static_path = array();
    if (isset($params['static'])) {
        $static_path = $params['static'];
        //在不修改smartysyntax的情况下,获取到的static_path为字符串而非php数组结构
        //array("/static/common/lib/fis/template/template.js")
        $static_path = substr($static_path, 6, -1);
        //如果以后传入的是多个元素的数组
        //array("/static/common/lib/fis/template/template.js","/static/common/lib/fis/template/template.js")
        $static_path = str_replace(array('"','\''), '', $static_path);
        $static_path = explode(',',$static_path);
    }else{
        trigger_error('This params have no static params!',E_USER_WARNING);
    }
    if(isset($params['module'])){
        $require_module = $params['module'];
        $require_module = substr($require_module, 1, -1);
    }else{
        $static = implode(',', $static_path);
        trigger_error("This params have no module params,when use $static", E_USER_WARNING);
    }
    if(isset($params['framework'])){
        $require_framework = $params['framework'];
        $require_framework = substr($require_framework, 1, -1);
    }else{
        $require_framework = null;
    }

    /**@var ResourceAPI $api*/
    $return_code = '<?php ';
    $return_code .= 'class_exists("ResourceAPI") or require "' . __FILE__. '";';

    if(!isset(ResourceAPI::$map[$require_module])){
        //加载resource_map.php
        $config_dir  = $smarty->smarty->getConfigDir();
        foreach($config_dir as $dir){
            if($require_module != 'common'){
                if($require_framework){
                    $common_php = $dir  . 'common/common_' . $require_framework .'_resource_map.php';
                    if(is_file($common_php)){
                        $return_code .= 'ResourceAPI::registerMapPath("'.$common_php.'", "common", "'.$require_framework.'");';
                    }
                }else{
                    $common_php = $dir . 'common/common_resource_map.php';
                    if(is_file($common_php)){
                        $return_code .= 'ResourceAPI::registerMapPath("'.$common_php.'", "common");';

                    }else{
                        trigger_error("Please use pc2-1.3.4 or later to compare common module!",E_USER_ERROR);
                    }
                }
            }
            if($require_framework){
                $require_php = $dir . $require_module . '/' . $require_module . '_' . $require_framework . '_resource_map.php';
                if(is_file($require_php)){
                    $return_code .= 'ResourceAPI::registerMapPath("'.$require_php.'", "'.$require_module.'", "'.$require_framework.'");';
                    break;
                }
            }else{
                $require_php = $dir . $require_module . '/' . $require_module . '_resource_map.php';
                if(is_file($require_php)){
                    $return_code .= 'ResourceAPI::registerMapPath("'.$require_php.'", "'.$require_module.'");';
                    break;
                }
            }
        }
    }
    foreach($static_path as $static){
        if($require_framework){
            $return_code .= 'ResourceAPI::addSymbol("'.$static.'", "'.$require_module.'", "'.$require_framework.'");';
        }else{
            $return_code .= 'ResourceAPI::addSymbol("'.$static.'", "'.$require_module.'");';
        }
    }
    $cdn = '';
    if($root = $smarty->smarty->getTemplateVars('root')){
        if($head = $root['head']){
            if($cdn = $head['cdn']){
                $cdn = rtrim($cdn, '/');
            }
        }
    }
    $return_code .= 'ResourceAPI::setCdn("' . $cdn . '");' ;
    $return_code .= '
    if(!ResourceAPI::$registered){
        $_smarty_tpl->registerFilter("output", array("ResourceAPI", "renderResponse"));
        ResourceAPI::$registered = true;
    }';
    $return_code .= '?>';
    return $return_code;
}
