<?php

class PhizResource {

    /**
     *
     */
    const MAP_EXT = '.json';

    /**
     * @var string
     */
    private static $_map_dir;

    /**
     * @var array
     */
    private static $_maps = array();

    /**
     * @var array
     */
    private static $_collection = array(
        'js' => array(),
        'css' => array()
    );

    private static $_imported = array();

    /**
     *
     */
    public static function reset(){
        self::$_maps = array();
        self::$_collection = array(
            'js' => array(),
            'css' => array()
        );
    }

    /**
     * @param string $map_dir
     */
    public static function setMapDir($map_dir){
        self::$_map_dir = $map_dir;
    }

    /**
     * @return string
     */
    public static function getMapDir(){
        return self::$_map_dir;
    }

    /**
     * @param string $id
     * @param string $def_ns
     * @return string
     */
    private static function getNamespace(&$id, $def_ns = null){
        $pos = strpos($id, ':');
        if($pos === false){
            if($def_ns === null){
                $def_ns = '__global__';
            } else {
                $id = $def_ns . ':' . $id;
            }
            return $def_ns;
        } else {
            return substr($id, 0, $pos);
        }
    }

    /**
     * @param $id
     * @param $caller_ns
     * @param &$ns
     * @param &$map
     * @return mixed
     */
    public static function getInfo(&$id, $caller_ns = null, &$ns = null, &$map = null){
        $ns = self::getNamespace($id, $caller_ns);
        if(isset(self::$_maps[$ns])){
           $map = self::$_maps[$ns];
        } else {
            if(self::$_map_dir){
                if($ns === '__global__'){
                    $map_file = self::$_map_dir . '/map' . self::MAP_EXT;
                } else {
                    $map_file = self::$_map_dir . '/' . $ns . '-map' . self::MAP_EXT;
                }
                if(file_exists($map_file)){
                    if(self::MAP_EXT === '.php'){
                        $map = self::$_maps[$ns] = include $map_file;
                    } else {
                        $map = self::$_maps[$ns] = json_decode(file_get_contents($map_file), true);
                    }
                } else {
                    trigger_error('unable to load reource [' . $id . '], missing map [' . $map_file . ']', E_USER_WARNING);
                }
            } else {
                trigger_error('undefined resource map dir', E_USER_ERROR);
            }
        }
        if(isset($map['res'][$id])){
            return $map['res'][$id];
        } else {
            trigger_error('undefined resource [' . $id . ']', E_USER_WARNING);
        }
        return null;
    }

    public static function import($id, $caller_ns = null, $async = false){
        if(isset(self::$_imported[$id])){
            return self::$_imported[$id];
        } else {
            $info = self::getInfo($id, $caller_ns, $ns, $map);
            if($info){
                $uri = $info['uri'];
                $type = $info['type'];
                if(isset($info['pkg'])){
                    $info = $map['pkg'][$info['pkg']];
                    $uri = $info['uri'];
                    foreach($info['has'] as $rId){
                        self::$_imported[$rId] = $uri;
                    }
                } else {
                    self::$_imported[$id] = $uri;
                }
                if(isset($info['deps'])){
                    foreach($info['deps'] as $dId){
                        self::import($dId);
                    }
                }
                self::$_collection[$type][] = $uri;
                return $uri;
            } else {
                return null;
            }
        }
    }

    public static function render($type, $reset = true){
        $html = '';
        if(!empty(self::$_collection[$type])){
            $uris = self::$_collection[$type];
            $lf = "\n";
            if($type === 'js'){
                $html  = '<script type="text/javascript" src="';
                $html .= implode('"></script>' . $lf . '<script type="text/javascript" src="', $uris);
                $html .= '"></script>' . $lf;
            } else if($type === 'css'){
                $html  = '<link rel="stylesheet" type="text/css" href="';
                $html .= implode('"/>' . $lf . '<link rel="stylesheet" type="text/css" href="', $uris);
                $html .= '"/>' . $lf;
            }
            if($reset){
                self::$_collection[$type] = array();
            }
        }
        return $html;
    }
    
    private static $_pool = array();
    private static $_pool_name;
    
    public static function startPool($name = '__global__'){
        if(!isset(self::$_pool[$name])){
            self::$_pool[$name] = '';
        }
        self::$_pool_name = $name;
        ob_start();
    }
    
    public static function endPool(){
        self::$_pool[self::$_pool_name] .= ob_get_clean();
    }

    public static function renderPool($name = '__global__'){
        if(isset(self::$_pool[$name])){
            return self::$_pool[$name];
        } else {
            return '';
        }
    }
}
