<p>执行 <strong>fis --help</strong> 让我们来看一下fis命令的相关帮助：</p>
<pre><code>Usage: fis &lt;command&gt;

        Commands:

        release     build and deploy your project
        install     install components and demos
        server      launch a php-cgi server

        Options:

        -h, --help     output usage information
        -v, --version  output the version number
        --no-color     disable colored output</code></pre>
<p>正如你所见，使用fis你需要——也只需要——记住三条命令：</p>
<ul>
    <li><strong><a href="https://github.com/fis-dev/fis/wiki/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B#fis-install-name">fis install</a></strong>：安装fis仓库提供的各种 <strong>组件，框架，库，样例项目，甚至配置文件</strong> 等模块</li>
    <li><strong><a href="https://github.com/fis-dev/fis/wiki/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B#fis-release-options">fis release</a></strong>： 编译并发布你的项目，使用该命令即可满足前端开发的所有需求，包括 <strong>less、coffee等语言的编译、自定义预处理、三种语言能力扩展、校验、测试、优化、打包、csssprite等</strong>。</li>
    <li><strong><a href="https://github.com/fis-dev/fis/wiki/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B#fis-server-command-options">fis server</a></strong>：启动一个 <strong>1.8M</strong> 大小的内置调试服务器，它采用php-java-bridge技术实现， <em>依赖java、php-cgi外部环境</em> ，可以 <strong>完美支持运行php程序</strong> 哦。</li>
</ul>
<p>比如，你想在编译的时候一次执行fis的 <code>文件监听</code> 、 <code>自动刷新</code> 、 <code>压缩优化</code> 、 <code>添加md5戳</code> 、 <code>添加domain</code> 、 <code>测试</code> 、 <code>校验</code> 、 <code>打包</code> 、 <code>多机器多目录上传</code> 功能，那么你可以执行命令：</p>
<pre><code class="lang-bash">fis release --watch --live --optimize --md5 --domains --test --lint --pack --dest remote,local,output</code></pre>
<p>或者</p>
<pre><code class="lang-bash">fis release -wLomDtlpd remote,local,output</code></pre>
