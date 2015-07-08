## 命令

通过以下命令查看 FIS3 提供了哪些命令。

```bash
~ fis3 -h

[INFO] Currently running fis3 (/usr/local/lib/node_modules/fis3/)

 Usage: fis3 <command>

 Commands:

   init                     scaffold with specifed template.
   install                  install components
   release [media name]     build and deploy your project
   server                   launch a php-cgi server
   inspect [media name]     inspect the result of fis.match

 Options:

   -h, --help                print this help message
   -v, --version             print product version and exit
   -r, --root <path>         specify project root
   -f, --file <filename>     specify the file path of `fis-conf.js`
   --no-color                disable colored output
   --verbose                 enable verbose mode
```

通过帮助信息，不难发现 FIS3 默认内置了命令 `release`、`install`、`init`、`server`、`inspect`等命令，这些命令都是 FIS `fis-command-*` 插件提供，通过

```bash
fis3 <command>
```

来调用，详见以下文档介绍内置的命令。

### release

> `fis3-command-release` 插件提供，默认内置

编译发布一个 FIS3 项目

```bash
$ fis3 release -h

 [INFO] Currently running fis3 (/usr/local/lib/node_modules/fis3/)

 Usage: fis3 release [media name]

 Options:

   -h, --help            print this help message
   -d, --dest <path>     release output destination
   -l, --lint            with lint
   -w, --watch           monitor the changes of project
   -L, --live            automatically reload your browser
   -c, --clean           clean compile cache
   -u, --unique          use unique compile caching
```

添加 `-h` 或者 `--help` 参数可以看到如上帮助信息，其中标明此命令有哪些参数并且起到什么作用。

- `-h`、`--help` 打印帮助信息
- `-d`、`--dest` 编译产出到一个特定的目录

  ```
  fis3 release -d ./output
  ```
  发布到当前命令执行目录下的 `./output` 目录下。

  ```
  fis3 release -d ../output
  ```
  发布到当前命令执行目录服目录的 `../output` 目录下, 即上一级的 `output` 目录。

- `-l`, `--lint` 启用文件格式检测

  ```
  fis3 release -l
  ```

  默认 `fis3 release` 不会启用 lint 过程，只有通过命令行参数指定了才会开启。

- `-w`、`--watch` 启动文件监听

  ```
  fis3 release -w
  ```

  会启动文件监听功能，当文件变化时会编译发布变化了的文件以及依赖它的文件。加了此参数，命令不会马上退出，而是常驻且监听文件变化，并按需再次执行。想停止命令需要使用快捷键 <kbd>CTRL</kbd>+<kbd>c</kbd> 来强制停止。

- `-L`、`--live` 启动 `livereload` 功能

  ```
  fis3 release -L
  ```

  `livereload` 功能应该跟 `watch` 功能一起使用（`-w` 在开启 `liveload` 的前提下，自动开启），当某文档做了修改时，会自动刷新页面。

- `-c`, `--clean` 清除编译缓存

  ```
  fis3 release -c
  ```

  默认 fis 的每次编译都会检测编译缓存是否有效，如果有效 fis 是不会重复编译的。开启此选项后，fis 编译前会做一次缓存清理。

- `-u`, `--unique` 启用独立缓存

  为了防止多个项目同时编译时缓存文件混乱，启用此选项后，会使用独立的缓存文件夹。一般用于编译机。



### install

> `fis-command-install` 插件提供，默认内置

