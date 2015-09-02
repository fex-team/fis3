var $ = require('common:widget/ui/jquery/jquery.js');


//window.Gl || (window.Gl = {});
//back to top button
var backTop = function () {
	var btn = $("#backTop"),
		isIE6 = /IE 6.0/.test(navigator.userAgent);
		/*fixIeTop = function () {
			var ieTop = $(window).height() + $(window).scrollTop() - 80;
			btn.css("top", ieTop);
		};*/
		/*fixPos = function () {
			var btOffset = ($(window).width() - 960) / 2;
			if (btOffset >= 50) {
				btn.css("right", btOffset - 40);
			} else {
				btn.css("right", 10);
			}
		};*/
	$(window).on("scroll", function () {
		var style = btn.css("display");
		if($(this).scrollTop() > 0) {
			style === "none" && btn.show();
			//fix ie6 positon
			// isIE6 && fixIeTop();
		}
		else {
			style === "block" && btn.hide();
		}

	});
	btn.on("click", function () {
		window.scrollTo(0,0); 
	})
}

module.exports = backTop;