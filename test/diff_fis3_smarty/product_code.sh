#!/usr/bin/env bash

TEST_PATH=/home/work/repos/fis3.0/test/diff_fis3_smarty
#TEST_PATH=/Users/ryan/workspace/fis-plus/test/util/diff
cd ${TEST_PATH}

#PLACE_SVN=https://svn.baidu.com/app/search/lbs-webapp/trunk/pcmap/place
#PLACE_DIR=./product_code/place

#BATMAN_SVN=https://svn.baidu.com/app/search/lbs-webapp/trunk/mmap/batman
#BATMAN_DIR=./product_code/batman

#WENKU_SVN=https://svn.baidu.com/app/search/wenku/branches/fe/bookeditor/wenku_1001-0-253_BRANCH
#WENKU_DIR=./product_code/wenku

TIEBA_SVN=https://svn.baidu.com/inf/odp/trunk/orp/cmodule/fe
TIEBA_DIR=./product_code/tieba

#HAO123_SVN=https://svn.baidu.com/app/global/hao123/trunk/fe
#HAO123_DIR=./product_code/hao123

img_SVN=https://svn.baidu.com/app/search/image/tags/fe/fis2-template/wisepadnew/wisepadnew_1-0-4-0_PD_BL/
img_DIR=./product_code/image

#svn co --username=$1 --password=$2 --no-auth-cache ${PLACE_SVN} ${PLACE_DIR}
#svn co --username=$1 --password=$2 --no-auth-cache ${BATMAN_SVN} ${BATMAN_DIR}
#svn co --username=$1 --password=$2 --no-auth-cache ${WENKU_SVN} ${WENKU_DIR}
#svn co --username=$1 --password=$2 --no-auth-cache ${TIEBA_SVN} ${TIEBA_DIR}
svn co --username=$1 --password=$2 --no-auth-cache ${TIEBA_SVN}/orcp-common ${TIEBA_DIR}/orcp-common
svn co --username=$1 --password=$2 --no-auth-cache ${TIEBA_SVN}/orcp-admin ${TIEBA_DIR}/orcp-admin
svn co --username=$1 --password=$2 --no-auth-cache ${TIEBA_SVN}/orcp-online ${TIEBA_DIR}/orcp-online
svn co --username=$1 --password=$2 --no-auth-cache ${TIEBA_SVN}/orcp-machine ${TIEBA_DIR}/orcp-machine
svn co --username=$1 --password=$2 --no-auth-cache ${img_SVN} ${img_DIR}
