// welcome tip

var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");
var helper = require("common:widget/ui/helper/helper.js");
require("common:widget/ui/jquery/widget/jquery.sethome/jquery.sethome.js");

window.Gl || (window.Gl = {});

var confAct = conf.logoActivity || {},
    curUa = navigator.userAgent.toLowerCase().match(/(msie|firefox|chrome)/),
    curBrowser = curUa ? curUa[1] : "",
    actLogo = {},
    actTips = {};

curBrowser = ((curBrowser === "msie") || (document.documentMode == 11)) ? "ie" : curBrowser;
actLogo = confAct[curBrowser] ? confAct[curBrowser].logo : null;
actTips = confAct[curBrowser] ? confAct[curBrowser].logoTips : null;

function isNotEmpty(str) {
	return ($.trim(str) !== "");
}

Gl.logo = function (type) {
	var indexLogo = $("#indexLogo"),
	indexLogoImg = $("#indexLogoImg"),
	secLogoImg = $("#secLogoImg"),
	indexSlogan = $(".userbar-logo_slogan");

	if (type !== "index") {
		indexLogoImg.hide();
		secLogoImg.show();
	} else {
		if (confAct.isHidden === "0" && actLogo) {
			var imgSrc = actLogo["src"],
				logoUrl = actLogo["url"],
				sloganTxt = actLogo["slogan"],
				sloganSz = actLogo["sloganSize"],
				indexTtl = actLogo["indexTitle"];
			indexLogoImg.attr("src", imgSrc);
			indexLogo.attr("href", logoUrl);
			indexSlogan.html(sloganTxt);
			isNotEmpty(sloganSz) && indexSlogan.css("font-size", sloganSz);
			indexLogo.attr("title", indexTtl);
			indexLogoImg.attr("title", indexTtl);
			indexLogoImg.attr("alt", indexTtl);
		}
	}

	indexLogo.on("click", function ( e ) {
		var logoTip = $("#logoTips").eq(0),
			noJump = conf.logo.noJump;
		UT.send({
			position: "logo",
			modId: "logo",
			type: "click"
		});
		if(logoTip && isNotEmpty(conf.logo.autoCloseTip)) {
			logoTip.hide();
			$.cookie("Gh_l", conf.logoTips.country || "jp");
		}
		if( type === "index" && conf.logo.notOpenNew === "true" ){
			e.preventDefault();
			return;
		}
		else if (type === "index" && ($(this).attr("href") === '/' || $(this).attr("href").match(/^\/\?/)))
			$(this).sethome();
		else if (type === "index"){//如果有passQueryParam，则点击链接要带上这个参数
			var url = $(this).attr("href"),
				paramKey = conf.logo.passQueryParam.trim();
			url = helper.appendQueryToUrl(url, paramKey);
			if( noJump && conf.pageType == "index"){
				return;
			}
			//!noJump && (conf.pageType != "index") &&
			 window.open(url);
		}
		else{
			if( noJump && conf.pageType == "index"){
				return;
			}
			//!noJump && (conf.pageType != "index") &&
			window.location.href = $(this).attr("href") || "/";
		}
	});
}

