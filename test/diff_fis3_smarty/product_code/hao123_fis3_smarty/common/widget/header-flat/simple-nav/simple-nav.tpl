<%style%>
	<%if $head.dir=='ltr'%> 
		@import url('/widget/header-flat/simple-nav/ltr/ltr.css?__inline');
	<%else%> 
		@import url('/widget/header-flat/simple-nav/rtl/rtl.css?__inline');
	<%/if%>
<%/style%>
<%*   声明对ltr/rtl的css依赖    *%>
<%require name="common:widget/header-flat/simple-nav/`$head.dir`/`$head.dir`.more.css"%> 
<%strip%>
<div class="mod-simple-nav" id="simpleNav" log-mod="index-nav">
	<ul class="nav-wrap">
		<%foreach $body.simpleNav.navData as $navItem%>
		    <li class="nav-item<%if $navItem@last%> cur<%/if%><%if $navItem@first%> nav-light<%/if%>">
				<%if $navItem.icon%>
					<i class="nav-item-con ic-<%$navItem.icon%><%if $navItem.url%> nav-href<%/if%>"  data-ut="<%$navItem.ut%>"></i>
				<%else%>
					<span class="nav-item-con nav-color"><%$navItem.text%></span>
					<i class="cur-arrow-border"></i>
				<%/if%>
				<div class="nav-tips">
					<div class="inner<%if $navItem.url%> nav-href<%/if%>" data-ut="<%$navItem.ut%>">
						<i class="arrow-border"></i>
						<i class="arrow"></i>
						<p><%$navItem.tip%></p>
					</div>
				</div>
			</li>
		<%/foreach%>
	</ul>
	<%if $body.simpleNav.downloadInfo.downloadUrl%>
		<div class="down-wrap">
			<a href="<%$body.simpleNav.downloadInfo.downloadUrl%>" class="down-btn">
				<i class="i-download"></i>
				<span><%$body.simpleNav.downloadInfo.downloadText%></span>
			</a>
		</div>
	<%/if%>
</div>
<%/strip%>

<%script%>
	conf.cookieRedirect = <%json_encode($head.cookieRedirect)%>;
    conf.logoNotice = <%json_encode($body.simpleNav.logoNotice)%>;
	require.async(["common:widget/header-flat/simple-nav/simple-nav-async.js"]);
<%/script%>