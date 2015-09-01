//window.Gl || (window.Gl = {});
var $ = require('common:widget/ui/jquery/jquery.js');
//navigation of lv2 page
var lv2Nav = function () {
	var nav = $("#navMore"),
		navList = $("#navList"),
		content = $("#navMoreContent"),
		expand = $("#navMoreExpand"),
		contract = $("#navMoreContract"),

		bindEvent = function () {
			nav.on("mouseenter", function () {
				$(this).addClass("nav-lv2_more-show");
				content.show();
			});
			nav.on("mouseleave", function () {
				$(this).removeClass("nav-lv2_more-show");
				content.hide();
			});
			nav.on("click", function () {
				if ($(this).hasClass("nav-lv2_more-show")) {
					$(this).removeClass("nav-lv2_more-show");
					content.hide();
				}
				else {
					$(this).addClass("nav-lv2_more-show");
					content.show();
				}
			});
		},

		// render list styles
		render = function () {
			var contentL = $("li", content).length,
				contentTop = 0,
				listTop = Math.floor(navList.offset().top),
				isIE6 = /IE 6.0/.test(navigator.userAgent);

			$("li:first", content).addClass("first-child");
			$("li:last", content).addClass("last-child");
			if (contentL <= 3) {
				$("li:last", content).addClass("noborder");
				content.css("bottom", "0px");
			} else if (contentL > 3 && contentL <= 6) {
				$("li", content).eq(contentL - 2).addClass("noborder");
				content.css("bottom", "-31px");
			} else if (contentL > 6) {
				$("li", content).eq(contentL - 3).addClass("noborder");
				content.css("bottom", "-61px");
			}

			content.show();
			contentTop = Math.floor(content.offset().top);
			content.hide();
			if (contentTop < listTop) {
				var heightDiff = isIE6 ? contentTop - listTop - 59 : contentTop - listTop - 60;
				$("li", content).eq(Math.floor(heightDiff / 30)).addClass("noborder");
				content.css("bottom", heightDiff);
			}
		},

		init = function () {
			render();
			bindEvent();
		};

		init();
};
module.exports = lv2Nav;