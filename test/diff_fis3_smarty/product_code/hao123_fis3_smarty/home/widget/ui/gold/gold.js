var $ = require('common:widget/ui/jquery/jquery.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");
var gold = function(){
	var scrollArrows = $(".mod-gold .scroll-arrow"),
		priceListWrapper = $(".gold-price"),
		priceList = $("#goldPriceList"),
		priceTags = $(".gold-icon"),
		errorTimeout,
		goldError = $("#gold-error"),
		goldWrapper = $('.mod-gold'),
		goldPanel = goldWrapper.find('.mod-side'),
		chartsMore = goldWrapper.find('.charts_more'),
		goldTpl = "<dt class='gradient-bg-silver'><i class='gold-icon'></i>#{title}</dt><dd><span class='gold-buy-title'>#{buyText}</span><span class='gold-buy-price'>#{buy}</span><span class='gold-sell-title'>#{sellText}</span><span class='gold-sell-price'>#{sell}</span></dd>",
		html = "",
		maxLength,
		sendStat = function(){
			UT.send({
                type:"click",
                level:1,
                modId:"gold",
                position:"links",
                country:conf.country
            });
		},
		bindEvents = function(){
			var topArrow = $(".mod-gold .top-arrow"),
				bottomArrow = $(".mod-gold .bottom-arrow");
			//下拉列表滚动条事件
			topArrow.addClass("disabled");
			bottomArrow.removeClass("disabled");
			if(maxLength > 3){
				scrollArrows.show();
			}
			topArrow.click(function(event){
				//var thisList = $(this).siblings("dl");
				priceListWrapper.scrollTop(priceListWrapper.scrollTop()-24);
				event.preventDefault();
				sendStat();
			});
			bottomArrow.click(function(event){
				//var thisList = $(this).siblings("dl");
				priceListWrapper.scrollTop(priceListWrapper.scrollTop()+24);
				event.preventDefault();
				sendStat();
			});
			/*priceListWrapper.scroll(function(e){
				var thisObj = $(this);
				thisObj.scrollTop() == 0 ?
					topArrow.addClass("disabled"):
					topArrow.removeClass("disabled");
				(thisObj.height() + thisObj.scrollTop() == priceList.height()) ?
					function(){
						bottomArrow.addClass("disabled");
					}():
					bottomArrow.removeClass("disabled");
				sendStat();
			});*/
			$(".mod-gold .charts_more").click(function(){
				sendStat();
			})
		},

		showError = function(){
			goldWrapper.css('height' , '300px');
			chartsMore.hide();
			goldPanel.hide();
			goldError.show();
		},

		hideError = function(){
			goldWrapper.css('height' , 'auto');
			goldError.hide();
			goldPanel.show();
			// chartsMore.show();
			chartsMore.css("display","block");
		},

		init = function(){
			/*TO BE REMOVEDconf.country = "th";*/
			var ajaxSucceed = false;
			var params = "?app=gold&act=contents&country="+conf.country;
			$.ajax({
				//url: "/widget/home/gold/data.json",
				url: conf.apiUrlPrefix + params,
				dataType: "jsonp",
				jsonp: "jsonp",
				//jsonpCallback: "ghao123_d251a1d7fc7a0ef5",
				jsonpCallback: "ghao123_" + hex_md5(params,16),
				cache: false,
				error: function(XMLHttpRequest, textStatus, errorThrown){
			    },
				success: function(data , textStatus){
					if(data.content && data.content.data){
						ajaxSucceed = true;
						hideError();
						data = data.content.data;
						maxLength = data.length;
						for(var i in data){
							data[i].buyText = conf.gold.buyText;
							data[i].sellText = conf.gold.sellText;
							if(i == maxLength -1){
								html += helper.replaceTpl(goldTpl,data[i]).replace("<dd>","<dd class='s-mbn'>");
							}else{
								html += helper.replaceTpl(goldTpl,data[i]);
							}
						}
						priceList.html(html);
						require.async("common:widget/ui/scrollable/scrollable.js", function(){
							priceList.scrollable({
								autoHide: false,
								onScroll: function(){
									sendStat();
								}
							});
						});
						bindEvents();
					}
				}
			});
			if(!ajaxSucceed){
				showError();
			}
		};

	goldError.click(function(e){
		e.preventDefault();
		clearTimeout(errorTimeout);
		errorTimeout = setTimeout(function(){
			init();
		},200);
	});


	init();
};
module.exports = gold;
