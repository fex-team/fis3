<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header-flat/fontsize-switch/ltr/ltr.css?__inline');
<%else%> 
@import url('/widget/header-flat/fontsize-switch/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
  <%require name="common:widget/header-flat/fontsize-switch/ltr/ltr.more.css"%> 
<%else%> 
  <%require name="common:widget/header-flat/fontsize-switch/rtl/rtl.more.css"%> 
<%/if%>

<ul class="mod-fontsize-swtich" id="fontsizeSwitch" log-mod="fontsize-switcher">
	<li class="switcher-next" data-utsend="1" data-sort="next"><i></i></li>
	<%foreach $body.headerTest.fontsizeSwitch as $fontItem%>
	<li class="switcher" data-size="<%$fontItem.fontsize%>" style="font-size:<%$fontItem.fontsize%>px;" data-utsend="1" data-sort="<%$fontItem.fontsize%>"><%$fontItem.word%></li>
	<%/foreach%>
</ul>

<%script%>
	require.async("common:widget/header-flat/fontsize-switch/fontsize-switch-async.js");
<%/script%>