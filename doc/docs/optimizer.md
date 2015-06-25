## 压缩优化

压缩资源可以有效的减少网络传输字节大小，来缩短资源的网络传输时间，这个是前端工程优化中最常见的优化手段。

在 FIS3 中调用压缩优化插件来进行压缩优化，而且这个过程非常简单。

### JavaScript 进行压缩优化

```js
fis.match('*.js', {
  // fis-optimizer-uglify-js
  optimizer: fis.plugin('uglify-js', {
    
  })
});
```

### CSS 进行压缩优化

```js
fis.match('*.js', {
  // fis-optimizer-clean-css
  optimizer: fis.plugin('clean-css', {
    
  })
});
```

### 图片进行压缩优化

FIS 集成压缩工具 `pngcrush` 和 `pngquant` 对 png 图片进行压缩。

```js
fis.match('*.png', {
  // fis-optimizer-clean-css
  optimizer: fis.plugin('png-compress', {
    type: 'pngquant' // 默认是 pngcrush
  })
});
```