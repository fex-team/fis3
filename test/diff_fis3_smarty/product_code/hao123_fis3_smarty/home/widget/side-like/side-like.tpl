<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/side-like/ltr/ltr.css"%> <%else%> <%require name="home:widget/side-like/rtl/rtl.css"%> <%/if%>

<%*   侧边栏点赞模块，支持自定义背景图   *%>	
<div class="mod-side-like" id="sideLike" log-mod="side-like" style="display:none;<%if !empty($body.sideLike)%>background: url(<%$body.sideLike.img%>) no-repeat;<%/if%>">
	<div class="like-wrap">
		<i class="i-hand ib"></i>
		<span class="like-num ib"></span>
		<i class="like-add ib"></i>
	</div>
</div>

<%script%>
	require.async('home:widget/ui/side-like/side-like-async.js');
<%/script%>
