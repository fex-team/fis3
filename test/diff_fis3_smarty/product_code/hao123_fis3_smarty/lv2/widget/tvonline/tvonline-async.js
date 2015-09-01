var $ = require('common:widget/ui/jquery/jquery.js');
 
!function  () {
	$(".mod-tvonline").find("li").hover(
		function(){
			$(this).addClass("hover");
		},
		function(){
			$(this).removeClass("hover");
	});
}();