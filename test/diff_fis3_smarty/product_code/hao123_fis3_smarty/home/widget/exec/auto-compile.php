<?php
/**
 * fe-fetch.php
 * @discribe to fetch templates files, execute to update compile files
 * @author LvChengbin
 */

/**
 * 功能描述
 * 1. 备份compile数据
 * 2. 生成新的compile数据
 * 3. 根据路径清理对应模板的cache
 * 4. 回滚方案（将备份的compile数据覆盖到相应目录）
 */

if(!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR); 
}

/**
 * define directory with fe-fetch.php
 */
define('SCRIPT_DIR', dirname(__FILE__) . DS);
define('WEBROOT_DIR', SCRIPT_DIR."../webroot" . DS );

/**
 * define backup directory
 */
define('TEMPLATE_PATH', WEBROOT_DIR  .'templates' . DS);
define('TEMPLATE_COMPLITE_PATH', WEBROOT_DIR  . 'templates_c' . DS);

//临时模板目录
define('TEMPLATE_COMPLITE_TMP_PATH', $argv[1]);


define('SMARTY_V3_PATH', SCRIPT_DIR . "../lib/smarty" . DS);

define('SMARTY_PLUGINS_DIR', SMARTY_V3_PATH . 'plugins' . DS);

define('SMARTY_V3_SYSPLUGIN', SMARTY_V3_PATH . "sysplugins" . DS);




//模板的临时目录
if(!is_dir(TEMPLATE_COMPLITE_TMP_PATH)) {
    shell_exec('mkdir -p ' . TEMPLATE_COMPLITE_TMP_PATH);
}


if(!is_dir(TEMPLATE_COMPLITE_PATH)) {
    shell_exec('mkdir -p ' . TEMPLATE_COMPLITE_PATH);
}

/**
 * autoload for smarty system plugins
 */
function __autoload($classname) {
    include SMARTY_V3_SYSPLUGIN . strtolower($classname) . '.php';
}

/**
 * load template configuration file(template.conf.php)
 */
/*if(file_exists($conf)) {
    echo "\nInclude $conf\n";
    include $conf;
} else {
    echo "\nError : Cannot find file $conf\n";
    exit;
}*/

/*if(!defined('LOCAL_ENV')) {
    echo "\nError : Undefined LOCAL_ENV\n";
    exit;
}*/


include SMARTY_V3_PATH . 'Smarty.class.php';

$smarty = new Smarty();
$smarty->left_delimiter = '<%';
$smarty->right_delimiter = '%>';
$smarty->setTemplateDir(TEMPLATE_PATH)
            ->setCompileDir(TEMPLATE_COMPLITE_TMP_PATH)
            ->setPluginsDir(SMARTY_PLUGINS_DIR)
            ->setConfigDir(array(
                                    "old" => TEMPLATE_PATH,
                                    "newFis" => TEMPLATE_PATH."config"
                                )
                          );
$smarty->caching = false;


$smarty->force_compile = true;
/*if( !empty($argv[1]) ) {
    if( strtolower($argv[1]) === 'pad' ) {
        $compileDir = SMARTY_V3_PAD_COMPILE_DIR;
        $smarty->addConfigDir(SMARTY_V3_PAD_CONFIG_DIR);
        $fetchType = 'pad';
    } else if( strtolower($argv[1]) === 'rollback') {
        // 如果是回滚，覆盖备份文件回compile目录
        if( is_dir(O_BACKUP_DIR . 'pc') )
        shell_exec();
    } else {
        if( file_exists($argv[1]) ) {
            $smarty->setCompileDir(SMARTY_V3_COMPILE_DIR);
            $smarty->clearCompiledTemplate($argv[1]);
            echo 'success to clear cache of template ', $argv[1];
            exit;
        }
        exit;
    }
} else {
    $compileDir = SMARTY_V3_COMPILE_DIR;
    $fetchType = 'pc';
}*/

/**
 * set left & reight delimiters
 */
/*$smarty->left_delimiter = '<%';
$smarty->right_delimiter = '%>';*/

/**
 * @return list of tpl files in page|widget|pad directories
 */
function get_template($dir, $deepth = 1){
    $result = array();

    if (is_dir($dir)) {
        $files = scandir($dir);

        foreach( $files as $file ) {
            if(preg_match('#^\..*#', $file)) continue;

            if(($deepth === 1 && preg_match('#page|widget|pad|home|common$#', $file)) || $deepth !== 1) {
                $fname = rtrim($dir, DS) . DS . $file;
                if(is_dir($fname)) {
                    $result = array_merge($result, get_template($fname, $deepth + 1));
                } else if($deepth !== 1) {
                    if(!preg_match('#\.tpl$#', $file)) continue;
                    $result[] = $fname;
                }
            }
        }
    } else {
        $result[] = $dir;
    }
    return $result;
} 

function fetch($smarty, $tplfiles) {
    foreach($tplfiles as $tpl) {
        echo "Fetching : $tpl\n";
        $sysInfo = array(
            "country"=>"br"
        );
        $root = array(
            'head' => array(
               "dir"=>"ltr"
            )
        );

        $smarty->assign('sysInfo',$sysInfo);
        $smarty->assign('body', array( "lottery" => array('displayType'=>"vn")));
        $smarty->assign('head', array( "dir" => "ltr"));
        $smarty->assign('root',$root);
        $smarty->fetch($tpl);
    
    }
}




$tplfiles = get_template(TEMPLATE_PATH);
/**
 * fetch pc templates
 */
echo "--------------------Start to fetch $fetchType templates--------------------\n";
try{
    //编译模板文件，生成到临时目录中
    fetch($smarty, $tplfiles);
    //拷贝模板到正式目录
    shell_exec("cp -r ". TEMPLATE_COMPLITE_TMP_PATH ."/* ".TEMPLATE_COMPLITE_PATH);
} catch( Exception $e ){
    print $e->getMessage();
    exit;
}

echo "--------------------end to fetch $fetchType templates--------------------\n";
/*echo "Moving files to $compileDir directory\n";
echo shell_exec(implode(' ', array('mv', O_TMP_COMPILE_DIR . '*', $compileDir)));

if(is_dir(O_TMP_COMPILE_DIR)) {
    echo shell_exec('rm -rf ' . O_TMP_COMPILE_DIR);
}
*/
exit;
