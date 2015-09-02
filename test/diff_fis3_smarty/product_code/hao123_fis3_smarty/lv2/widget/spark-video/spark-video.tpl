<%style%>
  <%if $head.dir=='ltr'%> 
    @import url('/widget/spark-video/ltr/ltr.css?__inline');
  <%else%> 
    @import url('/widget/spark-video/rtl/rtl.css?__inline');
  <%/if%>
  .mod-video .nav-item {width: <%if !empty($body.sparkVideo.ajaxData.size)%><%$body.sparkVideo.ajaxData.size%><%else%><%$body.sparkVideo.size%><%/if%>px;}
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
  <%require name="lv2:widget/spark-video/ltr/ltr.more.css"%> 
<%else%> 
  <%require name="lv2:widget/spark-video/rtl/rtl.more.css"%> 
<%/if%>

<div log-mod="spark-video" class="mod-video">
</div>


<%script%>
conf.video = <%json_encode($body.sparkVideo)%>;
require.async("lv2:widget/spark-video/spark-video-async.js");
<%/script%>
