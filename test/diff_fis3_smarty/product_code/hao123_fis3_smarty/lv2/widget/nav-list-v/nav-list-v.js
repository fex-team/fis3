//window.Gl || (window.Gl = {});
var $ = require('common:widget/ui/jquery/jquery.js');
//navigation of lv2 page
var lv2Nav = function () {
	var nav = $("#navMore"),
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
			if ($("li", content).length % 2 === 1) {
				var paddingHTML = '<li class="disabled"><a href="#" onclick="return false" hidefocus="true"></a></li>';
				content.append(paddingHTML);
			}
			$("li:odd", content).addClass("noborder");
			$("li:first", content).addClass("first-child");
			$("li:eq(1)", content).addClass("second-child");
		},

		init = function () {
			render();
			bindEvent();
		};

		init();
};
module.exports = lv2Nav;