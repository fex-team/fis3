var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');

var translate = function(){
	var needInfo_start = $(".needInfo_start");
	var needInfo_end = $(".needInfo_end");
	var needInfo_text = $(".needInfo_text");
	var translate_btn = $(".translate-submit");
	var pick_language = $(".pick_language");
	var translate_content = $(".translate_content");
	var charts_more = $(".charts_more");
	pick_language.change(function() {
		var tmp = $(this).val();
		var result = tmp.split("#");
		needInfo_start.attr('value',result[0]);
		needInfo_end.attr('value',result[1]);
	});
	$(".translate_note_info").click(function(){
			var _this = $(this);
			_this.hide();
			_this.siblings("textarea").focus();
		});
	translate_content.each(function(){
	     var thisVal=$(this).val();
	     if(thisVal!=""){
	       $(this).siblings("span").hide();
	      }else{
	      }
	     $(this).focus(function(){
	       $(this).siblings("span").hide();
	      }).blur(function(){
	        var val=$(this).val();
	        var _this = $(this);
	        if(val!=""){
	         _this.siblings("span").hide();
	        }else{
	         _this.siblings("span").show();
	        } 
	      });
    });
    translate_btn.mouseover(function(){
	   $(this).addClass('subBtn_color')
	}).mouseout(function(){
       $(this).removeClass('subBtn_color')
	});
    translate_btn.click(function() {
    	if(translate_content.val()==''){
    		translate_content.addClass('color_red');
    		return false;
    	}	
    });
    translate_content.keydown(function(){
		$(this).removeClass('color_red');
	});
	$(".translate_content,.translate-submit,.charts_more").on("click",function(e) {
		if(e.target.tagName === "A") {
			UT && UT.send({"type": "click","modId":"translate","position":"links"});
		} else {
			UT && UT.send({"type": "click","modId":"translate","position":"links","ac":"b"});
		}
		
	})
	$(".pick_language").on("change",function() {
		UT && UT.send({"type": "click","modId":"translate","position":"links","ac":"b"});
	});
};

module.exports = translate;