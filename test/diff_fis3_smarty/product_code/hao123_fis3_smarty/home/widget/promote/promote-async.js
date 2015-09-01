//requirement
var $ = require("common:widget/ui/jquery/jquery.js");
var cycletabs = require("common:widget/ui/cycletabs/cycletabs.js");
var UT = require("common:widget/ui/ut/ut.js");
var Helper = require("common:widget/ui/helper/helper.js");

//definition
var slideRef = {};
var sideContainer = $("#sidePromote");
var contentContainer = $(".promote_content",sideContainer);
var tabs = $(".promote-tab",sideContainer);

//new slide
function newSlide(type) {
	var modData = conf.promote.datas[type];
	var data = [];
	var itemTpl = '<a href="#{landingpage}" class="main-item" title="#{description}"><img src="#{imgSrc}" width="238" height="#{height}" data-i="#{index}"><p class="item-slogon" data-i="#{index}">#{description}</p></a>';
	for (var i=0; i<modData.length; i++) {
		$.extend(modData[i], { "index": i });
		data.push({
			'content': Helper.replaceTpl(itemTpl, modData[i]),
			'id': i+1
		});
	};
	var options = {
		offset: 0,
		navSize: 1,
		itemSize: 219,
		autoScroll: true,
		autoScrollDirection: conf.promote.dir == 'ltr' ? 'forward' : 'backward',
		containerId: ".promote-" + type + " .main-item-wrap",
		data: data,
		defaultId: 1
	};
	slideRef[type] = new cycletabs.NavUI();
	slideRef[type].init($.extend(options, conf.promote));
}

//change tab
function changeTab(ele) {
	var menuType = ele.attr("data-type");
	var target = $(".promote-" + menuType);
	var targetTextarea = target.find("textarea");
	var useSlide = ele.attr("data-slide");

	//该模块首次引入时执行加载内容
	if (targetTextarea.length) {
		var targetContent = targetTextarea.text();
		target.html(targetContent);
		//需要轮播
		if (useSlide) {
			newSlide(menuType);
		}
	//不包含texteare模块，但使用轮播
	} else if (useSlide && !slideRef[menuType]) {
		newSlide(menuType);
	}

	tabs.removeClass("cur");
	ele.addClass("cur");
	contentContainer.addClass("hide");
	target.removeClass("hide");
}

//bind log event
function bindLog() {
	sideContainer.on("mousedown", function(e) {
		var target = $(e.target);
		var log = {
			modId: target.parents(".promote_content").attr("log-mod")
		};
		if (target.hasClass("arrow-prev") || target.hasClass("arrow-next")) {
			log.position = "prev-next";
			log.ac = "b";
			UT.send(log);
		}
		if (target.hasClass("promote-tab") || target.parents(".promote-tab").length > 0) {
			log.modId = target.attr("log-mod");
			log.position = "menu";
			log.ac = "b";
			UT.send(log);
		}
	});
}

//bind event
function bindEvent() {
	//图片hover，半透明效果
	/*$(document).on("hover", ".detail-item-wrap a", function() {
		$(this).find(".item-mask").toggleClass("hide");
	});*/

	//menu的点击响应
	tabs.on("click", function(e) {
		e.preventDefault();
		changeTab($(this));
	});

	//hover大图时，加亮slogon
	sideContainer.on("hover", ".item-slogon", function() {
		$(this).toggleClass("item-slogon-hover");
		$(".ctrl",sideContainer).toggle();
	}).on("hover", ".promote-theme .detail-item", function() {
		$(this).toggleClass("promote-theme-hover");
		$(this).next(".detail-item").toggleClass("promote-theme-hover-next");
	});



	//发送日志绑定
	bindLog();
}

//initial
function init() {
	//初始化第一个模块
	changeTab(tabs.eq(0));
	bindEvent();
}

init();
