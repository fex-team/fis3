/*
* Setting btn including site switching and theme features
* @ by FK
* @require modified by Cgy
*/
var $ = require("common:widget/ui/jquery/jquery.js");

var siteList = $("#siteList"),
	curCountry = $("li.site_" + conf.country + " a", siteList);

curCountry.addClass("cur");

$("a", siteList).on("click", function(e) {
	if (e.target !== curCountry[0]) {
		var la = $(this).attr("data-la");
		// Set cookie for the Accept-language judging
		la !== "" && $.cookie("LA", $(this).attr("data-la"), {
			expires: 2000,
			domain: "hao123.com"
		});
	} else {
		e.preventDefault();
	}
	UT.send({
		position: "siteSwitch",
		sort: $(this).attr("href"),
		type: "click",
		modId: "country"
	});
});