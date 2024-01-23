<?php

ini_set('date.timezone', 'Asia/Chongqing');

define('WWW_ROOT', dirname(__FILE__));

require(WWW_ROOT . '/smarty/Smarty.class.php');
require(WWW_ROOT . '/php-simulation-env/log/Log.class.php');
require(WWW_ROOT . '/php-simulation-env/util/Util.class.php');
require(WWW_ROOT . '/php-simulation-env/mock-data/Mock.class.php');
require(WWW_ROOT . '/php-simulation-env/rewrite/Rewrite.class.php');


function initSmarty($config) {

    $smarty = new Smarty();

    $smarty->setTemplateDir($config['smarty']['template_dir']);
    $smarty->setConfigDir($config['smarty']['config_dir']);
    $smarty->setLeftDelimiter($config['smarty']['left_delimiter']);
    $smarty->setRightDelimiter($config['smarty']['right_delimiter']);

    foreach($config['smarty']['plugins_dir'] as $pluginDir) {
        $smarty->addPluginsDir($pluginDir);
    }

    return $smarty;
}

class TplRewirteHandle implements RewriteHandle {
    private $_smarty = null;
    private $_charset = 'utf-8';

    public function __construct($smarty, $charset) {
        $this->_smarty = $smarty;
        $this->_charset = $charset;
    }

    public function process($file) {
        $file = str_replace(WWW_ROOT . '/template/', '', $file); // rewrite ...
        $file = str_replace('template/', '', $file); // template ...
        header('Content-Type: text/html;charset=' . $this->_charset);
        $this->_smarty->assign(Mock::getData($file));
        $this->_smarty->display($file);
    }
}

class JsonRewriteHandle implements RewriteHandle {
    private $_charset = null;

    public function __construct($charset) {
        $this->_charset = $charset;
    }

    public function process($file) {

        Log::getLogger()->info('JsonRewriteHandle file: %s', $file);

        if (!file_exists($file)) {
            Log::getLogger()->warn('JSON file<%s> not exists.', $file);
            return;
        }

        $content = file_get_contents($file);

        if (($this->_charset != 'utf-8' || $this->_charset != 'utf8') && Util::isUtf8($content)) {
            Log::getLogger()->info('JsonRewriteHandle convert utf-8 to %s', $this->_charset);
            $content = Util::convertEncoding($content, 'utf-8', $this->_charset);
        }

        Log::getLogger()->info('JsonRewriteHandle put the content of JSON file: %s, charset: %s', $file, $this->_charset);
        
        header('Content-Type: text/json; charset='.$this->_charset);
        echo $content;
    }
}

function init($config, $smarty) {
    // log init
    Log::getLogger(array(
        'fd' => WWW_ROOT . '/app.log',
        'level' => Log::ALL,
        'requestUrl' => $_SERVER['REQUEST_URI']
    ));

    // mock init
    Mock::init(WWW_ROOT, $config['encoding']);

    // rewrite init
    $rewrite = new Rewrite(WWW_ROOT . '/server-conf', $config['encoding']);
    $rewrite->addRule(Rule::REWRITE, '@/static/.*@', '$&');
    $rewrite->addRule(Rule::REWRITE, '@/favicon.ico$@', 'static/favicon.ico');

    foreach(glob(WWW_ROOT . '/server-conf/**') as $configFile) {
        $configFile = basename($configFile);
        $rewrite->addConfigFile($configFile);
    }

    $rewrite->addRule(Rule::REWRITE, '@^/?$@', 'welcome.php');

    $rewrite->addRewriteHandle('tpl', new TplRewirteHandle($smarty, $config['encoding']));
    $rewrite->addRewriteHandle('json', new JsonRewriteHandle($config['encoding']));

    $rewrite->dispatch();
}

function getConfig($uriSplit) {
    $config = array(
        'namespace' => $uriSplit[0],
        'encoding' => 'utf-8',
        'smarty' => array(
            'left_delimiter' => '{%',
            'right_delimiter' => '%}',
            'template_dir' => './template',
            'plugins_dir' => array(
                './plugin'
            ),
            'config_dir' => './config'
        ) 
    );

    $smartyConfigFile = realpath(WWW_ROOT . '/smarty.conf');
    if ($smartyConfigFile) {
        $smartyConfig = parse_ini_file($smartyConfigFile);
        if (isset($smartyConfig['encoding'])) {
            //ugly, .... @TODO
            $config['encoding'] = $smartyConfig['encoding'];
            unset($smartyConfig['encoding']);
        }
        $config['smarty'] = array_merge($config['smarty'], (array) $smartyConfig);
    }

    return $config;
}

function routing() {
    $requestUri = $_SERVER['REQUEST_URI'];
    $requestUri = preg_replace('@\?.*$@', '', $requestUri);
    $requestUri = substr($requestUri, 1);
    $uriSplit = explode('/', $requestUri);

    $config = getConfig($uriSplit);

    $smarty = initSmarty($config);
    
    init($config, $smarty);

    $tpl = $requestUri . '.tpl';
    header('Content-Type: text/html;charset=' . $config['encoding']);
    $smarty->assign((array)Mock::getData($tpl));
    $smarty->display($tpl);
}

routing();
