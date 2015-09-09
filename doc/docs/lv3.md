## 高级使用

### 静态资源映射表

记录文件依赖、打包、URL等信息的表结构，在 [FIS2](https://github.com/fex-team/fis) 中统称 `map.json`。在 [FIS3](https://github.com/fex-team/fis3) 中默认不产出 `map.json`，FIS3 中为了方便各种语言下读取 `map.json`，对产出 `map.json` 做了优化。

当某个文件包含字符 `__RESOURCE_MAP__`，就会用表结构数据替换此字符。这样的好处是不再固定把表结构写入某一个特定文件，方便定制。

比如在

*php*
```php
<?php
$_map = json_decode('__RESOURCE_MAP__', true);
?>
```

*js*
```js
var _map = __RESOURCE_MAP__;
```

假设上面的 php 和 js 为分析静态资源映射表的程序，那么就省去了读 `map.json` 的过程。

当然，如果你想继续像 FIS2 一样的产出 `map.json` 只需要在模块下新建文件 `map.json`，内容设置为 `__RESOURCE_MAP__` 即可。

### 模块化开发

模块化开发是工程实践的最佳手段，分而治之维护上带来了很大的益处。

说到模块化开发，首先很多人都会想到 AMD、CMD，同时会想到 `require.js`、`sea.js` 这样的前端模块化框架。主要给 js 提供模块化开发的支持。后也增加了 css、前端模板的支持。这些框架就包含了组件依赖分析、保持加载并保持依赖顺序等功能。

但在 FIS 中依赖本身在构建过程中就已经分析并记录在静态资源映射表中，那么对于线上运行时模块化框架就可以省掉**依赖分析**这个步骤了。

在**声明依赖**内置语法中提到了几种资源之间标记依赖的语法，这样模板可以依赖 js、css，js 可以依赖某些 css，或者某个类型的组件可以互相依赖。

另外，考虑到 js 还需要有运行时支持，所以对于不同前端模板化框架，在 js 代码中 FIS 编译分析依赖增加了几种依赖函数的解析。这些包括

*AMD*
```js
define()
require([]);
require('');
```

*seajs*
```
define()
require('')
sea.use([])
```

*mod.js (extends commonjs)*
```
define()
require('')
require.async('')
require.async([])
```

考虑到不可能一个框架运用多个模块化框架（因为全都占用同样的全局函数，互斥），所以编译支持这块分成三个插件进行支持。

- [fis3-hook-commonjs](https://github.com/fex-team/fis3-hook-commonjs)
- [fis3-hook-amd](https://github.com/fex-team/fis3-hook-amd)
- [fis3-hook-cmd](https://github.com/fex-team/fis3-hook-cmd)

```js
// vi fis-conf.js
fis.hook('commonjs');
```

> 插件 README 有详细的使用文档。

如上面说到的，这个编译插件只是对编译工具做一下扩展，支持前端模块化框架中的组件与组件之间依赖的函数，以及入口函数来标记生成到静态资源映射表中；另外一个功能是针对某些前端模块化框架的特性自动添加 `define`。

有了依赖表，但如何把资源加载到页面上，需要额外的**FIS 构建插件**或者**方案**支持。

假设以纯前端（没有后端模板）的项目为例，对于依赖组件的加载就靠插件 [fis3-postpackager-loader](https://github.com/fex-team/fis3-postpackager-loader) 。其是一种基于构建工具的加载组件的方法，构建出的 `html` 已经包含了其使用到的组件以及依赖资源的引用。

```js
// npm install -g fis3-postpackager-loader
fis.match('::package', {
  postpackager: fis.plugin('loader', {})
});
```

为了方便、统一管理组件以及合并时便利，需要把组件统一放到某些文件夹下，并设置此目录下的资源都是组件资源。

```js
// widget 目录下为组件
fis.match('/widget/**.js', {
  isMod: true
});
```

通过以上三步，**纯前端**的模块化开发就可实现。

总结一下；

- 编译工具扩展：根据不同前端模块化框架，扩展**声明依赖**能力
- 静态资源管理：解析**静态资源映射表**加载页面用到的组件及其组件的依赖
- 目录规范：设置某个文件夹下资源标记为依赖

工具扩展、目录规范前后端的前端工程项目都需要，其不同的就在于**静态资源管理**这部分。

### 资源映射表的模块化方案设计

### 解决方案封装

解决方案，解决一系列特定问题的工具、规范、开发、上线支持的方案我们叫做一个解决方案。前端工程的解决方案一般包括

    研发规范 + 模块化框架 + 测试套件 + 辅助开发工具

FIS3 中的包装解决方案，就是把这些集成到一个工具中。

一个解决方案就是继承自 FIS3 并且支持特定模块化开发、特定模板语言、特定处理流程、研发规范的构建工具。

#### 封装解决方案的必要性

- 规范开发，对于特定团队业务，应该有特定的目录规范、模块化框架等
- FIS3 只提供一个方便定制前端工程的构建系统，每个团队需要怎么样去处理工程需要自己定制，定制会引入大量的 FIS3 插件，解决方案可统一规定引入哪些插件
- 树立独立技术品牌

#### 解决方案封装

**准备**

- 方案名 `foo`
- 构建工具名字 `foo`
- 模板语言 PHP
- 模块化框架选择 `require.js`
- 特定目录规范

**目录规范**

```bash
/static # 静态资源
/page # 页面
/widget # 组件
/fis-conf.js # 配置文件
```

**部署规范**

```bash
/template # 所有的 PHP 模板
/static  # 所有的静态资源
```

**构建工具**

```bash
foo
foo/bin/foo.js
foo/index.js
package.json
```

- 基于 FIS3 配置目录规范和部署规范

  ```js
  //vi foo/index.js
  var fis = module.exports = require('fis3');
  fis.require.prefixes.unshift('foo');
  fis.cli.name = 'foo';
  fis.cli.info = require('./package.json');

  fis.match('*', {
    release: '/static/$0' // 所有资源发布时产出到 /static 目录下
  });

  fis.match('*.php', {
    release: '/template/$0' // 所有 PHP 模板产出后放到 /template 目录下
  });

  // 所有js, css 加 hash
  fis.match('*.{js,css,less}', {
    useHash: true
  });

  // 所有图片加 hash
  fis.match('image', {
    useHash: true
  });

  // fis-parser-less
  fis.match('*.less', {
    parser: fis.plugin('less'),
    rExt: '.css'
  });

  fis.match('*.js', {
    optimizer: fis.plugin('uglify-js')
  });

  fis.match('*.{css,less}', {
    optimizer: fis.plugin('clean-css')
  });

  fis.match('*.png', {
    optimizer: fis.plugin('png-compressor')
  });

  fis.match('widget/*.{php,js,css}', {
    isMod: true
  });

  fis.match('::package', {
    spriter: fis.plugin('csssprites')
  });

  //fis3-hook-module
  fis.hook('module', {
    mode: 'amd' // 模块化支持 amd 规范，适应 require.js
  });
  ```

- 实现 `/bin/foo.js`

  ```js
  #!/usr/bin/env node

  // vi foo/bin/foo.js

  var Liftoff = require('liftoff');
  var argv = require('minimist')(process.argv.slice(2));
  var path = require('path');
  var cli = new Liftoff({
    name: 'foo', // 命令名字
    processTitle: 'foo',
    moduleName: 'foo',
    configName: 'fis-conf',

    // only js supported!
    extensions: {
      '.js': null
    }
  });

  cli.launch({
    cwd: argv.r || argv.root,
    configPath: argv.f || argv.file
  }, function(env) {
    var fis;
    if (!env.modulePath) {
      fis = require('../');
    } else {
      fis = require(env.modulePath);
    }
    fis.set('system.localNPMFolder', path.join(env.cwd, 'node_modules/foo'));
    fis.set('system.globalNPMFolder', path.dirname(__dirname));
    fis.cli.run(argv, env);
  });
  ```

  以上代码 copy 过来即可，不需要做大的改动，感兴趣可研究其原理

- 依赖的 NPM 包，需要在 package.json 中加上依赖
  + **fis-parser-less** 解析 less
  + **fis-optimizer-uglify-js** 压缩 js，fis3 已内置
  + **fis-optimizer-clean-css** 压缩 css，fis3 已内置
  + **fis-optimizer-png-compressor** 压缩 png 图片，fis3 已内置
  + **fis3-hook-module** 模块化支持插件
  + **fis3** fis3 核心
  + **minimist**
  + **liftoff**

- package.json 需要添加

  ```json
  "bin": {
    "foo": "bin/foo.js"
  }
  ```

- 发布 foo 到 NPM

通过以上步骤可以简单封装一个解决方案，FIS3 提供了大量的插件，已经几乎极其简单的配置方式来搞定研发规范的设置，很轻松即可打造完整的前端集成解决方案。

> **foo** [源码下载地址](https://github.com/fex-team/fis3/blob/dev/doc/demo/foo.tar.gz)

### 基于Smarty的解决方案

[fis3-smarty](https://github.com/fex-team/fis3-smarty) 集成了 [fis-plus](https://github.com/fex-team/fis-plus) 的目录规范以及处理插件。实现对 Smarty 模板解决方案的工程构建工具支持。

> 此方案在 FIS3 替代 [fis-plus](https://github.com/fex-team/fis-plus) 解决方案。

> [Smarty 解决方案原理](https://github.com/fex-team/fis3-demo/tree/master/backend-resource-manage/use-smarty)

### 基于纯PHP的解决方案

详细见 [纯php静态资源管理方案](https://github.com/fex-team/fis3-demo/tree/master/backend-resource-manage/use-php)

**解决问题**

 - 支持模块化的开发，使用commonJS或者AMD方案来控制前端JS资源的加载
 - 支持组件化开发，使用组件时能自动加载对应依赖的静态资源
 - 自动分析资源依赖关系，确保依赖资源正常下载
 - 自动把css放顶部、JS放底部输出，提升页面渲染性能
 - 支持收集组件中的内嵌样式或脚本，合并输出

### 基于Laravel的解决方案

详细请参见 [fis-laravel](https://github.com/fis-scaffold/laravel)


