

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="common:widget/header/banner/ltr/ltr.more.css"%> <%else%> <%require name="common:widget/header/banner/rtl/rtl.more.css"%> <%/if%>


<div class="userbar-banner <%if $head.dir=='ltr'%>fr<%else%>fl<%/if%>">
	<%if isset($body.banner.url)%>
	<a href="<%$body.banner.url%>" title="<%$body.banner.title%>">
		<img src="<%$body.banner.src%>" alt="<%$body.banner.title%>" title="<%$body.banner.title%>">
	</a>
	<%else%>
	<img src="<%$body.banner.src%>" alt="<%$body.banner.title%>" title="<%$body.banner.title%>">
	<%/if%>
</div>

