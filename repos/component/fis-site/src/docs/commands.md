执行 **fis --help** 让我们来看一下fis命令的相关帮助：

    
    Usage: fis <command>
    
    Commands:
    
      release     build and deploy your project
      install     install components and demos
      server      launch a php-cgi server
    
    Options:
    
      -h, --help     output usage information
      -v, --version  output the version number
      --no-color     disable colored output
    
正如你所见，使用fis你需要——也只需要——记住三条命令：

* **[fis install](https://github.com/fis-dev/fis/wiki/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B#fis-install-name)**：安装fis仓库提供的各种 **组件，框架，库，样例项目，甚至配置文件** 等模块
* **[fis release](https://github.com/fis-dev/fis/wiki/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B#fis-release-options)**： 编译并发布你的项目，使用该命令即可满足前端开发的所有需求，包括 **less、coffee等语言的编译、自定义预处理、三种语言能力扩展、校验、测试、优化、打包、csssprite等**。
* **[fis server](https://github.com/fis-dev/fis/wiki/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B#fis-server-command-options)**：启动一个 **1.8M** 大小的内置调试服务器，它采用php-java-bridge技术实现， _依赖java、php-cgi外部环境_ ，可以 **完美支持运行php程序** 哦。

比如，你想在编译的时候一次执行fis的 ``文件监听`` 、 ``自动刷新`` 、 ``压缩优化`` 、 ``添加md5戳`` 、 ``添加domain`` 、 ``测试`` 、 ``校验`` 、 ``打包`` 、 ``多机器多目录上传`` 功能，那么你可以执行命令：

```bash
fis release --watch --live --optimize --md5 --domains --test --lint --pack --dest remote,local,output
```

或者

```bash
fis release -wLomDtlpd remote,local,output
```