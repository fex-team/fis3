<%style%>
<%if $head.dir=='ltr'%>
@import url('/widget/userbar-btn-searchside/ltr/ltr.css?__inline');
<%else%>
@import url('/widget/userbar-btn-searchside/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%>
<%require name="common:widget/userbar-btn-searchside/ltr/ltr.more.css"%>
<%else%>
<%require name="common:widget/userbar-btn-searchside/rtl/rtl.more.css"%>
<%/if%>

<%if strpos($smarty.server["HTTP_USER_AGENT"], "MSIE")%>
	<%assign var="browser" value=$body.headerTest.userbarBtn.ie%>
<%elseif strpos($smarty.server["HTTP_USER_AGENT"], "Firefox")%>
	<%assign var="browser" value=$body.headerTest.userbarBtn.firefox%>
<%else%>
	<%assign var="browser" value=$body.headerTest.userbarBtn.chrome%>
<%/if%>

<div class="userbar-btns" log-mod="sethp-btn" id="userbarBtn">
	<%if $browser eq "addfav"%>
	<a href="<%$body.addFav.url%>" id="addFav02" onclick="return false;">
		<span class="userbar-btns-icon">
		    <i class="userbar-btns-addfav"></i>
		</span>
		<span class="userbar-btns-content"><%$body.addFav.title%></span>
	</a>
	<%elseif $browser eq "download"%>
	<a href="<%$body.download.url%>" id="shortCut02">
		<span class="userbar-btns-icon">
		    <i class="userbar-btns-down"></i>
		</span>
		<span class="userbar-btns-content"><%$body.download.title%></span>
	</a>
	<%else%>
	<a href="<%$body.setHome.url%>" id="setHome02" onclick="return false;">
	    <span class="userbar-btns-icon">
		    <i class="userbar-btns-sethome"></i>
		</span>
		<span class="userbar-btns-content"><%$body.setHome.title%></span>
	</a>
	<%/if%>
</div>
<%script%>
conf.userbarBtn = {
	<%if !empty($body.userbarBtn.maxSpanWidth)%>maxSpanWidth: '<%$body.userbarBtn.maxSpanWidth%>',<%/if%>
	addFavText: '<%$body.addFav.error%>',
	isSetHomeFf: <%if $body.headerTest.userbarBtn.firefox === "sethome"%>'1'<%else%>'0'<%/if%>
};
conf.setHomeOnFf ||(conf.setHomeOnFf = <%json_encode($body.setHomeOnFf)%>);

require.async(["common:widget/ui/jquery/jquery.js", "common:widget/userbar-btn-searchside/userbar-btn-searchside-async.js"],function($, init){
	$(".box-search").eq(0).parent().css("position", "relative");//用于皮肤定位
	$("#userbarBtn").show();
	init();
});
<%/script%>
