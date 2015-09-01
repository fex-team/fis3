var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var time = require("common:widget/ui/time/time.js");
var helper = require("common:widget/ui/helper/helper.js");
require('common:widget/ui/jquery/jquery.cookie.js');

var sideAstro = function(){
	var date = {
			"TODAY": 0,
			"TOMORROW": 1
		},
		errorTimeout,
		isInitted = false,
		astroError = $('#astro-error'),
		astroWrapper = $('.mod-astro'),
		astroPanel = astroWrapper.find('dl'),
		chartsMore = astroWrapper.find('.charts_more'),
		astroData = {},
		curDateIndex = date["TODAY"],//current date
		curAstroName,//current astro
		descLineHeight = parseInt($(".astro-desc").css("line-height")),
		truncConfig = conf.sideAstro.multiTruncate,
		minDescHeight = truncConfig.minLineNum * descLineHeight,
		maxDescHeight = truncConfig.maxLineNum * descLineHeight,
		win = $(window);
		//get local scale date from the top userbar , use a regexp to remove the useless part
		showError = function(){
			astroWrapper.css('height' , '300px');
			chartsMore.hide();
			astroPanel.hide();
			astroError.show();
		},

		hideError = function(){
			astroWrapper.css('height' , 'auto');
			astroPanel.show();
			// chartsMore.show();
			chartsMore.css("display","block");
			astroError.hide();
		},

		getToday = function(){
			time.getTime(function(){
				var today = time.getForm();
				$("#astroDateBox").html("<i></i>"+helper.replaceTpl(conf.sideAstro.todayReg,today));
			});
		},
		//get the whole astro data from api interface
		getAjaxData = function(){
			var ajaxSucceed = false;
			showError();

			var params = "?app=star&act=contents&country="+conf.country;
			$.ajax({
				url: conf.apiUrlPrefix + params,
				//url: "http://api.ghk.hao123.com:8088/api.php?app=star&act=contents&country=br",
				//url: "/static/web/base/js/astro.json",
			    dataType: "jsonp",
			    jsonp: "jsonp",
			    jsonpCallback: "ghao123_" + hex_md5(params,16),
			    cache: false,
			    error: function(XMLHttpRequest, textStatus, errorThrown){
			    },
			    success: function(data) {
			    	if(data.content && data.content.data){
				    	ajaxSucceed = true;
				    	hideError();
				    	astroData = data.content.data;
				    	// delete old cookie if existed, TODO: remove later
				    	$.cookie("sideAstro") && $.cookie('sideAstro', null);
				    	//init astro panel from cookie or default value
				    	var astroCookie = $.cookie.get("astro"),
				    		firstAstroIndex;
				    	firstAstroIndex = astroCookie ? astroCookie : 0;
				    	changeAstro($(".astro-list li:eq("+firstAstroIndex+")"));
				    	bindEvents();
			    	}
			    }
			});
		},
		//display data to content panel
		displayData = function(dateIndex,AstroName){
			var thisObj,score,scoreIcons,data;
			if(dateIndex != curDateIndex || AstroName != curAstroName){
				curDateIndex = dateIndex;
				curAstroName = AstroName?AstroName:curAstroName;
				data = astroData[dateIndex][curAstroName];
				$(".astro-panel > li:eq("+curDateIndex+")").show().siblings().hide();
				$(".astro-luck:eq("+curDateIndex+") li").each(function(){
				//$(".astro-luck:visible li").each(function(){
					thisObj = $(this);
					score = data[thisObj.attr("class").replace("astro-luck_","")];
					scoreIcons = thisObj.children("i");
					scoreIcons.slice(0,score).addClass("sel").end().slice(score).removeClass("sel");
				});
				$(".astro-desc:eq("+curDateIndex+")").each(function(){
				//$(".astro-desc:visible").each(function(){
					thisObj = $(this);
					var thisP = thisObj.children("p:eq(0)"),
						thisP2 = thisP.next(),
						txt = data["forecast"];
					thisP.text(txt);
					thisObj.addClass("astro-desc_s");
					thisObj.find(".i-pointer_up").removeClass("i-pointer_up");
					thisP.show();
					thisP2.hide();
					//muitiline truncate
					if(thisP.height() > minDescHeight){
						thisP2.text(txt);
						if(thisP2.height() > maxDescHeight){
							thisP2.text(txt.slice(0,truncConfig.maxCharNum)+"...");
						}
						thisP.text(txt.slice(0,truncConfig.minCharNum)+"...");
					}else{
						thisObj.find(".i-pointer").hide();
					}
				});
				if(data["more_url"]){
					$(".charts_more",".mod-astro").attr('href',data["more_url"]);
				};
			}
		},
		//change astro
		changeAstro = function(obj){
			var newAstroName = obj.children().eq(0).attr("astro_name"),
				newAstroIndex = obj.index(),
				astroIco = $(".astro_ico"),
				astroClass = astroIco.attr("class");
			if(newAstroName != curAstroName){
				if(astroClass.indexOf("astro_ico_") != -1){
					astroIco.attr("class",astroClass.replace(/astro_ico_\d+/g,"astro_ico_"+newAstroIndex));
				}else{
					astroIco.addClass("astro_ico_"+newAstroIndex);
				}

				$(".astro_name").text(newAstroName);
				$(".astro_period").text(obj.children().eq(1).text());
				displayData(curDateIndex,newAstroName);
				$.cookie.set("astro",newAstroIndex);
				/*if(!!$.cookie("sideAstro") || newAstroIndex != 0){
					multicookie.writeCookie("sideAstro","astro",newAstroIndex);
					//$.cookie("sideAstro","astro="+newAstroIndex,{expires: 2000});
				}*/

			}
		},
		/*multiTruncate = function(obj,divH){
		    while (obj.outerHeight() > divH) {
		        obj.text(obj.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
		    };
		},*/
		init = function(){
			if(!isInitted){
				getToday();
				this.astroList = $(".astro-list");
				$("body").append(this.astroList);
				this.listTrigger = $(".astro_period,.astro-head .i-pointer,.astro_name");
			}
			isInitted = true;
			getAjaxData();
		},
		sendStat = function(ac){
			var utObj = {
                type:"click",
                level:1,
                modId:"astro",
                position:"links",
                country:conf.country
            };
            if(ac) {
            	utObj.ac = "b";
            }
			UT.send(utObj);
		},
		bindEvents = function(){
			var thisObj = this;
			$("#panel-astro .close,#panel-astro .charts_more").click(function(){
				sendStat();
			});
			$(".astro-head").on("click",".astro_period,.i-pointer,.astro_name",function(){
				var astroHead = $(".astro-head"),
					offset = astroHead.offset();
				thisObj.astroList.css({
					"left": conf.dir === "ltr" ? offset.left + astroHead.width() - thisObj.astroList.outerWidth() : offset.left,
					"top": offset.top + 27
				});
				thisObj.astroList.toggle();
				if(thisObj.astroList.is(":visible")){
					$(".astro-head .i-pointer").addClass("i-pointer_up");
					win.one("scroll", function() {
						thisObj.astroList.hide();
						$(".astro-head .i-pointer").removeClass("i-pointer_up");
					});
				}else {
					$(".astro-head .i-pointer").removeClass("i-pointer_up");
				}
			});
			$(".astro-list li").mousedown(function(){
				changeAstro($(this));
				sendStat(true);
			});
			$(document).on("mousedown", function(e) {
				var el = e.target;
				if(thisObj.astroList.is(":visible") && el !== thisObj.listTrigger[0] && el !== thisObj.listTrigger[1] && el !== thisObj.listTrigger[2] && !jQuery.contains(thisObj.listTrigger[0], el) && !jQuery.contains(thisObj.listTrigger[1], el) && !jQuery.contains(thisObj.listTrigger[2], el)){
					thisObj.astroList.hide();
					$(".astro-head .i-pointer").removeClass("i-pointer_up");
				}
			});
			$(".astro-tab li").click(function(){
				$(this).addClass("cur").siblings().removeClass("cur");
				displayData($(this).index());
				sendStat(true);
			});
			$(".astro-desc .i-pointer").click(function(){
				var thisObj = $(this);
				if(thisObj.hasClass("i-pointer_up")){
					thisObj.removeClass("i-pointer_up").parent().addClass("astro-desc_s");
					thisObj.siblings("p:eq(0)").show().next().hide();
				}else{
					thisObj.addClass("i-pointer_up").parent().removeClass("astro-desc_s");
					thisObj.siblings("p:eq(0)").hide().next().show();
				}
				sendStat(true);
			});


		};

	astroError.click(function(e){
		e.preventDefault();
		clearTimeout(errorTimeout);
		errorTimeout = setTimeout(function(){
			init();
		},200);
	});

	init();
};
/*if($("#sideAstro:visible").length){
	window.sideAstro();
}*/
module.exports = sideAstro;
