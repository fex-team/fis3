<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir==ltr%> <%require name="home:widget/sidebar-spoilers/ltr/ltr.css"%> <%else%> <%require name="home:widget/sidebar-spoilers/rtl/rtl.css"%> <%/if%>

<div id="sidebarSpoilers" class="mod-sidebar-spoilers" log-mod="sidebar-spoilers">
	<ul class="spoilers">
		
	</ul>
</div>

<%script%>
	conf.spoilersNum = <%json_encode($body.sidetoolbar.leftSideGuidBubble.spoilersNum)%>;
	require.async("home:widget/sidebar-spoilers/sidebar-spoilers-async.js",function(sidebarSpoilers){
		sidebarSpoilers();
	});
<%/script%>
