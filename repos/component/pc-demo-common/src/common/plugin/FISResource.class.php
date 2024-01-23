<?php

class FISResource {

    const CSS_LINKS_HOOK = '<!--[FIS_CSS_LINKS_HOOK]-->';

    private static $arrMap = array();
    private static $arrLoaded = array();
    private static $arrStaticCollection = array();
    //收集require.async组件
    private static $arrRequireAsyncCollection = array();
    private static $arrScriptPool = array();

    public static $framework = null;

    public static function reset(){
        self::$arrMap = array();
        self::$arrLoaded = array();
        self::$arrStaticCollection = array();
        self::$arrScriptPool = array();
        self::$framework  = null;
    }

    public static function cssHook(){
        return self::CSS_LINKS_HOOK;
    }

    //输出模板的最后，替换css hook为css标签集合
    public static function renderResponse($strContent){
        $intPos = strpos($strContent, self::CSS_LINKS_HOOK);
        if($intPos !== false){
            $strContent = substr_replace($strContent, self::render('css'), $intPos, strlen(self::CSS_LINKS_HOOK));
        }
        self::reset();
        return $strContent;
    }

    //设置framewok mod.js
    public static function setFramework($strFramework) {
        self::$framework = $strFramework;
    }

    //返回静态资源uri，有包的时候，返回包的uri
    public static function getUri($strName, $smarty) {
        $intPos = strpos($strName, ':');
        if($intPos === false){
            $strNamespace = '__global__';
        } else {
            $strNamespace = substr($strName, 0, $intPos);
        }
        if(isset(self::$arrMap[$strNamespace]) || self::register($strNamespace, $smarty)) {
            $arrMap = &self::$arrMap[$strNamespace];
            $arrRes = &$arrMap['res'][$strName];
            if (isset($arrRes)) {
                if (isset($arrRes['pkg'])) {
                    $arrPkg = &$arrMap['pkg'][$arrRes['pkg']];
                    return $arrPkg['uri'];
                } else {
                    return $arrRes['uri'];
                }
            }
        }
    }

    public static function getTemplate($strName, $smarty) {
        //绝对路径
        return $smarty->joined_template_dir . str_replace('/template', '', self::getUri($strName, $smarty));
    }

    //渲染资源，将收集到的js css，变为html标签，异步js资源变为resorce map。
    public static function render($type){
        $html = '';
        if ($type === 'js') {
            $resourceMap = self::getResourceMap();
            $loadMoadJs = (self::$framework && (self::$arrStaticCollection['js'] || $resourceMap));
            //require.resourceMap要在mod.js加载以后执行
            if ($loadMoadJs) {
                $html .= '<script type="text/javascript" src="' . self::$framework . '"></script>' . PHP_EOL;
            }
            if ($resourceMap) {
                $html .= '<script type="text/javascript">';
                $html .= 'require.resourceMap('.$resourceMap.');';
                $html .= '</script>';
            }
            if (self::$arrStaticCollection['js']) {
                $arrURIs = &self::$arrStaticCollection['js'];
                foreach ($arrURIs as $uri) {
                    if ($uri === self::$framework) {
                        continue;
                    }
                    $html .= '<script type="text/javascript" src="' . $uri . '"></script>' . PHP_EOL;
                }
            }
        } else if($type === 'css' && self::$arrStaticCollection['css']){
            $arrURIs = &self::$arrStaticCollection['css'];
            $html = '<link rel="stylesheet" type="text/css" href="' . implode('"/><link rel="stylesheet" type="text/css" href="', $arrURIs) . '"/>';
        }

        return $html;
    }

    public static function addScriptPool($str){
        self::$arrScriptPool[] = $str;
    }

    //输出js，将页面的js源代码集合到pool，一起输出
    public static function renderScriptPool(){
        $html = '';
        if(!empty(self::$arrScriptPool)){
            $html = '<script type="text/javascript">!function(){' . implode("}();\n!function(){", self::$arrScriptPool) . '}();</script>';
        }
        return $html;
    }

