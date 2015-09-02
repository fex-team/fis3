<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
	<%require name="home:widget/sidebar-history/ltr/ltr.more.css"%>
<%else%> 
	<%require name="home:widget/sidebar-history/rtl/rtl.more.css"%> 
<%/if%>

<div id="historysitesSidebar" class="mod-historysites favsite-count" log-mod="historysites">
	<div class="sidebar-hotsite-hist">
		<div class="sidebar-hotsite-hist_bg">
			<i></i>
			<span><%$body.history.defaultText%></span>
		</div>
		<div class="sidebar-hotsite-content"></div>
	</div>
</div>
<%script%>
	window.conf || (window.conf = {});
	conf.sidebarHistory = {
		id: "historysitesSidebar",
		maxBlock: 10
	};
	require.async("home:widget/sidebar-history/sidebar-history-c.js", function (handler) {
		handler.init();
	});
<%/script%>
