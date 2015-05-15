<p>F.I.S的官网就是使用fis系统进行开发的，获取该网站的代码并观察里面的代码运行是体验F.I.S最直接的方式：</p>
<ol>
    <li><p>安装fis</p>
        <pre><code class="lang-bash"> npm install -g fis</code></pre>
    </li>
    <li><p>安装用于编译markdown的fis插件 <a href="https://github.com/fouber/fis-parser-marked">fis-parser-marked</a></p>
        <pre><code class="lang-bash"> npm install -g fis-parser-marked</code></pre>
    </li>
    <li><p>启动fis的调试服务器（注意添加 <code>--no-rewrite</code> 参数），如果报错 <code>没有php-cgi环境</code>，请 <a href="http://windows.php.net/downloads/releases/php-5.2.17-nts-Win32-VC6-x86.zip">安装</a> 它，并把php-cgi命令加到系统的环境变量中：</p>
        <pre><code class="lang-bash"> fis server start --no-rewrite</code></pre>
    </li>
    <li><p>使用 <code>fis server install &lt;name&gt;</code> 命令给调试服务器安装运行官网项目的所依赖的smarty库：</p>
        <pre><code class="lang-bash"> fis server install smarty</code></pre>
    </li>
    <li><p>创建一个项目目录并进入，使用 <code>fis install &lt;name&gt;</code> 命令来获取官网项目demo，将其安装到当前目录下：</p>
<pre><code class="lang-bash"> mkdir project
        cd project
        fis install fis-site</code></pre>
    </li>
    <li><p>对项目进行编译，fis会将产出后的代码投送到调试目录下：</p>
        <pre><code class="lang-bash"> fis release</code></pre>
    </li>
    <li><p>浏览 <a href=""><a href="http://localhost:8080">http://localhost:8080</a></a> 即可看到fis官网的样子啦！</p>
    </li>
    <li><p>使用 fis release 命令的 <code>--optimize</code>，<code>--md5</code>，<code>--pack</code> 参数来对网站进行 <code>优化</code>，<code>加md5戳</code>，<code>打包</code>：</p>
        <pre><code class="lang-bash"> fis release --optimize --md5 --pack</code></pre>
    </li>
    <li><p>再次浏览 <a href=""><a href="http://localhost:8080">http://localhost:8080</a></a> 页面，其源码均已实现优化。</p>
    </li>
    <li>浏览 <a href=""><a href="http://localhost:8080?debug">http://localhost:8080?debug</a></a> 页面，可看到散列的资源输出，而非合并后的。</li>
    <li><p>使用 fis release 命令的 <code>--watch</code> 参数对项目进行文件监控，此时可以进入 <code>保存即发布</code> 状态：</p>
        <pre><code class="lang-bash"> fis release --optimize --md5 --pack --watch</code></pre>
    </li>
    <li><p>追加 <code>--live</code> 参数可以进入 <code>发布即刷新</code> 状态：</p>
        <pre><code class="lang-bash"> fis release --optimize --md5 --pack --watch --live</code></pre>
    </li>
    <li><p>使用 fis release 命令的 &quot;--dest&quot; 参数，将代码输出到指定目录：</p>
        <pre><code class="lang-bash"> fis release --optimize --md5 --pack --dest ../output</code></pre>
    </li>
</ol>
<h3>前端集成解决方案解读：</h3>
<blockquote>
    <p>不要担心，F.I.S对目录结构 <strong>没有任何限制</strong>，都是依靠 <code>fis-conf.js</code> 来配置的，做到了 <strong>目录规范的可配置化</strong>。</p>
</blockquote>
<ul>
    <li>前端组件化框架： <a href="https://github.com/zjcqoo/mod">lib/js/mod.js</a>，由于fis可以很好的控制资源的加载与依赖管理，无需运行时复杂的管理逻辑，组件化管理成本非常低，因此我们实现了一套非常简洁的前端组件化框架。</li>
    <li>模板框架：由于网站使用smarty作为模板引擎，因此， <a href="https://github.com/fis-dev/fis/wiki/基于map.json的前后端架构设计指导">静态资源管理系统</a> 以smarty插件的形式实现， <code>plugin</code> 目录下的重要文件有：<ul>
            <li>FISResource.class.php：静态资源管理系统</li>
            <li>compiler.require.php：模板中加载资源的插件</li>
            <li>compiler.widget.php：组件化调用插件</li>
            <li>compiler.script.php：页面javascript收集插件</li>
        </ul>
    </li>
    <li>自动化工具： <code>fis release</code>， 用于对项目进行编译、打包、优化、建立资源表</li>
    <li>辅助开发工具： <code>fis server</code>，用于创建本地调试服务器，对项目进行开发与调试</li>
</ul>
