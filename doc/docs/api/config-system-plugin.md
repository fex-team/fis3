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

用来支持 fis3 本地部署能力，将 fis3 编译产出到指定目录。

```js
fis.match('*.js', {
  deploy: fis.plugin('local-deliver', {
      to: '/var/www/myApp'
  })
})
```

### [fis3-deploy-http-push](https://github.com/fex-team/fis3-deploy-http-push)

用来支持 fis3 远程部署能力，将 fis3 编译通过 http post 方式发送到远程服务端。

```js
fis.match('*.js', {
    deploy: fis.plugin('http-push', {

        // 如果配置了receiver，fis会把文件逐个post到接收端上
        receiver: 'http://www.example.com:8080/receiver.php',

        // 这个参数会作为文件路径前缀附加在 $_POST['to'] 里面。
        to: '/home/fis/www'
    })
})
```

### [fis3-hook-components](https://github.com/fex-team/fis3-hook-components)

用来支持 `短路径` 引用安装到本地的 [component](https://github.com/fis-components)。

如： `fis3 install bootstrap` 后，在页面中可以这么写。


```html
<link xxx href="bootstrap/css/bootstrap-theme.css" />
<script src="boostrap/button.js"></script>

<!--或者直接用模块化的方式引用 js-->
<script type="text/javascript">
  require(['bootstrap', 'bootstrap/button']);
</script>
```

此功能已自动开启。

### [fis3-packager-map](https://github.com/fex-team/fis3-packager-map)

用来支持 fis 简单的打包，无需额外设置，已自动开启。

```js
fis.match('*.css', {
  packTo: '/pkg/all.css'
});

fis.match('*.js', {
  packTo: '/pkg/all.js'
});
```
