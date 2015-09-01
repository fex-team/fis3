var $      = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT     = require("common:widget/ui/ut/ut.js");

var _conf      = conf.dailySign,
    _jumpUrl   = _conf.jumpUrl,
    _api       = conf.apiUrlPrefix,
    _box       = _conf.box,
    _boxOpen   = _conf.boxOpen,
    _noLog     = _conf.noLog,
    _logged    = _conf.logged,
    _noLogBub  = _conf.noLogBubble,
    _loggedBub = _conf.loggedBubble,
    _dailyTips = _conf.dailyTips;

_loggedBub.link = _jumpUrl;
_dailyTips.link = _jumpUrl;
_noLogBub.link  = _jumpUrl;
_logged.box = _box;
_noLog.box  = _box;
_dailyTips.id = _conf.dailyTipId;

var _tpl = {
	noLogTitle: '<img src="#{box}" class="ds-out-box" ><span class="ds-out-tip">#{content}</span><img src="#{gift}" class="ds-out-gift">',
	loggedTitle: '<img src="#{box}" class="ds-in-box" ><span class="ds-in-tip">#{content}</span><div class="ds-in-gift"><span class="ds-bracket-l">[</span><i class="ds-key"></i><span class="ds-in-multi">x</span><span class="ds-num">0</span><span class="ds-bracket-r">]</span></div>', 
	noLogBubble: '<a href="#" class="ds-out-close" onclick="return false" hidefocus="true"></a><p class="ds-content">#{content}<a class="ds-more" href="#{link}">#{more}<span class="ds-more-gt"></span></a></p><div class="ds-btn-wrap"><div class="ds-btn"><p class="ds-out-btn-content">#{login}</p></div></div>', 
	loggedBubble: '<a href="#" class="ds-in-close" onclick="return false" hidefocus="true"></a><p class="ds-content">#{content}<a class="ds-more" href="#{link}">#{more}<span class="ds-more-gt"></span></a></p><div class="ds-btn-wrap"><div class="ds-btn ds-client"><a href="#{link}" class="ds-in-btn-content ds-in-client">#{clientSign}</a></div><div class="ds-btn ds-direct"><a href="#{link}" class="ds-in-btn-content ds-in-web">#{directSign}</a></div></div>', 
	dailyTips: '<div class="mod-ds-pop" id="#{id}" log-mod="daily-sign"><a href="#" class="ds-pop-close ds-pop-close-x" hidefocus="true" onclick="return false"></a><p class="ds-pop-hd">#{title}</p><div class="ds-pop-bd"><p class="ds-pop-content">#{content}</p><p class="ds-pop-content ds-pop-btn"><a href="#{link}" class="ds-pop-to" hidefocus="true">#{toLinkContent}</a></p></div></div>'
};

var dailySign    = $("#" + _conf.id),
    dailyTips    = "#" + _conf.dailyTipId,
    signTitle    = $(".ds-title", dailySign),
    noLogTitle   = $(".ds-out-title", dailySign),
    noLogBubble  = $(".ds-out-bubble", dailySign),
    loggedTitle  = $(".ds-in-title", dailySign),
    loggedBubble = $(".ds-in-bubble", dailySign),
    bubbleWrap   = $(".ds-bubble", dailySign);

var isSigned = false, // 用户签到状态
    isGift   = false,  // 是否提醒礼物
    _tn      = helper.getQuery()["tn"],
    isTn     = checkTn(_tn), // 是否为客户端签到
    repTpl   = helper.replaceTpl;  

// check当前TN号是否属于客户端TN号
function checkTn(tn) {
	var arrTn = $.trim(_conf.tn);
	if (arrTn === "") {
		return false;
	}
	arrTn = arrTn.split("|");
	for (var i = 0, j = arrTn.length; i < j; i++) {
		if (arrTn[i] === tn) {
			return true;
		}
	}
	return false;
}