    //获取异步js资源集合，变为json格式的resourcemap
    public static function getResourceMap() {
        $ret = '';
        $arrResourceMap = array();
        if (isset(self::$arrRequireAsyncCollection['res'])) {
            foreach (self::$arrRequireAsyncCollection['res'] as $id => $arrRes) {
                $deps = array();
                if (!empty($arrRes['deps'])) {
                    foreach ($arrRes['deps'] as $strName) {
                        if (preg_match('/\.js$/i', $strName)) {
                            $deps[] = $strName;
                        }
                    }
                }

                $arrResourceMap['res'][$id] = array(
                    'url' => $arrRes['uri'],
                );

                if (!empty($arrRes['pkg'])) {
                    $arrResourceMap['res'][$id]['pkg'] = $arrRes['pkg'];
                }

                if (!empty($deps)) {
                    $arrResourceMap['res'][$id]['deps'] = $deps;
                }
            }
        }
        if (isset(self::$arrRequireAsyncCollection['pkg'])) {
            foreach (self::$arrRequireAsyncCollection['pkg'] as $id => $arrRes) {
                $arrResourceMap['pkg'][$id] = array(
                    'url'=> $arrRes['uri']
                );
            }
        }
        if (!empty($arrResourceMap)) {
            $ret = str_replace('\\/', '/', json_encode($arrResourceMap));
        }
        return  $ret;
    }

    //获取命名空间的map.json
    public static function register($strNamespace, $smarty){
        if($strNamespace === '__global__'){
            $strMapName = 'map.json';
        } else {
            $strMapName = $strNamespace . '-map.json';
        }
        $arrConfigDir = $smarty->getConfigDir();
        foreach ($arrConfigDir as $strDir) {
            $strPath = preg_replace('/[\\/\\\\]+/', '/', $strDir . '/' . $strMapName);
            if(is_file($strPath)){
                $map = json_decode(file_get_contents($strPath), true);
                //读取domain.conf,对所有静态资源uri根据不同url，添加domain，方便本地调试
                $domain = self::getDomain($smarty);
                if($domain) {
                    foreach($map['res'] as $id => &$res) {
                        if($res['type'] !== 'tpl') {
                            $res['uri'] = $domain . $res['uri'];
                        }
                    }
                    foreach($map['pkg'] as $id => &$res) {
                        $res['uri'] = $domain . $res['uri'];
                    }
                }
                self::$arrMap[$strNamespace] = $map;
		        return true;
            }
        }
        return false;
    }

    /**
     * 分析组件依赖
     * @param array $arrRes  组件信息
     * @param Object $smarty  smarty对象
     * @param bool $async   是否异步
     */
    private static function loadDeps($arrRes, $smarty, $async) {
        //require.async
        if (isset($arrRes['extras']) && isset($arrRes['extras']['async'])) {
            foreach ($arrRes['extras']['async'] as $uri) {
                self::load($uri, $smarty, true);
            }
        }
        if(isset($arrRes['deps'])){
            foreach ($arrRes['deps'] as $strDep) {
                self::load($strDep, $smarty, $async);
            }
        }
    }

    /**
     * 已经分析到的组件在后续被同步使用时在异步组里删除。
     * @param $strName
     */
    private static function delAsyncDeps($strName) {
        $arrRes = self::$arrRequireAsyncCollection['res'][$strName];
        if ($arrRes['pkg']) {
            $arrPkg = &self::$arrRequireAsyncCollection['pkg'][$arrRes['pkg']];
            if ($arrPkg) {
                self::$arrStaticCollection['js'][] = $arrPkg['uri'];
                unset(self::$arrRequireAsyncCollection['pkg'][$arrRes['pkg']]);
                foreach ($arrPkg['has'] as $strHas) {
                    if (isset(self::$arrRequireAsyncCollection['res'][$strHas])) {
                        self::delAsyncDeps($strHas);
                    }
                }
            }
        } else {
            //已经分析过的并且在其他文件里同步加载的组件，重新收集在同步输出组
            self::$arrStaticCollection['js'][] = self::$arrRequireAsyncCollection['res'][$strName]['uri'];
            unset(self::$arrRequireAsyncCollection['res'][$strName]);
        }
        if ($arrRes['deps']) {
            foreach ($arrRes['deps'] as $strDep) {
                if (isset(self::$arrRequireAsyncCollection['res'][$strDep])) {
                    self::delAsyncDeps($strDep);
                }
            }
        }
    }

