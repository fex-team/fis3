

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="lv2:widget/middle/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/middle/rtl/rtl.css"%> <%/if%>

<%if $sysInfo.country!='jp'%>
<div class="middle-container">
	<img class="middle-bg" src="<%$body.bgImg%>" alt="Hao123 is best" />
	<a class="middle-down" id="downloadBtn" href="<%$body.defaultUrl%>" title="<%$body.btnTitle%>" target="_self">
		<img src="<%$body.btnImg%>" alt="download shortcut" />
	</a>
</div>

<%else%>
<img src="<%$body.middlePage.topImg%>" class="middle-top" alt="Hao123 is best" />
<div class="middle-bottom">
	<a target="_self" href="<%$body.middlePage.url%>" id="downloadBtn">
		<img src="<%$body.middlePage.buttonImg%>" alt="download shortcut" />
	</a>
	<p><img src="<%$body.middlePage.bottomImg%>" alt="tips" /></p>
</div>
<br/><br/>
<%/if%>

<%script%>
	require.async('lv2:widget/middle/middle.js',function(middleInit){
		middleInit();
	})
<%/script%>
