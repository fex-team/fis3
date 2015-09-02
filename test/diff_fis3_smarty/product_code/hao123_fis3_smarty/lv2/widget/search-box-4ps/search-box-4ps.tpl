<%* 搜索引擎根据TN号显隐*%>
<%foreach $body.searchBox.sBoxTag as $value%>
  <%foreach $value.engine as $engine%>
    <%if !empty($engine.tn[0].param)%>
      <%foreach $engine.tn as $tn%>
        <%if $tn.param == $root.urlparam.tn%>
          <%$body.searchboxEngine[$engine.id] = 'true'%>
        <%/if%>
      <%/foreach%>
    <%/if%>
  <%/foreach%>
<%/foreach%>

<%assign var="sBoxTag" value=$body.searchBox.sBoxTag%>
<%assign var="hSearchWords" value=$body.searchBox.hotSearchWords%>
<%assign var="sBtnWords" value=$body.searchBox.searchBtnWords%>
<%* 搜索框 --- 首屏模块 inline css*%>
<%style%>
	<%if $head.dir=='ltr'%>
		@import url('/widget/search-box-4ps/ltr/ltr_inline.css?__inline');
	<%else%>
		@import url('/widget/search-box-4ps/rtl/rtl_inline.css?__inline');
	<%/if%>
<%/style%>

<%widget name="lv2:widget/search-box-4ps/`$head.dir`/`$head.dir`.tpl"%>
<%if isset($sysInfo.country)%>
<%widget name="lv2:widget/search-box-4ps/`$sysInfo.country`/`$sysInfo.country`.tpl"%>
<%/if%>
<%script%>
	require.async(["common:widget/ui/jquery/jquery.js", "lv2:widget/search-box-4ps/search-box-4ps-async.js"], function ($) {
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
