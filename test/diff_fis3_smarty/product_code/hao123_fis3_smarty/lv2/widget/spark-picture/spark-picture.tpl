<%style%>
  <%if $head.dir=='ltr'%> 
    @import url('/widget/spark-picture/ltr/ltr.css?__inline');
  <%else%> 
    @import url('/widget/spark-picture/rtl/rtl.css?__inline');
  <%/if%>
  .mod-picture .nav-item {width: <%if !empty($body.sparkPicture.ajaxData.size)%><%$body.sparkPicture.ajaxData.size%><%else%><%$body.sparkPicture.size%><%/if%>px;}
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
  <%require name="lv2:widget/spark-picture/ltr/ltr.more.css"%> 
<%else%> 
  <%require name="lv2:widget/spark-picture/rtl/rtl.more.css"%> 
<%/if%>

<div log-mod="spark-picture" class="mod-picture">
</div>


<%script%>
conf.picture = <%json_encode($body.sparkPicture)%>;
require.async("lv2:widget/spark-picture/spark-picture-async.js");
<%/script%>
