<style>
	.side-mod-preload-anchorbar{
		border:1px solid #e3e5e6;
		border-bottom:1px solid #d7d8d9;
		background: #f5f7f7;
		height: 62px;
	}
	.side-mod-preload-anchorbar > *{
		visibility: hidden;
	}
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/anchorbar/ltr/ltr.css"%> <%else%> <%require name="home:widget/anchorbar/rtl/rtl.css"%> <%/if%>


<%*monkey配置未知*%>
	<div class="mod-anchorbar box-border" id="sideAnchorBar" monkey="sideanchorbar" log-mod="anchorbar">
		<div class='anchor-nav' id='anchorNav'></div>
		<div class='anchor-prompt' id='anchorPrompt'></div>
	</div>
	<%script%>
	conf.anchorbar = {
		'dir' : "<%$head.dir%>",
		'anchors' : <%json_encode($body.anchorbar)%>
		// 'anchors': [
		// 		<%foreach $body.anchorBar as $mod%>
		// 			<%if $mod.show == '1'%>
		// 			{
		// 				'modName': '<%$mod@key%>',
		// 				'title': '<%$mod.title%>',
		// 				'prompt': '<%$mod.prompt%>',
		// 				'group': '<%$mod.group|lower|default:'none'%>'
		// 			}
		// 			<%/if%>
		// 			<%if !$mod@last%>,<%/if%>
		// 		<%/foreach%>
		// 		]
	};
	require.async(["common:widget/ui/jquery/jquery.js", "home:widget/anchorbar/anchorbar-async.js"], function($ , init){
		//目前首页情况下，保证dom.ready后再初始化anchorbar可以解决定位问题
		$(function(){
			init(conf.anchorbar);
			delete conf.anchorbar;
		});
	});
	<%/script%>
