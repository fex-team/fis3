<p>我们知道，单凭没有刻度的直尺和圆规就可以实现很多作图操作，那么，解决前端领域开发问题的“尺”与“规”是什么呢？F.I.S团队经过不断的实践和总结发现前端编译工具只须处理三件事，即可满足几乎所有的初等前端开发问题，这三件事就是三种语言能力：</p>
<ul>
    <li><strong>资源定位</strong>：编译中将开发时所使用的资源定位标识转换为上线后的值；</li>
    <li><strong>内容嵌入</strong>：编译中文本文件的内容或者二进制文件（如图片）的base64编码嵌入到另一个文件中；</li>
    <li><strong>依赖声明</strong>：编译中识别文件内标记的对其他资源的依赖声明；</li>
</ul>
<blockquote>
    <p>下图为资源定位能力示意图</p>
</blockquote>
<p><img src="/static/home/widget/section/docs/img/uri.png" alt="资源定位示意图"></p>
<p>有了这三种语言能力，你的团队前端工业化水平将有很大的提升。F.I.S编译工具在前端三种领域语言中分别实现了这三种能力的扩展：</p>
<ul>
    <li>在html中：<a href="https://github.com/fis-dev/fis/wiki/在html中定位资源">定位资源</a>、<a href="https://github.com/fis-dev/fis/wiki/在html中嵌入资源">嵌入资源</a>、<a href="https://github.com/fis-dev/fis/wiki/在html中声明依赖">声明依赖</a></li>
    <li>在js中：<a href="https://github.com/fis-dev/fis/wiki/在js中定位资源">定位资源</a>、<a href="https://github.com/fis-dev/fis/wiki/在js中嵌入资源">嵌入资源</a>、<a href="https://github.com/fis-dev/fis/wiki/在js中声明依赖">声明依赖</a></li>
    <li>在css中：<a href="https://github.com/fis-dev/fis/wiki/在css中定位资源">定位资源</a>、<a href="https://github.com/fis-dev/fis/wiki/在css中嵌入资源">嵌入资源</a>、<a href="https://github.com/fis-dev/fis/wiki/在css中声明依赖">声明依赖</a></li>
</ul>