var controller = {
	// 初始化
	init: function() {
		var that = this;
		isTn && that.showDailyTips();
		//if(that.checkStatus()) {
			//that.loggedInit();
		//} else {
			that.noLogInit();
		//}
		that.bindEvent();
	},
	// 未登录FB时初始化
	noLogInit: function() {
		var that = this;
		that.createNoLogHtml();
		that.bindNoLogEvent();
		that.showTips();

		loggedTitle.hide();
		loggedBubble.hide();
	},
	// 账号登录后初始化
	loggedInit: function() {
		var that = this;
		
		that.createLoggedHtml();
		that.bindLoggedEvent();

		noLogTitle.hide();
		noLogBubble.hide();
		bubbleWrap.hide();
		loggedBubble.show();
		loggedTitle.css("display", "block");
		isTn && loggedBubble.find(".ds-btn-wrap").remove();
		
		that.getGiftMsg(that.updateGiftTips);
		that.checkSignStatus(that.updateKey, that.showTips, that.updateSignedWord);
	},
	// 蒙层弹窗每日提醒初始化
	dailyTipsInit: function() {
		var that = this;
		that.createDailyTipsHtml();
		that.bindDailyTipsEvent();
	},
	// 不记cookie的气泡提醒
	showTips: function() {
		bubbleWrap.show();
		setTimeout(function() {
			(!isGift) && bubbleWrap.hide();
		}, _conf.tipAutoClose);
	},
	// 蒙层弹窗每日提醒，仅有客户端
	showDailyTips: function() {
		var that = this,
		   expir = that.fixTime();

		if ($.cookie("dailyC")) return;
		$.cookie("dailyC", 1, {
			expires: expir
		});
		that.dailyTipsInit();
	},
	// 获取一天内剩余时间
	fixTime: function() {
		var that  = this,
		    _date = that.getCurTime(), 
		    stamp;

		stamp = 24*60*60-_date.getHours()*3600-_date.getMinutes()*60-_date.getSeconds();
		_date.setTime(_date.getTime() + stamp * 1000);
		return _date;
	},
	// 获取当前时间
	getCurTime: function() {
		var _date;
		if (Gl && Gl.time && Gl.time.getTime) {
			_date = Gl.time.getTime();
		}
		_date = _date || (new Date());
		return _date;
	},
	// 获取登录状态
	checkStatus: function() {
		return (loginCtroller && loginCtroller.verify == 1);
	},
	// 登陆操作
	logIn: function() {
		loginCtroller && loginCtroller.fire && loginCtroller.fire();
	},
	// 用户没有登录时创建HTML
	createNoLogHtml: function() {
		noLogTitle.html(repTpl(_tpl.noLogTitle, _noLog));
		noLogBubble.html(repTpl(_tpl.noLogBubble, _noLogBub));
	},
	// 用户登录后创建HTML
	createLoggedHtml: function() {
		loggedTitle.html(repTpl(_tpl.loggedTitle, _logged));
		loggedBubble.html(repTpl(_tpl.loggedBubble, _loggedBub));
	},
	// 创建只有客户端有的每日提醒HTML
	createDailyTipsHtml: function() {
		$(document.body).append(repTpl(_tpl.dailyTips, _dailyTips));
		dailyTips = $(dailyTips);
		setTimeout(function() {
			dailyTips.hide();
		}, _conf.dailyTipsDelay);
		UT.send({
			"type"     : "others",
			"position" : "client",
			"sort"     : "tipsShow",
			"modId"    : "daily-sign"
		});
	},
	// 整体事件绑定
	bindEvent: function() {

		dailySign.hover(function() {
			var outBox = noLogTitle.find(".ds-out-box"),
				inBox  = loggedTitle.find(".ds-in-box");
			outBox && outBox.attr("src", _boxOpen);
			inBox && inBox.attr("src", _boxOpen);
		}, function() {
			var outBox = noLogTitle.find(".ds-out-box"),
				inBox  = loggedTitle.find(".ds-in-box");
			outBox && outBox.attr("src", _box);
			inBox && inBox.attr("src", _box);
			bubbleWrap.hide();
		});
	},
	// 未登录事件绑定
	bindNoLogEvent: function() {
		var that = this;
		noLogTitle.on("click", function() {
			bubbleWrap.show();
		});
		noLogBubble.on("click", ".ds-out-close", function() {
			bubbleWrap.hide();
		}).on("click", ".ds-btn", function() {
			that.logIn();
			if(isTn) {
				that.sendLog("client", "login", true);
			} else {
				that.sendLog("web", "login", true);
			}
			//bubbleWrap.hide();
		}).on("click", ".ds-more", function() {
			var _that = $(this),
				url   = _that.attr("href");
			if(isTn) {
				that.sendLog("client", "detail");
				_that.attr("href", that.addTn(_tn, url));
			} else {
				that.sendLog("web", "detail");
			}
		});
	},
	// 已登录事件绑定
	bindLoggedEvent: function() {
		var that = this;
		loggedTitle.on("click", function(e) {
			var _that = $(this),
				url   = _that.attr("href");
			if (isSigned) {
				if (isTn) {
					that.sendLog("client", "signed");
					_that.attr("href", that.addTn(_tn, url));
				} else {
					that.sendLog("web", "signed");
				}
				bubbleWrap.hide();
			} else {
				if(isTn) {
					that.signAction(that.updateSignedWord, that.updateKey);
					that.sendLog("client", "sign");
					_that.attr("href", that.addTn(_tn, url));
					bubbleWrap.hide();
				} else {
					bubbleWrap.show();
					e.preventDefault();
				}
			}
		});
		loggedBubble.on("click", ".ds-in-close", function(e) {
			bubbleWrap.hide();
		}).on("click", ".ds-in-client", function(e) {
			var _that = $(this),
				url = _that.attr("href");
			!isSigned && that.sendLog("web", "signClient");
			if (url.search(/download/) > -1) {} else {
				_that.attr("href", (url + ((url.search(/\?/) > -1) ? "&" : "?") + "download=1"));
			}
			bubbleWrap.hide();
		}).on("click", ".ds-in-web", function() {
			if (!isSigned) {
				that.sendLog("web", "signDirect");
				that.signAction(that.updateSignedWord, that.updateKey);
			}
			bubbleWrap.hide();
		}).on("click", ".ds-more", function() {
			var _that = $(this),
				url   = _that.attr("href");
			if (isTn) {
				that.sendLog("client", "detail");
				_that.attr("href", that.addTn(_tn, url));
			} else {
				that.sendLog("web", "detail");
			}
		});
	},
	// 蒙层事件绑定
	bindDailyTipsEvent: function() {
		var that = this;
		dailyTips.on("click", ".ds-pop-close", function() {
			dailyTips.hide();
			that.sendLog("client", "tipClose");
		}).on("click", ".ds-pop-to", function() {
			var _that = $(this),
				url = _that.attr("href");
			if (isTn) {
				that.sendLog("client", "detailTips");
				_that.attr("href", that.addTn(_tn, url));
			}
		});
	},
	// URL添加TN参数
	addTn: function(tn, url) {
		if(url.search(/tn=/) > -1) {
			return url;
		}
		return url + ((url.search(/\?/) > -1) ? "&" : "?") + "tn=" + tn;
	},
	// 检查签到状态
	checkSignStatus: function(callback1, callback2, callback3) {
		var that = this;
		$.ajax({
			type: 'get',
			url: _api,
			dataType: 'jsonp',
			jsonp: 'jsonp',
			data: {
				app: "checkin",
				act: "getInfo",
				cno: _conf.cno,
				country: conf.country
			},
			success: function(data) {
				data = (data && data["content"] && data["content"].data) || {};
				if (data["status"] == 1) {
					data["gold_num"] && callback1.call(that, data["gold_num"]);
					if (data["hascheckin"] == 1) {
						isSigned = true;
						callback3.call(that);
					} else {
						callback2.call(that);
					}
				}
			}
		});
	},
	// 用户已签到时页面跳转到活动页
	reloadSelf: function() {
		var that   = this,
		    curUrl = isTn ? that.addTn(_tn, _jumpUrl) : _jumpUrl;

		window.location.assign(curUrl);
	},
	// 更新奖品提醒
	updateGiftTips: function(stamp) {
		var that   = this,
		    oldCo  = $.cookie("dailyGift"),
			liveCo = $.cookie("dailyLive");

		var _curDate   = that.getCurTime(),
		    _stampDate = (new Date()).setTime(stamp * 1000),
		    gap        = _curDate.getTime() - stamp * 1000;

		if ((gap < 11*60*1000) || (gap >= 3*24*60*60*1000)) {
			return;
		}
		_curDate.setTime(stamp * 1000 + 3*24*60*60*1000);
		if (!liveCo) {
			$.cookie("dailyLive", stamp, {
				expires: parseInt(_conf.live, 10)
			});
			$.cookie("dailyGift", stamp, {
				expires: _curDate
			});
		} else {
			if (liveCo != stamp) {
				$.cookie("dailyLive", stamp);
				$.cookie("dailyGift", stamp, {
					expires: _curDate
				});
			}
		}
		if (liveCo == stamp && !oldCo) {} else {
			isGift = true;
			(!isTn) && loggedBubble.find(".ds-btn-wrap").remove();
			loggedBubble.find(".ds-content").html(_conf.giftTips);
			bubbleWrap.show();
		}
	},
	// 用户获奖信息，提示用户查看邮件
	getGiftMsg: function(callback) {
		var that = this;
		$.ajax({
			type: 'get',
			url: _api,
			dataType: 'jsonp',
			jsonp: 'jsonp',
			data: {
				app: "activity",
				ano: _conf.ano,
				act: "userPrizeInfo",
				lst: "1",
				uid: "1",
				country: conf.country
			},
			success: function(data) {
				data = (data && data["content"] && data["content"].data) || {};
				if (data["status"] == 1 && data["prizeInfo"] && data["prizeInfo"][0]) {
					//更新用户获奖信息
					if( data["prizeInfo"][0]["update_time"]) {
						callback.call(that, data["prizeInfo"][0]["update_time"]);
					}
				}
			}
		});
	},
	// 用户签到成功后显示签到成功文字
	updateSignedWord: function() {
		loggedTitle.find(".ds-in-tip").html(_conf.signSuc);
	},
	// 更新钥匙数
	updateKey: function(num) {
		loggedTitle.find(".ds-num").html(num);
	},
	// 签到
	signAction: function(callback1, callback2) {
		var that = this;
		$.ajax({
			type: 'get',
			url: _api,
			dataType: 'jsonp',
			jsonp: 'jsonp',
			data: {
				app: "checkin",
				cno: _conf.cno,
				act: "check",
				type: (isTn ? "2" : "1"),
				country: conf.country
			}
		}).done(function(data) {
			data = (data && data["content"] && data["content"].data) || {};
			if (data["status"] == 1 || data["status"] == 3) {
				isSigned = true;
				callback1.call(that);
			}
		}).done(function(data) {
			data = (data && data["content"] && data["content"].data) || {};
			if (data["status"] == 1 || data["status"] == 3) {
				isSigned = true;
				data["gold_num"] && callback2.call(that, data["gold_num"]);
			}
		});
	},
	// 统计
	sendLog: function(pos, sort, ac) {
		var utObj = {
			"type"     : "click",
			"position" : pos,
			"sort"     : sort,
			"modId"    : "daily-sign"
		};
		if(ac) {
			utObj.ac = "b";
		}
		UT.send(utObj);
	}
};

controller.init();

// 注册自定义事件，放于账号回调中使用
$(window).on("dailySign.login", function() {
	controller.loggedInit();
});

module.exports = controller;