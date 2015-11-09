## 调试

FIS3 构建后，默认情况下会对资源的 URL 进行修改，改成绝对路径。这时候本地双击打开文件是无法正常工作的。这给开发调试带来了绝大的困惑。

FIS3 内置一个简易 Web Server，可以方便调试构建结果。

### 目录

构建时不指定输出目录，即不指定 `-d` 参数时，构建结果被发送到内置 Web Server 的根目录下。此目录可以通过执行以下命令打开。

```bash
fis3 server open
```

### 发布

```bash
fis3 release
```

不加 `-d` 参数默认被发布到内置 Web Server的根目录下，当启动服务时访问此目录下的资源。

### 启动

通过

```bash
fis3 server start
```
来启动本地 Web Server，当此 Server 启动后，会自动浏览器打开 `http://127.0.0.1:8080`，默认监听端口 `8080`

通过执行以下命令得到更多启动参数，可以设置不同的端口号（当 `8080` 占用时）

```bash
fis3 server -h
```

### 预览

启动 Web Server 以后，会自动打开浏览器，访问 `http://127.0.0.1:8080` URL，这时即可查看到页面渲染结果。正如所有其他 Web Server，<font color="red">FIS3 内置的 Server 是常驻的，如果不重启计算机或者调用命令关闭是不会关闭的</font>。

所以后续只需访问对应链接即可，而不需要每次 `release` 就启动一次 `server`。

### 文件监听

为了方便开发，FIS3 支持文件监听，当启动文件监听时，修改文件会构建发布。而且其编译是增量的，编译花费时间少。

FIS3 通过对 `release` 命令添加 `-w` 或者 `--watch` 参数启动文件监听功能。

```bash
fis3 release -w
```
> 添加 `-w` 参数时，程序不会执行终止；停止程序用快捷键 <kbd>CTRL</kbd>+<kbd>c</kbd>

### 浏览器自动刷新

文件修改自动构建发布了，如果浏览器能自动刷新，这是一个非常好的体验。

FIS3 支持浏览器自动刷新功能，只需要给 `release` 命令添加 `-L` 参数，通常 `-w` 和 `-L` 一起使用。

```bash
fis3 release -wL
```

> 程序停止用快捷键 <kbd>CTRL</kbd>+<kbd>c</kbd>

### 发布到远端机器

当我们开发项目后，需要发布到测试机（联调机），一般可以通过如 smb、ftp 等上传代码。FIS3 默认支持使用 HTTP 上传代码，首先需要在测试机部署上传接收脚本（或者服务），这个脚本非常简单，现在给出了 [php 的实现版本](https://github.com/fex-team/fis-command-release/blob/master/tools/receiver.php)，可以把它放到测试机上某个 Web 服务根目录，并且配置一个 url 能访问到即可。

> 示例脚本是 php 脚本，测试机 Web 需要支持 PHP 的解析 <br />
> 如果需要其他语言实现，请参考这个 php 脚本实现，如果嫌麻烦，我们提供了一个 node 版本的[接收端](https://github.com/fex-team/receiver)

假定这个 URL 是：`http://cq.01.p.p.baidu.com:8888/receiver.php`

那么我们只需要在配置文件配置

```js
fis.match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://cq.01.p.p.baidu.com:8888/receiver.php',
    to: '/home/work/htdocs' // 注意这个是指的是测试机器的路径，而非本地机器
  })
})
```

> 如果你想通过其他协议上传代码，请参考 [deploy 插件开发](../api/dev-plugin.md#Deploy 插件) 实现对应协议插件即可。

- 当执行 `fis3 release` 时上传测试机器

可能上传测试机是最后联调时才会有的，更好的做法是设置特定 `media`。

```js
// 其他配置
...
fis.media('qa').match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://cq.01.p.p.baidu.com:8888/receiver.php',
    to: '/home/work/htdocs' // 注意这个是指的是测试机器的路径，而非本地机器
  })
});
```

- `fis3 release qa` 上传测试机器
- `fis3 release` 产出到本地测试服务器根目录

### 替代内置Server

FIS3 内置了一个 Web Server 提供给构建后的代码进行调试。如果你自己启动了你自己的 Web Server 依然可以使用它们。

假设你的 Web Server 的根目录是 `/Users/my-name/work/htdocs`，那么发布时只需要设置产出目录到这个目录即可。

```bash
fis3 release -d /Users/my-name/work/htdocs
```

如果想执行 `fis3 release` 直接发布到此目录下，可在配置文件配置；

```js
fis.match('*', {
  deploy: fis.plugin('local-deliver', {
    to: '/Users/my-name/work/htdocs'
  })
})
```
