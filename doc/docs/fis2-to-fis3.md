# FIS2 to FIS3

----

> [FIS](https://github.com/fex-team/fis) 以下统称 FIS2

## 简介

FIS3相对FIS2来说接口改动较大，并不是不考虑版本上的兼容，而是不愿意做简单的小修小补，希望从整体的角度打造一个`易用性和可扩展性`达到一个全新高度的工具。FIS2 与FIS3将并行维护，并且**绝大部分插件是兼容的**。

## 功能升级点简介

### RoadMap目录定制更简单

FIS2中roadmap是最先匹配的生效，如果想覆盖解决方案的默认配置比较麻烦。FIS3中使用了类似css的配置语法，使用叠加的机制，同一个配置最后一个生效：

```js
fis.match('{a,b}.js', {
    release: '/static/$0'
});

fis.match('b.js', {
    release: '/static/new/$0'
});
```

并且通过类似css media的API来控制不同用户、环境的配置：

```js
fis.media('prod')
    .match('**.js', {
        optimizer: fis.plugin('uglify-js')
    })
    .match('component_modules/*.js',{
        packTo: '/static/pkg/common.js' 
    })
```

另外你还可以像css !important一样设置不可以被覆盖的配置：

```js
//important设为true表示不可被覆盖
fis.match(selector, props[, important])
```

```js
fis.match('*.js', {
  useHash: true,
  release: '/static/$0'
},true);

```

### 支持本地插件

FIS2中插件都需要安装到全局才能使用，不方便自定义插件的开发和部署。FIS3中包括FIS3和插件都可以安装在项目本地使用。插件将优先使用本地的。

### 支持相对路径产出

从模块化开发和工程化部署的角度我们并不推荐使用相对路径产出部署的方式，在FIS2中这个也是基本不支持的(可以关闭标准处理，但变成了一个压缩工具)。

考虑到一些用户的需求，FIS3中可以安装一个插件来实现相对目录的产出：

```js
//全局或本地安装插件
npm install [-g] fis3-hook-relative

//fis-conf.js
// 启用插件
fis.hook('relative');

// 让所有文件，都使用相对路径。
fis.match('**', {
  relative: true
})
```

具体见插件说明 https://github.com/fex-team/fis3-hook-relative

### FIS3支持更好的按需编译

FIS2中可以通过`include`或者`exclude`来过滤源码，然而只有规则匹配的目录才生效。

FIS3中可以通过设置files过滤需要编译的源码，同时支持分析files中引用或依赖到的被过滤的资源目录中的文件。

```
fis.set('project.files', ['page/**','map.json','modules/**','lib']);
```

典型的使用场景如angular中，bower下面的资源有大量的冗余，并且可能导致编译失败。通过手工配置过滤比较麻烦，而通过files引用来分析资源就能屏蔽bower下载目录的情况下，**自动找出其中被使用的资源**。 示例见[fis3-demo](https://github.com/zhangtao07/fis3-angular-demo)


### FIS3 **不再默认解析 js 中的 `require()` 函数添加依赖

- 为什么这么做？
    
    虽然现在很多模块化框架都以 `require` 来作为依赖，但是其形式是不同的。比如

    **require.js**
    
    ```js
    require(['./a.js'])
    ```
    
    **mod.js**

    ```js
    require.async('./a.js');
    ```

    sea.js

    ```js
    sea.use('./a.js');
    ```
- 如果要解析 `require()` 需要自己添加 `preprocessor` 插件支持，而这个插件的逻辑相当简单。

    参考

    https://github.com/fex-team/fis3-hook-commonjs/blob/master/index.js

- 如果感觉自己写插件太麻烦

    可以安装 FIS组 提供的模块化方案的支持插件 fis3-hook-commonjs

    ```js
    fis.hook('commonjs');

    // 如果 jswrapper 自定义要做
    fis.hook('commonjs', {wrap: false});
    
    ```

### 更简单的纯前端自动合并支持

FIS2纯前端方案中使用[fis-postpackager-simple](https://github.com/hefangshi/fis-postpackager-simple) 来实现资源自动合并的支持，fis3中我们提供了一个新的扩展插件来实现类似功能，不仅支持灵活自动的打包配置，而且能产出适配requireJS、modJS的资源依赖配置。

具体文件见插件：https://github.com/fex-team/fis3-postpackager-loader

### 默认关闭同名依赖功能

FIS2中组件化资源默认开启了同名依赖设置，对初学者可能造成困惑。FIS3中默认关闭了同名依赖，您需要主动声明资源间的依赖关系。不过你也可以通过配置来开启同名依赖功能：

```js
fis.match('*.{html,js}', {
  useSameNameRequire: true
});
```

### 支持监听fis-conf.js修改自动重启

FIS2中开启`watch`修改fis-conf.js时工具不会自动重启，FIS3中能自动监听fis-conf.js的变化并给出提示自动重启。

### 支持内嵌异构语言分析

FIS2中通过`<script>`或`<style>`内嵌的语言不能是less、sass等异构语言，fis3中支持直接内嵌异构语言:

```html
<script type="text/x-coffee">
    //...
</script>
```

```html
<style type="text/x-less">
body {
    background-color: #F0F0F0;
    h1 {
        color: red;
    }
}
</style>

```

### 更加人性化的错误提示

FIS3中对于常见的错误将给出提示并提供对应的github issue链接，您可以在相应地方寻找解决办法。如果依旧没有解决欢迎提issue。

### FIS3删减了部分命令行参数

FIS3 配置上很灵活，通过给文件分配属性，由这些属性控制编译流程。不像 FIS2 给 `release` 添加参数就能搞定很多事情了，比如所有静态资源压缩、加 md5、打包、加 domain等，这些功能在 FIS3 中必须通过配置文件配置进行操控。

FIS2 `release` `-o` `-p` `-D` `-m` 在 FIS3 如何施展

#### `fis release -o` 在 FIS3 中等价配置

```js
fis.match('*.js', {
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  optimizer: fis.plugin('png-compressor')
});
```

#### `fis release -D` 在 FIS3 中等价配置

```js
fis.match('*.js', {
  domain: 'http://cdn.baidu.com'
})
```

#### `fis release -m` 在 FIS3 中等价配置

```js
fis.match('*.{js,css}', {
  useHash: true
});

//命中所有的图片类文件，包括字体等
fis.match('image', {
  useHash: true
});
```

#### `fis release -p` 在 FIS3 中等价配置

```js
fis.match('::package', {
  packager: fis.plugin('some-pack-plugin'), // 挂载一个打包插件
  spriter: fis.plugin('csssprites') // FIS2 默认启用 csssprites
});

fis.match('/widget/*.js', {
  packTo: '/static/widget_aio.js' // 匹配文件打包到此文件中
});
```

### MapJSON产出设置改变

FIS3中默认不产出map.json配置文件，但提供了一个标记符`__RESOURCE_MAP__` 支持您将map.json产出到任意位置，例如您的项目根目录下有个文件manifest.json里面包含此字符，那么产出后mapjson 静态资源表就会在其中。

### FIS2 `fis.config.set('pack', {})` 合并配置在 FIS3 如何施展

FIS2中通过数组来添加打包配置。FIS3中则是通过属性来控制打包：

```js
//fis-conf.js
fis.match('/widget/*.js', {
  packTo: '/static/widget_pkg.js'
})
```

您也可以在match中填写数组来控制打包顺序。另外简单的纯前端打包需求可以通过[自动打包插件](https://github.com/fex-team/fis3-postpackager-loader)来实现。

### 丰富的DEMO

FIS2中入门DEMO比较少，FIS3中我们提供了丰富的DEMO，从简单的合并压缩到纯前端的angular、react、vuejs等到最终结合后端smarty、php和laravel框架的解决方案都有相应的demo。具体见 https://github.com/fex-team/fis3-demo

