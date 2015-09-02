var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');

var bus = function() {
	var handleTime = function() {
		var time = new Date();
		var year = time.getFullYear();
		var month = time.getMonth();
		var nMonth = time.getMonth()+1;
		var day = time.getDate();
		var hour = time.getHours();
		var dateArray = [];
		var yearArray = [];
		var html;
		var yMonth = $('#ym');
		var nMon = nMonth.toString();
		if(nMon.charAt(1)==''){
			nMon='0'+nMon;
		}
		var nDay = day.toString();
		if(nDay.charAt(1)==''){
			nDay = '0'+nDay;
		}
		var nHour = hour.toString();
		if(nHour.charAt(1)==''){
			nHour = '0' + nHour;
		}
		var y_m = year+""+nMon; 
		var min = time.getMinutes();
		var nMin = min.toString();
		if(nMin.charAt(1)==''){
		    nMin = '0'+ nMin
		}
		//return nMin
		for(var i=0;i<8;i++) {
			if(month<=12){
				dateArray.push(month);
				yearArray.push(year);
				month++;	
			}else{
				month=1;
				year+=1;
			}
		};
		var nDateArray = [];
		var tmp;
		for(var i=0;i<dateArray.length;i++) {
	 		tmp = dateArray[i].toString();
	 		if(tmp.charAt(1)==''){
	 			tmp = '0' + tmp;
	 		}
	 		nDateArray.push(tmp);
			html += '<option value='+yearArray[i]+''+nDateArray[i]+'>'+yearArray[i]+'年'+nDateArray[i]+'月</option>';
		};
		yMonth.html(html);
		$("#ym option[value="+y_m+"]").attr("selected",true);
		$("#d option[value="+nDay+"]").attr("selected",true);
		$("#hh option[value="+nHour+"]").attr("selected",true);
		$("#m1 option[value="+nMin.charAt(0)+"]").attr("selected",true);
		$("#m2 option[value="+nMin.charAt(1)+"]").attr("selected",true);
	};
	
	
	var bindEvents = function() {
		var oSubmit = $(".bus-submit");
		var oFrom = $(".from-position");
		var oTo = $(".to-position");
		var oExchange = $(".bus-info-r");
		oExchange.click(function(){
			var from = oFrom.val();
			var to = oTo.val();
			if(from!='' || to!=''){
				if(from!=''&&to==''){
					oFrom.prev().show();
					oTo.prev().hide();	
				}else if(from==''&&to!=''){
					oTo.prev().show();
					oFrom.prev().hide();
				}	
				oFrom.val(to);
				oTo.val(from);
			}
			var tmpFrom = oFrom.val();
			var tmpTo = oTo.val();
			if(tmpFrom=='' && tmpTo!=''){
				oFrom.addClass('color_red');
				oTo.removeClass('color_red');	
			}
			if(tmpTo=='' && tmpFrom!=''){
				oTo.addClass('color_red');
				oFrom.removeClass('color_red');	
			}
		});
		oSubmit.click(function(){
			if(oFrom.val()=='' || oTo.val()=='') {
				if(oFrom.val()==''){
					oFrom.addClass('color_red');	
				}
				if(oTo.val()==''){
					oTo.addClass('color_red');	
				}
				return false;
				
			}else{
				return true;
			}
		});
		oFrom.keydown(function(){
			$(this).removeClass('color_red');
		})
		oTo.keydown(function(){
			$(this).removeClass('color_red');
		})
		oSubmit.mouseover(function(){
		   $(this).addClass('subBtn_color')
		}).mouseout(function(){
		    $(this).removeClass('subBtn_color')
		});
		$(".bus-note-info").click(function(){
			var _this = $(this);
			_this.hide();
			_this.siblings("input").focus();
		});
		$("#mod-side-bus .from-position, #mod-side-bus .to-position").each(function(){
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
	};
	
	
	var handleStatics = function() {
		$(".bus-submit,.from-position,.to-position,.via-position,.radio-type,.exchange,.charts_more").on("click",function(e) {
			var utObj = {
				"type": "click",
				"modId": "bustransfer",
				"position": "links"
			};
			if ($(e.target).hasClass('charts_more')) {
				utObj.ac = "b";
			}
			UT && UT.send(utObj);
		})
		$("#ym,#d,#hh,#m1,#m2,.order_items").on("change",function() {
			UT && UT.send({"type": "click","ac":"b","modId":"bustransfer","position":"links"});
		});
	};
	var init = function() {
		handleTime();
		bindEvents();
		handleStatics();
	};
	init();
}

module.exports = bus;