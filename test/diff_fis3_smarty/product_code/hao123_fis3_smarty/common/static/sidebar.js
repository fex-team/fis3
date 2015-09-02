/*
Sidebar init logic
@Frank Feng
 */
;(function () {
	var body = document.getElementsByTagName("body")[0],
		container = document.createElement("div"),
		WIN = window,
		ids = "",
		mid = hao123.mid || "sidebar",
		ls = hao123.country + "sidebar" + hao123.appModule,
		version = mid == "sidebar" ? "" : "new",
		module = mid == "sidebar" ? "home" : "flat-home";

	if( WIN.localStorage ){
		ids = WIN.localStorage[ls] || ids;
	}
	container.id = "hao123Container";
	container.style.position = "relative";

	// Create sidebar container
	body.appendChild(container);

	// Async load sidebar widget
	hao123.asyncLoad && hao123.asyncLoad({
		module:module,
		fileType:"tpl",
		containerId:"hao123Container",
		widgetName:"open-api",
		widgetId:[{id:mid}],
		api: hao123.host + "/openapi",
		params: {
			isHao123: hao123.isHao123 ? "true" : (hao123.host ? "false": "true")
		}
	});

	// Get app list
	hao123.getJSON({
		url: hao123.dataApi ? hao123.dataApi : ( hao123.host + "/applistapi?" ),
		params: {
			callback: "appList",
			country: hao123.country,
			module: hao123.appModule,
			version: version,
			appids: ids
		},
		callbackFuncName: "callback",
		callback: function (data) {
			// Sidebar widget and the applist need to be all ready, then the sidebar can be initialized.
			if (hao123.sidebar) {
				var sidebar = new hao123.sidebar(data);
				sidebar.init();
			} else {
				hao123.appList = data;

			}
		}
	});
})();