{%function name="li_maker" data=[]%}
    {%foreach $data as $item%}
    <li><a href="{%$item.href%}">{%$item.title%}</a></li>
    {%/foreach%}
{%/function%}

<h2>widget run!{%$abc%}</h2>
<ul>
    {%li_maker data=$data%}
</ul>


{%script%}
    var list = require('photo:widget/list/list.js');
    console.log(list);
{%/script%}