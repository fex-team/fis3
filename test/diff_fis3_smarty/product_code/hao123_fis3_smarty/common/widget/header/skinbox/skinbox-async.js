var $ = require("common:widget/ui/jquery/jquery.js");
var Slide = require("common:widget/ui/cycletabs/cycletabs.js");
var Helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");

$(function(){
	var modId = "skinbox";
	var confSkin = conf.skin;
	var skinData = confSkin.data;
	var headerIcon = $(".skinbox-header");
	var moreWrap;
	var BODY = $(document.body);
	var WINDOW = $(window);
	var headerDesc = headerIcon.find(".title-skinbox");
	var isAnimate = false;
	var manyPic = confSkin.manyPic && confSkin != "0" ? "true" : "false";
	var skinMoreTpl = '<div class="skinbox-more-wrap skin-many-pic-#{manyPic}">'
					+	'<div class="skinbox-content-wrap l-wrap">'
					+		'<div class="skinbox-item skinbox-item-default first-column" data-value="#{key}">'
					+			'<img width="154" height="#{height}" src="#{thumbnail}"/>'
					+			'<div class="skinbox-mask"><p>#{title}</p></div>'
					+			'<i class="ico-skinbox-selected"></i>'
					+		'</div>'
					+		'<div class="skinbox-normal-wrap"></div>'
					+	'</div>'
					+ '</div>';
	var skinItemTpl = "<div class='skinbox-item #{rowClass}' data-value='#{key}'>"
					+   "#{tipType}"
					+	"<img width='154' height='#{height}' src='#{thumbnail}'/>"
					+	"<div class='skinbox-mask'>#{title}</div>"
					+	"<i class='ico-skinbox-selected'></i>"
					+ "</div>";

	headerIcon.one("click", function(){
		var fullNum = manyPic == "true" ? 9 : 4;
		var height = manyPic == "true" ? 65 : 84;
		//内容拼接
		$("#top").after(Helper.replaceTpl(skinMoreTpl, $.extend({
			"manyPic": manyPic,
			"height": height
		}, skinData[0])));
		moreWrap = $(".skinbox-more-wrap");

		//数据拼接
		var tempData = [];
		var tempItemStr = "";
		var tempId = 1;
		var rowClass = "";
		for(var i=1; i<skinData.length; i++){
			var modNum = i % fullNum;
			var curData = skinData[i];
			var tipType = curData.tips;
			if (i!=1 && modNum==1) {
				tempItemStr = "";
				tempId++;
			}
			rowClass = modNum > 4 || modNum == 0 ? (modNum == 5 ? "column-first row-second" : "row-second") : "row-first";
			tempItemStr += Helper.replaceTpl(skinItemTpl, $.extend({
				"tipType" : tipType ? ( tipType == "hot" ? "<span class='tips hot'></span>" : ( tipType == "new" ? "<span class='tips new'></span>" : "" ) ) : "",
				"rowClass": rowClass,
				"height": height
			}, curData));
			if (i==skinData.length-1 || modNum==0) {
				tempData.push({
					"content": tempItemStr,
					"id": tempId
				});
			}
		}

		//调用slide组件
		var options = {
			offset: 0,
			navSize: 1,
			itemSize: manyPic == "true" ? 850 : 680,
			scrollDuration: 500,
			quickSwitch: true,
			dir: conf.dir,
			containerId: ".skinbox-normal-wrap",
			data: tempData
		};
		var skinSlide = new Slide.NavUI();
		skinSlide.init(options);
		//项数不到两屏时，隐藏控制Handler
		if(skinData.length < fullNum + 2){
			$(".ctrl, .switch", moreWrap).hide();
		}

		//已选中皮肤的跟新状态
		$(".skinbox-item[data-value="+conf.skin.current+"]", moreWrap).addClass("skinbox-item-selected");

	}).on("click", function(e){
		//fix ie8 bug（原来使用的是slideToggle）
		if(isAnimate){
			return false;
		}
		isAnimate = true;
		var containerHeight = manyPic == "true" ? 200 : 150;
		if (headerIcon.hasClass("skinbox-more-hide")) {
			moreWrap.animate({
				height:0
			}, 400, function(){
				moreWrap.hide();
				headerIcon.removeClass("skinbox-more-hide");
				headerDesc.text(confSkin.iconLiteral);
				isAnimate = false;
			});
		}else{
			moreWrap.show().animate({
				height: containerHeight
			}, 400, function(){
				headerIcon.addClass("skinbox-more-hide");
				headerDesc.text(confSkin.closeLiteral);
				isAnimate = false;
			});
		}
		UT.send({
			modId: modId,
			position: "header",
			sort: headerIcon.hasClass("skinbox-more-hide") ? "close" : "open"
		});
		e.preventDefault();
	});

	BODY.on("click", function(e){
		var target = $(e.target);
		//非目标区域的点击将关闭皮肤盒子.skinbox-wrap
		if(target.parents(".skinbox-more-wrap, .skinbox-wrap").length <= 0 && target.closest(".i-st-btn").length <= 0 && !target.hasClass("skinbox-more-wrap") && moreWrap && moreWrap.css("display") == "block"){
			if (isAnimate) {
				return false;
			}
			isAnimate = true;
			moreWrap.animate({
				height:0
			}, 400, function(){
				moreWrap.hide();
				headerIcon.removeClass("skinbox-more-hide");
				headerDesc.text(confSkin.iconLiteral);
				isAnimate = false;
			});
		}
	//更新选中状态
	}).on("click", ".skinbox-normal-wrap .prev, .skinbox-normal-wrap .next, .skinbox-normal-wrap .switch", function(e){
		var target = $(e.target);
		$(".skinbox-item-selected", moreWrap).removeClass("skinbox-item-selected");
		$(".skinbox-item[data-value="+confSkin.current+"]", moreWrap).addClass("skinbox-item-selected");
		if (target.hasClass("next") || target.hasClass("arrow-next")) {
			UT.send({
				modId: modId,
				ac: "b",
				position: "switch",
				sort: "next"
			});
		}else if(target.hasClass("prev") || target.hasClass("arrow-prev")){
			UT.send({
				modId: modId,
				ac: "b",
				position: "switch",
				sort: "prev"
			});
		}
	});

	//顶部icon区的hover效果
	$(".skinbox-wrap").on("hover", function(){
		headerIcon.toggleClass("module-mask");
	});

	//皮肤装载（由skin-mod.js分拆出来）
	var skinCookie = $.store("lastSkin") || $.cookie("lastSkin");
	var skin = confSkin.recommandSkin;
	var filtered = confSkin.filter;
	if((skin && skin != "no") && (filtered && filtered != "0")){
		var browserInfo = $.browser;
		if(browserInfo.mozilla || browserInfo.msie){
			skin = confSkin.recommandSkin;
		}else{
			skin = "";
			conf.skin.recommandSkin = "";
		}
	}
	if(skinCookie && skinCookie.indexOf("|") >= 0){
		var skinCookies = skinCookie.split("|");
		if(skin == skinCookies[1] || skin == ""){
			skin = skinCookies[0];
		}
	}
	if (skin) {
		var time = confSkin.loadTime;
		if (time === "" || time <= 15) {
			setSkin(skin);
		}else{
			setTimeout($.proxy(setSkin, null, skin), time);
		}
	}
	//设置皮肤
	function setSkin(skin){
		for(var i=0;i<skinData.length; i++){
			var skinItem = skinData[i];
			if(skinItem.key == skin){
				var needClass = skinItem.type ? ("skin skin-type-dark skin-"+skin) : ("skin skin-"+skin);
				conf.skin.current = skin;
				$("#skin-bgimage").css({ "background-image": "url(" + skinItem.bgImgSrc + ")" });
				// 背景图片支持Y方向重复
			    if (skinItem.isRepeat === "1") {
				    $("#skin-bgimage").css({ "background-repeat": "repeat-y" });
			    } else {
				    $("#skin-bgimage").css({ "background-repeat": "no-repeat" });
			    }
				skinItem.type && setDarkLogo();
				BODY.addClass(needClass);
				skinItem.color && BODY.css({
					"background-color": skinItem.color,
					"z-index": 0
				});
				if(skinItem.clickArea && skinItem.clickArea.length>0 && skinItem.clickArea[0].landingpage) {
					setClickArea(skin, skinItem.clickArea[0]);
					WINDOW.on("resize.skin", $.proxy(setClickArea, null, skin, skinItem.clickArea[0]));
				}
			}
		}
	}
	//设置可点击区域
	function setClickArea(skin, data){
		var divWidth = parseInt(data.width);
		var mainWidth = 960;
		var windowWidth = WINDOW.width();
		var margin = (windowWidth - mainWidth)/2;
		if(windowWidth <= mainWidth){
			margin = 0;
			divWidth = 0;
		}else if(divWidth > margin){
			divWidth = margin;
		}
		var firstLeft = margin - divWidth;
		var secondLeft = firstLeft + mainWidth + divWidth;
		$("#skin-clickarea-left").css({left:firstLeft, width:divWidth, height:data.height});
		$("#skin-clickarea-right").css({left:secondLeft, width:divWidth, height:data.height});
		$(".skin-clickarea").on("click.skin", function(){
			window.open(updateLandingpage(data.landingpage));
			UT.send({
				modId: "skinbox",
				ac: "b",
				position: "background",
				sort: skin
			});
		});
	}
	//深色换肤搜索框Logo
	function setDarkLogo(){
		$("#searchGroupLogos img").each(function(){
			var dataSrc = $(this).attr("data-src"),
			    realSrc = $(this).attr("src"),
			    oldSrc  = realSrc || dataSrc || "";

			var prefix = oldSrc.substring(0, oldSrc.lastIndexOf("/"));
			var suffix = oldSrc.substring(oldSrc.lastIndexOf("/"));

			if (realSrc) {
				$(this).attr("src", prefix+"/dark"+suffix);
			} else {
				$(this).attr("data-src", prefix+"/dark"+suffix);
			}
		});
	}
	//带uid设置
	function updateLandingpage(url){
		var paramKey = confSkin.passQueryParam || "uid",
			paramVal = Helper.getQuery(location.href)[paramKey];
		if(paramVal){
			url += (url.indexOf("?") != -1 ? "&" : "?") + paramKey + "=" + paramVal;
		}
		return url;
	}
});
