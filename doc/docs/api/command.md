## 命令

通过以下命令查看 FIS3 提供了哪些命令。

```bash
fis3 -h
```

FIS3 默认内置命令 `release`、`install`、`init`、`server`、`inspect`等命令，这些命令都是 FIS `fis-command-*` 插件提供，通过

```bash
fis3 <command>
```

来调用，详见 [command 插件]()，以下文档介绍内置的命令。

### release

> `fis3-command-release` 插件提供，默认内置

编译发布一个 FIS3 项目

```bash
$ fis3 release -h

 Usage: fis3 release [media name]

 Options:

   -h, --help            print this help message
   -d, --dest <path>     release output destination
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
  发布到当前命令执行目录服目录的 `./output` 目录下。

- `-w`、`--watch` 启动文件监听

  ```
  fis3 release -w
  ```
  会启动文件监听功能，当文件变化时会编译发布变化了的文件以及依赖它的文件。加了此参数，命令不会马上执行完，并让出命令行。想停止命令需要使用快捷键 <kbd>CTRL</kbd>+<kbd>c</kbd> 来强制停止。

- `-L`、`--live` 启动 `livereload` 功能

  ```
  fis3 release -wL
  ```

  `livereload` 功能应该跟 `watch` 功能一起使用，当某文档做了修改时，会自动刷新页面。

  @TODO

### install

> `fis-command-install` 插件提供，默认内置


### init
> `fis3-command-init` 插件提供，默认内置


### server

> `fis-command-server` 插件提供，默认内置


### inspect

> `fis3-command-inspect` 插件提供，默认内置
