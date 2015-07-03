## FIS2 to FIS3

> [FIS](https://github.com/fex-team/fis) 以下统称 FIS2

FIS3 配置上很灵活，通过给文件分配属性，由这些属性控制编译流程。不像 FIS2 给 `release` 添加参数就能搞定很多事情了，比如所有静态资源压缩、加 md5、打包、加 domain等，这些功能在 FIS3 中必须通过配置文件配置进行操控。

### FIS2 `release` `-o` `-p` `-D` `-m` 在 FIS3 如何施展

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
fis.match('*.css', {
  useHash: true
});
```

#### `fis release -p` 在 FIS3 中等价配置

```js
fis.match('::packager', {
  packager: fis.plugin('some-pack-plugin'), // 挂载一个打包插件
  spriter: fis.plugin('csssprites') // FIS2 默认启用 csssprites
});

fis.match('/widget/*.js', {
  packTo: '/static/widget_aio.js' // 匹配文件打包到此文件中
});
```

### FIS2 `fis.config.set('pack', {})` 在 FIS3 如何施展

如上，对 `fis release -p` 的讲解中，也说明了一些，这块主要说一些兼容情况。
