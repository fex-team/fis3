{%html%}
{%head%}
    <meta charset="utf-8"/>
    <title>name-----</title>
{%/head%}
{%body%}
    
    {%require name="photo:libs/mod.js"%}
    {%require name="photo:index.js"%}
    
    <img src="images/npm.png"/>
    
    <h2>hello world fis.</h2>
    <p>I'm a boy.</p>
    
    <!--widget-->
    {%widget name="photo:widget/list/list.tpl" data=$data%}
    
    <ul>
        <!--call widget function-->
        {%widget name="photo:widget/list/list.tpl" call="li_maker" data=$data%}
    </ul>
    
    {%require name="photo:index.css"%}
{%/body%}
{%/html%}