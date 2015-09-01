<%style%>
  <%if $head.dir=='ltr'%> 
    @import url('/widget/spark-hotsite/ltr/ltr.css?__inline');
  <%else%> 
    @import url('/widget/spark-hotsite/rtl/rtl.css?__inline');
    
  <%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
  <%require name="lv2:widget/spark-hotsite/ltr/ltr.more.css"%> 
<%else%> 
  <%require name="lv2:widget/spark-hotsite/rtl/rtl.more.css"%> 
<%/if%>

<div log-mod="spark-hotsite" class="mod-hotsite">
<%if !empty($body.sparkHotsite.list)%>
  <%foreach $body.sparkHotsite.list as $item%>
     <div  class="i-hotsite-wrap<%if $item@iteration % $body.sparkHotsite.per==0%> i-hotsite-last<%/if%>">
       <a href="<%$item.link%>" title="<%$item.title%>" <%if !empty($item.bgColor)%>style="background-color: <%$item.bgColor%>;"<%/if%>>
         <i class="i-hotsite i-hotsite-<%$item.class%>" <%if !empty($item.bgImg)%>style="background: url(<%$item.bgImg%>) no-repeat center center;"<%/if%>></i>
       </a>
     </div>
  <%/foreach%>
<%/if%>
</div>


<%script%>
require.async("lv2:widget/spark-hotsite/spark-hotsite-async.js");
<%/script%>
