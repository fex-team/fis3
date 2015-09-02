<?php

class ResourceAPI {

    /**
     * @var ResourceAPI
     */
    private static $instance;
    
    private $map = array();
    private $map_path = array();
    private $collection = array();
    private $processed_symbol = array();
    private $smarty = '';

    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public static function reset(){
        self::$instance->destroy();
        self::$instance = null;
    }
    
    public function destroy(){
        unset($this->map);
        unset($this->map_path);
        unset($this->collection);
        unset($this->processed_symbol);
        unset($this->smarty);
    }
    
    public function registerMapPath($path, $module, $key = 'pc2'){
        $this->map_path[$key][$module] = $path;
    }
    
    private function loadMap($module, $key = 'pc2'){
        $map = &$this->map_path;
        if(isset($map[$key][$module])){
            include($map[$key][$module]);
            return true;
        } else {
            trigger_error("Unregistered module map [{$module}].", E_USER_WARNING);
            return false;
        }
    }

    public function setSmarty(Smarty_Internal_Template $template){
        $this->smarty = $template->smarty;
    }
    
    private function getPackages(&$info, &$map){
        $ret = array();
        $id = $info['id'];
        $pacakges = &$map['resource'][$id]['packages'];
        foreach($pacakges as $package){
            $ret[] = &$map['package'][$package];
        }
        return $ret;
    }
    
    public function addSymbol($id, $module, $framework = 'pc2'){
        if(isset($this->processed_symbol[$id])) return;
        $this->processed_symbol[$id] = true;
        if(!isset($this->map[$framework][$module]) && !$this->loadMap($module, $framework)){
            //加载模块map文件失败
            trigger_error("Unknown [{$module}] map.", E_USER_WARNING);
            return;
        }
        if(!isset($this->map[$framework][$module]['resource'][$id])){
            trigger_error("Unknown resource [{$id}].", E_USER_WARNING);
            return;
        }
        $map = &$this->map[$framework][$module];
        $info = &$map['resource'][$id];
        if($info['is_lib']){
            //如果是lib，先探测是否在common里
            if((isset($this->map[$framework]['common']) || $this->loadMap('common', $framework)) && isset($this->map[$framework]['common']['resource'][$id])){
                $map = &$this->map[$framework]['common'];
                $info = &$map['resource'][$id];
            }
        }
        foreach($info['requires'] as &$require){
            $this->addSymbol($require[0], $require[1], $framework);
        }
        $ext = $info['ext'];
        if(!isset($this->collection[$ext])){
            $this->collection[$ext] = array();
        }
        $collections = &$this->collection[$ext];
        $packages = $this->getPackages($info, $map);
        if(empty($collections)){
            $collections[] = array(
                'html' => $this->renderResource($info),
                'count' => 1,
                'size' => $info['size'],
                'pos' => 0,
                'symbols' => array($id => 1)
            );
            foreach($packages as &$package){
                $collections[] = array(
                    'html' => $this->renderResource($package),
                    'count' => 1,
                    'size' => $package['size'],
                    'pos' => 0,
                    'symbols' => $package['symbols_map']
                );
            }
        } else {
            $collections_new = array();
            $packages[] = &$info;
            foreach($collections as &$collection){
                $add_fail = true;
                foreach($packages as &$package){
                    $symbols = $collection['symbols'];
                    if($package === $info){
                        if(isset($symbols[$id])) {
                            continue;
                        } else {
                            $symbols[$id] = 1;
                        }
                    } else {
                        foreach($package['symbols'] as $symbol) {
                            if(isset($symbols[$symbol])){
                                continue 2;
                            } else {
                                $symbols[$symbol] = 1;
                            }
                        }
                    }
                    $add_fail = false;
                    $collections_new[] = array(
                        'html' => $this->renderResource($package, $collection['html']),
                        'count' => $collection['count'] + 1,
                        'size' => $collection['size'] + $package['size'],
                        'pos' => $collection['pos'] + 0,
                        'symbols' => $symbols
                    );
                }
                if($add_fail) {
                    $collections_new[] = &$collection;
                }
                //if(count($collections_new) > 100) break;
            }
            $this->collection[$ext] = &$collections_new;
        }
    }
    
