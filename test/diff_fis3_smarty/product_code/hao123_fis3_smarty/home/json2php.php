<?php

$ns = $argv[1];

if (!$ns) {
    return;
}

$root = dirname(__FILE__) . '/output/config/';

$map_path =  $root . $ns . '-map';

$maps = glob($map_path."*.json");

if($maps !== false){
    for($i = 0 , $len = count($maps) ; $i < $len ; $i++){
        $jsonFile = $maps[$i];
        if (is_file($jsonFile)) {
            file_put_contents(
                str_replace(".json" , ".php" , $jsonFile),
                '<?php return '.
                    var_export(
                        json_decode(file_get_contents($jsonFile), true),
                        true
                    ) .
                '; ?>'
            );
        }
    }
}else{

}
