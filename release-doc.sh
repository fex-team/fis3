git checkout master
rev="fex-team/fis3@$(git log --pretty=format:'%h' -n 1)"

## 生成 API 文档
npm run jsdoc

## 编译官网
cd ./doc && npm install && node ../bin/fis.js release prod -d ./output

## 进入 output 提交编译产出到 gh-pages 分支下
cd ./output && git init && git remote add origin https://github.com/fex-team/fis3.git

git config --global user.email "fansekey@gmail.com"
git config --global user.name "xiangshouding"
git config credential.helper "store --file=.git/credential"
echo "https://${GH_TOKEN}:@github.com" > .git/credential

git push origin :gh-pages
git add *
git commit -am "build from ${rev}"

git branch gh-pages
git checkout gh-pages

git push -f origin gh-pages

cd ../../

# 删掉产出的 output 目录，为了方便本地跑脚本
rm -rf ./doc/output

git checkout master