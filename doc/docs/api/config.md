
> 本文提及配置 API & 属性都可以在 [配置 API](./config-api.md) 和 [配置属性](./config-props.md) 找到

FIS3 配置设计了一套类似 css 的规则，而就如同 css 一样，有 `!important` 也有 `@media`，那么就在这篇文档中揭露我们的类 css 配置；**默认情况下，配置文件写到 `fis-conf.js`文件中，此文件放到项目的根目录下，或说有此文件的目录被看做是项目根目录**

> 以下例子配置内容，都应该指的是 fis-conf.js 的内容，不再特别说明；

通过 API [fis.match()][] FIS3 在处理的时候首先会加载项目内的所有文件，然后通过 [fis.match()][] 来为某一个文件分配不同的属性，这些属性叫做[文件属性][]。这些属性控制这个文件经过怎么样的操作；

先来一个例子

**启用插件的例子**

```js
fis.match('a.js', {
    optimizer: fis.plugin('uglify-js')
});

fis.match('b.min.js', {
    optimizer: null
})
```

如上面，a.js 文件分配了属性，其中处理过程中会调用 `fis-optimizer-uglify-js` 插件进行压缩；而已经压缩过的 b.min.js 就不需要进行压缩了，那么它的 optimizer 就设置为 `null`；
> 可以不设置这个属性为 `null` 因为默认为 `null`

**规则覆盖的例子**

假设 [fis.match()][] 给若干文件**分配**了属性，当两个规则之间匹配的文件相同时，后设置的可以覆盖前面设置的属性，如果前面规则没有某属性则追加；

```js
fis.match('{a,b,c}.js', {
    optimizer: fis.plugin('uglify-js')
});

fis.match('{a,b}.js', {
    isMod: true,
    optimizer: null
});

```
- `c.js` 分配到的属性是 `{optimizer: fis.plugin('uglify-js')}`，意思是最终会被压缩
- `a.js` 和 `b.js` 分配到的属性是 `{isMod: true, optimizer: null}` 意思是最终会附带属性 [isMod](./config-props.md#isMod) 并进行组件化处理、不做压缩

通过上面两个例子，大家不难看出；FIS3 设计的是一套类 css 的配置体系，那么其中 `fis.match()` 就是用来设置规则的；其中第一个参数可当成是 `selector` 其设置的类型是 [glob][] 或者是 [正则][]；

### media
多状态，刚才说到过，FIS3 中都靠给文件分配不同属性来决定这个文件经过哪些处理的；那么 media 就能让我们在不同状态（情形）下给文件分配不同属性；这个任务就由 [fis.media()][] 完成；

假设我们有如下需求，当在开发阶段资源都不压缩，但是在上线时做压缩，那么这个配置如何写呢；

```js
//default `dev` mode
fis.match('**.js', {

});

fis.media('prod')
    .match('**.js', {
        optimizer: fis.plugin('uglify-js')
    })
    .match('**.css', {
        optimizer: fis.plugin('clean-css')
    });
```

这样就写完了，那么怎么在编译发布的时候使用 `media` 呢，是这样的；

```
fis3 release <media>
```
那么对上面的配置

- `fis3 release` 默认开发状态不做压缩
- `fis3 release prod` 上线编译调用


### important

[fis.match()][] 的第三个参数就是设置 **!important** 的，那么设置了这个属性后，后面的规则就无法覆盖了。

比如

```js
fis.match('{a,b,c}.js', {
    optimizer: fis.plugin('uglify-js')
}, true);

fis.match('a.js', {
    optimizer: null
})
```
这样的设置下，当 `a.js` 处理使还是会被调用压缩器进行压缩；

### ::package

```js
fis.match('::package', {
   packager: fis.plugin('map')
});
```
表示当 [packager][] 阶段**所有的文件**都分配某些属性

### ::image

```js
// 所有被标注为图片的文件添加 hash
fis.match('::image', {
  useHash: true
});
```
- [project.fileType.image](./config-props.md#project.fileType.image)

### ::text

```js
// 所有被标注为文本的文件去除 hash
fis.match('::text', {
  useHash: false
});
```
- [project.fileType.text](./config-props.md#project.fileType.text) 

### :js

匹配模板中的内联 js，支持 [isHtmlLike](./config-props.md#isHtmlLike) 的所有模板

```js
// 压缩 index.html 内联的 js
fis.match('index.html:js', {
  optimizer: fis.plugin('uglify-js')
});

// 压缩 index.tpl 内联的 js
fis.match('index.tpl:js', {
  optimizer: fis.plugin('uglify-js')
})
```

### :css

匹配模板中内联 css，支持 [isHtmlLike](./config-props.md#isHtmlLike) 的所有模板

```js
// 压缩 index.html 内联的 css
fis.match('index.html:css', {
  optimizer: fis.plugin('clean-css')
});

// 压缩 index.tpl 内联的 css
fis.match('index.tpl:js', {
  optimizer: fis.plugin('clean-css')
})
```


[fis.match()]: ./config-api.md#fis.match()
[fis.media()]: ./config-api.md#fis.media()
[文件属性]: ./config-props.md#文件属性
[glob]: ./config-glob.md
[packager]: ./config-props.md#打包时插件
