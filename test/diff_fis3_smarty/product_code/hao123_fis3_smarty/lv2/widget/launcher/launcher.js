var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");
require('common:widget/ui/slide/slide.js');
require('common:widget/ui/slide/plugin/animate.js');
require('common:widget/ui/slide/plugin/play.js');

var launcher = function() {
	init = function(){
		$.slide({
            animate: {
                styles: "fade"
            }
        }, $(".mod-launcher-mid #rightSlide"));
	};
	init();
}

module.exports = launcher;