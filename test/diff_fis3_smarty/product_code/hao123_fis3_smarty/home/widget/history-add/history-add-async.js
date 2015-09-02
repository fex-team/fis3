var $ = require("common:widget/ui/jquery/jquery.js");

var cookie = ($.cookie("FLASHID") || $.cookie("BAIDUID") || "").substr(0, 32);
var add = function(el) {
	var href    = el.attr("href"),
		title   = $.trim(el.text()),
		hrefReg = /https?:\/\/([^\/]+)\/?/i;

	if (href.substr(0, 1) === "/") {
		href = window.location.protocol + '//' + window.location.host + href;
	}
	// add by chenliang,  return when the a tag is not a real link, example:href="javascript:;"
	if (!href.match(hrefReg)) return;
	$.ajax({
		url: "/historyurl/add",
		data: {
			name: title,
			url: href,
			id: cookie
		},
		type: "POST"
	});
};
$(document.body).on('click', 'a', function(e) {
	var that = $(this),
	    tarObj = $(e.target);
	if (that.closest(".favsite-count").length > 0 && !tarObj.hasClass("sidebar-hist-block_remove") && !tarObj.hasClass("hist-block_remove")) {
		add(that);
		Gl && Gl.history && Gl.history.add && Gl.history.add(that);
	}
});