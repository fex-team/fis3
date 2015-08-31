#!/usr/bin/env bash
export PATH=/home/fis/npm/bin:$PATH
fisp -v --no-color
fisp release -ompuDcd ./output --no-color
#fisp release -ompuDd remote
rm -rf ./output/data
mkdir ./output/webroot
mv ./output/static ./output/webroot/static

