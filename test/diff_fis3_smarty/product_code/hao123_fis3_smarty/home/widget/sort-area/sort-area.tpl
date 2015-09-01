<%*   声明对ltr/rtl的css依赖    *%>
<%style%>
<%if $head.dir=='ltr'%>
	@import url('/widget/sort-area/ltr/ltr.css?__inline');
<%else%>
	@import url('/widget/sort-area/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*为两种布局抽样时暂时添加隐藏tab功能，以后会去掉*%>
<%if !empty($body.sortAreaTab) && $body.sortAreaTab.isHidden !=="true"%>
	<%foreach $body.sortAreaTab.tabs as $key => $mod%>
		<%if empty($mod.isHidden)%>
			<%$newSortAreaTab[]=$mod%>
		<%/if%>
	<%/foreach%>
	<%$body.sortAreaTab.tabs=$newSortAreaTab%>
<%/if%>

<div id="sortArea" class="mod-sort-area <%if $head.dir=='rtl' || !empty($head.sideBeLeft)%>s-mlm<%else%>s-mrm<%/if%>" log-mod="sort-area" style="visibility:hidden;">
	<%******如何拼装页面，完全根据cms是否配置了sortAreaTab，sortAreaNav以及是否显示*********%>
	<%if !empty($body.sortAreaTab) && $body.sortAreaTab.isHidden !=="true"%>
		<%widget name="home:widget/sort-area/tab/tab.tpl"%>
	<%elseif !empty($body.sortAreaNav) && $body.sortAreaNav.isHidden !=="true"%>
		<%widget name="home:widget/sort-area/nav/nav.tpl"%>
	<%/if%>
	<%if !empty($body.sortAreaTab) && $body.sortAreaTab.isHidden !=="true"%>
		<%widget name="home:widget/sort-area/container/container.tpl"%>
	<%else%>
		<%widget name="home:widget/sort-area/sort/sort.tpl"%>
	<%/if%>
</div>

<%script%>
	require.async( "common:widget/ui/jquery/jquery.js", function( $ ){
		conf = conf || {};
		conf.sortArea = conf.sortArea || {};
		$.extend( conf.sortArea, <%json_encode( $body.sortArea )%> );
		conf.sortArea.id = "sortArea";

		<%***********data属性用于框架和子模块的数据传递，目前仅日本购物用到*************%>
		conf.sortArea.data = conf.sortArea.data || {};

		<%**********如果有tab，加载tab需要的cms数据并请求相应的的js************%>
		<%if !empty($body.sortAreaTab) && $body.sortAreaTab.isHidden !=="true"%>
			conf.sortArea.sortAreaTab = conf.sortArea.sortAreaTab || {};
			<%foreach $body.sortAreaTab.tabs as $tab%>
				conf.sortArea.sortAreaTab["<%$tab.id%>"] = <%json_encode( $tab )%>;
			<%/foreach%>


			<%***重定位时同页头吸顶有冲突，需要监控页头是否已经是新版***%>
			conf.sortArea.newHeader = "<%$body.headerTest.widget%>";
			conf.sortArea.isCeiling = "<%$body.headerTest.isCeiling%>";
			conf.sortArea.ceilingMore = "<%$body.headerTest.ceilingMore%>";

			require.async( "home:widget/sort-area/sort-area-tab-async.js", function( SortArea ){
				new SortArea();
			} );

		<%**********如果快速导航，加载tab需要的cms数据并请求相应的的js************%>
		<%elseif !empty($body.sortAreaNav) && $body.sortAreaNav.isHidden !=="true"%>
			require.async( "home:widget/sort-area/sort-area-nav-async.js", function( SortAreaNav ){
				new SortAreaNav();
			} );
		<%/if%>
	} );
<%/script%>