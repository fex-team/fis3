# FIS3

FIS3 面向**前端**的**工程构建系统**。

```
npm install -g fis3
```

### 例子

```
mkdir my-proj
cd my-proj
fis3 init
fis3 release
fis3 server start --type node
```

*fis-conf.js 的例子*

```js
// default settings. fis3 release
fis
  .media('dev')

  .match('**', {
    useHash: false
  });


// fis3 release production
fis
  .media('production')

  .match('*.js', {
    optimizer: fis.plugin('uglify-js') // 用 fis-optimizer-uglify-js 压缩 js
  })

  .match('*.{css,scss}', {
    optimizer: fis.plugin('clean-css') // 用 fis-optimizer-clean-css 压缩 css
  })

  .match('*.png', {
    optimizer: fis.plugin('png-compressor') // 用 fis-optimizer-png-compressor 压缩 png 图片
  });
```