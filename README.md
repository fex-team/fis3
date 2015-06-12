![](https://raw.githubusercontent.com/fex-team/fis3/dev2/doc/logo.png?token=AAmhm2K2RcHJIrIrvPWkf42FBo3nC5kYks5Vg2Z5wA%3D%3D)

# FIS3

FIS3 面向**前端**的**工程构建系统**。解决前端工程中性能优化、资源加载（异步、同步、按需、预加载、依赖管理、合并、内嵌）、模块化开发、自动化工具、开发规范、代码部署等问题。

![](https://img.shields.io/npm/v/fis3.svg)

```
npm install -g fis3
```

## 文档

快速入门、配置、插件开发以及原理等文档，都在 https://github.com/fex-team/fis3/wiki

## 例子

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

## 常用插件

- [fis-optimizer-uglify-js](https://www.npmjs.com/package/fis-optimizer-uglify-js) UglifyJS2 压缩插件
- [fis-optimizer-clean-css](https://www.npmjs.com/package/fis-optimizer-clean-css) CleanCss  压缩插件
- [fis-parser-less](https://www.npmjs.com/package/fis-parser-less) less 解析插件
- [fis-parser-sass](https://www.npmjs.com/package/fis-parser-sass) sass / scss 解析插件
- [fis-parser-handlebars](https://www.npmjs.com/package/fis-parser-handlebars) handlebars 解析插件