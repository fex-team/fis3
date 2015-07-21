## 声明依赖

声明依赖能力为工程师提供了声明依赖关系的编译接口。

FIS3 在执行编译的过程中，会扫描这些编译标记，从而建立一张 静态资源关系表，资源关系表详细记录了项目内的静态资源id、发布后的线上路径、资源类型以及 **依赖关系** 和 **资源打包**等信息。使用 FIS3 作为编译工具的项目，可以将这张表提交给后端或者前端框架去运行时根据组件使用情况来 按需加载资源或者资源所在的包，从而提升前端页面运行性能。

### 在html中声明依赖

> 用户可以在html的注释中声明依赖关系，这些依赖关系最终会被记录下来，当某个文件中包含字符 `__RESOURCE_MAP__` 那么这个记录会被字符串化后替换 `__RESOURCE_MAP__`。为了方便描述呈现，我们假定项目根目录下有个文件 **manifest.json**包含此字符，编译后会把表结构替换到这个文件中。

在项目的index.html里使用注释声明依赖关系：

```html
<!--
    @require demo.js
    @require "demo.css"
-->
```

默认情况下，只有js和css文件会输出到manifest.json表中，如果想将html文件加入表中，需要通过配置 ```useMap``` 让HTML文件加入 **manifest.json**，例如：

```javascript
//fis-conf.js
fis.match('*.html', {
    useMap: true
})
```

配置以下内容到配置文件进行编译

```js
// fis-conf.js
fis.match('*.html', {
    useMap: true
});

fis.match('*.{js,css}', {
    // 开启 hash
    useHash: true
});
```

查看 output 目录下的 **manifest.json** 文件，则可看到：

```json
{
    "res" : {
        "demo.css" : {
            "uri" : "/static/css/demo_7defa41.css",
            "type" : "css"
        },
        "demo.js" : {
            "uri" : "/static/js/demo_33c5143.js",
            "type" : "js",
            "deps" : [ "demo.css" ]
        },
        "index.html" : {
            "uri" : "/index.html",
            "type" : "html",
            "deps" : [ "demo.js", "demo.css" ]
        }
    },
    "pkg" : {}
}
```

### 在js中声明依赖

> fis支持识别js文件中的 **注释中的@require字段** 标记的依赖关系，这些分析处理对 **html的script标签内容** 同样有效。

```javascript
//demo.js
/**
 * @require demo.css
 * @require list.js
 */
```

经过编译之后，查看产出的 **manifest.json** 文件，可以看到：

```json
{
    "res" : {
        ...
        "demo.js" : {
            "uri" : "/static/js/demo_33c5143.js",
            "type" : "js",
            "deps" : [ "demo.css", "list.js", "jquery" ]
        },
        ...
    },
    "pkg" : {}
}
```

> 注意， `require()` 不再处理，js 中 `require()` 留给各种前端模块化方案，假设你选择的是 `AMD` 那么就得解析，`require([])` 和 `require()`；如果选用的是 `mod.js` 那么就得解析 `require.async()` 和 `require()`，其他亦然。 

### 在css中声明依赖

> fis支持识别css文件 **注释中的@require字段** 标记的依赖关系，这些分析处理对 **html的style标签内容** 同样有效。

```css
/**
 * demo.css
 * @require reset.css
 */
```

经过编译之后，查看产出的 **manifest.json** 文件，可以看到：

```json
{
    "res" : {
        ...
        "demo.css" : {
            "uri" : "/static/css/demo_7defa41.css",
            "type" : "css",
            "deps" : [ "reset.css" ]
        },
        ...
    },
    "pkg" : {}
}
```
