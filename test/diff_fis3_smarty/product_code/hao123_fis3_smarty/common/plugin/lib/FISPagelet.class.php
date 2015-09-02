<?php
if (!class_exists('FISResource')) require_once(dirname(__FILE__) . '/FISResource.class.php');
if (!class_exists('FISAutoPack')) require_once(dirname(__FILE__) . '/FISAutoPack.class.php');
/**
 * Class FISPagelet
 * DISC:
 * 构造pagelet的html以及所需要的静态资源json
 */
class FISPagelet {

    const CSS_LINKS_HOOK = '<!--[FIS_CSS_LINKS_HOOK]-->';
    const JS_SCRIPT_HOOK = '<!--[FIS_JS_SCRIPT_HOOK]-->';
    const CSS_STYLE_HOOK = '<!--[FIS_STYLE_HOOK]-->';
    //国际化特殊stylehook
    const CSS_GLBAL_LINKS_HOOK = '<!--[FIS_CSS_GLBAL_LINKS_HOOK]-->';

    static private $hide_link = false;

    static private $global_link = false;

    const MODE_NOSCRIPT = 0;
    const MODE_QUICKLING = 1;
    const MODE_BIGPIPE = 2;

    //缺省的textarea类
    const DEFAULT_TEXTAREA_CLASS = 'g_fis_bigrender';
    //缺省的textarea style
    const DEFAULT_TEXTAREA_STYLE = 'visibility: hidden;';
    //是否自动输出容器
    static private $rend_div = true;
    //传递group class,style
    static private $group_class = "";
    static private $group_style = "";
    /**
     * 收集widget内部使用的静态资源
     * array(
     *  0: array(), 1: array(), 2: array()
     * )
     * @var array
     */
    static protected $inner_widget = array(
        array(),
        array(),
        array()
    );
    static private $_session_id = 0;
    static private $_context = array();
    static private $_contextMap = array();
    static private $_pagelets = array();
    static private $_title = '';
    static private $_pagelet_group = array();
    /**
     * 解析模式
     * @var number
     */
    static protected $mode = null;

    static protected $default_mode = null;

    //url强迫模式
    static protected $force_mode = false;

    /**
     * 某一个widget使用那种模式渲染
     * @var number
     */
    static protected  $widget_mode;

    static protected  $filter;

    static public $cp;
    static public $arrEmbeded = array();

