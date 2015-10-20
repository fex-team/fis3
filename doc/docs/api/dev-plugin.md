## 插件开发

<!-- @WARNING 此页面也会被 jsdoc 所用，所以一些图片链接无法经过相对路径定位，请加图时注意 -->
FIS3 是以 File 对象为中心构建编译的，每一个 File 都要经历编译、打包、发布三个阶段。[运行原理](http://fis.baidu.com/fis3/docs/build.html)讲述了 FIS3 中的插件扩展点；那么本节就将说明一个插件如何开发；

![](https://raw.githubusercontent.com/fex-team/fis3/master/doc/docs/api/img/fis-compile-flow.png)

如上图，编译起初，扫描项目目录下的所有文件（不包含指定排除文件），后实例化 File 对象，并对 File 内容进行编译分析；

### 编译阶段插件

在编译阶段，文件是单文件进行编译的，这个阶段主要是对文件内容的编译分析；这个阶段分为 `lint`、`parser`、`preprocessor`、`postprocessor`、`optimizer` 等插件扩展点。

对于这些插件扩展点，可详见文档 [单文件编译流程][]

其扩展点插件接口比较简单；

```js
/**
 * Compile 阶段插件接口
 * @param  {string} content     文件内容
 * @param  {File}   file        fis 的 File 对象 [fis3/lib/file.js]
 * @param  {object} settings    插件配置属性
 * @return {string}             处理后的文件内容
 */
module.exports = function (content, file, settings) {
    return content;
};
```

为了搞清楚哪些功能用那种类型的插件去实现比较好，建议详细阅读[单文件编译流程][]这篇文档。

fis 的插件是以 NPM 包的形式提供的，这将意味着 fis 的插件都是一个 NPM 包，并且最终也需要发布到 NPM 平台上。在开始之前你需要了解 node 是如何加载一个 NPM 包的 https://nodejs.org/api/modules.html。

FIS3 不再强制用户必须把插件（一个 NPM 包）进行全局安装，可把包安装到 fis-conf.js 同目录下（项目目录）或者某一个父目录，这个遵循 node 加载一个包的规范即可。

```
my-proj/
my-proj/fis-conf.js
my-proj/node_modules/fis3-<type>-<name>/index.js
```

- 插件开发

    ```js
    // vi my-proj/node_modules/fis3-<type>-<name>/index.js

    module.exports = function (content, file, settings) {
        // 只对 js 类文件进行处理
        if (!file.isJsLike) return content;
        return content += '\n// build ' + Date.now()
    }
    ```

- 插件调用

    ```js
    // fis-conf.js
    fis.match('*.js', {
        <type>: fis.plugin('<name>', {
            //conf
        })
    })
    ```

    - [&lt;type&gt;](#插件类型)

- 发布 NPM 包

    https://docs.npmjs.com/getting-started/publishing-npm-packages

> FIS团队建议，开发插件时为了方便可放到项目目录下，但发布到 NPM 后还是建议进行全局安装，一个团队使用的插件应该是被固化的。

----

为了便捷解决一些简短功能，也可以插件功能直接写到 `fis-conf.js` 中。

```js
fis.match('*.js', {
    // 直接设置插件属性的值为插件处理逻辑
    postprocessor: function (content, file, settings) {
        return content += '\n// build ' + Date.now();
    }
});
```

参考插件
- lint https://www.npmjs.com/package/fis-lint-csslint
- parser https://www.npmjs.com/package/fis-parser-sass
- preprocessor https://www.npmjs.com/package/fis-preprocessor-image-set
- standard
- postprocessor https://www.npmjs.com/package/fis-postprocessor-jswrapper
- optimizer https://www.npmjs.com/package/fis-optimizer-clean-css

### 打包阶段插件

原理请详细参考文档 [构建流程][]，到打包阶段，所有的文件都经过了单文件处理，该压缩的已经被压缩，该预编译的也进行了预编译。这个阶段主要实现一些共性的功能，比如打包合并。所以插件接口也不太一样了。

```js
/**
 * 打包阶段插件接口
 * @param  {Object} ret      一个包含处理后源码的结构
 * @param  {Object} conf     一般不需要关心，自动打包配置文件
 * @param  {Object} settings 插件配置属性
 * @param  {Object} opt      命令行参数
 * @return {undefined}
 */
module.exports = function (ret, conf, settings, opt) {
    // ret.src 所有的源码，结构是 {'<subpath>': <File 对象>}
    // ret.ids 所有源码列表，结构是 {'<id>': <File 对象>}
    // ret.map 如果是 spriter、postpackager 这时候已经能得到打包结果了，
    //         可以修改静态资源列表或者其他
}
```

跟编译是打包一样，也可项目本地开发或者是直接写到 fis-conf.js 中。参考 [打包阶段插件](./config-api.md#打包阶段插件)其配置方式与单文件编译阶段插件配置方式不同。由于 packager 时所有文件都在处理之列，所以需要通过以下方式进行配置；

```js
fis.match('::package', {
    <type>: fis.plugin('<name>')
})
```

- [&lt;type&gt;](#插件类型)

参考插件

- prepackager https://www.npmjs.com/package/fis-prepackager-widget-inline
- packager https://www.npmjs.com/package/fis3-packager-map
- spriter https://www.npmjs.com/package/fis-spriter-csssprites
- postpackager https://www.npmjs.com/package/fis-postpackager-simple

### Deploy 插件

deploy 插件是一类比较特殊的插件，它的功能只是发布数据，比如发布到某个文件夹下或者是发布到远端服务器上，以及用什么方式发布（http，ftp，git等等），deploy 插件是**异步模型**的。

deploy 作用于某些文件或者全部文件；它依然以文件属性的方式分配给某些文件；比如

```js
fis.match('*.js', {
    deploy: [
        fis.plugin('replace', {
            from: 'some-string',
            to: 'another-string'
        }),
        fis.plugin('local-deliver') // 发布到本地，由 -d 参数制定目录
    ]
})
```

也就是说可以在 deploy 阶段做一些转码、replace 这样的一些事情，最后一个插件必然是发布文件到磁盘或者远端的一个插件。

插件接口如下

```js
/**
 * deploy 插件接口
 * @param  {Object}   options  插件配置
 * @param  {Object}   modified 修改了的文件列表（对应watch功能）
 * @param  {Object}   total    所有文件列表
 * @param  {Function} next     调用下一个插件
 * @return {undefined}
 */
module.exports = function(options, modified, total, next) {
    next(); //由于是异步的如果后续还需要执行必须调用 next
};
```


参考插件

- https://www.npmjs.com/package/fis3-deploy-local-deliver
- https://www.npmjs.com/package/fis3-deploy-http-push
- https://www.npmjs.com/package/fis3-deploy-encoding
- https://www.npmjs.com/package/fis3-deploy-zip
- https://www.npmjs.com/package/fis3-deploy-replace

### 命令行插件

fis3 默认提供了 [release](https://github.com/fex-team/fis3-command-release)、[server](https://github.com/fex-team/fis3-command-server)、[inspect](https://github.com/fex-team/fis3-command-inspect)、[init](https://github.com/fex-team/fis3-command-init) 和 [install](https://github.com/fex-team/fis-command-install)五个子命令，每个子命令都是通过独立 npm 包来完成, 命名规范为 `fis3-command-xxxx`。如果希望扩展新的子命令如 `foo`, 则需要开发 npm 包 `fis3-command-foo`，全局安装或者安装在对应的 fis 项目目录，代码请参考如下所示。

```js
exports.name = 'foo';
exports.desc = 'description of foo.';
exports.options = {
  '-h, --help': 'print this help message',
  '--files'   : 'some options.'
};

exports.run = function(argv, cli) {
  // 如果输入为 fis3 foo -h
  // 或者 fis3 foo --help
  // 则输出帮助信息。
  if (argv.h || argv.help) {
    return cli.help(exports.name, exports.options);
  }

  // 可以通过 argv 知道命令行中有哪些参数以及是什么值。
  console.log('I am working..');
};

```

参考插件

- https://github.com/fex-team/fis3-command-release
- https://github.com/fex-team/fis3-command-server
- https://github.com/fex-team/fis3-command-inspect
- https://github.com/fex-team/fis3-command-init
- https://github.com/fex-team/fis-command-install

### 插件类型

- lint
- parser
- preprocessor
- standard
- postprocessor
- optimizer
- prepackager
- packager
- spriter
- postpackager
- deploy

[运行原理]: ../build.md
[单文件编译流程]: ../build.md#单文件编译流程
[构建流程]: ../build.md#构建流程
