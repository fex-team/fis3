## 初级使用

### 一个复杂一点的例子

为了尝试更多 FIS3 提供的特性，我们设计一个比较复杂的例子。这个例子包含

- 两个页面
- 三个 css 文件，其中俩页面各一个 css 文件，剩下一个 css 文件公用
- 包含一个 less 文件，并被俩页面同时使用
- 两个 png 图片
- 两个 js 文件

例子下载地址 [demo-lv1](https://github.com/fex-team/fis3/blob/dev/doc/demo/demo-lv1.tar.gz)

### 安装一些插件

FIS3 是一个扩展性很强的构建工具，社区也包含很多 FIS3 的插件。为了展示 FIS3 的预处理、静态合并 js、css 能力，需要安装两个插件。

- fis-parser-less 例子引入一个 less 文件，需要 less 预处理插件
- fis3-postpackager-loader 可对页面散列文件进行合并

FIS3 的插件都是以 NPM 包形式存在的，所以安装 FIS3 的插件需要使用 `npm` 来安装。

```bash
npm install -g 插件名
```

```bash
npm install -g fis-parser-less
npm install -g fis3-postpackager-loader
```

### 预处理

FIS3 提供强大的预处理能力，可以对 less、sass 等异构语言进行预处理还可以对模板语言进行预编译。FIS3 社区已经提供了绝大多数需要预处理的异构语言。

我们给定的例子中有个 less 文件，那么需要对 less 进行预处理，我们已经安装了对应的预处理插件。现在只需要配置启用这个插件就能搞定这个事情。

```js
fis.match('*.less', {
  // fis-parser-less 插件进行解析
  parser: fis.plugin('less'),
  // .less 文件后缀构建后被改成 .css 文件
  rExt: '.css'
})
```

<font color="red">如同之前强调的，虽然构建后后缀为 `.css` 但 FIS3 使用中开发者只需要关心源码路径。所以引入一个 less 文件时，依然是 `.less` 后缀。</font>

```css
<link rel="stylesheet" type="text/css" href="./test.less">
```

### 简单合并

在起步中我们阐述了[图片合并 CssSprite](./beginning/release.md#CssSprite图片合并)，为了减少请求。现在介绍一种比较简单的打包 js，css 的方式。

启用打包后处理插件进行合并。

- 基于整个项目打包

  ```js
  fis.match('::package', {
    postpackager: fis.plugin('loader')
  });

  fis.match('*.less', {
    parser: fis.plugin('less'),
    rExt: '.css'
  });

  fis.match('*.{less,css}', {
    packTo: '/static/aio.css'
  });

  fis.match('*.js', {
    packTo: '/static/aio.js'
  });
  ```

  这样配置打包的结果，是一个页面最终只会引入一个 css、js，aio.js 和 aio.css。
  但两个页面的资源都被打包到同一个包里面了。这个可能不是我们想要的结果，我们想一个页面只包含这个页面用过的资源。

- 基于页面的打包方式

  ```js
  fis.match('::package', {
    postpackager: fis.plugin('loader', {
      allInOne: true
    })
  });

  fis.match('*.less', {
    parser: fis.plugin('less'),
    rExt: '.css'
  });
  ```
  
  给 `loader` 插件配置 `allInOne` 属性，即可对散列的引用链接进行合并，而不需要进行配置 `packTo` 指定合并包名。

**注意**，这个插件只针对纯前端的页面进行比较粗暴的合并，如果使用了后端模板，一般都需要从整站出发配置合并。

### 构建调试预览

进入 demo 目录，执行命令构建发布到**本地测试服务**根目录下

```bash
fis3 release
```

启动内置服务器进行预览；

```bash
fis3 server start --type node
```
