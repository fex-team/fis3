var $ = require("common:widget/ui/jquery/jquery.js");
//keyboard on search group
;;(function () {
	var searchKeyboard = $("#searchKeyboard");

	searchKeyboard.hover(function() {
	    !(searchKeyboard.attr("src") === __uri("img/tia_down2.png")) && searchKeyboard.attr("src", __uri("img/tia_hover2.png"));
	}, function() {
	    !(searchKeyboard.attr("src") === __uri("img/tia_down2.png")) && searchKeyboard.attr("src", __uri("img/tia_normal.png"));
	});
	
	searchKeyboard.on("click", function () {
		UT.send({
			type: "click",
			ac: "b",
			position: "keyboard",
			modId: "search"
		});
		$(this).toggleClass("keyboard-down");
		require.async("common:widget/keyboard/keyboard-main.js", function () {
			var input = $("#searchGroupInput"),
	            kbda = $("#kbda");
	        input.length > 0 && input.focus();
	        if($("#addFavBar").css("display")=="block"){
	        	$("#kbd").css("top","167px");
	        }
	        
	        //修复IE下小键盘点击光标乱跳
	        kbda.length > 0 && document.all && $(document.body).on("mousedown", function(e) {
	        	var el = e.target;
	          	$.contains(kbda, el) && input.length > 0 && (input[0].onbeforedeactivate = function() {
	            window.event.returnValue = false;
	            input.onbeforedeactivate = null;
	          });
	        });
		});
	});
	$(document).on("mousedown","#close",function(){
		searchKeyboard.removeClass("keyboard-down");
	});
})();