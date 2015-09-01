<%require name="common:widget/keyboard/`$head.dir`/`$head.dir`.css"%>
<img class="box-search_keyboard" id="searchKeyboard" src="/resource/fe/img/blank.gif" data-src="img/tia_normal.png" width="25" height="25" alt="">
<%script%>
require.async("common:widget/ui/jquery/jquery.js", function($) {
	var $keyBoard = $("#searchKeyboard");
	$keyBoard.attr("src", $keyBoard.attr("data-src"));
	$keyBoard.one("e_go.keyboard", function() {
		require.async("common:widget/keyboard/keyboard-async.js");
	});

	$(function() {
		$keyBoard.trigger("e_go.keyboard");
	});

	$keyBoard.one("mouseenter", function() {
		$(this).trigger("e_go.keyboard");
	});
});
<%/script%>
