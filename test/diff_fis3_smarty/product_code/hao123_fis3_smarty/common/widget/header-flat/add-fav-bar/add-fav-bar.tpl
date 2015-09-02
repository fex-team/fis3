<%style%>
<%if $head.dir=='ltr'%>
@import url('/widget/header-flat/add-fav-bar/ltr/ltr.css?__inline');
<%else%>
@import url('/widget/header-flat/add-fav-bar/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
<%require name="common:widget/header-flat/add-fav-bar/ltr/ltr.more.css"%> 
<%else%> 
<%require name="common:widget/header-flat/add-fav-bar/rtl/rtl.more.css"%> 
<%/if%>

<div class="bar-addfav" id="addFavBar" alog-alias="addFavBar" log-mod="sethp-bar">
<%if empty($body.addFavBar.hideBar) && ($body.addFavBar.showbarTime === '0' || empty($smarty.cookies['Gh_b']))%>
	<div class="l-wrap">
	    <i class="fav-down"></i>
	    <span class="fav-title"><%$body.addFavBar.download.title%></span>
	    <span class="fav-text"><%$body.addFavBar.download.text%></span>
	    <a href="<%$body.addFavBar.download.url%>" class="fav-btn" data-sort="topbar" data-val="button" hidefocus="true">
	        <%$body.addFavBar.download.buttonText%>
	    </a>
	    <a href="javascript:void(0)" class="fav-close" data-sort="topbar" data-val="close" hidefocus="true">
		</a>
	</div>
<%/if%>
</div>
<%script%>
	<%if isset($body.addFavBar)%>
	conf.addFavBar = {
		hideBar: "<%$body.addFavBar.hideBar%>",
		showbarTime:"<%$body.addFavBar.showbarTime%>"
	};
	<%/if%>
	require.async("common:widget/header-flat/add-fav-bar/add-fav-bar-async.js", function(addFavBar) {
        addFavBar();
    });
<%/script%>


