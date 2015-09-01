<%style%>
  <%if $head.dir=='ltr'%> 
    @import url('/widget/spark-shopping/ltr/ltr.css?__inline');
  <%else%> 
    @import url('/widget/spark-shopping/rtl/rtl.css?__inline');
  <%/if%>
  .mod-site .nav-item {width: <%if !empty($body.sparkShopping.ajaxData.size)%><%$body.sparkShopping.ajaxData.size%><%else%><%$body.sparkShopping.size%><%/if%>px;}
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
  <%require name="lv2:widget/spark-shopping/ltr/ltr.more.css"%> 
<%else%> 
  <%require name="lv2:widget/spark-shopping/rtl/rtl.more.css"%> 
<%/if%>

<div log-mod="spark-shopping" class="mod-shopping">
</div>

<%script%>
conf.shopping = <%json_encode($body.sparkShopping)%>;
require.async("lv2:widget/spark-shopping/spark-shopping-async.js");
<%/script%>
