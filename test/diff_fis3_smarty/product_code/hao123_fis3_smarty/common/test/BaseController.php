<?php
	class DefaultController extends adapterUi{
		function index(){
			$tplDir = $this->cmsdata['head']['tplDir'];
			header("Content-type:text/html;charset=UTF-8");
			if( !empty( $this->cmsdata['head']['forceCompile'] ) ){
    			$smarty->force_compile = true;
			}
			$this->smarty->display($tplDir);
		}
	}

	$controller = new DefaultController();
	$controller->index();



/*$sysData['templateRoot'] = $smarty->getTemplateDir(0)."/";
if(isset($_GET['debug'])){
    if($_GET['debug'] == 'on'){
        $smarty->debugging = true;
    }
}*/
/*if( !empty( $rootData['head']['forceCompile'] ) ){
    $smarty->force_compile = true;
}
$smarty->assign('root',$rootData);
$smarty->assign('sysInfo',$sysData);

$smarty->display($tplDir);*/



?>