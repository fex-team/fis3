var $ = require("common:widget/ui/jquery/jquery.js");

var aboutInit = function() {
	window.aboutHelp = function() {
		var anchor = location.href.split("#"),
			arrLength = anchor.length,
			navObj,

			getBrowserType = function() {
				var userAgent = navigator.userAgent,
					browserType;
				if (/msie/i.test(userAgent)) browserType = "msie";
				else if (/firefox/i.test(userAgent)) browserType = "firefox";
				else if (/chrome/i.test(userAgent)) browserType = "chrome";
				else if (/opera/i.test(userAgent)) browserType = "opera";
				else if (/safari/i.test(userAgent)) browserType = "safari";
				else browserType = "other"
				return browserType;
			},
			initHow = function(tabId) {
				$(".item-content:visible").hide().prev().removeClass("extend");
				var browser = getBrowserType();
				if (browser != "other") {
					$("#" + tabId + "-" + browser).trigger("click");
				}
			},
			switchTab = function(navObj, tabId) {
				$("#navList").find("a.cur").removeClass("cur");
				navObj.addClass("cur");
				var index = location.href.indexOf("#");
				if (index == -1) {
					location.href += ("#" + tabId);
				} else {
					location.href = location.href.substring(0, index) + "#" + tabId;
				}
				$("#tabContent").children(":visible").hide();
				$("#tab-" + tabId).show();
				if (tabId == "how" || tabId == "uninstall") {
					initHow(tabId);
				} else {
					window.scrollTo(0, 0);
				}
			};
		$(".item-title").click(function() {
			var that = $(this);
			if (!that.next(":visible").length) {
				$(".item-content:visible").hide().prev().removeClass("extend");
				that.addClass("extend").next().show(); //.slideDown("fast");

			} else {
				that.removeClass("extend").next().hide(); //.slideUp("fast");				
			}
		});
		$("#navList").click(function(e) {
			var targetObj = $(e.target),
				id = targetObj.attr("href").split("#")[1];
			if ( !! targetObj.attr("onclick")) {
				switchTab(targetObj, id);
			}
		});
		if (arrLength >= 2) {
			setTimeout(function() {
				navObj = $("#navList").find("[href=#" + anchor[1] + "]");
				navObj.addClass("cur");
				switchTab(navObj, anchor[1]);
			}, 0);
		}

	};
	window.aboutHelp();
}

module.exports = aboutInit;