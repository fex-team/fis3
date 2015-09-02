find test/data -name data.php | xargs perl -pi -e "s|'tplDir' => 'page/lv2/|'tplDir' => 'lv2/page/|g"
find test/data -name data.php | xargs perl -pi -e "s|'tplDir' => 'page/home/|'tplDir' => 'home/page/|g"


