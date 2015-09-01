var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");

var extApp = {};
var appid,appURL;
extApp.searchObj = {};
extApp.config = {
	minHeight: 500
};

extApp.parseUrl = function(){
	var searchStr = location.search;
	var searchArr = [];
	var searchItem = {};
	if(searchStr && (searchStr = searchStr.substring(1))){
		searchArr = searchStr.split("&");
		for (var i = searchArr.length - 1; i >= 0; i--) {
			searchItem = searchArr[i].split("=");
			extApp.searchObj[searchItem[0]] = searchItem[1];
		}
	}
};
extApp.getJumpUrl = function(appid){
	var search;
	var hash;
	var appHref = "";
	if (location.search) {
		if(extApp.searchObj.appid){
			search = location.search.replace(/appid=\d+/, "appid=" + appid);
		}else{
			search = location.search + "&appid=" + appid;
		}
	}else{
		search = "?appid=" + appid;
	}
	appHref = location.protocol + "//" + location.host + location.pathname + search + "#lv2_app_canvas";
	return appHref;
};
extApp.getCurrentAppInfo = function(appInfoList){
	var appid = 0;
	var appInfo = {};
	extApp.parseUrl();
	if (extApp.searchObj["appid"]) {
		appid = parseInt(extApp.searchObj["appid"]);
	}
	for (var i = appInfoList.length - 1; i >= 0; i--) {
		appInfo = appInfoList[i];
		if(appInfo.hasOwnProperty("appid") && appInfo.appid == appid){
			return appInfo;
		}
	}
	return appInfoList[0];
};
extApp.init = function(currentAppInfo){
	if(!currentAppInfo){
		return;
	}
	appid = currentAppInfo.appid;
	appURL = currentAppInfo.url /*+'&country='+currentAppInfo.country+'&appid='+appid*/;
	appHeight = currentAppInfo.height;
	//访问页面的log
	UT.send({
		type: "scroll",
		position:"app-canvas",
		modId: "mod-lv2-app",
		appid: appid
	});
	extApp.update(appid, appURL, appHeight);
	extApp.bindEvent();
};
extApp.update = function(appid, appURL, height){
	//update canvas
	var appHeight = Math.max(height, extApp.config.minHeight);
	$('.app-iframe-wrap iframe').attr('src', appURL).attr('height', appHeight);
	//update height
	$('.app-list-side').css('height',appHeight-17);
	$('.app-iframe-wrap').css('height',appHeight);
	//update list
	$('.app-list-side').find('[data-app-appid='+appid+']').addClass('current');
};

extApp.bindEvent = function(){
//推荐app的点击响应
	$(".app-list-side").on("click", ".app-item",  function(){
		var $li = $(this);
		var appType = $li.attr('data-app-type');
		if(appType == 'link'){
			var appLink = $li.attr('data-app-url');
			UT.send({
				type:"click",
				ac:"b",
				position:"app-list",
				url: appLink,
				element: "app-item-link",
				modId: 'mod-lv2-app'});  //log
			window.open(appLink);
		}else if(appType == 'app'){
			var appid = $li.attr("data-app-appid");
			var link = extApp.getJumpUrl(appid)
	        location.href = link;
		}
	}).on("mouseenter mouseleave", ".app-item", function(){
		$(this).toggleClass("item-hover");
	});
};

module.exports = extApp;