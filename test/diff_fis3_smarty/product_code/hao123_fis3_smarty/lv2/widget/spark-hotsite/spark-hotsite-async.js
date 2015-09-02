var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");

$(".mod-hotsite").on("click", "a", function() {
	var url = $(this).attr("href");
	UT.send({
		modId: "spark-hotsite",
		type: 'click',
		position: url
	});
});