## 全局属性

全局属性通过 `fis.set` 设置，通过 `fis.get` 获取；

### 内置的默认配置

```js
var DEFAULT_SETTINGS = {
  project: {
    charset: 'utf8',
    md5Length: 7,
    md5Connector: '_',
    files: ['**'],
    ignore: ['node_modules/**', 'output/**', '.git/**', 'fis-conf.js']
  },

  component: {
    skipRoadmapCheck: true,
    protocol: 'github',
    author: 'fis-components'
  },

  modules: {
    hook: 'components',
    packager: 'map'
  },

  options: {}
};
```

### project.charset

* 解释：指定项目编译后产出文件的编码。
* 值类型：``string``
* 默认值：'utf8'
* 用法：在项目的fis-conf.js里可以覆盖为

    ```js
    fis.set('project.charset', 'gbk');
    ```

### project.md5Length

* 解释：文件MD5戳长度。
* 值类型：``number``
* 默认值：7
* 用法：在项目的fis-conf.js里可以修改为

    ```js
    fis.set('project.md5Length', 8);
    ```

### project.md5Connector

* 解释：设置md5与文件的连字符。
* 值类型：``string``
* 默认值：`_`
* 用法：在项目的fis-conf.js里可以修改为

    ```js
    fis.set('project.md5Connector ', '.');
    ```

### project.files

* 解释：设置项目源码文件过滤器。
* 值类型：`Array`
* 默认值：'**'
* 用法：

    ```js
    fis.set('project.files', ['*.html']);
    ```

### project.ignore
* 解释：排除某些文件
* 值类型：`Array`
* 默认值：`['node_modules/**', 'output/**', 'fis-conf.js']`
* 用法

    ```
    fis.set('project.ignore', ['*.bak']); // set 为覆盖不是叠加
    ```

### project.fileType.text

* 解释：追加文本文件后缀列表。
* 值类型：``Array`` | ``string``
* 默认值：无
* 说明：fis系统在编译时会对文本文件和图片类二进制文件做不同的处理，文件分类依据是后缀名。虽然内部已列出一些常见的文本文件后缀，但难保用户有其他的后缀文件，内部已列入文本文件后缀的列表为： [ **'css', 'tpl', 'js', 'php', 'txt', 'json', 'xml', 'htm', 'text', 'xhtml', 'html', 'md', 'conf', 'po', 'config', 'tmpl', 'coffee', 'less', 'sass', 'jsp', 'scss', 'manifest', 'bak', 'asp', 'tmp'** ]，用户配置会 **追加**，而非覆盖内部后缀列表。
* 用法：编辑项目的fis-conf.js配置文件

    ```js
    fis.set('project.fileType.text', 'tpl, js, css');
    ```

### project.fileType.image

* 解释：追加图片类二进制文件后缀列表。
* 值类型：``Array`` | ``string``
* 默认值：无
* 说明：fis系统在编译时会对文本文件和图片类二进制文件做不同的处理，文件分类依据是后缀名。虽然内部已列出一些常见的图片类二进制文件后缀，但难保用户有其他的后缀文件，内部已列入文本文件后缀的列表为： [ **'svg', 'tif', 'tiff', 'wbmp', 'png', 'bmp', 'fax', 'gif', 'ico', 'jfif', 'jpe', 'jpeg', 'jpg', 'woff', 'cur'** ]，用户配置会 **追加**，而非覆盖内部后缀列表。
* 用法：编辑项目的fis-conf.js配置文件

    ```js
    fis.set('project.fileType.image', 'swf, cur, ico');
    ```

## 文件属性

fis3 以文件属性控制文件的编译合并以及各种操作；文件属性包括基本属性和插件属性，插件属性是为了方便在不同的插件扩展点设置插件；

