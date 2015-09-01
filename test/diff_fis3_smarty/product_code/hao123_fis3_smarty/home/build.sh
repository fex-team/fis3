#!/bin/bash

MOD_NAME="home"
TAR="$MOD_NAME.tar.gz"

# add path
export PATH=/home/fis/npm/bin:$PATH
#show fis-pc version
fis-pc --version --no-color

#通过fis-pc release 命令进行模块编译 开启optimize、md5、打包功能，同时需开启-u 独立缓存编译方式，产出到同目录下output中
fis-pc release -cuompd output

php ./json2php.php $MOD_NAME
#进入output目录
cd output
#删除产出的test目录
rm -rf test

#整理output目录
mkdir webroot
mkdir views
rm json2php.php
mv static/ webroot/static
mv template/ views/templates
mv config/ views/templates/config

#将output目录进行打包
tar zcf $TAR ./*
mv $TAR ../

cd ..
rm -rf output

mkdir output

mv $TAR output/

echo "build end"