Gl.logoTips = function () {
	if(!(this instanceof Gl.logoTips)) return new Gl.logoTips();

	var that = this;
	that.tip = $("#logoTips");
	that.tipLink = $("#tipLink");
	that.closeBtn = $("#tipClose");
	that.conf = conf.logoTips;

	that.init();
	if(conf.pageType === "index") {
		that.fixActTips(confAct.isHidden, actTips);
	}
}
Gl.logoTips.prototype = {
	constructor: Gl.logoTips,

	init: function () {
		var that = this;
		var myConf;
		if(confAct.isHidden === "0" && actTips) {
			myConf = confAct.logoTips;
		} else {
			myConf = that.conf;
		}
		if (myConf.show) {
			//点击logotips跳转分类区在二级页不适用
			if((!conf.pageType || conf.pageType != "index") && /^{[0-9]+}$/.test(that.tipLink.attr("href"))){
				that.tip.hide();
				return;
			}
			that.bindEvent();
			if (myConf.alwaysShow) {
				that.show();
			} else if (myConf.userOption) {
				(!$.cookie("Gh_l") || $.cookie("Gh_l") !== that.conf.country) && that.show();
			} else {
				$.cookie("oldFriend", null);
				that.setStore("oldFriend", myConf.version, function() {
					that.show();
				});
			}
		}
	},
	bindEvent: function () {
		var that = this;
		that.tipLink.on("click", function (e) {
			var href = $(this).attr("href");
			e.preventDefault();
			if(href && href !== "#"){//如果有passQueryParam，则点击链接要带上这个参数
				//针对点击logotips可跳转到指定分类区的处理
				if (/^{[0-9]+}$/.test(href)) {
					var sortIndex = href.substring(1, href.length-1);
					var sortSite = $("dl[log-index="+sortIndex+"]", ".box-sort");
					var sortMarginTop = conf.logoTips.sortMarginTop || 40;
					var sortDisappearTime = conf.logoTips.sortDisappearTime || 1500;
					if(sortSite.length>0){
						var embedHome = $("#embed-iframe-nav .home");
						if(embedHome.length>0 && !embedHome.hasClass("current")){
							embedHome.trigger("click");
						}
						$(window).scrollTop(sortSite.offset().top - sortMarginTop);
						var sortSiteHeight = sortSite.height()-2;
						//按需加载导致获取高度可能有问题，采用一定延时
						if (sortIndex>4 && sortSiteHeight<50) {
							setTimeout(function(){
								sortSiteHeight = sortSite.height()-2;
								sortSite.height(sortSiteHeight);
							}, 50);
						}else{
							sortSite.height(sortSiteHeight);
						}
						sortSite.addClass("selected");
						setTimeout(function(){
							sortSite.removeClass("selected");
							sortSite.height(sortSiteHeight+2);
						}, sortDisappearTime);
					}
				}else{
					var url = $(this).attr("href"),
						paramKey = that.conf.passQueryParam.trim();
					url = helper.appendQueryToUrl(url, paramKey);
					window.open(url, "_blank");
				}
			}
			if(confAct.isHidden === "0" && actTips) {
				confAct.logoTips.userOption && $.cookie("Gh_l",that.conf.country);
			} else {
				that.conf.userOption && $.cookie("Gh_l",that.conf.country);
			}
			that.tip.hide();
			UT.send({
				position: "logoTipsLink",
				modId: "logo",
				type: "click"
			});
		});
		that.closeBtn.on("mouseenter", function () {
			$(this).addClass("tip-close_hover");
		});
		that.closeBtn.on("mouseleave", function () {
			$(this).removeClass("tip-close_hover");
		});
		that.closeBtn.on("click", function (e) {
			e.preventDefault();
			that.tip.hide();
			UT.send({
				position: "logoTipsClose",
				ac:"b",
				modId: "logo",
				type: "click"
			});
			$.cookie("Gh_l",that.conf.country);
		});
	},
	show: function () {
		var that = this,
		    timeout = parseInt(that.conf.tipsHideTime, 10);
		that.tip.show();
		if (timeout) {
			setTimeout(function() {
				that.tip.hide();
			}, timeout);
		}
		return true;
	},
	setStore: function (key, value, callback, expires) {
		var that = this;
		$.store(key) !== value && callback();
		$.store(key, value, {expires: expires || 2000});
	},
	fixActTips: function(isHidden, data) {
		var that = this;
		if(isHidden === "0" && data) {
			isNotEmpty(data["tipsWidth"]) && that.tip.css("width", data["tipsWidth"]);
			that.tipLink.attr("href", data["url"]);
			that.tip.children('p').first().contents().filter(function() {
				return this.nodeType === 3;
			}).replaceWith(data["text"]);
			if (isNotEmpty(data["closeText"])) {
				that.tipLink.html(data["closeText"] + '<span class="tipLinkArrow"></span>');
			} else {
				that.tipLink.html('');
			}
		}
	}
}
