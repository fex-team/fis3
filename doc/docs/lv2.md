## 中级使用

在**初级使用**中，为了解析 `less` 和 进行简单的资源合并，我们安装了两个已经提供好的插件，使用插件完成了我们的工作。那么假设有一些情况下还没有提供插件做支持该怎么办。

那么这节讨论一下 FIS 中插件如何编写。在[工作原理](./build.md)已经介绍了整个构建的过程。以及说明了 FIS 与其他构建工具的不同点。

### 预处理插件编写

假设给定项目中要是用 `es6`，线上运行时解析成标准 `js` 性能堪忧，想用自动化工具进行预处理转换。如原理介绍 `parser` 阶段就是进行归一化的过程，通过预处理阶段，整个文件都会翻译为标准的文件，即浏览器可解析的文件。

这时候我们搜罗开源社区，看转换 `es6` 到 `es5` 哪个转换工具更好一些，发现 `babel` 具有无限的潜能。

#### 任务

- 预处理 `es6` 为 `es5`

#### 前期准备

- `.es6` 后缀最终变为 `.js`
- 使用 `babel` 进行 `es6` 的转换
- FIS3 实现一个 `parser` 类型的插件，取名叫 `translate-es6`，插件全名 `fis3-parser-translate-es6`

#### 开发插件

> [开发插件](./api/dev-plugin.md)文档详细介绍了开发插件的步骤，但为了更友好的进行接下来的工作，我们在这块简述一下整个过程。

FIS3 支持 `local mode` 加载一个插件。当你调用一个插件的时候。

```js
{
  parser: fis.plugin('translate-es6')
}
```

如果项目的根目录 **node_modules** 下有这个插件就能挂载起来。

```bash
my-proj/node_modules/fis3-parser-translate-es6
```

这样我们就知道插件逻辑放到什么地方能用 `fis.plugin` 接口挂载。

```bash
my-proj/node_modules/fis3-parser-translate-es6/index.js
```

```js
// vi index.js
// babel node.js api 只需要 babel-core 即可
var babel = require('babel-core');
module.exports = function (content, file, options) {
  var result = babel.transform(content, opts);
  return result.code; // 处理后的文件内容
}
```

如上我们调用 `babel-core` 封装了一个 `fis3-parser` 插件。

现在我们要在项目使用它

```bash
my-proj/fis-conf.js # 项目 fis3 配置文件
my-proj/node_modules/fis3-parser-translate-es6/index.js # 插件逻辑
my-proj/style.es6
my-proj/index.html
```

**配置使用**

```js
fis.match('*.es6', {
  parser: fis.plugin('translate-es6'),
  rExt: '.js' // .es6 最终修改其后缀为 .js 
})
```

**构建**
```bash
fis3 release -d ./output
```

### 打包插件编写

在开始之前，我们需要阐述下**打包**这个名词，打包在前端工程中有两个方面。

- 收集页面用到的 js、css 分别合并这些引用，资源合并成一个。
- 打包，对某些资源进行打包，而记录他们打包的信息，某个文件打包到了哪个包文件。

其实一般意义上来说，对于第一种情况**收集打包**只适合于纯前端页面，并且要求资源都是静态引入的。假设出现这种情况。

```html
<script type="text/javascript">
// load common.js and index.js
F.load([
  'common',
  'index'
]);
</script>
```

需要通过动态脚本去加载的资源，就无法通过工具静态分析来去做合并了。

还有一种情况，如果模板是后端模板，也依然无法做到这一点，因为加载资源只有在运行时解析时才能确定。

那么对于这类打包合并资源，需要特殊的处理思路。

0. 直接将所有资源合并成一个文件，进行整站（整个项目）合并
1. 通过**配置文件**配置打包，并且合并时记录合并信息，在运行时根据这些打包信息吐给浏览器合适的资源。

第一种，粗暴问题多，并且项目足够大时效率明显不合适。我们主要探讨第二种。

FIS3 默认内置了一个打包插件 `fis3-packager-map`，它根据用户的**配置信息**对资源进行打包。

```js
//fis-conf.js
fis.match('/widget/*.js', {
  packTo: '/static/widget_pkg.js'
})
```

标明 `/widget` 目录下的 **js** 被合并成一个文件 `widget_pkg.js`

假设

``` 
/widget/a.js
/widget/b.js
/widget/c.js
/map.json
```

编译发布后

```
/widget/a.js
/widget/b.js
/widget/c.js
/static/widget_pkg.js
/map.json
```

我们前面说过

    当某文件包含字符 __RESOURCE_MAP__ 时，最终静态资源表（资源之间的依赖、合并信息）会替换这个字符。

构建后，出现一个合并资源以外，还会产出一张某资源合并到什么文件中的关系信息。

```json
{
  "res": {
    "widget/a.js": {
      "uri": "/widget/a.js",
      "type": "js",
      "pkg": "p0"
    },
    "widget/b.js": {
      "uri": "/widget/b.js",
      "type": "js",
      "pkg": "p0"
    },
    "widget/c.js": {
      "uri": "/widget/c.js",
      "type": "js",
      "pkg": "p0"
    }    
  },
  "pkg": {
    "p0": {
      "uri": "/static/widget_pkg.js",
      "has": [
        "widget/a.js",
        "widget/b.js",
        "widget/c.js"
      ],
      "type": "js"
    }
  }
}
```

### 发布插件

FIS3 的插件都放在 NPM 平台上，把插件发布到其上即可。

参考链接 [npm publish](https://docs.npmjs.com/getting-started/publishing-npm-packages)

发布的插件如何使用

- `npm install -g <plugin>` 安装插件
- FIS3 配置文件中按照配置规则进行配置，`fis.plugin(<plugin-name>)`