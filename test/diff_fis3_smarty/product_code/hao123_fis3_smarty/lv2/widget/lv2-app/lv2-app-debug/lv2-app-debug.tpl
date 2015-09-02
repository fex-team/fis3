
<%widget name="lv2:widget/lv2-app/lv2-app-debug/`$head.dir`/`$head.dir`.tpl"%>
<div class="open-debug-form">
	<label>URL: <input type="text" id="open-debug-url" placeholder="app url here"></label>
	<label>Height:<input type="text" id="open-debug-height" placeholder="app max height"></label>
	<label><input type="button" id="open-debug-submit" value="update App"></label>
</div>

<%script%>
	require.async('lv2:widget/lv2-app/lv2-app-debug/lv2-app-debug.js',function(extAppDebug){
		extAppDebug.init();
	});
<%/script%>
