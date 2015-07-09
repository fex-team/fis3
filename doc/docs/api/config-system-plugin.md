## FIS3 内置插件及配置

fis3 中内嵌了很多常用的插件。

- [fis-optimizer-clean-css](https://github.com/fex-team/fis-optimizer-clean-css)
- [fis-optimizer-png-compressor](https://github.com/fex-team/fis-optimizer-png-compressor)
- [fis-optimizer-uglify-js](https://github.com/fex-team/fis-optimizer-uglify-js)
- [fis-spriter-csssprites](https://github.com/fex-team/fis-spriter-csssprites)
- [fis3-deploy-local-deliver](https://github.com/fex-team/fis3-deploy-local-deliver)
- [fis3-deploy-http-push](https://github.com/fex-team/fis3-deploy-http-push)
- [fis3-hook-components](https://github.com/fex-team/fis3-hook-components)
- [fis3-packager-map](https://github.com/fex-team/fis3-packager-map)

可以连接到仓库介绍页面查看详情，这里将概要描述这些插件的作用及基本配置。

### [fis-optimizer-clean-css](https://github.com/fex-team/fis-optimizer-clean-css)

用于压缩 css，一般用于发布产品库代码。

```js
fis
  .media('prod')
  .match('*.css', {
    optimizer: fis.plugin('clean-css')
  });
```

配置项说明，请参考 [how-to-use-clean-css-programmatically](https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-programmatically)。

```js
fis
  .media('prod')
  .match('*.css', {
    optimizer: fis.plugin('clean-css', {
      keepBreaks: true,

      // 更多其他配置
    })
  });
```

### [fis-optimizer-png-compressor](https://github.com/fex-team/fis-optimizer-png-compressor)

用来压缩 png 文件，减少文件体积，详情请见 [pngcrush](http://pmt.sourceforge.net/pngcrush/) 和 [pngquant](https://pngquant.org/) 说明。

```js
fis
  .media('prod')
  .match('*.png', {
    optimizer: fis.plugin('png-compressor', {

      // pngcrush or pngquant
      // default is pngcrush
      type : 'pngquant'
    })
  });
```

### [fis-optimizer-uglify-js](https://github.com/fex-team/fis-optimizer-uglify-js)

用来压缩 js 文件，混淆代码，减少文件体积。

```js
fis
  .media('prod')
  .match('*.js', {
    optimizer: fis.plugin('uglify-js', {

      // https://github.com/mishoo/UglifyJS2#compressor-options
    })
  });
```

[配置说明](https://github.com/mishoo/UglifyJS2#compressor-options)

### [fis-spriter-csssprites](https://github.com/fex-team/fis-spriter-csssprites)

针对 css 规则中的 background-image 做图片优化，将多张零碎小图片合并，并自动修改 css 背景图片位置。

此插件并不会处理所有的 background-image 规则，而只会处理 url 中带 `?__sprite` 图片的规则。

```css
li.list-1::before {
  background-image: url('./img/list-1.png?__sprite');
}

li.list-2::before {
  background-image: url('./img/list-2.png?__sprite');
}
```

```js
// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
})

// 对 CSS 进行图片合并
fis.match('*.css', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});
```

详情请查看 [fis-spriter-csssprites](https://github.com/fex-team/fis-spriter-csssprites)

### [fis3-deploy-local-deliver](https://github.com/fex-team/fis3-deploy-local-deliver)
待续
