
<%assign var="sBoxTag" value=$body.searchBox.sBoxTag%>
<%assign var="hSearchWords" value=$body.searchBox.hotSearchWords%>
<%assign var="sBtnWords" value=$body.searchBox.searchBtnWords%>
<%widget name="common:widget/search-box-4ps-cookie/`$head.dir`/`$head.dir`.tpl"%>
<%* 搜索框 --- 首屏模块 inline css*%>
<%style%>
	<%if $head.dir=='ltr'%>
		@import url('/widget/search-box-4ps-cookie/ltr/ltr.css?__inline');
	<%else%>
		@import url('/widget/search-box-4ps-cookie/rtl/rtl.css?__inline');
	<%/if%>
<%/style%>
<%if isset($sysInfo.country)%>
<%widget name="common:widget/search-box-4ps-cookie/`$sysInfo.country`/`$sysInfo.country`.tpl"%>
<%/if%>
<%script%>
	require.async(["common:widget/ui/jquery/jquery.js", "common:widget/search-box-4ps-cookie/search-box-4ps-cookie-async.js"], function ($) {
		var autoFocusSearch = true;
		<%if $body.extAppMod%>
		autoFocusSearch = false;  //if app show DO NOT autoFocus
		<%/if%>
		<%if !empty($body.searchBox.sugUrl)%>
		$.ajax({
			url: "<%$body.searchBox.sugUrl%>",
			dataType: "script",
			cache: true,
			success: function () {
				baidu_sug.setMode('baidu');
				baidu_sug.toggle(false);
				Gl.searchGroup({type: conf.pageType, autoFocus: autoFocusSearch});
			}
		});
		<%else%>
		baidu_sug = false;
		Gl.searchGroup({type: conf.pageType, autoFocus: autoFocusSearch});
		<%/if%>
	});
<%/script%>