    /**
     * 加载组件以及组件依赖
     * @param $strName      id
     * @param $smarty       smarty对象
     * @param bool $async   是否为异步组件（only JS）
     * @return mixed
     */
    public static function load($strName, $smarty, $async = false){
        if(isset(self::$arrLoaded[$strName])) {
            //同步组件优先级比异步组件高
            if (!$async && isset(self::$arrRequireAsyncCollection['res'][$strName])) {
                self::delAsyncDeps($strName);
            }
            return self::$arrLoaded[$strName];
        } else {
            $intPos = strpos($strName, ':');
            if($intPos === false){
                $strNamespace = '__global__';
            } else {
                $strNamespace = substr($strName, 0, $intPos);
            }
            if(isset(self::$arrMap[$strNamespace]) || self::register($strNamespace, $smarty)){
                $arrMap = &self::$arrMap[$strNamespace];
                $arrRes = &$arrMap['res'][$strName];
                $arrPkg = null;
                $arrPkgHas = array();
                if(isset($arrRes)) {
                    if(isset($arrRes['pkg'])){
                        $arrPkg = &$arrMap['pkg'][$arrRes['pkg']];
                        $strURI = $arrPkg['uri'];
                        foreach ($arrPkg['has'] as $strResId) {
                            self::$arrLoaded[$strResId] = $strURI;
                        }
                        foreach ($arrPkg['has'] as $strResId) {
                            $arrHasRes = &$arrMap['res'][$strResId];
                            if ($arrHasRes) {
                                $arrPkgHas[$strResId] = $arrHasRes;
                                self::loadDeps($arrHasRes, $smarty, $async);
                            }
                        }
                    } else {
                        $strURI = $arrRes['uri'];
                        self::$arrLoaded[$strName] = $strURI;
                        self::loadDeps($arrRes, $smarty, $async);
                    }

                    if ($async && $arrRes['type'] === 'js') {
                        if ($arrPkg) {
                            self::$arrRequireAsyncCollection['pkg'][$arrRes['pkg']] = $arrPkg;
                            self::$arrRequireAsyncCollection['res'] = array_merge(self::$arrRequireAsyncCollection['res'], $arrPkgHas);
                        } else {
                            self::$arrRequireAsyncCollection['res'][$strName] = $arrRes;
                        }
                    } else {
                        self::$arrStaticCollection[$arrRes['type']][] = $strURI;
                    }
                    return $strURI;
                } else {
                    self::triggerError($strName, 'undefined resource "' . $strName . '"', E_USER_NOTICE);
                }
            } else {
                self::triggerError($strName, 'missing map file of "' . $strNamespace . '"', E_USER_NOTICE);
            }
        }
        self::triggerError($strName, 'unknown resource load error', E_USER_NOTICE);
    }

    /**
     * 用户代码自定义js组件，其没有对应的文件
     * 只有有后缀的组件找不到时进行报错
     * @param $strName       组件ID
     * @param $strMessage    错误信息
     * @param $errorLevel    错误level
     */
    private static function triggerError($strName, $strMessage, $errorLevel) {
        $arrExt = array(
            'js',
            'css',
            'tpl',
            'html',
            'xhtml',
        );
        if (preg_match('/\.('.implode('|', $arrExt).')$/', $strName)) {
            trigger_error(date('Y-m-d H:i:s') . '   ' . $strMessage, $errorLevel);
        }
    }
   /**
     * 从domain.conf文件获得domain设置
     * 返回url(http://xxxx?domain=online)中请求的online的domain值
     */
    public static function getDomain($smarty) {
        $domainFile = 'domain.conf';
        $domainKey = $_GET['domain'] ? $_GET['domain'] : 'online';
        $configDirs = $smarty->getConfigDir();
        foreach($configDirs as $strDir) {
            $strDir = preg_replace('/[\\/\\\\]+/', '/', $strDir . '/' . $domainFile);
            if(is_file($strDir)) {
                $smarty->configLoad($domainFile);
                $domains = $smarty->getConfigVars();
                break;
            }
        }
        $domainValue = $domains[$domainKey] ? $domains[$domainKey] : null;
        return $domainValue;
    }
}
