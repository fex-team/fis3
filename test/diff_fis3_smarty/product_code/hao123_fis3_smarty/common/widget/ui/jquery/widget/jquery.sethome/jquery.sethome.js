/*
* jQuery Set Home Page Plugin
*
* @Frank Feng
*/

var jQuery = require("common:widget/ui/jquery/jquery.js");

jQuery.fn.extend({
	sethome: function (url) {
		var el = this[0],
			url = url || window.location.href;
		try {
			el.style.behavior = 'url(#default#homepage)';
			el.setHomePage(url);
		} catch (e) {
			window.open("/about#how", "_blank");
		}
		return this;
	}
});
