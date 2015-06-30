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

```
```
### 压缩资源

### CssSprites