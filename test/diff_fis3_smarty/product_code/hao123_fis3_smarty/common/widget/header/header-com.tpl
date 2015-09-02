<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header/ltr/ltr.css?__inline');
@import url('/widget/header/header-com/ltr-s/ltr.css?__inline');
<%if $body.headerTest.actPage == '1'%>
@import url('/widget/header/header-com/ltr-s/ltr.lv2.css?__inline');
<%/if%>
<%else%> 
@import url('/widget/header/rtl/rtl.css?__inline');
@import url('/widget/header/header-com/rtl-s/rtl.css?__inline');
<%if $body.headerTest.actPage == '1'%>
@import url('/widget/header/header-com/rtl-s/rtl.lv2.css?__inline');
<%/if%>
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
<%require name="common:widget/header/header-com/ltr-s/ltr.more.css"%>
<%if $body.headerTest.actPage == '1'%>
	<%require name="common:widget/header/header-com/ltr-s/ltr.lv2.more.css"%> 
<%/if%>
<%else%>
<%if $body.headerTest.actPage == '1'%>
	<%require name="common:widget/header/header-com/rtl-s/rtl.lv2.more.css"%> 
<%/if%>
<%require name="common:widget/header/header-com/rtl-s/rtl.more.css"%> 
<%/if%>

<%if $body.headerTest.ceilingMore == '1' && $body.searchBox.widget =='search-box-4ps'%>
    <%if $head.dir=='ltr'%> 
        <%require name="common:widget/header/header-com/ltr-s/ltr.ps.css"%>
    <%else%> 
        <%require name="common:widget/header/header-com/rtl-s/rtl.ps.css"%> 
    <%/if%>
<%/if%>


<%if !empty($body.headerTest.ceilingLogo)%>
<style>
.header-fixed #indexLogo {
	background: url(<%$body.headerTest.ceilingLogo%>) no-repeat <%if $head.dir=='ltr'%>left<%else%>right<%/if%> center !important;
}
</style>
<%/if%>

<%widget name="common:widget/header/add-fav-bar/add-fav-bar.tpl"%>
<div class="userbar-wrap" id="top" alog-alias="userBar">
	<div class="userbar l-wrap">
	    <%widget name="common:widget/header/logo/logo.tpl"%>
	    <div class="userbar-logoSibling <%if $head.dir=='ltr'%>fl<%else%>fr<%/if%>">
	        <%if !empty($body.headerTest.logoSibling)%>
	            <span class="userbar_split">|</span>
			    <%foreach explode("|", $body.headerTest.logoSibling) as $item%>
			    <%if $item == "weather"%>
			        <div class="weather-wrap" id="weatherWrap" log-mod="weather">
			        <div class="weather-wrap_arrow"><div class="weather-wrap_arrow-bg"></div></div>
			        <%widget name="common:widget/header/`$item`/`$item`.tpl"%>
			        <div class="weather-tip_def" id="weatherClkTip"></div>
			        <div id="weatherMoreWrap" class="weather-more_wrap" alog-alias="weatherMore">
			            <div class="weather-more_line">
			                <ul id="weatherMore" class="weather-more l-wrap"></ul>
			            </div>
			        </div>
			        </div>
			    <%else%>
			        <%widget name="common:widget/header/`$item`/`$item`.tpl"%>
			    <%/if%>
				    <span class="userbar_split">|</span>
			    <%/foreach%>
			<%/if%>
		</div>
		<div class="userbar-tool <%if $head.dir=='ltr'%>fr<%else%>fl<%/if%>">
		<%if !empty($body.headerTest.showContent)%>
			<%foreach array_reverse(explode("|", $body.headerTest.showContent)) as $module%>
				<%widget name="common:widget/header/`$module`/`$module`.tpl"%>
				<span class="userbar_split">|</span>
			<%/foreach%>
		<%/if%>
		</div>
		<%if !empty($body.newerguide.isShow)%>
		<%widget name="common:widget/header/newerguide/newerguide.tpl"%>
		<%/if%>
	</div>
	<%if !empty($body.tearPage.isShow)%>
		<%widget name="common:widget/header/tear-page/tear-page.tpl"%>
	<%/if%>
</div>
<div class="header-test-holder"></div>
<%script%>
 conf.headerTest = {
     dateWidth : "<%$body.headerTest.dateWidth%>",
     weatherWidth : "<%$body.headerTest.weather.width%>",
     isCeiling: "<%$body.headerTest.isCeiling%>",
     ceilingMore: "<%$body.headerTest.ceilingMore%>",
     settingTip: "<%$body.headerTest.settingTip%>",
     ceilingLogo: "<%$body.headerTest.ceilingLogo%>"
 };
 require.async("common:widget/header/header-com/header-com-async.js");
<%/script%>


