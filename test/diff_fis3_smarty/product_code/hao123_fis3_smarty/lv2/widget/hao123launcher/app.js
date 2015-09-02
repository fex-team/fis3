var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
require('lv2:widget/hao123launcher/sidebar-lib.js');
require('lv2:widget/hao123launcher/asyncload.js');
require('lv2:widget/hao123launcher/require.js');
require('lv2:widget/hao123launcher/lazyload.js');
!function () {
	var $this = $(".mod-hao123launcher-app"),
		app = $this.attr("id");

	window.hao123 || (window.hao123 = {});	
	hao123.country = conf.country;
	hao123.appModule = "lv2";
	hao123.host = "";

	hao123.asyncLoad && hao123.asyncLoad({
		module: "home",
		fileType: "tpl",
		containerId: app,
		widgetName: "open-api",
		widgetId:[{id: app}],
		// 通用iframe使用
		appType: "",
		api: hao123.host + "/openapi"
	});

	$(document).on("click",".i-pointer,.astro-tab li",function(){
		window.external.AppSizeChange($("body").height().toString());
	})
	.on("mousedown",".l-ff",function(){
		window.external.AppSizeChange($("body").height().toString());
	});

}();