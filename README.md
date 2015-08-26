![](https://raw.githubusercontent.com/fex-team/fis3/master/doc/logo.png)

# FIS3
![](https://img.shields.io/npm/v/fis3.svg) ![](https://img.shields.io/npm/dm/fis3.svg)
[![Build Status](https://travis-ci.org/fex-team/fis3.svg?branch=master)](https://travis-ci.org/fex-team/fis3)
[![Coverage Status](https://coveralls.io/repos/fex-team/fis3/badge.svg?branch=master&service=github)](https://coveralls.io/github/fex-team/fis3?branch=master)

FIS3 面向**前端**的**工程构建系统**。解决前端工程中性能优化、资源加载（异步、同步、按需、预加载、依赖管理、合并、内嵌）、模块化开发、自动化工具、开发规范、代码部署等问题。

> 如果对FIS先有些了解，但理解不深的，可试着带着这句话去看文档 <br>
> FIS3 会在配置文件中给文件添加相应属性，用于控制文件的编译、合并等各种操作；文件属性包括基本属性和插件属性，[详细请参考](https://github.com/fex-team/fis3/blob/master/doc/docs/api/config-props.md#文件属性)

```
npm install -g fis3
```

## 文档

快速入门、配置、插件开发以及原理等文档 [doc/docs/INDEX.md](doc/docs/INDEX.md)

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

// Global start
fis.match('*.{js,css}', {
  useHash: true
});

fis.match('::image', {
  useHash: true
});

fis.match('*.js', {
  optimizer: fis.plugin('uglify-js') // js 压缩
});

fis.match('*.css', {
  optimizer: fis.plugin('clean-css') // css 压缩
});

fis.match('*.png', {
  optimizer: fis.plugin('png-compressor') // png 图片压缩
});

// Global end

// default media is `dev`
fis.media('dev')
  .match('*', {
    useHash: false,
    optimizer: null
  });

// extends GLOBAL config
fis.media('production');
```

## 其他例子

https://github.com/fex-team/fis3-demo

## 常用插件

###优化类（插件属性：optimizer）
- [fis-optimizer-uglify-js](https://www.npmjs.com/package/fis-optimizer-uglify-js) UglifyJS2 压缩插件
- [fis-optimizer-clean-css](https://www.npmjs.com/package/fis-optimizer-clean-css) CleanCss  压缩插件
- [fis-optimizer-png-compressor](https://www.npmjs.com/package/fis-optimizer-png-compressor) PNG 压缩插件

###预处理类（插件属性：parser）
- [fis-parser-less](https://www.npmjs.com/package/fis-parser-less) less 解析插件
- [fis-parser-sass](https://www.npmjs.com/package/fis-parser-sass) sass / scss 解析插件
- [fis-parser-handlebars](https://www.npmjs.com/package/fis-parser-handlebars) handlebars 解析插件