    static public function init() {
        self::$default_mode = self::MODE_NOSCRIPT;
        $is_ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
            && (strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest');
        // url指定模式,暂时只能指定为default_mode
        if( !empty( $_GET['fispagemode'] ) ){
            self::setMode(self::$default_mode);
            self::$force_mode = self::$default_mode;
        } else {
            if ($is_ajax || $_GET['pagelets']) {
                self::setMode(self::MODE_QUICKLING);
            } else {
                self::setMode(self::$default_mode);
            }
        }
        
        self::setFilter($_GET['pagelets']);
    }

    static public function setCdn($url) {
        FISResource::setCdn($url);
    }

    static public function setMode($mode){
        if (self::$mode === null) {
            self::$mode = isset($mode) ? intval($mode) : 1;
        }
    }

    static public function setFilter($ids) {
        if (!is_array($ids)) {
            $ids = array($ids);
        }
        foreach ($ids as $id) {
            self::$filter[$id] = true;
        }
    }

    static public function setTitle($title) {
        self::$_title = $title;
    }

    static public function getUri($strName, $smarty) {
        return FISResource::getUri($strName, $smarty);
    }

    static public function addScript($code) {
        if(self::$_context['hit'] || self::$mode == self::$default_mode){
            FISResource::addScriptPool($code);
        }
    }

    static public function addStyle($code) {
        if(self::$_context['hit'] || self::$mode == self::$default_mode){
            FISResource::addStylePool($code);
        }
    }

    public static function cssHook() {
        return self::CSS_LINKS_HOOK;
    }

    public static function cssStyleHook() {
        self::$hide_link = true;
        return self::CSS_STYLE_HOOK;
    }


    //国际化定制化link,可定制位置
    public static function cssGlobalLinkHook(){
         self::$global_link = true;
        return self::CSS_GLBAL_LINKS_HOOK;
    }

    public static function jsHook() {
        return self::JS_SCRIPT_HOOK;
    }

    static function load($str_name, $smarty, $async = false) {
        if(self::$_context['hit'] || self::$mode == self::$default_mode){
            FISResource::load($str_name, $smarty, $async);
        }
    }

    static private function _parseMode($str_mode) {
        $str_mode = strtoupper($str_mode);
        $mode = self::$mode;
        //url强迫模式
   
        switch($str_mode) {
            case 'BIGPIPE':
                $mode = self::MODE_BIGPIPE;
                break;
            case 'QUICKLING':
                $mode = self::MODE_QUICKLING;
                break;
            case 'NOSCRIPT':
                $mode = self::MODE_NOSCRIPT;
                break;
        }
       
        return $mode;
    }
    /**
     * WIDGET START
     * 解析参数，收集widget所用到的静态资源
     * @param $id
     * @param $mode
     * @param $group
     * @param $class
     * @return bool
     */
    static public function start($id, $mode = null, $group = null, $class = null, $is_rend = 1, $textarea_style=null, $fetch_widget=null) {
        $has_parent = !empty(self::$_context);
        $special_flag = false;
        if ($mode !== null) {
            $special_flag = true;
        }

        if ($mode) {
            self::$widget_mode = self::_parseMode($mode);
        } else {
            self::$widget_mode = self::$mode;
        }

        //是否渲染div
        self::$rend_div = $is_rend;
        $parent_id = $has_parent ? self::$_context['id'] : '';
        $qk_flag = self::$mode == self::MODE_QUICKLING ? '_qk_' : '';
        $id = empty($id) ? '__elm_' . $parent_id . '_' . $qk_flag . self::$_session_id ++ : $id;
        $class = empty($class) ? self::DEFAULT_TEXTAREA_CLASS : $class;
        $textarea_style = empty($textarea_style) ? self::DEFAULT_TEXTAREA_STYLE : $textarea_style;
        //widget是否命中，没有指定fetch_widget默认命中,否则默认不命中
        $hit = empty($fetch_widget) ? true : false;        


        //url强迫模式,优先级最高
        if ( self::$force_mode !== false ) {
            self::$widget_mode = self::$force_mode;
            $hit = true;
        }


        switch(self::$widget_mode) {
            case self::MODE_NOSCRIPT:
                break;
            case self::MODE_QUICKLING:
                $hit = self::$filter[$id];
            case self::MODE_BIGPIPE:
                $context = array( 'id' => $id, 'async' => false);
                //widget调用时mode='quickling'，so，打出异步加载代码
                if ($special_flag && !$hit) {
                    if (!$group) {
                    echo "<textarea class=\"$class\" style=\"$textarea_style\"><script>"
                        ."BigPipe.asyncLoad({id: \"$id\"},\"$fetch_widget\");"
                        .'</script></textarea>';
                    } else {
                        if (isset(self::$_pagelet_group[$group])) {
                            self::$_pagelet_group[$group]["ids"][] = $id;
                            self::$_pagelet_group[$group]["class"][] = $class;
                            self::$_pagelet_group[$group]["style"][] = $textarea_style;
                        } else {
                            self::$_pagelet_group[$group] = array(
                                                                "ids"=>array($id),
                                                                "class"=>array($class),
                                                                "style"=>array($textarea_style),
                                                                "url"=> $fetch_widget
                                                            );
                            echo "<!--" . $group . "-->";
                        }
                    }
                    $context['async'] = true;
                }

                $parent = self::$_context;
                if(!empty($parent)) {
                    $parent_id = $parent['id'];
                    self::$_contextMap[$parent_id] = $parent;
                    $context['parent_id'] = $parent_id;
                    if($parent['hit']) {
                        $hit = true;
                    } else if($hit && self::$mode === self::MODE_QUICKLING){
                        unset($context['parent_id']);
                    }
                }
                $context['hit'] = $hit;


                self::$_context = $context;

                if (empty($parent) && $hit) {
                    FISResource::widgetStart();
                } else if (!empty($parent) && !$parent['hit'] && $hit) {
                    FISResource::widgetStart();
                }
                //指定自动渲染div
                if( !empty(self::$rend_div) ){
                    echo '<div id="' . $id . '">';
                } 
                ob_start();
                break;
        }
        return $hit;
    }

    /**
     * WIDGET END
     * 收集html，收集静态资源
     */
    static public function end() {
        $ret = true;
        if (self::$widget_mode !== self::MODE_NOSCRIPT) {
            $html = ob_get_clean();
            $pagelet = self::$_context;
            //end
            if (isset($pagelet['parent_id'])) {
                $parent = self::$_contextMap[$pagelet['parent_id']];
                if (!$parent['hit'] && $pagelet['hit']) {
                    self::$inner_widget[self::$widget_mode][] = FISResource::widgetEnd();

                }
            } else {
                if ($pagelet['hit']) {
                    self::$inner_widget[self::$widget_mode][] = FISResource::widgetEnd();
                }
            }

            if($pagelet['hit'] && !$pagelet['async']){
                unset($pagelet['hit']);
                unset($pagelet['async']);
                $pagelet['html'] = $html;
                self::$_pagelets[] = &$pagelet;
                unset($pagelet);
            } else {
                $ret = false;
            }
            $parent_id = self::$_context['parent_id'];
            if(isset($parent_id)){
                self::$_context = self::$_contextMap[$parent_id];
                unset(self::$_contextMap[$parent_id]);
            } else {
                self::$_context = null;
            }
            self::$widget_mode = self::$mode;
            //指定渲染的位置
            if( !empty(self::$rend_div) ){
                echo '</div>';
            } else{
                self::$rend_div = true;
            }
        }
        return $ret;
    }

    /**
     * 渲染静态资源
     * @param $html
     * @param $arr
     * @param bool $clean_hook
     * @return mixed
     */
    static public function renderStatic($html, $arr, $clean_hook = false) {
        if (!empty($arr)) {
            $code = '';
            $resource_map = $arr['async'];
            $loadModJs = (FISResource::getFramework() && ($arr['js'] || $resource_map));
            if ($loadModJs) {
                foreach ($arr['js'] as $js) {
                    $code .= '<script type="text/javascript" src="' . $js . '"></script>';
                    if ($js == FISResource::getFramework()) {
                        if ($resource_map) {
                            $code .= '<script type="text/javascript">';
                            $code .= 'require.resourceMap('.json_encode($resource_map).');';
                            $code .= '</script>';
                        }
                    }
                }
            }

            if (!empty($arr['script'])) {
                $code .= '<script type="text/javascript">'. PHP_EOL;
                foreach ($arr['script'] as $inner_script) {
                    $code .= '!function(){'.$inner_script.'}();'. PHP_EOL;
                }
                $code .= '</script>';
            }

             /**************autopack getCountUrl for sending log*********************/
            $jsCode = FISAutoPack::getCountUrl($arr);
            if($jsCode != ""){
                $code .=  '<script type="text/javascript">' . $jsCode . '</script>';
            }
            /**************autopack end*********************/

            $html = str_replace(self::JS_SCRIPT_HOOK, $code . self::JS_SCRIPT_HOOK, $html);
            //收集style和link
            $code = '';
            //通过编译插件可控制inline,link的样式位置
            $linkPosition = self::$global_link ? self::CSS_GLBAL_LINKS_HOOK :  self::CSS_LINKS_HOOK;
            if (!empty($arr['style'])) {
                $code .= '<style type="text/css">';
                foreach ($arr['style'] as $inner_style) {
                    $code .= $inner_style;
                }
                $code .= '</style>';
            }
            //替换
            $html = str_replace($linkPosition, $code . $linkPosition, $html);


            //国际化定制
            if (!empty($arr['css'])) {
                $s_code = '';
                $s_code .= '<link rel="stylesheet" type="text/css" href="'
                    . implode('" /><link rel="stylesheet" type="text/css" href="', $arr['css'])
                    . '" />';
                if (self::$hide_link) {
                    $s_code = '<textarea style="display:none"  id="g_fis_css">' . $s_code . '</textarea>';
                    $html = str_replace(self::CSS_STYLE_HOOK, $s_code . self::CSS_STYLE_HOOK, $html);
                } else {
                    $html = str_replace($linkPosition, $s_code . $linkPosition, $html);
                }
            }

            
        }
        if ($clean_hook) {
            $html = str_replace(array($linkPosition, self::JS_SCRIPT_HOOK, self::CSS_STYLE_HOOK), '', $html);
        }
        return $html;
    }

    /**
     * @param $html string html页面内容
     * @return mixed
     */
    static public function insertPageletGroup($html) {
        if (empty(self::$_pagelet_group)) {
            return $html;
        }
        $search = array();
        $replace = array();
        foreach (self::$_pagelet_group as $group => $groupInfo) {
            $search[] = '<!--' . $group . '-->';
            $ids = $groupInfo['ids'];
            $class = implode( " ", array_unique( $groupInfo["class"] ) );
            $style = implode( " ", array_unique( $groupInfo["style"] ) );
            $url = $groupInfo['url'];
            $replace[] = '<textarea class="'.$class.'" style="'.$style.'"><script>BigPipe.asyncLoad([{id: "'.
                implode('"},{id:"', $ids)
            .'"}],"'.$url.'");</script></textarea>';
        }
        return str_replace($search, $replace, $html);
    }

    static public function display($html) {
        $html = self::insertPageletGroup($html);
        $pagelets = self::$_pagelets;
        $mode = self::$mode;
        $res = array(
            'js' => array(),
            'css' => array(),
            'script' => array(),
            'style' => array(),
            'async' => array(
                'res' => array(),
                'pkg' => array()
            )
        );
        //{{{
        foreach (self::$inner_widget[$mode] as $item) {
            foreach ($res as $key => $val) {
                if (isset($item[$key]) && is_array($item[$key])) {
                    if ($key != 'async') {
                        $arr = array_merge($res[$key], $item[$key]);
                        $arr = array_merge(array_unique($arr));
                    } else {
                        $arr = array(
                            'res' => array_merge($res['async']['res'], (array)$item['async']['res']),
                            'pkg' => array_merge($res['async']['pkg'], (array)$item['async']['pkg'])
                        );
                    }
                    //合并收集
                    $res[$key] = $arr;
                }
            }
        }
        //if empty, unset it!
        foreach ($res as $key => $val) {
            if (empty($val)) {
                unset($res[$key]);
            }
        }
        //}}}
        //tpl信息没有必要打到页面
        switch($mode) {
            case self::MODE_NOSCRIPT:
                //渲染widget以外静态文件
                $all_static = FISResource::getArrStaticCollection();
                $html = self::renderStatic(
                    $html,
                    $all_static,
                    true
                );
                break;
            case self::MODE_QUICKLING:
                header('Content-Type: text/plain;');
                if ($res['script']) {
                    $res['script'] = implode("\n", $res['script']);
                }
                if ($res['style']) {
                    $res['style'] = implode("\n", $res['style']);
                }
                foreach ($pagelets as &$pagelet) {
                    $pagelet['html'] = self::insertPageletGroup($pagelet['html']);
                }
                unset($pagelet);

                /*********************autopack *****************************/
                $jsCode = FISAutoPack::getCountUrl($res);
                if($jsCode != "" && !$_GET['fis_widget']){
                    $res['script'] = $res['script'] ? $res['script'] . $jsCode : $jsCode;
                }
                /*********************autopack end************************/
                
                //开放api
                if( $_GET["method"] === "jsonp" ){
                    $html = "hao123.process(".json_encode(array(
                        'title' => self::$_title,
                        'pagelets' => $pagelets,
                        'resource_map' => $res
                    )). ",'". $_GET['containerId'] ."')" ;
                //正常模式
                 } else {
                    $html = json_encode(array(
                        'title' => self::$_title,
                        'pagelets' => $pagelets,
                        'resource_map' => $res
                    ));
                 }
                break;
            case self::MODE_BIGPIPE:
                $external = FISResource::getArrStaticCollection();
                $page_script = $external['script'];
                unset($external['script']);
                $html = self::renderStatic(
                    $html,
                    $external,
                    true
                );
                $html .= "\n";
                $html .= '<script type="text/javascript">';
                $html .= 'BigPipe.onPageReady(function() {';
                $html .= implode("\n", $page_script);
                $html .= '});';
                $html .= '</script>';
                $html .= "\n";

                if ($res['script']) {
                    $res['script'] = implode("\n", $res['script']);
                }
                if ($res['style']) {
                    $res['style'] = implode("\n", $res['style']);
                }
                $html .= "\n";
                foreach($pagelets as $index => $pagelet){
                    $id = '__cnt_' . $index;
                    $html .= '<code style="display:none" id="' . $id . '"><!-- ';
                    $html .= str_replace(
                        array('\\', '-->'),
                        array('\\\\', '--\\>'),
                        self::insertPageletGroup($pagelet['html'])
                    );
                    unset($pagelet['html']);
                    $pagelet['html_id'] = $id;
                    $html .= ' --></code>';
                    $html .= "\n";
                    $html .= '<script type="text/javascript">';
                    $html .= "\n";
                    $html .= 'BigPipe.onPageletArrived(';
                    $html .= json_encode($pagelet);
                    $html .= ');';
                    $html .= "\n";
                    $html .= '</script>';
                    $html .= "\n";
                }
                $html .= '<script type="text/javascript">';
                $html .= "\n";
                $html .= 'BigPipe.register(';
                if(empty($res)){
                    $html .= '{}';
                } else {
                    $html .= json_encode($res);
                }
                $html .= ');';
                $html .= "\n";
                $html .= '</script>';
                break;
        }

        return $html;
    }

    //smarty output filter
    static function renderResponse($content, $smarty) {
        return self::display($content);
    }
}
