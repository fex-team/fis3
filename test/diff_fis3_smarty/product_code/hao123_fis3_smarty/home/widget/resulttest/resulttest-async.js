var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');

var resultTest = function(){
	var handleSub = function(){
		var oSubmit = $(".exam_submit");
		var oSeatNo = $(".seatno-area");
		var oRadio = $(".exam_radio-type");
		var url_level_1 = "http://nateega.masrawy.com/Thanaweya_L1.aspx";
		var url_level_2 = "http://nateega.masrawy.com/Thanaweya_L2.aspx";
		var oForm = $("#mod-side-result-test");
		oSeatNo.keydown(function(){
			$(this).removeClass('note-info');
		});
		oSeatNo.click(function() {
			UT && UT.send({"type": "click","modId":"testresult","sort":"seatno-area","position":"links","ac":"b"});
		});
		oSubmit.click(function() {
			UT && UT.send({"type": "click","modId":"testresult","position":"links","sort":"submit_btn","ac":"b"});
			if(oSeatNo.val()==''){
				oSeatNo.addClass("note-info");
				return false;
			}else {
				return true;
			}
		});	
		oRadio.click(function(){
			UT && UT.send({"type": "click","modId":"testresult","position":"links","sort":"radio_type","ac":"b"});
		    if($(this).val()!='1'){
		    	oForm.attr("action",url_level_2); 
		    }else{
		    	oForm.attr("action",url_level_1); 
		    }
		});
	};
	handleSub();
};

module.exports = resultTest;