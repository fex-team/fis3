var $ = require('common:widget/ui/jquery/jquery.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");
var score = function(){
	var scrollArrows = $(".mod-score .mod-scroll"),
		priceListWrapper = $(".score-wrapper"),
		priceList = $("#scoreList"),
		wrapperHeight = priceListWrapper.height(),
		listHeight,
		scoreTpl = "<li class='score-item' link='#{url}'>#{code} - #{name}</li>",
		curScoreTpl = "<li class='score-item score-item_cur' link='#{url}'>#{code} - #{name}</li>",
		html = "",
		searchBtn = $("#scoreSearch"),
		scoreData,
		scoreLength,
		curIndex = 0,
		errorTimeout,
		scoreError = $('#score-error'),
		scoreWrapper = $('.mod-score'),
		scorePanel = scoreWrapper.find('.mod-side'),

		showError = function(){
			scoreWrapper.css('height' , '300px');
			scorePanel.hide();
			scoreError.show();
		},

		hideError = function(){
			scoreWrapper.css('height' , 'auto');
			scorePanel.show();
			scoreError.hide();
		},

		sendStat = function(ac){
			var utObj = {
                type:"click",
                level:1,
                modId:"score",
                position:"links",
                country:conf.country
            };
            if(ac) {
            	utObj.ac = "b";
            }
			UT.send(utObj);
		},
		bindEvents = function(){
			if(priceListWrapper.height() < priceList.height()){
				scrollArrows.show();
			}
			priceList.on("click",".score-item",function(e){
				var thisObj = $(this);
				thisObj.addClass("score-item_cur").siblings().removeClass("score-item_cur");
				searchBtn.attr("href",thisObj.attr("link"));
				sendStat(true);
				e.preventDefault();
			}).on("mouseenter",".score-item",function(){
				$(this).addClass("score-item_hover");
			}).on("mouseleave",".score-item",function(){
				$(this).removeClass("score-item_hover");
			});
			searchBtn.click(function(){
				sendStat();
			});
		},
		appendData = function(){
			html = "";
			for(var i=0;i<20&&curIndex<scoreLength;i++,curIndex++){
				if(!curIndex){
					searchBtn.attr("href",scoreData[curIndex].url);
					html += helper.replaceTpl(curScoreTpl,scoreData[curIndex]);
				}else{
					html += helper.replaceTpl(scoreTpl,scoreData[curIndex]);
				}
			}
			priceList.append(html);
			listHeight = priceList.height();
		},
		init = function(){
			var ajaxSucceed = false;
			var params = "?app=gaokao&act=schools&country="+conf.country;
			require.async("common:widget/ui/scrollable/scrollable.js",function(){
				var scrollbar = priceList.scrollable({
					autoHide: false,
					onScroll: function(){
						var state = this.state;
						// console.log(state.y+":"+state._y);
						if(state.y - 50 <= -state._y){
							appendData();
						}
					}
				});
			});
			$.ajax({
				//url: "/widget/home/score/data.json",
				url: conf.apiUrlPrefix + params,
				dataType: "jsonp",
				jsonp: "jsonp",
				//jsonpCallback: "ghao123_d251a1d7fc7a0ef5",
				jsonpCallback: "ghao123_" + hex_md5(params,16),
				cache: false,
				error: function(XMLHttpRequest, textStatus, errorThrown){
			   		//console.log(textStatus+"-"+errorThrown);
			    },
				success: function(data){
					if(data.content && data.content.data){
						ajaxSucceed = true;
						hideError();
						scoreData = data.content.data;
						scoreLength = scoreData.length;
						$("#scoreTotal").html(scoreLength);
						appendData();
						bindEvents();
					}
				}
			});
			if(!ajaxSucceed) showError();
		};

	scoreError.click(function(e){
		e.preventDefault();
		clearTimeout(errorTimeout);
		errorTimeout = setTimeout(function(){
			init();
		},200);
	});

	init();
};
module.exports = score;
