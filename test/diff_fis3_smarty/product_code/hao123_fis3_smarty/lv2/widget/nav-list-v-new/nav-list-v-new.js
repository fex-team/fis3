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
			$("li:last", content).addClass("noborder");
		},

		init = function () {
			render();
			bindEvent();
		};

		init();
};
module.exports = lv2Nav;
//;;(function () {
//	Gl.lv2Nav();
//})();
