
<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="lv2:widget/app-canvas-iframe/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/app-canvas-iframe/rtl/rtl.css"%> <%/if%>
<h1 class="green app-title"><%$body.appWrap.title%></h1>
<div class="app-iframe-wrap">
	<iframe src="<%$body.appWrap.url%>" scrolling="yes" frameborder="0" width="<%$body.appWrap.width%>" height="<%$body.appWrap.height%>" data-app-appid="<%$body.appWrap.appid%>"></iframe>
</div>
<div class="app-list-side">
	<ul>
		<%foreach $body.appWrap.appSideList as $appSideList%>
		<li class="app-item<%if $appSideList.current == 'true'%> current<%/if%>" data-app-type="<%$appSideList.type%>" data-app-appid="<%$appSideList.appid%>" data-app-url="<%$appSideList.url%>">
			<img class="app-icon" src="<%$appSideList.logo_m%>" alt="icon" />
			<h3 class="app-name"><%$appSideList.name%></h3>
			<p class="app-type"><%$appSideList.type_desc%></p>
		</li>
		<%/foreach%>
	</ul>
</div>
<div class="cb"></div>
<%script%>
	require.async('lv2:widget/app-canvas-iframe/app-canvas-iframe.js',function(extApp){
			var appInfoList = <%json_encode($body.appWrap.appSideList)%>;
			var currentAppInfo = extApp.getCurrentAppInfo(appInfoList);
			extApp.init(currentAppInfo);
		});
<%/script%>
