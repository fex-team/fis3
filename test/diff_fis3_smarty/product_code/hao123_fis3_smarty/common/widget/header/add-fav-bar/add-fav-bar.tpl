<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header/add-fav-bar/ltr/ltr.css?__inline');
<%else%> 
@import url('/widget/header/add-fav-bar/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="common:widget/header/add-fav-bar/ltr/ltr.more.css"%> <%else%> <%require name="common:widget/header/add-fav-bar/rtl/rtl.more.css"%> <%/if%>


<div class="bar-addfav" id="addFavBar" alog-alias="addFavBar" log-mod="sethp-bar"></div>
<%script%>
	// Configuration for addFavBar
	<%if isset($body.addFavBar)%>
	conf.addFavBar = {
		setHome: {
			title: "<%$body.addFavBar.setHome.title%>",
			text: "<%$body.addFavBar.setHome.text%>",
			button: "<%$body.addFavBar.setHome.button%>"
		},
		addFav: {
			title: "<%$body.addFavBar.addFav.title%>",
			text: "<%$body.addFavBar.addFav.text%>",
			button: "<%$body.addFavBar.addFav.button%>"
		},
		addFavNoSupport: {
			title: "<%$body.addFavBar.addFavNoSupport.title%>",
			text: "<%$body.addFavBar.addFavNoSupport.text%>",
			button: "<%$body.addFavBar.addFavNoSupport.button%>"
		},
		download: {
			title: "<%$body.addFavBar.download.title%>",
			text: "<%$body.addFavBar.download.text%>",
			button: "<%$body.addFavBar.download.button%>",
			url: "<%$body.addFavBar.download.url%>"
		},
		hideBar: "<%$body.addFavBar.hideBar%>",
		ieType:"<%$body.addFavBar.ie%>",
		ffType:"<%$body.addFavBar.firefox%>",
		chType:"<%$body.addFavBar.chrome%>",
		otherType:"<%$body.addFavBar.others%>",
		showbarTime:"<%$body.addFavBar.showbarTime%>",
		slideSpeed: 1000
	};
	<%/if%>
	require.async("common:widget/ui/jquery/jquery.js", function($) {
		$(window).one("e_go.addfavbar", function () {
			require.async("common:widget/header/add-fav-bar/add-fav-bar-async.js", function () {
				Gl.addFavBar(conf.pageType);
			});
		});

		$(function () {
			$(window).trigger("e_go.addfavbar");
		});

		$("#addFavBar").one("mouseenter", function () {
			$(window).trigger("e_go.addfavbar");
		});
	});
<%/script%>


