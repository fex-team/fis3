## glob

FIS3 中支持的 glob 规则，FIS3 使用 [node-glob](https://github.com/isaacs/node-glob) 提供 glob 支持。

### 简要说明

[node-glob](https://github.com/isaacs/node-glob) 中的使用方式有很多，如果要了解全部，请前往 [node-glob](https://github.com/isaacs/node-glob)。

这里把常用的一些用法做说明。

- `*` 匹配多个除了 `/` 以外的字符
- `?` 匹配单个除了 `/` 以外的字符
- `**` 匹配多个字符**包括 `/`**
- `{}` 可以让多个规则用 `,` 逗号分隔，起到`或者`的作用
- `!` 出现在规则的开头，表示取反。即匹配不命中后面规则的文件

需要注意的是，fis 中的文件路径都是以 `/` 开头的，所以编写规则时，请尽量严格的以 `/` 开头。

当设置规则时，没有严格的以 `/` 开头，比如 `a.js`, 它匹配的是所有目录下面的 `a.js`, 包括：`/a.js`、`/a/a.js`、`/a/b/a.js`。 如果要严格只命中根目录下面的 `/a.js`, 请使用 `fis.match('/a.js')`。

另外 `/foo/*.js`， 只会命中 `/foo` 目录下面的所有 js 文件，不包含子目录。
而 `/foo/**/*.js` 是命中所有子目录以及其子目录下面的所有 js 文件，不包含当前目录下面的 js 文件。
如果需要命中 `foo` 目录下面以及所有其子目录下面的 js 文件，请使用 `/foo/**.js`。


### 扩展的规则

1. 假设匹配 `widget` 目录下以及其子目录下的所有 js 文件，使用 `node-glob` 需要这么写

  ```js
  widget/{*.js,**/*.js}
  ```

  这样写起来比较麻烦，所以扩展了这块的语法，以下方式等价于上面的用法

  ```js
  widget/**.js
  ```
2. `node-glob` 中没有捕获分组，而 fis 中经常用到分组信息，如下面这种正则用法：

  ```js
  // 让 a 目录下面的 js 发布到 b 目录下面，保留原始文件名。
  fis.match(/^\/a/(.*\.js$)/i, {
    release: '/b/$1'
  });
  ```

  由于原始 `node-glob` 不支持捕获分组，所以做了对括号用法的扩展，如下用法和正则用法等价。

  ```js
  // 让 a 目录下面的 js 发布到 b 目录下面，保留原始文件名。
  fis.match('/a/(**.js)', {
    release: '/b/$1'
  });
  ```

  ### 特殊用法（类 css 伪类）

  1. `::package` 用来匹配 fis 的打包过程。
  2. `::text` 用来匹配文本文件。

    默认识别这类后缀的文件。

    ```js
    [
      'css', 'tpl', 'js', 'php',
      'txt', 'json', 'xml', 'htm',
      'text', 'xhtml', 'html', 'md',
      'conf', 'po', 'config', 'tmpl',
      'coffee', 'less', 'sass', 'jsp',
      'scss', 'manifest', 'bak', 'asp',
      'tmp', 'haml', 'jade', 'aspx',
      'ashx', 'java', 'py', 'c', 'cpp',
      'h', 'cshtml', 'asax', 'master',
      'ascx', 'cs', 'ftl', 'vm', 'ejs',
      'styl', 'jsx', 'handlebars'
    ]
    ```

    如果你希望命中的文件类型不在列表中，请通过 `fis.set('project.fileType.text')` 扩展，多个后缀用 `,` 分割。

    ```
    fis.set('project.fileType.text', 'cpp,hhp');
    ```

  3. `::image` 用来匹配文件类型为图片的文件。

    默认识别这类后缀的文件。

    ```js
    [
      'svg', 'tif', 'tiff', 'wbmp',
      'png', 'bmp', 'fax', 'gif',
      'ico', 'jfif', 'jpe', 'jpeg',
      'jpg', 'woff', 'cur', 'webp',
      'swf', 'ttf', 'eot', 'woff2'
    ]
    ```

    如果你希望命中的文件类型不在列表中，请通过 `fis.set('project.fileType.image')` 扩展，多个后缀用 `,` 分割。

    ```
    fis.set('project.fileType.image', 'raw,bpg');
    ```
  4. `*.html:js` 用来匹配命中的 html 文件中的内嵌的 js 部分。

    fis3 htmlLike 的文件内嵌的 js 内容也会走单文件编译流程，默认只做标准化处理，如果想压缩，可以进行如下配置。

    ```js
    fis.match('*.html:js', {
        optimizer: fis.plugin('uglify-js')
    });
    ```
  5. `*.html:css` 用来匹配命中的 html 文件中内嵌的 css 部分。

    fis3 htmlLike 的文件内嵌的 css 内容也会走单文件编译流程，默认只做标准化处理，如果想压缩，可以进行如下配置。

    ```js
    fis.match('*.html:css', {
        optimizer: fis.plugin('clean-css')
    });
    ```

## 注意事项

给 [node-glob](https://github.com/isaacs/node-glob) 扩展分组功能确实还存在缺陷。分组 `()` 与 或`{}` 搭配使用时存在问题。

比如： `/a/({b,c}/**.js)` 会拆分成并列的两个规则 `/a/(b/**.js)` 和 `/a/(c/**.js)`，当这两个合成一个正则的时候，这个时候问题来了，
一个分组变成了两个分组，分组 1 为 `(b/**.js)` 分组 2 为 `(c/**.js)`。那么当希望获取捕获信息时，不能按原来的分组序号去获取了。

```js
// 错误
fis.match('/a/({b,c}/**.js)', {
  release: '/static/$1'
});

// 正确
fis.match('/a/({b,c}/**.js)', {
  release: '/static/$1$2'
});
```
