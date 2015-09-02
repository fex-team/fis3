<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="lv2:widget/pcfstatic/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/pcfstatic/rtl/rtl.css"%> <%/if%>
<div class="mod-pcfstatic-starthelper" log-mod="pcfstatic-starthelper" log-mod="pcfstatic-starthelper">
	<div class="div-con type<%$body.starthelper.modType%>"></div>
	<div class="block block-left bl<%$body.starthelper.modType%>"></div>
	<div class="block block-right bl<%$body.starthelper.modType%>"></div>
</div>

<%script%>
	conf.pcf_starthelper = <%json_encode($body.starthelper)%> ;
	require.async('lv2:widget/pcfstatic/starthelper.js');
<%/script%>