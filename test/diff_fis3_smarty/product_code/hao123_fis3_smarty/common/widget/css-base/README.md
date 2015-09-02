# base-css

完整版在 master 分支维护, 首页优化精简在 mini 分支维护

`git checkout mini`

经过压缩精简, 同样功能 base-css 从 **9K** 减少到 **5K**

## USAGE

为保持主流浏览器体积最小, 拆分 IE6-8 为独立版本(`base.ie.css`)

```html
<!-- for IE6-8 -->
<!--[if lt IE 9]>
    <link rel="stylesheet" href="base.ie.css">
<![endif]-->
<!--[if gte IE 9]><!-->
    <link rel="stylesheet" href="base.css">
<!--<![endif]-->
```

## BUILD & OUTPUT

* 安装依赖
`npm i`

* 编译打包
`grunt`

* 测试(默认访问: 127.0.0.1:8011)
`grunt test`

最终产出在 dist 目录, 分为 4 份文件

- base.rtl.css

- base.ltr.css

- base.rtl.ie.css

- base.ltr.ie.css

## COMPACT DETAIL

### 1. 不常用的 form 控件 reset

```css
input[type="search"] {
    -webkit-appearance: textfield;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
}

input[type="search"]::-webkit-search-decoration,input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
}
```

### 2. html5 标签兼容

```css
audio,canvas,video {
    display: inline-block;
    *display: inline;
    *zoom: 1;
}

audio:not([controls]) {
    display: none;
    height: 0;
}
```

### 3. 过旧的样式属性兼容

```css
.unselect,i,.i,.icon {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
}
```

### 4. IE Hack

```css
_zoom:expression(function(el) {
    document.execCommand('BackgroundImageCache',false,true);el.style.zoom = "1";
}(this));
```

### 5. kill jQuery-UI

待定, 依赖自定义网址重构

### 6. 不常用的工具类

```css
sup,.sup {
    top: -0.5em;
}

sub,.sub {
    bottom: -0.25em;
}
```

### 7. 冗余代码

```css
@charset "utf-8";
...
@charset "utf-8";
```

### 8. 抽象继承冗余部分

```css
.icon-hot{
    display: inline-block;
	width: 30px;
	height: 11px;
	margin-left: 3px;
	cursor: pointer;
	background: url(../img/i-rtl-hot.png?m=z) no-repeat;
	_position: absolute;
	font-size:0;
}
.icon-new{
	display: inline-block;
	width: 30px;
	height: 11px;
	margin-left: 3px;
	cursor: pointer;
	background: url(../img/i-rtl-new.png?m=z) no-repeat;
	_position: absolute;
	font-size:0;
}
```

调整为:

```css
.icon-hot, .icon-new, .icon-new_red{
}
```

另外: base.css 中提供了很多常用工具类, 比如:

```css
.hide{} /*隐藏*/
.s-ptn{} /*通用margin/padding设置*/
.unselect{} /*禁止文本选择*/
.fl{} /*浮动*/
.g /*grid 布局相关*/
```
请在源码或文档中熟悉, 避免业务代码冗余

## TEST

`/test/index.html`
