F.I.S的官网就是使用fis系统进行开发的，获取该网站的代码并观察里面的代码运行是体验F.I.S最直接的方式：

1. 安装fis
    
    ```bash
    npm install -g fis
    ```

1. 安装用于编译markdown的fis插件 [fis-parser-marked](https://github.com/fouber/fis-parser-marked)

    ```bash
    npm install -g fis-parser-marked
    ```

1. 启动fis的调试服务器（注意添加 ``--no-rewrite`` 参数），如果报错 ``没有php-cgi环境``，请 [安装](http://windows.php.net/downloads/releases/php-5.2.17-nts-Win32-VC6-x86.zip) 它，并把php-cgi命令加到系统的环境变量中：

    ```bash
    fis server start --no-rewrite
    ```

1. 使用 ``fis server install <name>`` 命令给调试服务器安装运行官网项目的所依赖的smarty库：

    ```bash
    fis server install smarty
    ```

1. 创建一个项目目录并进入，使用 ``fis install <name>`` 命令来获取官网项目demo，将其安装到当前目录下：

    ```bash
    mkdir project
    cd project
    fis install fis-site
    ```
1. 对项目进行编译，fis会将产出后的代码投送到调试目录下：

    ```bash
    fis release
    ```

1. 浏览 [http://localhost:8080]() 即可看到fis官网的样子啦！
1. 使用 fis release 命令的 ``--optimize``，``--md5``，``--pack`` 参数来对网站进行 ``优化``，``加md5戳``，``打包``：

    ```bash
    fis release --optimize --md5 --pack
    ```

1. 再次浏览 [http://localhost:8080]() 页面，其源码均已实现优化。
1. 浏览 [http://localhost:8080?debug]() 页面，可看到散列的资源输出，而非合并后的。
1. 使用 fis release 命令的 ``--watch`` 参数对项目进行文件监控，此时可以进入 ``保存即发布`` 状态：

    ```bash
    fis release --optimize --md5 --pack --watch
    ```

1. 追加 ``--live`` 参数可以进入 ``发布即刷新`` 状态：

    ```bash
    fis release --optimize --md5 --pack --watch --live
    ```

1. 使用 fis release 命令的 "--dest" 参数，将代码输出到指定目录：

    ```bash
    fis release --optimize --md5 --pack --dest ../output
    ```

### 前端集成解决方案解读：

> 不要担心，F.I.S对目录结构 **没有任何限制**，都是依靠 ``fis-conf.js`` 来配置的，做到了 **目录规范的可配置化**。

* 前端组件化框架： [lib/js/mod.js](https://github.com/zjcqoo/mod)，由于fis可以很好的控制资源的加载与依赖管理，无需运行时复杂的管理逻辑，组件化管理成本非常低，因此我们实现了一套非常简洁的前端组件化框架。
* 模板框架：由于网站使用smarty作为模板引擎，因此， [静态资源管理系统](https://github.com/fis-dev/fis/wiki/基于map.json的前后端架构设计指导) 以smarty插件的形式实现， ``plugin`` 目录下的重要文件有：
    * FISResource.class.php：静态资源管理系统
    * compiler.require.php：模板中加载资源的插件
    * compiler.widget.php：组件化调用插件
    * compiler.script.php：页面javascript收集插件
* 自动化工具： ``fis release``， 用于对项目进行编译、打包、优化、建立资源表
* 辅助开发工具： ``fis server``，用于创建本地调试服务器，对项目进行开发与调试
    