#!/bin/bash
#����Ӧ�ļ����Ƶ�outputĿ¼��outputĿ¼�Ľṹ�������յ���վĿ¼�ṹ 

PUBLIC_PATH=../../../../public

rm -rf output
mkdir output
mkdir output/var
cp -r *.php aclient service mis test rdtest output/
rm -rf `find output -name ".svn" `
