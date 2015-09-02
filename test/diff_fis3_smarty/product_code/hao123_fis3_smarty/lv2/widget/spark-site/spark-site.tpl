<%style%>
  <%if $head.dir=='ltr'%> 
    @import url('/widget/spark-site/ltr/ltr.css?__inline');
  <%else%> 
    @import url('/widget/spark-site/rtl/rtl.css?__inline');
  <%/if%>
  .mod-site .nav-item {width: <%if !empty($body.sparkSite.ajaxData.size)%><%$body.sparkSite.ajaxData.size%><%else%><%$body.sparkSite.size%><%/if%>px;}
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
  <%require name="lv2:widget/spark-site/ltr/ltr.more.css"%> 
<%else%> 
  <%require name="lv2:widget/spark-site/rtl/rtl.more.css"%> 
<%/if%>

<div log-mod="spark-site" class="mod-site">
</div>


<%script%>
conf.site = <%json_encode($body.sparkSite)%>;
require.async("lv2:widget/spark-site/spark-site-async.js");
<%/script%>
