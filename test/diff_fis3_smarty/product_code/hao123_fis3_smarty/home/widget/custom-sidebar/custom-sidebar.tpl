<%if $root.urlparam.isHao123 == "false"%>
<%widget name="common:widget/global-conf/global-conf.tpl"%>
<%widget name="common:widget/header/clock/clock-conf/clock-conf.tpl"%>
<%/if%>
<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
	<%require name="home:widget/custom-sidebar/ltr/ltr.css"%>
	<%require name="common:widget/css-base/dist/base.ltr.css"%>	
	<%require name="common:widget/css-base/dist/base.ltr.ie.css"%>
<%else%> 
	<%require name="home:widget/custom-sidebar/rtl/rtl.css"%> 
	<%require name="common:widget/css-base/dist/base.rtl.css"%>	
	<%require name="common:widget/css-base/dist/base.rtl.ie.css"%>	
<%/if%>
<%require name="common:widget/ui/css-ui/css-ui.css"%>
<div class="mod-custom-sidebar" log-mod="custom-sidebar" style="display:none;">
	<div class="sidebar-wrap trans-all">
		<div class="apps-wrap"></div>
		<div class="app-switch icons-wrap">
			<i class="icons switch-icon"></i>
		</div>
		<div class="app-content"></div>
	</div>
	<div class="sidebar-switch">
		<i class="switch-arrow trans-all"></i>
		<div class="arrow-wrap trans-all"></div>
	</div>

</div>

<%script%>
	conf.customSidebar = {};
	require.async("home:widget/custom-sidebar/custom-sidebar-async.js", function(customSidebar){
		window.hao123 || (window.hao123 = {});
		if (hao123.appList) {
			sb = new customSidebar(hao123.appList);
			sb.init();
		}
		
	});	

	//主站特型气泡列表，这里写一份是因为fis在编译时无法解析来自于数据的地址
	conf.customSidebar.specialBubble = {
		"sidebarVote" : '<%uri name="home:widget/sidebar-vote/sidebar-tips-vote-async.js"%>'
	};
	conf.customSidebar.newsTypeList = [
		<%foreach $body.News.news_sort as $value%>
		{
			id: '<%$value.type|default:$value@iteration%>'
		}<%if !$value@last%>,<%/if%>
		<%/foreach%>
	];
<%/script%>

