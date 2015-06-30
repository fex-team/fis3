## 构建

*由 fis3-command-release 插件提供构建能力*

FIS3 的构建不会修改源码，而是会通过用户设置，将构建结果输出到指定的目录。

### 例子

在正式介绍 FIS3 功能之前，我们给定一个简单的例子，例子下载地址 https://github.com/fex-team/fis3-simple-demo

### 命令

进入**项目根目录**执行命令，进行构建。
> 项目根目录：FIS3 配置文件（默认`fis-conf.js`）所在的目录为项目根目录。

```bash
fis3 release -d <path>
```
- `<path>` 任意目录
- `fis3 release -h` 获取更多参数

#### 构建发布到项目目录的 `output` 目录下

```bash
fis3 release -d ./output
```

#### 构建发布到项目父级目录的 `dist` 子目录下 

```bash
fis3 release -d ../dist
```

#### 发布到其他盘 （Windows）

```bash
fis3 release -d D:\output
```

### 资源定位

我们在项目根目录执行命令 `fis3 release -d ../output` 发布到目录 `../output` 下。然后通过 diff 工具查看源码和构建结果的内容变化。

*文件变化*

![](./img/demo-uri-dir-diff.png)

- `index.html`、`style.css` 发生了变化

*index.html*

![](./img/demo-uri-html-diff.png)

*style.css*

![](./img/demo-uri-css-diff.png)

如上，构建过程中对资源 URI 进行了替换，替换成了绝对 URL。通俗点讲就是相对路径换成了绝对路径。

这是一个 FIS 的很重要的特性，**[资源定位][]**。

资源定位能力，可以有效的分离开发路径与部署路径之间的关系，工程师不再关心资源部署到线上之后去了哪里，变成了什么名字，这些都可以通过配置来指定。<font color="red">而工程师只需要使用相对路径来定位自己的开发资源即可</font>。这样的好处是 资源可以发布到任何静态资源服务器的任何路径上而不用担心线上运行时找不到它们，而且代码 具有很强的可移植性，甚至可以从一个产品线移植到另一个产品线而不用担心线上部署不一致的问题。

在默认不配置的情况下只是对资源相对路径修改成了绝对路径。通过配置文件可以轻松分离开发路径（源码路径）与部署路径。比如我们想让所有的静态资源构建后到 `static` 目录下。

```js
// 配置配置文件，注意，清空所有的配置，只留下一下代码即可。
fis.match('*.{png,js,css}', {
  release: '/static/$0'
});
```

同样构建到 `../output` 目录下看变化。

```bash
fis3 release -d ../output
```
![](./img/demo-uri-dir-output.png)

以上示例只是更改部署路径，还可以给 `url` 添加 `CDN domain` 或者添加文件指纹（时间戳或者md5戳）。

**再次强调**，<font color="red">FIS3 的构建是不会对源码做修改的，而是构建产出到了另外一个目录，并且构建的结果才是用来上线使用的</font>。

### 配置文件

默认配置文件为 `fis-conf.js`，FIS3 编译的整个流程都是通过配置来控制的。FIS3 定义了一种类似 CSS 的配置方式。固话了构建流程，以期让工程构建变得简单。

首先介绍设置规则的配置接口

```js
fis.match(selector, props);
```
- `selector` FIS3 把匹配文件路径的路径做为selector，匹配到的文件会分配给它设置的 `props`
- `props` 编译规则属性，包括文件属性和插件属性

我们修改例子的配置文件 `fis-conf.js`，添加一下内容

```js
fis.match('*.js', {
  useHash: false
});

fis.match('*.css', {
  useHash: false
});

fis.match('*.png', {
  useHash: false
});
```

我们执行 `fis3 inspect` 来查看文件命中属性的情况。`fis3 inspect` 是一个非常重要的命令，可以查看文件分配到的属性，这些属性决定了文件将如何被编译处理。

```
 ~ /app.js
 -- useHash false `*.js`   (0th)


 ~ /img/list-1.png
 -- useHash false `*.png`   (2th)


 ~ /img/list-2.png
 -- useHash false `*.png`   (2th)


 ~ /img/logo.png
 -- useHash false `*.png`   (2th)


 ~ /style.css
 -- useHash false `*.css`   (1th)


 ~ ::package
 -- empty
```

### 文件指纹

文件指纹，唯一标识一个文件。在开启强缓存的情况下，如果文件的 URL 不发生变化，无法刷新浏览器缓存。一般都需要通过一些手段来强刷缓存，一种方式是添加时间戳，每次上线更新文件，给这个资源文件的 URL 添加上时间戳。

```html
<img src="a.png?t=12012121">
```

而 FIS3 选择的是添加 MD5 戳，直接修改文件的 URL，而不是在其后添加 `query`。

对 js、css、png 图片引用 URL 添加 md5 戳，配置如下；

```js
//清除其他配置，只剩下如下配置
fis.match('*.{js,css,png}', {
  useHash: true
});
```

### 压缩资源

### CssSprites

[资源定位]: ../user-dev/uri.md