<?php
/**
 * User: zhangyunlong
 * Date: 13-10-15
 * Time: 下午9:19
 */

$root = dirname(__FILE__);
require_once $root . '/Resource.class.php';

abstract class PhizView {

    /**
     * @var string
     */
    protected static $_template_dir;

    /**
     * @var array
     */
    protected $_data = array();

    /**
     * @var string
     */
    protected $_id;

    /**
     * @var string
     */
    protected $_namespace;

    /**
     * @var string
     */
    protected $_scope = 'protected';

    /**
     * @var string
     */
    protected $_uri;

    /**
     * @var array
     */
    protected $_deps;

    /**
     * @var array
     */
    protected $_res_info;

    /**
     * @var null|string
     */
    protected $_caller_namespace = null;

    /**
     * @param string $id
     * @param string $caller_namespace
     */
    public function __construct($id, $caller_namespace = null){
        $this->_caller_namespace = $caller_namespace;
        $this->_info = $info = PhizResource::getInfo($id, $caller_namespace, $this->_namespace);
        $this->_id = $id;
        $this->_uri = $info['uri'];
        if($this->_namespace === 'common'){
            $this->_scope = 'public';
        }
        if(isset($info['deps'])){
            $this->_deps = $info['deps'];
        }
    }

    /**
     * for subclasses
     */
    protected function init(){}

    /**
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    protected function input($key, $default = null){
        if(isset($this->_data[$key])){
            return $this->_data[$key];
        } else {
            return $default;
        }
    }

    /**
     * @param string $template_dir
     */
    public static function setTemplateDir($template_dir){
        self::$_template_dir = $template_dir;
    }

    /**
     * @return string
     */
    public static function getTemplateDir(){
        return self::$_template_dir;
    }

    /**
     * @param string $map_dir
     */
    public static function setMapDir($map_dir){
        PhizResource::setMapDir($map_dir);
    }

    /**
     * @param string $id
     * @return mixed
     */
    public function uri($id){
        $info = PhizResource::getInfo($id, $this->_namespace);
        return $info['uri'];
    }

    /**
     * @param string $id
     * @param bool $async
     * @return string
     */
    public function import($id, $async = false){
        return PhizResource::import($id, $this->_namespace, $async);
    }

    /**
     * @param string $property
     * @param mixed $value
     * @return $this
     */
    public function assign($property, $value = null){
        if(is_string($property)){
            $this->_data[$property] = $value;
        } else if(is_array($property)){
            foreach($property as $k => $v){
                $this->assign(strval($k), $v);
            }
        } else {
            trigger_error('invalid assign data type', E_USER_ERROR);
        }
        return $this;
    }

    /**
     * @param string $name
     * @param mixed $arguments
     * @return mixed
     */
    public function __call($name, $arguments){
        $value = count($arguments) === 0 ? true : $arguments[0];
        $this->assign($name, $value);
        return $this;
    }

    /**
     * @return string
     */
    public function __toString(){
        return $this->fetch();
    }

    /**
     * @param string $type
     * @return bool
     */
    public function scope($type){
        $this->_scope = strtolower($type);
    }

    /**
     * @return bool
     */
    protected function checkScope(){
        if($this->_caller_namespace){
            switch($this->_scope){
                case 'private':
                    if($this->_namespace === $this->_caller_namespace){
                        return true;
                    }
                    break;
                case 'protected':
                    if(strpos($this->_caller_namespace . '-', $this->_namespace . '-') === 0){
                        return true;
                    }
                    break;
                case 'public':
                    return true;
                    break;
                default:
                    trigger_error('unsupport scope type [' . $this->_scope . ']', E_USER_ERROR);
            }
            trigger_error("unable to use [{$this->_scope}] resource [{$this->_id}]", E_USER_ERROR);
        }
        return false;
    }

    /**
     * 
     */
    protected function loadResource(){
        if($this->_deps){
            foreach($this->_deps as $id){
                PhizResource::import($id);
            }
            $this->_deps = null;
        }
    }

    /**
     *
     */
    const CSS_PLACEHOLDER = '<!--[FIS_CSS_PLACEHOLDER]-->';

    /**
     *
     */
    const JS_PLACEHOLDER = '<!--[FIS_JS_PLACEHOLDER]-->';

    /**
     * @var bool
     */
    protected $_used_css_placeholder = false;

