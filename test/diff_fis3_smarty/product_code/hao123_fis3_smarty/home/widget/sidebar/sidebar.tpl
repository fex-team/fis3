<%if $root.urlparam.isHao123 == "false"%>
<%widget name="common:widget/global-conf/global-conf.tpl"%>
<%widget name="common:widget/header/clock/clock-conf/clock-conf.tpl"%>
<%/if%>
<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%>
	<%require name="home:widget/sidebar/ltr/ltr.css"%>
	<%require name="home:widget/sidebar/ltr/right-ltr.css"%>
	<%require name="common:widget/css-base/dist/base.ltr.css"%>	
	<%require name="common:widget/css-base/dist/base.ltr.ie.css"%>
<%else%> 
	<%require name="home:widget/sidebar/rtl/rtl.css"%> 
	<%require name="common:widget/css-base/dist/base.rtl.css"%>	
	<%require name="common:widget/css-base/dist/base.rtl.ie.css"%>	
<%/if%>
<%require name="common:widget/ui/css-ui/css-ui.css"%>	
<div id="sidetoolbarContainer" class="mod-sidetoolbar-container" style="display:none;" log-mod="sidetoolbar">
	<div class="sidetoolbar" >
		<ul class="applist"></ul>			
		<div class="contents-container"></div>			
	</div>
	<div class="sidetoolbar-closebtn"></div>
</div>	
<%script%>
	require.async(["home:widget/sidebar/sidebar-async.js","common:widget/ui/jquery/jquery.js"], function(sidebar,$){
		window.hao123 || (window.hao123 = {});

		hao123.atRightSide ? $("#hao123Container").addClass("sidebar-right") : $("#hao123Container").addClass("sidebar-left");
		if (hao123.appList) {
			sb = new sidebar(hao123.appList);
			sb.init();
		}
		
	});
	conf.flowLayout = 1;
	conf.sidebarBubble = {
		"sidebarVote" : '<%uri name="home:widget/sidebar-vote/sidebar-tips-vote-async.js"%>',
	};
	
<%/script%>