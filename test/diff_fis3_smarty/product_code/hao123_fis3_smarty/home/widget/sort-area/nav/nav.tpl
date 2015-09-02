<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%>
	<%require name="home:widget/sort-area/nav/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/sort-area/nav/rtl/rtl.css"%>
<%/if%>

<%if !empty($body.sortAreaNav) && $body.sortAreaNav.isHidden !=="true"%>
	<div class="sortsites-tabs-container" log-mod="sortsites" style="display:none;">
		<div class="bubble-like" style="display:none;">
				<span><%$body.sortAreaNav.bubbleLike%></span>
				<i></i>
			</div>
		<div class="sortsites-tabs">
			<span class="sortsites-tabs-description">
				<i></i>
				<%$body.sortAreaNav.tabDescription%>
			</span>
			<ul class="tab-lists">
				<ul class="block_sep"></ul>
				<%foreach $body.sortAreaNav.tabList as $listValue%>
					<li>
						<a href="javascript:void(0)" class="tab-item" item-index="<%$listValue.itemIndex%>" target="_self"><%$listValue.sortName%></a>
						<em class="sortsite_sep"></em>
					</li>
				<%/foreach%>
			</ul>
			<a class="sortsites-tabs-refresh" href="javascript:void(0)" target="_self">
				<i></i>
				<span><%$body.sortAreaNav.refreshDescription%></span>
			</a>
		</div>
	</div>
<%/if%>
<%script%>
	conf = conf || {};
	conf.sortArea = conf.sortArea || {};
	conf.sortArea.sortAreaNav = conf.sortArea.sortAreaNav || {};
	conf.sortArea.sortAreaNav.opt = {
		show:"<%$body.sortAreaNav.showBubble%>",
		paddingTop:"<%$body.sortAreaNav.paddingTop%>",
		paddingTop1:"<%$body.sortAreaNav.paddingTop1%>",
		newHeader:"<%$body.headerTest.widget%>",
		isCeiling:"<%$body.headerTest.isCeiling%>",
		ceilingMore:"<%$body.headerTest.ceilingMore%>"
	};
<%/script%>
