## 高级使用

### 模块化开发

模块化开发是工程实践的最佳手段，分而治之维护上带来了很大的益处。加载时组件懒加载优化了页面呈现。甚至很多构建工具都是为某种前端模块化框架设计的，包括配套的模块化组件生态。

在 FIS3 中没有特定规定的模块化框架。在 FIS 多年对前端工程开发的研究，发现了一种更行之有效的模块化方案，即把 CSS、JS、模板 一起纳入组件的范围，相互可依赖。而不是单单模拟 JS 来实现组件化开发。

FIS 团队在 FIS3 的基础之上实现插件 [fis3-hook-module](https://github.com/fex-team/fis3-hook-module)， 基本上支持了 AMD，SeaJS，mod.js 等模块化框架，支持对此类规范的组件打包、提前分析依赖等等。

本节主要介绍 FIS 基于静态资源映射表的组件化方案设计。

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
  fis.cli.info = require('./require.json');
  
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
    type: 'amd' // 模块化支持 amd 规范，适应 require.js
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
    fis.set('localNPMFolder', path.join(env.cwd, 'node_modules/foo'));
    fis.set('globalNPMFolder', path.dirname(__dirname));
    fis.cli.run(argv, env);
  });
  ```
  上面内容没啥大不了的，copy 过去，改改 name、processTitle、moduleName 搞定

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
