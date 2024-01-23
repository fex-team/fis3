#!/bin/bash
#把相应文件复制到output目录，output目录的结构就是最终的网站目录结构 

PUBLIC_PATH=../../../../public

rm -rf output
mkdir output
mkdir output/var
cp -r *.php aclient service mis test rdtest output/
rm -rf `find output -name ".svn" `
