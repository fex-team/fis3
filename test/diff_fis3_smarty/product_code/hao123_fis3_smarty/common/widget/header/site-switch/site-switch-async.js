/*
* Setting btn including site switching and theme features
* @ by FK
*/
var $ = require("common:widget/ui/jquery/jquery.js");
window.Gl || (window.Gl = {});

Gl.settings = function () {
	var btn = $("#settingBtn"),
		dropdown = $("#settingDropdown"),
		siteList = $("#siteList"),
		curCountry = $("li.site_" + conf.country + " a", siteList),
		status = 0, // Status of whether the dropdown is show, 0: hide; 1: show
		_this = {}, // Copy objects to this function's return value

		bindEvent = function () {
			btn.on("click.old", function (e) {
				e.preventDefault();
				if (!status) {
					Gl.settings.open();
				} else {
					Gl.settings.close();
				}
			});
			$(document).on("click", function (e) {
				var el = e.target;
				// Shut the dropdown when clicking on other areas
				el !== btn[0] && el !== dropdown[0] && !$.contains(dropdown[0], el) && Gl.settings.close();
			});
			$("a", siteList).on("click", function (e) {
				e.preventDefault();
				if (e.target !== curCountry[0]) {
					var la = $(this).attr("data-la");
					// Set cookie for the Accept-language judging
					la !== "" && $.cookie("LA", $(this).attr("data-la"), {expires: 2000, domain: "hao123.com"});
					Gl.settings.close();
					// Open target site
					window.open($(this).attr("href"), $(this).attr("target"));
				}
			});

		}

	// Open the dropdown list
	_this.open = function () {
		btn.addClass("settings-btn_open");
		dropdown.show();
		status = 1;	// Set status to open
	};

	// Shut the dropdown list
	_this.close = function () {
		btn.removeClass("settings-btn_open");
		dropdown.hide();
		status = 0;	// Set status to close
	};

	// init
	_this.init = function () {
		curCountry.addClass("cur");
		bindEvent();
	};

	return _this;
}();