用来从组件平台中下载组件到当前项目中，并自动下载其依赖。默认组件下载来源于 [fis-components](https://github.com/fis-components) 机构。
更多内容请查看 [components 文档](https://github.com/fis-components/components).

```bash
~/sanbox/test fis3 install bootstrap-datepicker

 [INFO] Currently running fis3 (/usr/local/lib/node_modules/fis3/)

Installed
├── github:fis-components/bootstrap-datepicker@v1.4.0
├── github:fis-components/bootstrap@v3.3.4
└── github:fis-components/jquery@2.1.0

~/sanbox/test tree . -L 3
.
└── components
    ├── bootstrap
    │   ├── README.md
    │   ├── affix.js
    │   ├── alert.js
    │   ├── bootstrap.js
    │   ├── button.js
    │   ├── carousel.js
    │   ├── collapse.js
    │   ├── component.json
    │   ├── css
    │   ├── dropdown.js
    │   ├── fonts
    │   ├── modal.js
    │   ├── popover.js
    │   ├── scrollspy.js
    │   ├── tab.js
    │   ├── tooltip.js
    │   └── transition.js
    ├── bootstrap-datepicker
    │   ├── README.md
    │   ├── bootstrap-datepicker.css
    │   ├── bootstrap-datepicker.js
    │   ├── bootstrap-datepicker.standalone.css
    │   ├── bootstrap-datepicker3.css
    │   ├── bootstrap-datepicker3.standalone.css
    │   └── component.json
    └── jquery
        ├── README.md
        ├── component.json
        └── jquery.js

6 directories, 25 files
```

命令使用说明

```bash
fis3 install --help

 [INFO] Currently running fis3 (/usr/local/lib/node_modules/fis3/)

  Usage: install [options] <components...>

  Options:

    -h, --help         output usage information
    --save             save component(s) dependencies into `components.json` file.
    -r, --root <path>  set project root
```

可以同时下载多个组件，多个组件之间使用空格隔开，如：

```
$ fis3 install jquery jquery-ui
```

当设置 `--save` 参数时，除了安装组件外，还会将依赖信息保存在当前项目根目录下面的 `component.json` 文件中。

### init
> `fis3-command-init` 插件提供，默认内置

fis3 脚手架工具，用来快速初始化项目。在 [fis-scaffold](https://github.com/fis-scaffold) 机构中的仓库都可以通过 `fis3 init ${模板名称}` 来初始化到当前目录。当不指定模板名称时，fis3 会使用 [default](https://github.com/fis-scaffold/default) 作为模板用来初始化。

```
fis3 init --help

 [INFO] Currently running fis3 (/usr/local/lib/node_modules/fis3/)

  Usage: init <template>

  Options:

    -h, --help         output usage information
    -r, --root <path>  set project root
```


### server

> `fis-command-server` 插件提供，默认内置

fis3 内置了一个小型 web server, 可以通过 `fis3 server start` 快速开启。如果一切正常，开启后它将自动弹出浏览器打开 `http://127.0.0.1:8080/`。

需要说明的是，fis3 自带的 server 默认是通过 java 内嵌 jetty 然后桥接 php-cgi 的方式运行的。所以，要求用户机器上必须安装有 jre 和 php-cgi 程序。

另外, fis server 是后台进行运行的，不会随着进程的结束而停止。如果想停止该服务器，请使用 `fis3 server stop` 进行关闭。

更多说明请参考命令行使用说明。

```bash
$ fis3 server --help

 [INFO] Currently running fis3 (/usr/local/lib/node_modules/fis3/)

  Usage: server <command> [options]

  Commands:

    start                  start server
    stop                   shutdown server
    restart                restart server
    info                   output server info
    open                   open document root directory
    clean                  clean files in document root
    install <name>         install server framework

  Options:

    -h, --help                     output usage information
    -p, --port <int>               server listen port
    --root <path>                  document root
    --type <php|java|node>         process language
    --rewrite [script]             enable rewrite mode
    --repos <url>                  install repository
    --timeout <seconds>            start timeout
    --php_exec <path>              path to php-cgi executable file
    --php_exec_args <args>         php-cgi arguments
    --php_fcgi_children <int>      the number of php-cgi processes
    --php_fcgi_max_requests <int>  the max number of requests
    --registry <registry>          set npm registry
    --include <glob>               clean include filter
    --exclude <glob>               clean exclude filter
    --https                        start https server

```


### inspect

> `fis3-command-inspect` 插件提供，默认内置

用来查看文件 match 结果。如下所示，将列出项目中所有文件，并显示该文件有哪些属性及属性值，以及该属性是源于哪个 `fis.match` 配置。

```bash
fis3 inspect

 [INFO] Currently running fis3 (/usr/local/lib/node_modules/fis3/)

 ~ /README.md
 -- useHash false `*`   (0th)


 ~ /comp/1-0/1-0.js
 -- useHash false `*`   (0th)
 -- isMod true `/comp/**/*.js`   (1th)
 -- release /static/comp/1-0/1-0.js `/comp/**/*.js`   (1th)


 ~ /comp/2-0/2-0.js
 -- useHash false `*`   (0th)
 -- isMod true `/comp/**/*.js`   (1th)
 -- release /static/comp/2-0/2-0.js `/comp/**/*.js`   (1th)


 ~ /comp/cal/cal.js
 -- useHash false `*`   (0th)
 -- isMod true `/comp/**/*.js`   (1th)
 -- release /static/comp/cal/cal.js `/comp/**/*.js`   (1th)


 ~ /index.html
 -- useHash false `*`   (0th)


 ~ /static/mod.js
 -- useHash false `*`   (0th)


 ~ ::package
 -- postpackager [plugin `loader`] `::package`   (2th)
```
