## 常用插件列表


### parser 插件

#### [fis-parser-babel-5.x](https://github.com/fex-team/fis-parser-babel-5.x)

支持 es6、es7 或者 jsx 编译成 es5

```js
fis.match('*.jsx', {
  parser: fis.plugin('babel-5.x')
})
```

#### [fis3-parser-typescript](https://github.com/fex-team/fis3-parser-typescript)

支持 typescript、es6 或者 jsx 编译成 js。速度相比 babel 略快，但是 es7 跟进较慢。

```js
fis.match('*.jsx', {
  parser: fis.plugin('typescript')
})
```

#### [fis-parser-less-2.x](https://github.com/fouber/fis-parser-less-2.x)

支持 less 编译成 css

```js
fis.match('*.less', {
  parser: fis.plugin('less-2.x'),
  rExt: '.css'
})
```

#### [fis-parser-node-sass](https://github.com/fex-team/fis-parser-node-sass)

支持 sass/scss 编译成 css。

```js
fis.match('*.scss', {
  rExt: '.css',
  parser: fis.plugin('node-sass', {
    // options...
  })
})
```

#### [fis-parser-jdists](https://github.com/fex-team/fis-parser-jdists)

一款强大的代码块预处理工具。比如加上如下配置，在 `debug` 注释中的代码，在正式环境下自动移除。

```js
fis.media('production').match('*.js', {
  parser: fis.plugin('jdists', {
    remove: "debug"
  })
})
```

```js
/*<debug>*/
// 这段代码在 fis3 release production 的时候会被移除。
console.log(debug);
/*</debug>*/
```

### preprocessor 插件


#### [fis3-preprocessor-js-require-css](https://github.com/fex-team/fis3-preprocessor-js-require-css)

允许你在 js 中直接 `require` css 文件。

```js
fis.match('*.{js,es,es6,jsx,ts,tsx}', {
  preprocessor: fis.plugin('js-require-css')
})
```

#### [fis3-preprocessor-js-require-file](https://github.com/fex-team/fis3-preprocessor-js-require-file)

允许你在 js 中直接 `require` 文件。比如图片，json, 其他静态文件。

require 部分将会替换成部署后的 url。 同时还支持，如果文件小于 20K 直接替换成 base64 字符串。

```js
fis.match('*.{js,es,es6,jsx,ts,tsx}', {
  preprocessor: fis.plugin('js-require-file')
})
```

### [fis3-preprocessor-autoprefixer](https://www.npmjs.com/package/fis3-preprocessor-autoprefixer)

自动给 css 属性添加前缀，让标准的 css3 支持更多的浏览器.

```js
fis.match('*.{css,less,scss}', {
  preprocessor: fis.plugin('autoprefixer', {
    "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
    "cascade": true
  })
})
```

### postprocessor 插件

待补充

### optimizer 插件

#### [fis-optimizer-uglify-js](https://github.com/fex-team/fis-optimizer-uglify-js)

压缩 js 代码。

```
fis.match('*.{js,jsx,ts,tsx,es6,es}', {
  optimizer: fis.plugin('uglify-js')
});
```

#### [fis-optimizer-clean-css](https://github.com/fex-team/fis-optimizer-clean-css)

压缩 css 代码。

```
fis.match('*.{scss,sass,less,css}', {
  optimizer: fis.plugin('clean-css',{
      //option
  })
})
```

#### [fis-optimizer-png-compressor](https://github.com/fex-team/fis-optimizer-png-compressor)

压缩 png 图片。

```js
fis.match('*.png', {
  optimizer: fis.plugin('png-compressor',{
      //option
  })
})
```

#### [fis-optimizer-smarty-xss](https://github.com/fex-team/fis-optimizer-smarty-xss)

