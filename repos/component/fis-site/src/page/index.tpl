{%html class="expanded"%}
{%head%}
    <meta charset="utf-8"/>
    <meta content="{%$description%}" name="description">
    <title>{%$title%}</title>
    <!--[if lt IE 9]>
        <script src="/lib/js/html5.js"></script>
    <![endif]-->
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    {%require name="lib/css/bootstrap.css"%}
    {%require name="lib/css/bootstrap-responsive.css"%}
    {%require name="lib/js/mod.js"%}
    {%require name="lib/js/jquery-1.10.1.js"%}
    {%require name="page/index.js"%}
{%/head%}
{%body%}
    <div id="wrapper">
        <div id="sidebar">
            {%widget
                name="widget/sidebar/sidebar.tpl"
                data=$docs
            %}
        </div>
        <div id="container">
            {%widget name="widget/slogan/slogan.tpl"%}
            {%foreach $docs as $index=>$doc%}
                {%widget
                    name="widget/section/section.tpl"
                    call="section"
                    data=$doc index=$index
                %}
            {%/foreach%}
			<div id="vedio">
				<a href="http://v.youku.com/v_show/id_XNjA3NzQzNDY0.html"><img src="/lib/img/vedio.png" alt="ÊÓÆµ½Ì³Ì" style="max-width:100%;"></a>
			</div>
			 
        </div>
    </div>
    {%require name="page/index.css"%}
    {%script%}var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F70b541fe48dd916f7163051b0ce5a0e3' type='text/javascript'%3E%3C/script%3E"));{%/script%}
{%/body%}
{%/html%}