    /**
     * @var bool
     */
    protected $_used_js_placeholder = false;

    /**
     * @return string
     */
    public function fetch(){
        $this->init();
        $content = $this->loadTemplate();
        $this->checkScope();
        $this->loadResource();
        if($this->_used_css_placeholder){
            $pos = strpos($content, self::CSS_PLACEHOLDER);
            if($pos !== false){
                $content = substr_replace($content, PhizResource::render('css'), $pos, strlen(self::CSS_PLACEHOLDER));
            }
        }
        if($this->_used_js_placeholder){
            $pos = strrpos($content, self::JS_PLACEHOLDER);
            if($pos !== false){
                $content = substr_replace($content, PhizResource::render('js'), $pos, strlen(self::JS_PLACEHOLDER));
            }
        }
        return $content;
    }

    /**
     * @return string
     */
    public function css(){
        $this->_used_css_placeholder = true;
        return self::CSS_PLACEHOLDER;
    }

    /**
     * @return string
     */
    public function js(){
        $this->_used_js_placeholder = true;
        return self::JS_PLACEHOLDER;
    }

    /**
     * @param string $name
     */
    public function startScript($name = 'normal'){
        PhizResource::startPool($name);
    }

    /**
     *
     */
    public function endScript(){
        PhizResource::endPool();
    }

    /**
     * @param string $name
     * @return string
     */
    public function script($name = 'normal'){
        return PhizResource::renderPool($name);
    }

    /**
     * 
     */
    public function display(){
        echo $this->fetch();
    }

    /**
     * @var array
     */
    private static $_loaded_view = array();

    /**
     * @param string $__uri__
     */
    private static function _include($__uri__){
        ob_start();
        include_once $__uri__;
        ob_end_clean();
    }

    /**
     * @param string $id
     * @param string $caller_namespace
     * @return string|null
     */
    private static function _includeOnce(&$id, $caller_namespace = null){
        $id = preg_replace('/(^.*(\/[^\/.]+))$/', '$1$2.php', $id);
        $info = PhizResource::getInfo($id, $caller_namespace);
        if(isset(self::$_loaded_view[$id])){
            return self::$_loaded_view[$id];
        } else {
            if(isset($info['extend'])){
                self::_includeOnce($info['extend'], $caller_namespace);
            }
            $clazz = $info['extras']['clazz'];
            if(self::$_template_dir){
                self::_include(self::$_template_dir . '/' . $info['uri']);
            } else {
                trigger_error('undefined template dir', E_USER_ERROR);
            }
            return $clazz;
        }
    }
    
    public static function includeOnce($id){
        return self::_includeOnce($id);
    }

    /**
     * @param $id
     * @return self|null
     */
    public static function page($id){
        $clazz = self::_includeOnce($id);
        $page = new $clazz($id);
        if(!($page instanceof self)){
            trigger_error('unable to load [' . $id . '] as a PhizView instance', E_USER_ERROR);
        }
        self::setPage($page);
        return $page;
    }

    /**
     * @param string $id
     * @return self
     */
    public function load($id){
        $clazz = self::_includeOnce($id, $this->_namespace);
        $view = new $clazz($id, $this->_namespace);
        if(!($view instanceof PhizView)){
            $clazz = get_class($view);
            trigger_error('unable to load ' . $clazz . ' object [' . $id . '] as PhizView instance.');
        }
        return $view;
    }

    /**
     * @var self
     */
    protected static $_page;

    /**
     * @return self
     */
    protected static function getPage(){
        return self::$_page;
    }

    /**
     * @param self $page
     */
    protected static function setPage(self $page){
        self::$_page = $page;
    }

    /**
     * @param string $key
     * @param mixed $default
     * @return mixed|null
     */
    public function getPageData($key, $default = null){
        if(self::$_page){
            $keys = explode('.', $key);
            $len = count($keys);
            if(empty($keys[0])){
                trigger_error('invalid input property', E_USER_ERROR);
            } else {
                $data = self::$_page->input($keys[0], $default);
                for($i = 1; $i < $len; $i++){
                    $key = $keys[$i];
                    if(isset($data[$key])){
                        $data = $data[$key];
                    } else {
                        return $default;
                    }
                }
                return $data;
            }
        } else {
            trigger_error('missing page instance', E_USER_ERROR);
        }
        return $default;
    }

    /**
     * @return string
     */
    abstract protected function loadTemplate();

}