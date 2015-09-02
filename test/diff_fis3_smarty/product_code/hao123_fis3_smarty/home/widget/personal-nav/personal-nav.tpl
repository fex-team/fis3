<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/personal-nav/ltr/ltr.css"%> <%else%> <%require name="home:widget/personal-nav/rtl/rtl.css"%> <%/if%>

<div class="mod-personal-nav" log-mod="personal-nav" style="display:none">
		<div class="title">
			<i class="title-icon"></i>
			<span class="title-word"><%$body.personalNav.title%></span>
		</div>
		<i class="empty-icon"></i>
		<ul class="websites">
		</ul>
		<span class="emptyTip"><%$body.personalNav.emptyTip%></span>	
</div>

<%script%>
	conf.personalNav = {
		"emptyTip" : "<%$body.personalNav.deleteTip%>",
		"okTip" : "<%$body.personalNav.okTip%>",
		"cancelTip" : "<%$body.personalNav.cancelTip%>",
		"defaultIcon" : "<%$body.personalNav.defaultIcon%>"

	}
	require.async('home:widget/personal-nav/personal-nav-async.js');
<%/script%>