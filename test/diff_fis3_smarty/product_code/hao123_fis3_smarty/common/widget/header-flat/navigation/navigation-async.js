var $ = require("common:widget/ui/jquery/jquery.js");

var $navWrap = $("#navWrap");

$navWrap.on("click", '.nav-el', function(e) {
	UT.send({
		position: "nav",
		sort: $(this).attr("href"),
		type: "click",
		modId: "navigation"
	});
});