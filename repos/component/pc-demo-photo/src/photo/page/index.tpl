{%extends file="common/page/layout/layout.tpl"%}
{%block name="test"%}{%/block%}
{%block name="main"%}
    {%require name="photo:static/index/index.css"%}
    {%require name="photo:static/index/index.js"%}
<h3>demo 1</h3>
<pre>
    <code>
        &lt;script type="text/javascript"&gt;
        document.getElementById('btn').onclick = function() {
                require.async(['/widget/ui/respClick/respClick.js'], function(resp) {
                resp.hello();
            });
        };
        &lt;/script&gt;
    </code>
</pre>
    <button id="btn">Button</button>
    {%script type="text/javascript" framework="common:static/common/mod.js"%}
        document.getElementById('btn').onclick = function() {
            require.async(['/widget/ui/respClick/respClick.js'], function(resp) {
                resp.hello();
            });
        };
    {%/script%}
    {%widget name="photo:widget/renderBox/renderBox.tpl"%}
{%/block%}
