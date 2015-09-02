<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header/theme/ltr-s/ltr.css?__inline');
<%else%> 
@import url('/widget/header/theme/rtl-s/rtl.css?__inline');
<%/if%>
<%/style%>
<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="common:widget/header/theme/ltr-s/ltr.more.css"%> <%else%> <%require name="common:widget/header/theme/rtl-s/rtl.more.css"%> <%/if%>

	<ul id="themeSelect" class="select_theme" style="display:none" log-mod="theme">
		<li data-theme="1" class="skin_1"><span></span></li>
		<li data-theme="2" class="skin_2"><span></span></li>
		<li data-theme="3" class="skin_3"><span></span></li>
	</ul>
	<%script%>
		require.async(["common:widget/header/theme/theme-async.js"],function(){
			G.theme.init("/widget/header/theme/theme/");
		});
	<%/script%>
