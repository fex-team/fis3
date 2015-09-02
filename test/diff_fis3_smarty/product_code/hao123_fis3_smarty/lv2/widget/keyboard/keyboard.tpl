
<img class="box-search_keyboard" id="searchKeyboard" src="img/tia.png" width="25" height="25" alt="">
<%script%>
require.async("common:widget/ui/jquery/jquery.js", function($) {
	$(window).one("e_go.keyboard", function () {
		require.async("lv2:widget/keyboard/keyboard-async.js");
	});

	$(function () {
		$(window).trigger("e_go.keyboard");
	});

	$("#searchKeyboard").one("mouseenter", function () {
		$(window).trigger("e_go.keyboard");
	});
});
<%/script%>