### 基本属性
- [release](#release)
- [packTo](#packTo)
- [packOrder](#packOrder)
- [query](#query)
- [id](#id)
- [url](#url)
- [charset](#charset)
- [isHtmlLike](#isHtmlLike)
- [isCssLike](#isCssLike)
- [isJsLike](#isJsLike)
- [useHash](#useHash)
- [domain](#domain)
- [rExt](#rExt)
- [useMap](#useMap)
- [isMod](#isMod)
- [extras](#extras)
- [requires](#requires)
- [useSameNameRequire](#useSameNameRequire)

#### release
* 解释：设置文件的产出路径。默认是文件相对项目根目录的路径，以 / 开头。该值可以设置为 false ，表示为不产出（unreleasable）文件。
* 值类型：`string`
* 默认值：无

    ```js
    fis.match('/widget/{*,**/*}.js', {
        isMod: true,
        release: '/static/$0'
    });
    ```

#### packTo
* 解释：分配到这个属性的文件将会合并到这个属性配置的文件中
* 值类型：`string`
* 默认值：无

    ```
    fis.match('/widget/{*,**/*}.js', {
        packTo: '/static/pkg_widget.js'
    })
    ```
    widget 目录下的所有 js 文件将会被合并到 /static/pkg_widget.js 中。
    **packTo 设置的是源码路径，也会受到已经设置的 fis.match 规则的影响**，比如可以配置[fis.match](#fis.match()) 来更改 `packTo` 的产出路径或者 url；

    ```js
    fis.match('/static/pkg_widget.js', {
        release: '/static/${namespace}/pkg/widget.js' // fis.set('namespace', 'home'),
        url: '/static/new/${namespace}/pkg/widget.js'
    })
    ```

#### packOrder
* 解释：用来控制合并时的顺序，值越小越在前面。配合 `packTo` 一起使用。
* 值类型：`Integer`
* 默认值：`0`
 
```javascript
fis.match('/*.js', {
  packTo: 'pkg/script.js'
})

fis.match('/mod.js', {
  packOrder: -100
})
```

#### query
* 解释：指定文件的资源定位路径之后的query，比如'?t=123124132'。
* 值类型：`string`
* 默认值：无

    ```js
    fis.set('new date', Date.now());
    fis.match('*.js', {
        query: '?=t' + fis.get('new date')
    });
    ```

#### id
* 解释：指定文件的资源id。默认是 **namespace + subpath** 的值
* 值类型：`string`
* 默认值：**namespace + subpath**

    如下方例子，假设 `/static/lib/jquery.js` 设定了特定的 id `jquery`,
    那么在使用这个组件的时候，可以直接用这个 id；

    ```js
    fis.match('/static/lib/jquery.js', {
        id: 'jquery',
        isMod: true
    });
    ```

    使用

    ```js
    var $ = require('jquery');
    ```

#### moduleId
* 解释：指定文件资源的模块id。在插件``fis3-hook-module``里面自动包裹``define``的时候会用到，默认是 id 的值。
* 类型：`string`
* 默认值：`**namespace + subpath**`

   ```js
    fis.match('/static/lib/a.js', {
        id: 'a',
        moduleId: 'a'
        isMod: true
    });
    ```
    
    编译前
    ```js
    exports.a = 10
    ```
    
    编译后
    ```js
    define('a',function(require,exports,module){
      exports.a = 10
    })
    ```
    

#### url
* 解释：指定文件的资源定位路径，以 / 开头。默认是 [release](#release) 的值，url可以与发布路径 release 不一致。
* 值类型：`string`
* 默认值：无

    ```js
    fis.match('*.{js,css}', {
        release: '/static/$0',
        url: '/static/new_project/$0'
    })
    ```

#### charset
* 解释：指定文本文件的输出编码。默认是 utf8，可以制定为 gbk 或 gb2312等。
* 值类型：`string`
* 默认值：无

    ```js
    fis.match('some/file/path', {
        charset: 'gbk'
    });
    ```

#### isHtmlLike
* 解释：指定对文件进行 [html](../user-dev/extlang.md#html) 相关语言能力处理
* 值类型：`bool`
* 默认值：无

#### isCssLike
* 解释：指定对文件进行 [css](../user-dev/extlang.md#css) 相关的语言能力处理
* 值类型：`bool`
* 默认值：无

#### isJsLike
* 解释：指定对文件进行 [js](../user-dev/extlang.md#js) 相关的语言能力处理
* 值类型：`string`
* 默认值：无

#### useHash
* 解释：文件是否携带 md5 戳
* 值类型：`bool`
* 默认值：false
* 说明：文件分配到此属性后，其 url 及其产出带 md5 戳；

    ```js
    fis.match('*.css', {
        useHash: false
    });

    fis.media('prod').match('*.css', {
        useHash: true
    });

    ```
    - fis3 release 时不带hash
    - fis3 release prod 时带 hash

#### domain
* 解释：给文件 URL 设置 domain 信息
* 值类型：`string`
* 默认值：无
* 说明：如果需要给某些资源添加 cdn，分配到此属性的资源 url 会被添加 domain；

    ```js
    fis.media('prod').match('*.js', {
        domain: 'http://cdn.baidu.com/'
    });
    ```
    - fis3 release prod 时添加cdn

#### rExt
* 解释：设置最终文件产出后的后缀
* 值类型：`string`
* 默认值：无
* 说明：分配到此属性的资源的真实产出后缀

    ```js
    fis.match('*.less', {
        rExt: '.css'
    });
    ```
    源码为`.less`文件产出后修改为`.css`文件；

#### useMap
* 解释：文件信息是否添加到 map.json
* 值类型：`bool`
* 默认值：无
* 说明： 分配到此属性的资源出现在静态资源表中，现在对 js、css 等文件默认加入了静态资源表中；

    ```js
    fis.match('logo.png', {
        useMap: true
    });
    ```

#### isMod
* 解释：标示文件是否为组件化文件。
* 值类型：`bool`
* 默认值：无
* 说明：标记文件为组件化文件。被标记成组件化的文件会入map.json表。并且会对js文件进行组件化包装。

    ```js
    fis.match('/widget/{*,**/*}.js', {
        isMod: true
    });
    ```

#### extras
* 注释：在[静态资源映射表][]中的附加数据，用于扩展[静态资源映射表][]表的功能。
* 值类型：`Object`
* 默认值：无
* 说明：无

    ```js
    fis.match('/page/layout.tpl', {
        extras: {
            isPage: true
        }
    });
    ```

#### requires
* 注释：默认依赖的资源id表
* 值类型：`Array`
* 默认值：无
* 说明：

    ```js
    fis.match('/widget/*.js', {
        requires: [
            'static/lib/jquery.js'
        ]
    });
    ```

#### useSameNameRequire
* 注释：开启同名依赖
* 值类型：`bool`
* 默认值：`false`
* 说明：当设置开启同名依赖，模板会依赖同名css、js；js 会依赖同名 css，不需要显式引用。

    ```js
    fis.match('/widget/**', {
        useSameNameRequire: true
    });
    ```

### 插件属性

插件属性决定了匹配的文件进行哪些插件的处理；

- [lint](#lint)
- [parser](#parser)
- [preprocessor](#preprocessor)
- [standard](#standard)
- [postprocessor](#postprocessor)
- [optimizer](#optimizer)

#### lint

启用 lint 插件进行代码检查

```js
fis.match('*.js', {
    lint: fis.plugin('js', {

    })
})
```

[更多插件](http://npmsearch.com/?q=fis-lint%20fis3-lint)

#### parser

启用 parser 插件对文件进行处理；

如编译less文件

```js
fis.match('*.less', {
   parser: fis.plugin('less'), //启用fis-parser-less插件
   rExt: '.css'
});
```

如编译sass文件

```js
fis.match('*.sass', {
    parser: fis.plugin('sass'), //启用fis-parser-sass插件
    rExt: '.css'
});
```

[更多插件](http://npmsearch.com/?q=fis-parser%20fis3-parser)

#### preprocessor
标准化前处理

```js
fis.match('*.{css,less}', {
    paser: fis.plugin('image-set')
});
```

[更多插件](http://npmsearch.com/?q=fis-preprocessor%20fis3-preprocessor)

#### standard
自定义标准化，可以自定义 uri、embed、require 等三种能力，可自定义三种语言能力的语法；

[更多插件](http://npmsearch.com/?q=fis-standard%20fis3-standard)

#### postprocessor
标准化后处理

```js
fis.match('*.{js,tpl}', {
   postprocessor: fis.plugin('require-async')
});
```
[更多插件](http://npmsearch.com/?q=fis-postprocessor%20fis3-postprocessor)

#### optimizer

启用优化处理插件，并配置其属性

```js
fis.match('*.css', {
    optimizer: fis.plugin('clean-css')
});
```

[更多插件](http://npmsearch.com/?q=fis-optimizer%20fis3-optimizer)



#### 打包阶段插件

打包阶段插件设置时**必须分配给所有文件**，设置时必须 match `::package`，不然不做处理。

```js
fis.match('::package', {
    packager: fis.plugin('map'),
    spriter: fis.plugin('csssprites')
});
```

##### prepackager

- 解释：打包预处理插件
- 值类型：`Array` | `fis.plugin` | `function`
- 默认值：无
- 用法：

    ```js
    fis.match('::package', {
        prepackager: fis.plugin('plugin-name')
    })
    ```

##### packager

- 解释：打包插件
- 值类型：`Array` | `fis.plugin` | `function`
- 默认值：无
- 用法：

    ```js
    fis.match('::package', {
        packager: fis.plugin('map')
    })
    ```

    *例子*
    ```js
    fis.media('prod').match('::package', {
        packager: fis.plugin('map')
    });
    ```

    `fis3 release prod` 当在 prod 状态下进行打包

##### spriter

- 解释：打包后处理csssprite的插件。
- 值类型：`Array` | `fis.plugin` | `function`
- 默认值：无
- 用法：

    ```js
    fis.match('::package', {
        spriter: fis.plugin('csssprites')
    })
    ```

    *例子*
    ```js
    fis.media('prod').match('::package', {
        spriter: fis.plugin('csssprites')
    });
    ```

    `fis3 release prod` 当在 prod 状态下进行 csssprites 处理

##### postpackager

- 解释：打包后处理插件。
- 值类型：`Array` | `fis.plugin` | `function`
- 默认值：无
- 用法：

    ```js
    fis.match('::package', {
        postpackager: fis.plugin('plugin-name')
    })
    ```

    *例子*
    ```js
    fis.media('prod').match('::package', {
        postpackager: fis.plugin('plugin-name')
    });
    ```

    `fis3 release prod` 当在 prod 状态下调用打包后处理插件

#### deploy

- 解释：设置项目发布方式
- 值类型：`Array` | `fis.plugin` | `function`
- 默认值：`fis.plugin('local-deliver')`
- 说明：编译打包后，新增发布阶段，这个阶段主要决定了资源的发布方式，而这些方式都是以插件的方式提供的。比如你想一键部署到远端或者是把文件打包到 Tar/Zip 又或者是直接进行 Git 提交，都可以通过设置此属性，调用相应的插件就能搞定了。
- 用法：

    假设项目开发完后，想部署到其他机器上，我们选择 http 提交数据的方式部署

    ```js
    fis.match('**', {
        deploy: fis.plugin('http-push', {
            receiver: 'http://target-host/receiver.php', // 接收端
            to: '/home/work/www' // 将部署到服务器的这个目录下
        })
    })
    ```

- 常用插件
    - [local-deliver](https://github.com/fex-team/fis3-deploy-local-deliver)
    - [http-push](https://github.com/fex-team/fis3-deploy-http-push)
    - [replace](https://github.com/fex-team/fis3-deploy-replace)
    - [encoding](https://github.com/fex-team/fis3-deploy-encoding)
