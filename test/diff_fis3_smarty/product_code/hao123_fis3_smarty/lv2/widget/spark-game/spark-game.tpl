<%style%>
  <%if $head.dir=='ltr'%> 
    @import url('/widget/spark-game/ltr/ltr.css?__inline');
  <%else%> 
    @import url('/widget/spark-game/rtl/rtl.css?__inline');
  <%/if%>
  .mod-game .nav-item {width: <%if !empty($body.sparkGame.ajaxData.size)%><%$body.sparkGame.ajaxData.size%><%else%><%$body.sparkGame.size%><%/if%>px;}
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
  <%require name="lv2:widget/spark-game/ltr/ltr.more.css"%> 
<%else%> 
  <%require name="lv2:widget/spark-game/rtl/rtl.more.css"%> 
<%/if%>

<div log-mod="spark-game"<%if !empty($body.sparkGame.moreContent)%> class="mod-game-wrap"<%/if%>>
  <div class="mod-game"></div>
 <%if !empty($body.sparkGame.moreContent)%>
  <div class="game-more" id="gameMoreContent"></div>
 <%/if%>
</div>


<%script%>
conf.game = <%json_encode($body.sparkGame)%>;
require.async("lv2:widget/spark-game/spark-game-async.js");
<%/script%>
