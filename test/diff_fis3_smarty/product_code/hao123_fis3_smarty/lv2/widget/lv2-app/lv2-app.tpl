
<%widget name="lv2:widget/lv2-app/`$head.dir`/`$head.dir`.tpl"%>
	<dl class="box-lv2 s-mbm mod-lv2-app">
	<dt><%$body.extAppMod.modName%><a id="lv2_app_canvas" name="lv2_app_canvas"></a></dt>
	<dd class="cf">
		<div class="app-list" id="lv2AppList">
			<div class="default_asc">
				<span class="default_word"><%$body.extAppMod.default%></span>
			</div>
			<ul id="app-list-content"></ul>
			<a id="charts_more" href="<%$body.extAppMod.more_link%>" style="display: none;"><%$body.extAppMod.more%><i class="arrow_r">›</i></a>
		</div>
		<div class="app-canvas-wrapper" id="lv2AppCanvasWrapper">
			<%if $body.extAppMod.isDebug == 'true' %>
				<%widget name="lv2-app/lv2-app-debug"%>
			<%/if%>
			<iframe src="about:blank" width="760" height="500" scrolling="no" frameborder="0" id="lv2AppCanvas" class="app-canvas"></iframe>
		</div>
	</dd>
	<%script%>
		require.async('lv2:widget/lv2-app/lv2-app.js',function(extApp){
			var appInfoList = <%json_encode($body.extAppMod.appList)%>,
				apptype = <%json_encode($body.extAppMod.typeList)%>,
				appCountry = <%json_encode($body.extAppMod.country)%>,
				isLoad = <%json_encode($body.extAppMod.isLoad)%>,
				isDefault = <%json_encode($body.extAppMod.isDefault)%>,
				preUrl = <%json_encode($body.extAppMod.preUrl)%>,
				currentAppInfo = extApp.getCurrentAppInfo(appInfoList);
				//执行
				extApp.init(currentAppInfo,apptype,appCountry,"1",isLoad,preUrl,isDefault);
		});
	<%/script%>
</dl>
