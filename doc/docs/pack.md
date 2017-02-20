## 资源合并（打包）

关于资源合并，在 fis3 中有多种方式来实现。为了搞清楚他们都有些什么特点，适用于什么场合，我觉得有必要聚集在一起一一说明下。


### packTo

命中目标文件，设置 packTo 即能完成简单的合并操作。

```js
fis.match('/static/folderA/**.js', {
  packTo: '/static/pkg/folderA.js'
});

fis.match('/static/folderA/**.css', {
  packTo: '/static/pkg/folderA.css'
});
```

合并的列表中，被依赖的文件会自动提前。但是并不是所有的资源都严格的指定了依赖，所以有时候需要控制顺序。可以通过配置 `packOrder` 来控制，`packOrder` 越小越在前面。

```
fis.match('/static/folderA/**.js', {
  packTo: '/static/pkg/folderA.js'
});

fis.match('/static/folderA/file1.js', {
  packOrder: -100
});
```

这种打包方式最简单，但是对于顺序配置有点麻烦，如果 A 必须在 B 的前面，最好的方式是让 B 指定依赖 A。

### [fis3-packager-map](https://github.com/fex-team/fis3-packager-map)

packTo 其实用的就是这个插件，fis3 内部其实就是把 packTo 转成了这个插件的配置。

以下配置完全等价于上面 packTo 的配置。

```js
fis.match('::package', {
  packager: fis.plugin('map', {
    '/static/pkg/folderA.js': '/static/folderA/**.js'
  })
})
```

为什么这种变体的配置方式，是因为用这种方式很好控制顺序。此插件会按配置的顺序来打包。

```js
fis.match('::package', {
  packager: fis.plugin('map', {
    '/static/pkg/folderA.js': [
      '/static/folderA/file1.js',
      '/static/folderA/file2.js',
      '/static/folderA/**.js'
    ]
  })
})
```

### [fis3-packager-deps-pack](https://github.com/fex-team/fis3-packager-deps-pack)

deps-pack 是在 map 的基础上再扩展了用法，可以快速的命中目标文件的依赖，比如：

```
fis.match('::package', {
  packager: fis.plugin('deps-pack', {

    'pkg/hello.js': [

      // 将 main.js 加入队列
      '/static/hello/src/main.js',

      // main.js 的所有同步依赖加入队列
      '/static/hello/src/main.js:deps',

      // 将 main.js 所以异步依赖加入队列
      '/static/hello/src/main.js:asyncs',

      // 移除 comp.js 所有同步依赖
      '!/static/hello/src/comp.js:deps'
    ],

    // 也可以从将 js 依赖中 css 命中。
    'pkg/hello.css': [
      // main.js 的所有同步依赖加入队列
      '/static/hello/src/main.js:deps',
    ]

  })
});
```

以上示例中还有中特殊的用法，即 `!` 打头的规则。他可以在现有结果集中做排除处理。

这种打包方式最复杂，但是很多情况下，你需要这些规则来做打包细化。

### [fis3-postpackager-loader](https://github.com/fex-team/fis3-postpackager-loader)

其实它并不是专门做打包的，而是做资源加载的插件。只是他能提供另一种更简单的打包方式。

他以页面为单位，分析当前页面用到的所有资源，将所有 js 合并成一个 js，所有的 css 合并成一个 css.

```
fis.match('::package', {
  postpackager: fis.plugin('loader', {
    allInOne: true
  })
});
```

非常简单粗暴，但是有两个缺点。

1. 因为他是前端编译期分析，对于使用了后端模板的页面资源分析无能为力，所以它只能适用于纯前端项目。
2. 它的资源合并是以页面为单位，所以存在公共 js/css 被复制成多分打包多个包里面，导致的结果是，页面间切换，公共部分的 js/css 是没有公用缓存的。

  但是这个问题还是能结合前面提到的插件解决的。比如：

  ```
  fis.match('/static/folderA/**.js', {
    packTo: '/static/pkg/folderA.js'
  });
  ```

  以上配置和 loader 的 allInOne 同时配置了的话，结果会是这样的， folderA 下面的资源被打包到 folderA.js 中，同时页面里面的**其他资源**走 allInOne 打包。

  所以只要勤快点，是可以把公用的资源抽出来的。


