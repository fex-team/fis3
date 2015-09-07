#!/usr/bin/env bash

TEST_PATH=/home/work/repos/fis3.0/test/diff_fis3_smarty
#TEST_PATH=/Users/ryan/workspace/fis-plus/test/util/diff


FISP_PATH=/home/work/repos/fis3.0/
#FISP_PATH=/Users/ryan/workspace/fis-plus/

cd ${TEST_PATH}
WENKU_CODE_PATH=${TEST_PATH}/product_code/wenku_svn_fis3_smarty
WENKU_OUTPUT_PATH=${TEST_PATH}/product_output/wenku_svn_fis3_smarty

IMAGE_CODE_PATH=${TEST_PATH}/product_code/image
IMAGE_OUTPUT_PATH=${TEST_PATH}/product_output/image

TIEBA_CODE_PATH=${TEST_PATH}/product_code/tieba
TIEBA_OUTPUT_PATH=${TEST_PATH}/product_output/tieba
TIEBA_MODULES=(orcp-common orcp-admin orcp-online orcp-machine)

#PLACE_CODE_PATH=${TEST_PATH}/product_code/place
#PLACE_OUTPUT_PATH=${TEST_PATH}/product_output/place
#PLACE_MODULES=(admin beauty cater common detail hotel movie scope)

HAO123_CODE_PATH=${TEST_PATH}/product_code/hao123_fis3_smarty
HAO123_OUTPUT_PATH=${TEST_PATH}/product_output/hao123_fis3_smarty
#HAO123_MODULES=(common home lv2)
HAO123_MODULES=(common lv2)

#SUPERMAN_CODE_PATH=${TEST_PATH}/product_code/superman
#SUPERMAN_OUTPUT_PATH=${TEST_PATH}/product_output/superman
#SUPERMAN_MODULES=(transit place common index addr feedback drive walk third taxi user)

#获取fis version
if [ $1 = 'new' ]
then
	version=$(node ${FISP_PATH}/bin/fis -v --no-color)
else
	version=$(node /home/work/bin/fis3 -v --no-color)
fi

OLD_IFS="$IFS"
IFS=" "
arr=($version)
IFS="$OLD_IFS"
v=${arr[1]}

# 执行release
if [ $1 = 'new' ]
then
	#wenku
	rm -rf ${WENKU_OUTPUT_PATH}/output_o_new
	cd ${WENKU_CODE_PATH}
	node ${FISP_PATH}/bin/fis release -f ${WENKU_CODE_PATH}/fis-conf2.js -cd ${WENKU_OUTPUT_PATH}/output_o_new --no-color
	echo $version > ${WENKU_OUTPUT_PATH}/output_o_new/fis_version.txt
    chmod 777 ${WENKU_OUTPUT_PATH}

	#image
	rm -rf ${IMAGE_OUTPUT_PATH}/output_o_new
	cd ${IMAGE_CODE_PATH}
	node ${FISP_PATH}/bin/fis release -cd ${IMAGE_OUTPUT_PATH}/output_o_new --no-color
	echo $version > ${IMAGE_OUTPUT_PATH}/output_o_new/fis_version.txt
    chmod 777 ${IMAGE_OUTPUT_PATH}

	#tieba
	rm -rf ${TIEBA_OUTPUT_PATH}/output_o_new
	for module in ${TIEBA_MODULES[@]}
	do
	    cd ${TIEBA_CODE_PATH}/$module
	    node ${FISP_PATH}/bin/fis release prod -cd ${TIEBA_OUTPUT_PATH}/output_o_new --no-color
	done
	echo $version > ${TIEBA_OUTPUT_PATH}/output_o_new/fis_version.txt
    chmod 777 ${TIEBA_OUTPUT_PATH}

	#place
	rm -rf ${PLACE_OUTPUT_PATH}/output_o_new
