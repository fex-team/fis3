
<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/sidebar-appbox/ltr/ltr.css"%> <%else%> <%require name="home:widget/sidebar-appbox/rtl/rtl.css"%> <%/if%>

<div id="sidebarAppbox" class="mod-sidebar-appbox" log-mod="sidebar-appbox">
	<ul class="apps">
	</ul>
</div>

<%script%>
    conf.sidebarAppbox = <%json_encode($body.sidebarAppbox)%> ;
	require.async("home:widget/sidebar-appbox/sidebar-appbox-async.js",function(sidebarAppbox){
		sidebarAppbox();
	});
<%/script%>
