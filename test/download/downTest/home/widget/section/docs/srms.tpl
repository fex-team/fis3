<p>为了网站性能优化，除了需要对静态资源进行压缩优化，还需要对静态资源进行合并，以减少http请求。但传统的“简单文件合并”方式在大型互联网产品上往往非但不能带来性能的优化，反倒会引起性能的恶化，比如：</p>
<p><img src="/static/home/widget/section/docs/img/pack.gif" alt="传统资源合并方式导致性能恶化"></p>
<p>那么，在F.I.S中是如何解决这类问题的呢？答案就是：</p>
<pre><code>使用F.I.S对项目进行编译后会产生一张【资源表】，F.I.S的前端或后端框架利用这张表实现对静态资源的管理与优化。</code></pre>
<p><img src="/static/home/widget/section/docs/img/map.png" alt="F.I.S的静态资源管理示意图"></p>