#	for module in ${PLACE_MODULES[@]}
#	do
#	    cd ${PLACE_CODE_PATH}/$module
#	    node ${FISP_PATH}/bin/fis-plus release -copd ${PLACE_OUTPUT_PATH}/output_o_new --no-color
#	done
#	echo $v > ${PLACE_OUTPUT_PATH}/output_o_new/fis_version.txt
#    chmod 777 ${PLACE_OUTPUT_PATH}

    #hao123
    rm -rf ${HAO123_OUTPUT_PATH}/output_o_new
    for module in ${HAO123_MODULES[@]}
    do
        echo "cd ${HAO123_CODE_PATH}/$module"
        cd ${HAO123_CODE_PATH}/$module

        echo "node ${FISP_PATH}/bin/fis release -f ${HAO123_CODE_PATH}/$module/fis-conf2.js -d ${HAO123_OUTPUT_PATH}/output_o_new --no-color"
        node ${FISP_PATH}/bin/fis release -f ${HAO123_CODE_PATH}/$module/fis-conf2.js  -d ${HAO123_OUTPUT_PATH}/output_o_new --no-color

    done
    echo $version > ${HAO123_OUTPUT_PATH}/output_o_new/fis_version.txt
    chmod 777 ${HAO123_OUTPUT_PATH}

    #superman
    rm -rf ${SUPERMAN_OUTPUT_PATH}/output_o_new
#    for module in ${SUPERMAN_MODULES[@]}
#    do
#        cd ${SUPERMAN_CODE_PATH}/$module
#        node ${FISP_PATH}/bin/fis-plus release -copd ${SUPERMAN_OUTPUT_PATH}/output_o_new --no-color
#    done
#    echo $v > ${SUPERMAN_OUTPUT_PATH}/output_o_new/fis_version.txt
#    chmod 777 ${SUPERMAN_OUTPUT_PATH}
else
	#wenku
	rm -rf ${WENKU_OUTPUT_PATH}/output_o_old
	cd ${WENKU_CODE_PATH}
#	fis3 release -cd ${WENKU_OUTPUT_PATH}/output_o_old --no-color
	/home/work/bin/fis3 release -f ${WENKU_CODE_PATH}/fis-conf2.js -cd ${WENKU_OUTPUT_PATH}/output_o_old --no-color
	echo $version > ${WENKU_OUTPUT_PATH}/output_o_old/fis_version.txt
    chmod 777 -R ${WENKU_OUTPUT_PATH}/output_o_old

	#image
	rm -rf ${IMAGE_OUTPUT_PATH}/output_o_old
	cd ${IMAGE_CODE_PATH}
	/home/work/bin/fis3 release -d ${IMAGE_OUTPUT_PATH}/output_o_old --no-color
	echo $version > ${IMAGE_OUTPUT_PATH}/output_o_old/fis_version.txt
    chmod 777 -R ${IMAGE_OUTPUT_PATH}/output_o_old

    #tieba
	rm -rf ${TIEBA_OUTPUT_PATH}/output_o_old
	for module in ${TIEBA_MODULES[@]}
	do
		cd ${TIEBA_CODE_PATH}/$module
		node /home/work/bin/fis3 release prod -cd ${TIEBA_OUTPUT_PATH}/output_o_old --no-color
	done
	echo $version > ${TIEBA_OUTPUT_PATH}/output_o_old/fis_version.txt
    chmod 777 -R ${TIEBA_OUTPUT_PATH}/output_o_old

	#place
	rm -rf ${PLACE_OUTPUT_PATH}/output_o_old
#	for module in ${PLACE_MODULES[@]}
#	do
#		cd ${PLACE_CODE_PATH}/$module
#		fisp release -copd ${PLACE_OUTPUT_PATH}/output_o_old --no-color
#	done
#	echo $v > ${PLACE_OUTPUT_PATH}/output_o_old/fis_version.txt
#    chmod 777 -R ${PLACE_OUTPUT_PATH}/output_o_old

    #hao123
    rm -rf ${HAO123_OUTPUT_PATH}/output_o_old
    for module in ${HAO123_MODULES[@]}
    do
        cd ${HAO123_CODE_PATH}/$module
        node /home/work/bin/fis3 release -f ${HAO123_CODE_PATH}/$module/fis-conf2.js -d ${HAO123_OUTPUT_PATH}/output_o_old --no-color
    done
    echo $version > ${HAO123_OUTPUT_PATH}/output_o_old/fis_version.txt
    chmod 777 -R ${HAO123_OUTPUT_PATH}/output_o_old

    #superman
    rm -rf ${SUPERMAN_OUTPUT_PATH}/output_o_old
#    for module in ${SUPERMAN_MODULES[@]}
#    do
#        cd ${SUPERMAN_CODE_PATH}/$module
#        fisp release -copd ${SUPERMAN_OUTPUT_PATH}/output_o_old --no-color
#    done
#    echo $v > ${SUPERMAN_OUTPUT_PATH}/output_o_old/fis_version.txt
#    chmod 777 -R ${SUPERMAN_OUTPUT_PATH}/output_o_old
fi
