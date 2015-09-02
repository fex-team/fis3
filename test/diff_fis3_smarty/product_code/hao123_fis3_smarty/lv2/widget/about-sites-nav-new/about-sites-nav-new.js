var $ = require("common:widget/ui/jquery/jquery.js");
var History = require("common:widget/ui/history/history.js");

var aboutInit = function() {

		var anchor = location.href.split("#"),
			arrLength = anchor.length,
			historyObj = new History(),
			defaultAnchor = "about",
			navObj = $("#navList").find("[href='#"+defaultAnchor+"']"),
			panelObj = $("#tab-" + defaultAnchor),
			$window = $(window),

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
			initHow = function(tabId, subTabId) {
				// $(".item-title.extend").removeClass("extend");
				var browser = subTabId || getBrowserType();
				if (browser != "other") {
					// $("#" + tabId + "-" + browser).trigger("click");
					var tabObj = $("#" + tabId + "-" + browser).parent(),
						itemObj = tabObj.next(":visible");
					if(itemObj && itemObj.length){
						tabObj.removeClass("extend");
					}else{
						$(".item-title.extend").removeClass("extend");
						tabObj.addClass("extend"); //.slideDown("fast");
					}
					$window.scrollTop(tabObj.offset().top);

				}
			},
			switchTab = function(tabId) {
				var regRes = tabId.match(/^(how|uninstall)(?:-([^-]*))?$/);
				if(regRes && regRes[1]){
					tabId = regRes[1];
				}
				navObj.removeClass("cur");
				navObj = $("#navList").find("[href='#"+tabId+"']");
				navObj.addClass("cur");
				panelObj.hide();
				panelObj = $("#tab-" + tabId);
				panelObj.show();

				if (regRes && regRes[0]) {
					initHow(regRes[1], regRes[2]);
				} else {
					$window.scrollTop() && $window.scrollTop(0);
				}
			};
		$("#tabContent").on("click", ".item-title", function(e) {
			var id = $(this).attr("href").slice(1);
			historyObj.pushState(id);
			// 清除锚点默认行为
			e.preventDefault();
			/*var that = $(this),
				itemObj = that.next(":visible");
			if(itemObj && itemObj.length){
				that.removeClass("extend");
			}else{
				$(".item-title.extend").removeClass("extend");
				that.addClass("extend"); //.slideDown("fast");
			}*/
		});
		$(historyObj).on("popstate", function(e, id) {
			switchTab(id.length ? id : defaultAnchor);
		});
		$("#navList").on("click", "a", function(e) {
			var targetObj = $(this),
				id = targetObj.attr("href").split("#")[1];

			if (id) {
				historyObj.pushState(id);
				// 清除锚点默认行为
				e.preventDefault();
			}
		});


			/*setTimeout(function() {
				var anchorArr = anchor[1].split("-");
				navObj = $("#navList").find("[href=#" + anchorArr[0] + "]");
				navObj.addClass("cur");
				anchorArr[1] ? switchTab(navObj, anchorArr[0], anchorArr[1]) : switchTab(navObj, anchorArr[0]);
			}, 0);*/

		historyObj.pushState(anchor[1] || defaultAnchor);



}

module.exports = aboutInit;
