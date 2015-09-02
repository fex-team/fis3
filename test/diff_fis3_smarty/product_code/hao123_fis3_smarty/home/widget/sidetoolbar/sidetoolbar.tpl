	
<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/sidetoolbar/ltr/ltr.css"%> <%else%> <%require name="home:widget/sidetoolbar/rtl/rtl.css"%> <%/if%>
<%require name="common:widget/ui/css-ui/css-ui.css"%>	
	<div id="sidetoolbarContainer" style="display:none;" log-mod="sidetoolbar">
		<div class="sidetoolbar" >
			<ul class="applist"></ul>			
			<div class="contents-container"></div>			
		</div>
		<div class="sidetoolbar-closebtn"></div>
	</div>	
<%script%>

	conf.sidetoolbar = <%json_encode($body.sidetoolbar)%>;
	require.async("home:widget/sidetoolbar/sidetoolbar-async.js", function(sideToolBar){
		sideToolBar();
	});
<%/script%>