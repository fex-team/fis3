<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header-flat/ltr/ltr.fn.css?__inline');
<%else%> 
@import url('/widget/header-flat/rtl/rtl.css?__inline');
<%/if%>
<%/style%>
<div class="l-wrap">
	<div class="head-top-wrap">
	    <%widget name="common:widget/header-flat/logo/logo.tpl"%>
		<%if !empty($body.searchBox.widget)%>
			<%widget name="common:widget/`$body.searchBox.widget`/`$body.searchBox.widget`.tpl"%>
		<%else%>
			<%widget name="common:widget/search-box/search-box.tpl"%>
		<%/if%>
		<%*widget name="common:widget/search-box-flat-head/search-box-flat-head.tpl"*%>
		<div class="userbar-logoSibling <%if $head.dir=='ltr'%>fr<%else%>fl<%/if%>">
	        <%if !empty($body.headerTest.logoSibling)%>
			    <%foreach explode("|", $body.headerTest.logoSibling) as $item%>
			    	<%widget name="common:widget/header-flat/`$item`/`$item`.tpl"%>
			    <%/foreach%>
			<%/if%>
		</div>
	</div>
	<div class="userbar-wrap">
		<div class="usrbar-nav">
			<%widget name="common:widget/header-flat/navigation/navigation.tpl"%>
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


