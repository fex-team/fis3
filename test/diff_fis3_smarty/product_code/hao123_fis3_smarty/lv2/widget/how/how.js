var $ = require("common:widget/ui/jquery/jquery.js");

var howInit = function() {

	function getBrowserType() {
		var userAgent = navigator.userAgent,
			browserType;
		if (/msie/i.test(userAgent)) browserType = "msie";
		else if (/firefox/i.test(userAgent)) browserType = "firefox";
		else if (/chrome/i.test(userAgent)) browserType = "chrome";
		else if (/opera/i.test(userAgent)) browserType = "opera";
		else if (/safari/i.test(userAgent)) browserType = "safari";
		else browserType = "other"
		return browserType;
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
	
	(function init() {
		var browser = getBrowserType();
		if (browser != "other") {
			$("#" + browser).trigger("click");
		}
	})();
};

module.exports = howInit;