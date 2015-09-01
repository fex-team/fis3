<%*   声明对ltr/rtl的css依赖    *%>
<%require name="home:widget/sidebar-worldcup/`$head.dir`/`$head.dir`.css"%>
<div id="sidebarWorldCup" class="mod-sidebar-worldcup">
	<!--<ul  class="sidebar-worldcup-control">
		<%foreach $body.sidebarWorldcup.tabItems as $tabItem%><li class="<%if $tabItem@last%>last<%/if%><%if $tabItem@first%>cur<%/if%>"><%$tabItem.tabName%></li><%/foreach%>
	</ul>-->
	<ul class="sidebar-worldcup-content">
		<li>
			<div class="worldcup-nav-wrap">
			</div>
			<div class="worldcup-slide-panel">
			</div>
		</li>
		<!--<li>
			<ul class="worldcup-teamnav-wrap">
			</ul>
			<div class="worldcup-scroll">
				<div class="worldcup-scroll-container">
					<div class="worldcup-scroll-panel">
					</div>
				</div>
			</div>
		</li>-->
	</ul>
</div>
<%script%>
	conf.worldcup = {
		startMatchWeekday: '<%$body.sidebarWorldcup.startMatchWeekday%>',
		weekdayText: '<%$body.sidebarWorldcup.weekdayText%>'
	};
	require.async("home:widget/sidebar-worldcup/sidebar-worldcup-async.js",function(sidebarWorldCup){
		var sidebarWorldCup = new sidebarWorldCup(conf.worldcup);
	   	sidebarWorldCup.init();
	});
<%/script%>
