var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");
var Helper = require("common:widget/ui/helper/helper.js");

var WINDOW = $(window);
var BODY = $(document.body);

/*
 * 换肤插件
 * loadTime：
 	1. "" - 默认值，即刻加载
 	2. 数字 - 延迟加载，毫秒数
 * recommandSkin：设置推荐皮肤
 * data：
 	key为皮肤关键字；
 	value是一个对象，必须包含"bgImgSrc"属性（皮肤图片URL）；
 * 使用示例：
   var skin = new Skin({
	recommandSkin: "music",
 	data: {
		music: {
			bgImgSrc: "http://xxx.com/a.jpg"
		},
		baozou: {
			bgImgSrc: "http://xxx.com/b.jpg"
		}
 	}
   });
   skin.init();
 */

var Skin = function(userOption) {
	var defaultOptions = {
		loadTime: "",
		recommandSkin: "",
		mainWidth: 960,
		data: []
	};
	$.extend(this, defaultOptions, userOption);

	this.bgContainer = $("#skin-bgimage");
	this.leftClickArea = $("#skin-clickarea-left");
	this.rightClickArea = $("#skin-clickarea-right");
	this.clickArea = $(".skin-clickarea");
	this.modId = "skinbox";
};

Skin.prototype = {

	constructor: Skin,

	//设置皮肤，若skin为空字符串则关闭皮肤
	setSkin: function(skin, bgImgSrc) {
		if (bgImgSrc) {
			var removedSkin = conf.skin.current;
			var skinItem = this._getSkinDataByKey(skin);
			var needClass = skinItem.type ? ("skin skin-type-dark skin-"+skin) : ("skin skin-"+skin);
			var bodyBg = BODY.css("background-color");
			var htmlBg = $("html").css("background-color");

			this.bgContainer.css({ "background-image": "url(" + bgImgSrc + ")" });

			// 背景图片支持Y方向重复
			if (skinItem.isRepeat === "1") {
				this.bgContainer.css({ "background-repeat": "repeat-y" });
			} else {
				this.bgContainer.css({ "background-repeat": "no-repeat" });
			}

			this._resetLogo(skinItem.type);
			$.cookie("lastSkin", null);
			$.store("lastSkin", skin+"|"+conf.skin.recommandSkin, {expires: 100});
			conf.skin.current = skin;
			if(skinItem.color){
				BODY.css({
					"background-color": skinItem.color,
					"z-index": 0
				});
			}else if(bodyBg != htmlBg){
				BODY.css({
					"background-color": htmlBg,
					"z-index": 0
				});
			}
			BODY.removeClass("skin-"+removedSkin+" skin-type-dark").addClass(needClass);
		}else if (bgImgSrc === "" || bgImgSrc == "no") {
			this.emptySkin();
		}
	},

	//清空皮肤
	emptySkin: function(){
		var removedSkin = conf.skin.current;
		this.bgContainer.css({ "background-image": "" });
		this._resetLogo();
		$.cookie("lastSkin", null);
		$.store("lastSkin", "no|"+conf.skin.recommandSkin, {expires: 100});
		conf.skin.current = "no";
		BODY.removeClass("skin skin-type-dark skin-"+removedSkin).css("background-color", $("html").css("background-color"));
	},

	//可点击区域的重置
	setClickArea: function(skin, clickData){
		var self = this;
		WINDOW.off("resize.skin");
		self.clickArea.off("click.skin");
		if(clickData && clickData.length>0 && clickData[0].landingpage){
			self._clickAreaAjust(clickData[0]);
			WINDOW.on("resize.skin", $.proxy(self._clickAreaAjust, self, clickData[0]));
			self.clickArea.on("click.skin", function(){
				window.open(self._updateLandingpage(clickData[0].landingpage));
				UT.send({
					modId: self.modId,
					ac: "b",
					position: "background",
					sort: skin
				});
			});
		}else{
			self.clickArea.width(0);
		}
	},

	_resetLogo: function(type){
		$("#searchGroupLogos img").each(function(){
			var dataSrc = $(this).attr("data-src"),
			    realSrc = $(this).attr("src"),
			    oldSrc  = realSrc || dataSrc || "";

			if(!type){
				if(realSrc) {
					$(this).attr("src", oldSrc.replace(/\/dark\//, "/"));
				} else {
					$(this).attr("data-src", oldSrc.replace(/\/dark\//, "/"));
				}
			}else if(!/\/dark\//.test(oldSrc)){
				var prefix = oldSrc.substring(0, oldSrc.lastIndexOf("/"));
				var suffix = oldSrc.substring(oldSrc.lastIndexOf("/"));
				if(realSrc) {
					$(this).attr("src", prefix+"/dark"+suffix);
				} else {
					$(this).attr("data-src", prefix+"/dark"+suffix);
				}
			}
		});
	},

	_getSkinDataByKey: function(skin){
		var data = this.data;
		var skinData = {};
		for(var i=0; i<data.length; i++){
			if(skin == data[i].key){
				skinData = data[i];
				break;
			}
		}
		return skinData;
	},

	_updateLandingpage: function(url){
		var paramKey = conf.skin.passQueryParam || "uid",
			paramVal = Helper.getQuery(location.href)[paramKey];
		if(paramVal){
			url += (url.indexOf("?") != -1 ? "&" : "?") + paramKey + "=" + paramVal;
		}
		return url;
	},

	//生成html容器，并定义该变量（分拆）
	/*_genHtml: function() {
		$("[alog-alias=p-1]").append("<div id='skin-bgimage'></div>");
		this.bgContainer = $("#skin-bgimage");
	},*/

	//绑定事件
	_bindEvent: function() {
		var self = this;
		//class为"ui-skin-close"的元素点击时将关闭
		//BODY.on("click", ".skinbox-item-default", $.proxy(self.emptySkin, self));
		//class为"ui-skin-item"的元素点击时将设置皮肤（取属性值"data-value"）
		BODY.on("click", ".skinbox-item", function(){
			if($(this).hasClass("skinbox-item-selected")){
				return;
			}
			$(".skinbox-item-selected").removeClass("skinbox-item-selected");
			$(this).addClass("skinbox-item-selected");
			var skin = $(this).attr("data-value");
			var skinData = self._getSkinDataByKey(skin);
			self.setSkin(skin, skinData.bgImgSrc);
			self.setClickArea(skin, skinData.clickArea);
			// 判断，当当前选中的皮肤和皮肤skinTrans上推荐的皮肤一致时，改变skinTrans上的icon
			if( skin === conf.skinTrans.defaultSkin ){
				$( window ).trigger( "skinTrans.recommendedSelect" );
			}
			UT.send({
				modId: self.modId,
				ac: "b",
				position: "thumbnail",
				sort: skin
			});
		});
	},

	// 提供外部换肤接口
	_setTrigger: function() {
		var self = this;
		WINDOW.on("skin.change", function(e, arg1) {
			$(".skinbox-item-selected").removeClass("skinbox-item-selected");
			BODY.find(".skinbox-item[data-value='" + arg1 + "']").addClass("skinbox-item-selected");
			var skinData = self._getSkinDataByKey(arg1);
			self.setSkin(arg1, skinData.bgImgSrc);
			self.setClickArea(arg1, skinData.clickArea);
		});
	},

	//具体设置可点击区域的样式
	_clickAreaAjust: function(data){
		var divWidth = parseInt(data.width);
		var mainWidth = parseInt(this.mainWidth);
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
		this.leftClickArea.css({left:firstLeft, width:divWidth, height:data.height});
		this.rightClickArea.css({left:secondLeft, width:divWidth, height:data.height});
	},

	//第一次载入时机、策略（分拆）
	/*_firstLoad: function(){
		var skinCookie = $.cookie("lastSkin");
		var skin = this.recommandSkin ? this.recommandSkin : skinCookie;
		//如果skin不为空，则进行皮肤设置
		if (skin) {
			var time = this.loadTime;
			var self = this;
			//即刻加载
			if (time === "") {
				self.setSkin(skin);
			//延迟加载
			}else{
				setTimeout($.proxy(self.setSkin, self, skin), time);
			}
		}
	},*/

	//插件初始化
	init: function() {
		var that = this;
		that._bindEvent();
		that._setTrigger();
	}
};

module.exports = Skin;
