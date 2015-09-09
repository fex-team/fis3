## FIS3 常用配置

### 制定目录规范

相信在前端工程化开发中，目录规范是必不可少的，比如哪些目录下是组件，哪些目录下的 js 要被特殊的插件处理，满足特殊的需求，比如对 commonjs、AMD 的支持。

这一节给大家介绍目录规范的制定，把它跟部署目录衔接起来；

源码目录规范

```
.
├── page
│   └── index.html
├── static
│   └── lib
├── test
└── widget
    ├── header
    ├── nav
    └── ui
```

- page 放置页面模板
- widget 一切组件，包括模板、css、js、图片以及其他前端资源
- test 一些测试数据、用例
- static 放一些组件公用的静态资源
- static/lib 放置一些公共库，例如 jquery, zepto, lazyload 等

当编译产出时，产出结果目录是这样的；

```
.
├── static
├── template
└── test
```

- static 所有的静态资源都放到这个目录下
- template 所有的模板都放到这个目录下
- test 还是一些测试数据、用例

那么，我们的源码目录规范的指定是为了我们好维护，其产出目录规范是为了我们容易部署。

用 fis3 可以很方便的搞定这个事情；

*fis-conf.js*
```js
// 所有的文件产出到 static/ 目录下
fis.match('*', {
    release: '/static/$0'
});

// 所有模板放到 tempalte 目录下
fis.match('*.html', {
    release: '/template/$0'
});

// widget源码目录下的资源被标注为组件
fis.match('/widget/**/*', {
    isMod: true
});

// widget下的 js 调用 jswrapper 进行自动化组件化封装
fis.match('/widget/**/*.js', {
    postprocessor: fis.plugin('jswrapper', {
        type: 'commonjs'
    })
});

// test 目录下的原封不动产出到 test 目录下
fis.match('/test/**/*', {
    release: '$0'
});
```

这样就完成了**目录规范**的制定

等等，可能我们还需要做一些优化，来实现对整个工程的优化；

需要做以下几个方面的事情

- js, css 在开发时不压缩，但在产品发布时压缩
- 代码进行合理的合并处理

```js
// 所有的文件产出到 static/ 目录下
fis.match('*', {
    release: '/static/$0'
});

// 所有模板放到 tempalte 目录下
fis.match('*.html', {
    release: '/template/$0'
});

// widget源码目录下的资源被标注为组件
fis.match('/widget/**/*', {
    isMod: true
});

// widget下的 js 调用 jswrapper 进行自动化组件化封装
fis.match('/widget/**/*.js', {
    postprocessor: fis.plugin('jswrapper', {
        type: 'commonjs'
    })
});

// test 目录下的原封不动产出到 test 目录下
fis.match('/test/**/*', {
    release: '$0'
});

// optimize
fis.media('prod')
    .match('*.js', {
        optimizer: fis.plugin('uglify-js', {
            mangle: {
                expect: ['require', 'define', 'some string'] //不想被压的
            }
        })
    })
    .match('*.css', {
        optimizer: fis.plugin('clean-css', {
            'keepBreaks': true //保持一个规则一个换行
        })
    });

// pack
fis.media('prod')
    // 启用打包插件，必须匹配 ::package
    .match('::package', {
        packager: fis.plugin('map'),
        spriter: fis.plugin('csssprites', {
            layout: 'matrix',
            margin: '15'
        })
    })
    .match('*.js', {
        packTo: '/static/all_others.js'
    })
    .match('*.css', {
        packTo: '/staitc/all_others.js'
    })
    .match('/widget/**/*.js', {
        packTo: '/static/all_comp.js'
    })
    .match('/widget/**/*.css', {
        packTo: '/static/all_comp.css'
    });
```
- 发布 `fis3 release prod`，进行合并、压缩等优化
- 发布 `fis3 release` 不做压缩不做合并

### 部署远端测试机

由于前端项目的特殊性，一般都需要放到服务器上去运行，那么在本地开发完成后，需要把**编译产出**部署到测试远端机器上面去，这节就给大家分享一下在 fis3 这个操作怎么做；

在 fis3 中用 [fis.media](基础配置#media) 提供各个状态区分，那么我们也可以轻松制定不同状态下的发布方式；比如要部署到 `qa` 的机器上抑或是 `rd` 的机器；

准备工作，我们先选定自己需要使用的 deploy 插件，在 fis3 部署方式都是用插件实现的；

- [fis3-deploy-http-push](/fex-team/fis3-deploy-http-push)

这个插件就是以 HTTP 提交的方式来完成远端部署的，当然由于安全性等原因这种方式只适用于测试阶段，**请勿直接拿来上线**；

HTTP 提交的方式上传就得有一个接受端，`http-push` 提供了一个 php 版本的接收端 [receiver.php]() ，其他后端可以模仿实现一个。这个接收端需要放到你的 Web 服务 WWW 目录下，并且可以被访问到；

部署好接收端，并且它能正常被访问到，比如 url 是 `http:///receiver.php` 其配置如下

```js
fis.media('qa').match('**', {
    deploy:  fis.plugin('http-push', {
        receiver: 'http:///receiver.php',
        to: '/home/work/www'
    })
});
```

- `fis3 release qa` 当执行时就会部署到配置的 qa 的机器上。

### 异构语言 less 的使用
```js
fis.match('**.less', {
    parser: fis.plugin('less'), // invoke `fis-parser-less`,
    rExt: '.css'
});
```


### 异构语言 sass 的使用
```js
fis.match('**.sass', {
    parser: fis.plugin('sass'), // invoke `fis-parser-sass`,
    rExt: '.css'
});
```


### 前端模板的使用

```js
fis.match('**.tmpl', {
    parser: fis.plugin('utc'), // invoke `fis-parser-utc`
    isJsLike: true    
});
```

### 某些资源不产出

```js
fis.match('*.inline.css', {
  // 设置 release 为 FALSE，不再产出此文件
  release: false
})
```

### 某些资源从构建中去除

FIS3 会读取全部项目目录下的资源，如果有些资源不想被构建，通过以下方式排除。

```js
fis.set('project.ignore', [
  'output/**',
  'node_modules/**',
  '.git/**',
  '.svn/**'
]);
```
