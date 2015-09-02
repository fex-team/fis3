<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/sidebar-retie/ltr/ltr.css"%> <%else%> <%require name="home:widget/sidebar-retie/rtl/rtl.css"%> <%/if%>

<div id="sidebarRetie" class="mod-sidebar-retie" log-mod="sidebar-retie">
	<ul class="reties">
	</ul>
	<div class="ui-o" style="display: block;"></div>
	<div class="bottom-mask"></div>
</div>

<%script%>
    conf.sidebarRetie = <%json_encode($body.sidebarRetie)%>;
    conf.sidebarRetie.id = "sidebarRetie";
	require.async("home:widget/sidebar-retie/sidebar-retie-async.js",function( SidebarRetie ){
		new SidebarRetie( conf.sidebarRetie );
	});
<%/script%>
