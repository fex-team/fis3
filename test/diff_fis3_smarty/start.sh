#!/usr/bin/env bash

TEST_PATH=/home/work/repos/fis3.0/test/diff_fis3_smarty
#TEST_PATH=/Users/ryan/workspace/fis-plus/test/util/diff
cd  ${TEST_PATH}
if [ -f "result"$4"/report.xml" ]
then
   rm "result"$4"/report.xml"
   rm "result"$4"/*.html"
fi
sh product_code.sh $1 $2     #拉取代码form svn
sh new_fis_ready.sh $4       #安装新的fis版本
chmod +x old_fis_scp.sh
#./old_fis_scp.sh $3
#diff不同版本的smarty
#npm install fis3-smarty@1.1.2 --registry https://registry.npm.taobao.org
chmod +x old_fis_ready.sh
./old_fis_ready.sh $3 $4
rm -rf result$4/*.html
sleep 2s
php -f diffall.class.php $4
