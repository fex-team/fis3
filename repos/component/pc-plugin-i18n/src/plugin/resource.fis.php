<?php
/**
 * fis resource: 添加fis资源类型，接管页面渲染。 
 *      1. 提供tpl页面资源定位
 *      2. 使用方式$smarty->display(fis:<id>); eg: $smarty->display("fis:ns:page/index.tpl")
 */

require_once 'FIS.init.php';

class Smarty_Resource_Fis extends Smarty_Resource_Custom {

    protected function fetch($name, &$source, &$mtime)
    {
        $source = file_get_contents($name);
        $mtime = filemtime($name);
    } 
    /**
     * populate Source Object with meta data from Resource
     *
     * @param Smarty_Template_Source   $source    source object
     * @param Smarty_Internal_Template $_template template object
     */
    public function populate(Smarty_Template_Source $source, Smarty_Internal_Template $_template=null)
    {

        $namespace = '__global__';
        $id = $source->name;
        $subpath = $id;
        if (($pos = strpos($id, ':')) != false) {
            $namespace = substr($id, 0, $pos);
            $subpath = substr($id, $pos + 1); 
        }

        $this->initializeFIS($namespace, $source->smarty);

        $uri = FISResource::getUri($id, $source->smarty);

        if (!$uri) {
            trigger_error('undefined resource "fis:' . $source->name . '"' , E_USER_ERROR);
        }

        //@TODO 后续修改fisp的配置文件去掉/template/
        $uri = str_replace('/template/', '', $uri);
        $template_dir = $source->smarty->joined_template_dir;

        $name = 'file://' . $template_dir . $uri;
        
        $source->name = $name;

        $source->filepath = strtolower($name);
        $source->uid = sha1($name);
        $mtime = $this->fetchTimestamp($subpath);
        if ($mtime !== null) {
            $source->timestamp = $mtime;
        } else {
            $this->fetch($name, $content, $timestamp);
            $source->timestamp = isset($timestamp) ? $timestamp : false;
            if( isset($content) )
                $source->content = $content;
        }
        $source->exists = !!$source->timestamp;
    }

    public function initializeFIS($namespace, $smarty) {
        $modules = array(
            $namespace
        );

        if (isset($fis_config['common_module_namespace'])) {
            $modules = array_merge($modules, explode(',', $fis_config['common_module_namespace']));
        };
        //default i18n_val == 'i18n'
        $i18n_val = isset($fis_config['i18n_variable']) ? $fis_config['i18n_variable'] : 'i18n';

        //init i18n
        FISTranslate::init(
            $smarty->tpl_vars[$i18n_val]->value
            , $modules
            , $smarty->getConfigDir()
        );

        //init resource api
        FISResource::register($namespace, $smarty);
    }
}