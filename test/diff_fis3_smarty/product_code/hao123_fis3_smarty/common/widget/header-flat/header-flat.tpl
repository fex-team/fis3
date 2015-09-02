<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header-flat/ltr/ltr.css?__inline');
<%else%> 
@import url('/widget/header-flat/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
<%require name="common:widget/header-flat/ltr/ltr.more.css"%>
<%else%>
<%require name="common:widget/header-flat/rtl/rtl.more.css"%> 
<%/if%>

<%if $body.headerTest.isCeiling == '1'%>
<%if $body.headerTest.ceilingMore == '1' && $body.searchBox.widget =='search-box-4ps'%>
    <%if $head.dir=='ltr'%> 
        <%require name="common:widget/header-flat/ltr/ltr.ps.css"%>
    <%else%> 
        <%require name="common:widget/header-flat/rtl/rtl.ps.css"%> 
    <%/if%>
<%/if%>
<%/if%>

<%if !empty($body.headerTest.ceilingHide)%>
	<%assign var="headArr" value=[
		"userbar-btn-header" => ".header-fixed .userbar-btn",
		"account" => ".header-fixed .account_wrap",
		"site-switch" => ".header-fixed .settings",
		"banner-site" => ".header-fixed .mod-banner-site"
	]%>
	<%assign var="ceilingArr" value=[]%>
	<%foreach explode("|", $body.headerTest.ceilingHide) as $item%>
		<%if !empty($item) && !empty($headArr[$item]) && array_push($ceilingArr, $headArr[$item])%>
		<%/if%>
	<%/foreach%>

	<%if $ceilingArr != []%>
	    <%style%>
		    <%join(",", $ceilingArr)%> {display: none;}
	    <%/style%>
	<%/if%>
<%/if%>
<%*newUserRedirect*%>
<%assign var="newUserName" value="newUser"%>
<%*cookieRedirect*%>
<%assign var="cookieName" value="simplenav"%>
<%foreach $head.cookieRedirect as $cookieItem%>
	<%if $cookieItem@first%>
		<%$cookieName = $cookieItem@key%>
	<%/if%>
<%/foreach%>

<%if $smarty.get.tn && (!empty($smarty.cookies.$cookieName) || $smarty.cookies.$newUserName == "0")%>
	<%widget name="common:widget/header-flat/simple-nav/simple-nav.tpl"%>
<%else%>
  <%if empty($body.addFavBar.hideBar)%>
	<%widget name="common:widget/header-flat/add-fav-bar/add-fav-bar.tpl"%>
  <%/if%>
<%/if%>
<div class="userbar-wrap" id="top" alog-alias="userBar">
	<div class="userbar l-wrap">
	    <%widget name="common:widget/header-flat/logo/logo.tpl"%>
	    <div class="userbar-glo">
	    <div class="userbar-logoSibling <%if $head.dir=='ltr'%>fl<%else%>fr<%/if%>">
	        <%if !empty($body.headerTest.logoSibling)%>
			    <%foreach explode("|", $body.headerTest.logoSibling) as $item%>
			    <%if $item == "weather"%>
			        <div class="weather-wrap" id="weatherWrap" log-mod="weather"<%if $body.headerTest.weather.font%> style="font:<%$body.headerTest.weather.font%>;"<%/if%>>
			        <%*<div class="weather-wrap_arrow"><div class="weather-wrap_arrow-bg"></div></div>*%>
			        <%widget name="common:widget/header-flat/`$item`/`$item`.tpl"%>
			        <div class="weather-tip_def" id="weatherClkTip"></div>
			        <div id="weatherMoreWrap" class="weather-more_wrap" alog-alias="weatherMore">
			            <div class="weather-more_line">
			                <ul id="weatherMore" class="weather-more l-wrap"></ul>
			            </div>
			        </div>
			        </div>
			    <%else%>
			        <%widget name="common:widget/header-flat/`$item`/`$item`.tpl"%>
			    <%/if%>
			    <%/foreach%>
			<%/if%>
		</div>
		<div class="userbar-tool <%if $head.dir=='ltr'%>fr<%else%>fl<%/if%>">
		<%if !empty($body.headerTest.showContent)%>
			<%foreach array_reverse(explode("|", $body.headerTest.showContent)) as $module%>
				<%widget name="common:widget/header-flat/`$module`/`$module`.tpl"%>
			<%/foreach%>
		<%/if%>
		</div>
		</div>
	</div>
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
 require.async("common:widget/header-flat/header-flat-async.js");
<%/script%>