    private function renderResource(&$info, $ret = array('', '')){
        $crlf = "\n";
        $html = '';
        $cdn = '';
        if($root = $this->smarty->getTemplateVars('root')){
            if($head = $root['head']){
                if($cdn = $head['cdn']){
                    $cdn = rtrim($cdn, '/');
                }
            }
        }
        if($info['ext'] == 'js'){
            if($info['is_sync']){
                $html = $crlf . '<script type="text/javascript" src="' . $cdn . $info['uri'] . '">'.'</script>';
            } else {
                if(isset($info['symbols'])){
                    $html = $crlf . '<script type="text/javascript">F._fileMap({\'' . $cdn . $info['uri'] . '\' : [\'' . implode("','", $info['symbols']) . '\']});</script>';
                } else {
                    $html = $crlf . '<script type="text/javascript">F._fileMap({\'' . $cdn . $info['uri'] . '\' : [\'' . $info['id'] . '\']});</script>';
                }
            }
        } else if($info['ext'] == 'css') {
            $html = $crlf . '<link rel="stylesheet" type="text/css" href="' . $cdn . $info['uri'] . '" />';
        }
        if($info['module'] == 'common'){
            $ret[0] .= $html;
        } else {
            $ret[1] .= $html;
        }
        return $ret;
    }
    
    public function registerResourceMap($map, $module, $key = 'pc2') {
        $this->map[$key][$module] = &$map;
    }
    
    public function getCollection($type){
        return $this->collection[$type];
    }
   
    public function renderResponse($output, Smarty_Internal_Template $template){
        $ret = '';
        $collection = $this->calResultCollection('css');
        if($collection){
            $ret .= $collection['html'][0] . $collection['html'][1];
        }
        $collection = $this->calResultCollection('js');
        if($collection){
            $ret .= $collection['html'][0] . $collection['html'][1];
        }
        return str_replace('<!--([==FIS_REQUIRE_FILE_MAP_PLACEHOLDER==])-->', $ret, $output);
    }
    
    private function calResultCollection($type){
        if(empty($this->collection[$type])) return false;
        $len = count($this->collection[$type]);
        $ret = &$this->collection[$type][0];
        if($len > 1){
            $s1 = $ret;
            for($i = 1 ; $i < $len ; $i++){
                $curr = &$this->collection[$type][$i];
                $s2 = &$curr ;
                if($s1['count'] < $s2['count']) {
                    continue;
                } elseif($s1['count'] > $s2['count']) {
                    $s1 = &$s2;
                    $ret = &$curr;
                } else if($s1['pos'] < $s2['pos']) {
                    //count相等时， 比较postion
                    continue;
                } else if($s1['pos'] > $s2['pos']) {
                    //count相等时， 比较postion
                    $s1 = &$s2;
                    $ret = &$curr;
                } else if($s1['size'] < $s2['size']) {
                    //count、postion相等时， 比较size
                    continue;
                } else if($s1['size'] > $s2['size']) {
                    //count、postion相等时， 比较size
                    $s1 = &$s2;
                    $ret = &$curr;
                }
            }
            
        }
        return $ret;
    }
}

function smarty_function_fis_require($params, Smarty_Internal_Template $template){
    $static_path = array();
    if (isset($params['static'])) {
        $static_path = $params['static'];
    }else{
        trigger_error('This params have no static params!',E_USER_WARNING);
    } 
    if(isset($params['module'])){
        $require_module = $params['module'];
    }else{
        $static = implode(',', $static_path);
        trigger_error("This params have no module params,when use $static", E_USER_WARNING);
    }
    if(isset($params['framework'])){
        $require_framework = $params['framework'];
    }else{
        $require_framework = null;
    }
    
    /**@var ResourceAPI $api*/
    $api = ResourceAPI::getInstance();
    //加载resource_map.php
    $config_dir  = $template->smarty->getConfigDir();
    foreach($config_dir as $dir){
        if($require_module != 'common'){
            if($require_framework){
                $common_php = $dir  . 'common/common_' . $require_framework .'_resource_map.php';
                if(is_file($common_php)){
                    $api->registerMapPath($common_php, 'common', $require_framework);
                }
            }else{
                $common_php = $dir . 'common/common_resource_map.php';
                if(is_file($common_php)){
                    $api->registerMapPath($common_php, 'common');
                }else{
                    trigger_error("Please use pc2-1.3.4 or later to compare common module!", E_USER_WARNING);
                }
            }
        }
        if($require_framework){
            $require_php = $dir . $require_module . '/' . $require_module . '_' . $require_framework . '_resource_map.php';
            if(is_file($require_php)){
                $api->registerMapPath($require_php, $require_module, $require_framework);
                break;
            }
        }else{
            $require_php = $dir . $require_module . '/' . $require_module . '_resource_map.php';
            if(is_file($require_php)){
                $api->registerMapPath($require_php, $require_module);
                break;
            }
        }
    }
    $api->setSmarty($template);
    foreach($static_path as $static){
        if($require_framework){
            $api->addSymbol($static, $require_module, $require_framework);
        }else{
            $api->addSymbol($static, $require_module);
        }
        
    }
    $template->smarty->registerFilter('output', array($api,'renderResponse'));
}