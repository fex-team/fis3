git checkout master
cd ./doc && npm install && node ../bin/fis.js release prod -d ./output
cd ./output && git init && git remote add origin https://github.com/fex-team/fis3.git

git config --global user.email "fansekey@gmail.com"
git config --global user.name "xiangshouding"
git config credential.helper "store --file=.git/credential"
echo "https://${GH_TOKEN}:@github.com" > .git/credential

git push origin :gh-pages
git add *
git commit -am "build fex-team/fis3@$(git log --pretty=format:'%h' -n 1)"

git branch gh-pages
git checkout gh-pages

git push -f origin gh-pages
cd ../../
rm -rf ./doc/output
git checkout master