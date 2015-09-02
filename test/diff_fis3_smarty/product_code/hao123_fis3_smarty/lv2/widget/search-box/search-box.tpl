
<%assign var="sBoxTag" value=$body.searchBox.sBoxTag%>
<%assign var="hSearchWords" value=$body.searchBox.hotSearchWords%>
<%assign var="sBtnWords" value=$body.searchBox.searchBtnWords%>
<%* 搜索框 --- 首屏模块 inline css*%>
<%style%>
	<%if $head.dir=='ltr'%>
		@import url('/widget/search-box/ltr/ltr_inline.css?__inline');
	<%else%>
		@import url('/widget/search-box/rtl/rtl_inline.css?__inline');
	<%/if%>
<%/style%>
<%widget name="lv2:widget/search-box/`$head.dir`/`$head.dir`.tpl"%>
<%widget name="lv2:widget/search-box/`$sysInfo.country`/`$sysInfo.country`.tpl"%>
<%script%>
	require.async(["common:widget/ui/jquery/jquery.js", "lv2:widget/search-box/search-box-async.js"], function ($) {
		var autoFocusSearch = true;
		<%if $body.extAppMod%>
		autoFocusSearch = false;  //if app show DO NOT autoFocus
		<%/if%>
		<%if !empty($body.searchBox.sugUrl)%>
			var head = document.getElementsByTagName("head")[0];
			var requestScript = function(url, onsuccess, onerror, timeout) {

				var script = document.createElement('script');
				if (onerror) {
					var tid = setTimeout(function() {
						script.onload = script.onreadystatechange = script.onerror = null;
						timeout();
					}, 5000);

					script.onerror = function() {
						clearTimeout(tid);
						onerror();
					};

					script.onload = script.onreadystatechange = function() {
						if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {
							script.onload = script.onreadystatechange = null;
							script = undefined;
							clearTimeout(tid);
							onsuccess();
						}
					}
				}
				script.type = 'text/javascript';
				script.src = url;
				head.appendChild(script);
			};

			requestScript("<%$body.searchBox.sugUrl%>", function() {
				baidu_sug.setMode('baidu');
				baidu_sug.toggle(false);
				Gl.searchGroup({
					type: conf.pageType,
					autoFocus: autoFocusSearch
				});
			}, function() {
				baidu_sug = false;
				Gl.searchGroup({
					type: conf.pageType,
					autoFocus: autoFocusSearch
				});
			}, function() {
			    baidu_sug = false;
				Gl.searchGroup({
					type: conf.pageType,
					autoFocus: autoFocusSearch
				});
			});
		<%else%>
		baidu_sug = false;
		Gl.searchGroup({type: conf.pageType, autoFocus: autoFocusSearch});
		<%/if%>

		<%if !empty($body.searchBox.sugMoreUrl)%>
		    setTimeout(function() {
		        window["require"] && require.async("<%$body.searchBox.sugMoreUrl%>");
			}, 1e3);
		<%/if%>
	});
<%/script%>
