<%style%>
	<%if $head.dir=='ltr'%> 
		@import url('/widget/header-flat/navigation/ltr/ltr.css?__inline');
	<%else%> 
		@import url('/widget/header-flat/navigation/rtl/rtl.css?__inline');
	<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%require name="common:widget/header-flat/navigation/`$head.dir`/`$head.dir`.more.css"%>
<div class="mod-nav-wrap" id="navWrap" log-mod="navigation">
	<ul>
		<%foreach $body.navigation.navData as $navItem%>
			<li class="nav-item<%if $navItem@first%> cur<%/if%>">
				<%if $navItem@first%>
					<span><%$navItem.text%></span>
				<%else%>
					<a href="<%$navItem.url%>" class="nav-el" title="<%$navItem.text%>">
						<span><%$navItem.text%></span>
					</a>
				<%/if%>
			</li>
		<%/foreach%>
	</ul>
</div>

<%script%>
	require.async("common:widget/header-flat/navigation/navigation-async.js");
<%/script%>