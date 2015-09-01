/*
*	Side Render with textarea
*	For magicbox and charts

*	@Frank Feng
*/

var $ = require("common:widget/ui/jquery/jquery.js");

var sideRender = function (mod, callback) {
	var $mod = $('.side-render[data-mod=' + mod + ']'),
		dom = $($mod.val());
	$mod.before(dom);
	if(callback) {
		callback();
	}
};

module.exports = sideRender;