smarty xss 修复插件。 [fis3-smarty](https://github.com/fex-team/fis3-smarty) 中已默认配置好。

```
fis.match('*.tpl', {
  optimizer: fis.plugin('smarty-xss')
})
```


#### [fis-optimizer-html-compress](https://github.com/pianist829/fis-optimizer-html-compress)

smarty html 代码压缩插件。 [fis3-smarty](https://github.com/fex-team/fis3-smarty) 中已默认配置好。

```
fis.match('*.tpl', {
  optimizer: fis.plugin('html-compress')
})
```

#### [jello-optimizer-velocity-xss](https://github.com/fex-team/jello-optimizer-velocity-xss)

velocity 模板 xss 修复插件。

```
fis.match('*.vm', {
  optimizer: fis.plugin('velocity-xss')
})
```


### package 插件

#### [fis3-packager-map](https://github.com/fex-team/fis3-packager-map)

在 fis3 中自带了， 默认的打包插件。详情见插件 [Readme](https://github.com/fex-team/fis3-packager-map)

#### [fis3-packager-deps-pack](https://github.com/fex-team/fis3-packager-deps-pack)

支持包含依赖的打包插件

```js
fis.match('::packager', {
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

#### [fis3-postpackager-loader](https://github.com/fex-team/fis3-postpackager-loader)

静态资源前端加载器，纯前端项目必备插件。自动加载页面中用到的资源，同时还能按页面级别的All In One 打包。

```
fis.match('::packager', {
  postpackager: fis.plugin('loader')
});
```


### deploy 插件

#### [fis3-deploy-local-deliver](https://github.com/fex-team/fis3-deploy-local-deliver)

已自带 fis3 中。用来将文件产出到本地。

```js
fis.match('*.js', {
    deploy: fis.plugin('local-deliver', {
        to: './output'
    })
})
```

#### [fis3-deploy-http-push](https://github.com/fex-team/fis3-deploy-http-push)

将产出文件通过 http post 到目标机器。

```js
fis.match('*.js', {
    deploy: fis.plugin('http-push', {
        //如果配置了receiver，fis会把文件逐个post到接收端上
        receiver: 'http://www.example.com:8080/receiver.php',
        //这个参数会跟随post请求一起发送
        to: '/home/fis/www'
    })
})
```

#### [fis3-deploy-tar](https://github.com/fex-team/fis3-deploy-tar)

将产出文件，打包成 tar 文件。

```
fis.match('**', {
  deploy: [
    fis.plugin('tar'),

    fis.plugin('local-deliver', {
      to: './output'
    })
  ]
})
```

#### [fis3-deploy-zip](https://github.com/fex-team/fis3-deploy-zip)

将产出文件，打包成 zip 文件。

```
fis.match('**', {
  deploy: [
    fis.plugin('zip'),

    fis.plugin('local-deliver', {
      to: './output'
    })
  ]
})
```

#### [fis3-deploy-encoding](https://github.com/fex-team/fis3-deploy-encoding)

将产出的文件做编码处理。

```
fis.match('**', {
    charset: 'gbk',
    deploy: [
        fis.plugin('encoding'),
        fis.plugin('local-deliver')
    ]
});
```

#### [fis3-deploy-replace](https://github.com/fex-team/fis3-deploy-replace)

将产出的文件，做文本替换。

```
fis.match('**', {
    deploy: [
        fis.plugin('replace', {
            from: /(img|cdn)\.baidu\.com/,
            to: function ($0, $1) {
                switch ($1) {
                    case 'img':
                        return '127.0.0.1:8080';
                    case 'cdn':
                        return '127.0.0.1:8081';
                }
                return $0;
            }
        }),
        fis.plugin('local-deliver')
    ]
});
```

#### [fis3-deploy-skip-packed](https://github.com/fex-team/fis3-deploy-skip-packed)

将产出的文件过滤掉已被打包的。

```
fis.match('**', {
  deploy: [
    fis.plugin('skip-packed', {
      // 配置项
    }),

    fis.plugin('local-deliver', {
      to: 'output'
    })
  ]
})
```

### hook 插件

#### [fis3-hook-commonjs](https://github.com/fex-team/fis3-hook-commonjs)

[强烈推荐] CommonJs 模块化支持插件。 详情请见 [README](https://github.com/fex-team/fis3-hook-commonjs)

```
fis.hook('commonjs')
```


#### [fis3-hook-amd](https://github.com/fex-team/fis3-hook-amd)

AMD 模块化支持插件。

#### [fis3-hook-cmd](https://github.com/fex-team/fis3-hook-cmd)

CMD 模块化支持插件。

#### [fis3-hook-system](https://github.com/fex-team/fis3-hook-system)

System 模块化支持插件。

#### [fis3-hook-node_modules](https://github.com/fex-team/fis3-hook-node_modules)

支持 npm 组件的插件，npm 包中的模块，直接通过包名就能 `require` 到。

```
fis.hook('node_modules');
```

#### [fis3-hook-releative](https://github.com/fex-team/fis3-hook-relative)

支持产出为相对路径。
