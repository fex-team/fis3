<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="lv2:widget/hao123launcher/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/hao123launcher/rtl/rtl.css"%> <%/if%>
<%widget name="common:widget/global-conf/global-conf.tpl"%>
<%widget name="common:widget/header/clock/clock-conf/clock-conf.tpl"%>

<div id="<%$root.urlparam.appid%>" class="mod-hao123launcher-app">
	<i class="loading"></i>
</div>

<%script%>
	require.async('lv2:widget/hao123launcher/app.js');
<%/script%>

