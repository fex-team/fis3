var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var message = require("common:widget/ui/message/src/message.js");

!function () {
	var iframe = '<iframe src="#{src}" width="#{width}" height="#{height}" scrolling="no" frameborder="0" allowTransparency="true"></iframe>';
		_conf = conf.easterGame;
	
	function render () {
		var el = "";

		el = helper.replaceTpl(iframe,{
			"src" : _conf.src,
			"width" : _conf.width,
			"height" : _conf.height
		});
		$(".mod-easter-game").append(el).show();
	}

	function bindEvents () {
		message.on("iframe.gEaster.close",function(){
			$(".mod-easter-game").hide().empty();
		});
		$(document).on("click",".mod-anchorside a,#indexLogo",function(e){
			e.preventDefault();
			!$(".mod-easter-game").is(":visible") && render();
			
		});
	}
	bindEvents();		
}();