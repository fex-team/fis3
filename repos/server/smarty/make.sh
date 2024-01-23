#!/bin/bash
echo -n "smarty version: "
version=$1
filename=Smarty-${version}
tar=${filename}.tar.gz
rm -rf ${filename}*
wget http://www.smarty.net/files/$tar
tar -zxvf $tar
cd ${filename}
mkdir tmp
mv libs tmp/smarty
cd tmp
tar cvf ../../${version}.tar .
cd ..
cd ..
rm -rf ${filename}*
