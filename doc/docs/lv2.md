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

这样我们就知道插件逻辑放到什么地方就能用 `fis.plugin` 接口挂载了。

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

### 发布插件
