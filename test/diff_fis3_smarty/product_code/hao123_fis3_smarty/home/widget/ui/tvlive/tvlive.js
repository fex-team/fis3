var $ = require('common:widget/ui/jquery/jquery.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");
var time = require('common:widget/ui/time/time.js');
var message = require("common:widget/ui/message/src/message.js");
var tvlive = function(args){
	var	programList = $("#sideTvlive .mod-side"),
		channelTpl = "<li><a class='tvlive-channel gradient-bg-silver' href='#{url}'><i class='#{icon}'><span class='tvlive-mask'><i class='icon'></i></span></i>#{channel}</a><div class='tvlive-content'>#{programs}</div></li>",
		programTpl = "<a href='#{url}' class='tvlive-program' title='#{name}'><span class='tvlive-time'>#{time}</span><span class='tvlive-name'>#{name}</span></a>",
		config = conf.tvlive,
		showNum = parseInt(config.showNum,10),
		html = "",
		tvData = {},
		refreshBtn = $("#panel-tvlive .refresh"),
		curDate = Gl.time.getTime(),
		curDay,
		timer,
		errorTimeout,
		tvliveError = $('#tvlive-error'),
		tvliveWrapper = $('.mod-tvlive'),
		tvlivePanel = tvliveWrapper.find('.mod-side'),
		chartsMore = tvliveWrapper.find('.charts_more'),
		messageChannel = args.messageChannel,//与其它模块通信信道

		showError = function(){
			tvliveWrapper.css('height' , '300px');
			tvlivePanel.hide();
			chartsMore.hide();
			tvliveError.show();
		},

		hideError = function(){
			tvliveWrapper.css('height' , 'auto');
			tvlivePanel.show();
			// chartsMore.show();
			chartsMore.css("display","block");
			tvliveError.hide();
		},
		sendStat = function(ac){
			var utObj = {
                type:"click",
                level:1,
                modId:"tvlive",
                position:"links",
                country:conf.country
            };
            if(ac) {
            	utObj.ac = "b";
            }
			UT.send(utObj);
		},
		getToday = function(){
		    var curYear = curDate.getFullYear();
		    var curMonth = curDate.getMonth()+1;
		    var curDay = curDate.getDate();
		    return curYear+"-"+(curMonth<10?"0"+curMonth:curMonth)+"-"+(curDay<10?"0"+curDay:curDay);
		},
		getNow = function(){
		    var curHour = curDate.getHours();
		    var curMinute = curDate.getMinutes();
		    return (curHour<10?"0"+curHour:curHour)+":"+(curMinute<10?"0"+curMinute:curMinute);
		},
		refresh = function(){//当用户过分频繁点击刷新按钮时，响应稍加延迟，新点击会取消掉旧点击，最终是响应了最后一次点击
			clearTimeout(timer);
			timer = setTimeout(function(){
				curDate = Gl.serverNow;
				if(getToday() != curDay){//如果当前日期已不再是页面最后一次刷新时的日期，则重新请求新日期的数据
					init();
				}else{//当前日期和页面最后一次刷新时的日期一致，则直接从得到的数据里找正在及将要播放的showNum条数据
					appendData(tvData[curDay]);
				}
			},200);
		},
		bindEvents = function(){
			message.on(messageChannel, function(data){
				if(data.type === "refresh") {
					tvliveWrapper.is(":visible") && refresh();
				}
			});
			refreshBtn.click(function(){
				refresh();
				sendStat(true);
				/*clearTimeout(timer);
				timer = setTimeout(function(){
					curDate = Gl.serverNow;
					if(getToday() != curDay){//如果当前日期已不再是页面最后一次刷新时的日期，则重新请求新日期的数据
						init();
					}else{//当前日期和页面最后一次刷新时的日期一致，则直接从得到的数据里找正在及将要播放的showNum条数据
						appendData(tvData[curDay]);
					}
				},200);*/
			});
			/*$("#panel-tvlive .refresh").click(function(){
				sendStat(true);
			});*/
		},
		appendData = function(data){
			var curIndex = [];
			curTime = getNow();
			html = "";
			for(var i=0,d;d=data[i];i++){//遍历当天的所有频道
				var tmpHtml = "";
		        for(var j=0,len=d.tvlist.length;j<len;j++){
		        	var id = d.tvlist[j];
		            if(curTime < id.time.match(/\d{2}:\d{2}/)[0]){
		                curIndex[i] = j-1;
		                curIndex[i] = (curIndex[i] < 0 ? 0 : curIndex[i]);//处理第一条数据
		                for(var k=curIndex[i];k<(curIndex[i] + showNum < len ? (curIndex[i] + showNum) : len);k++){
		                	id = d.tvlist[k];
		                	tmpHtml += helper.replaceTpl(programTpl,{url:config.channel[i].url,time:id.time,name:id.value});
		                }
		                break;
		            }else if(curTime >= id.time.match(/\d{2}:\d{2}/)[0] && j == len - 1){//处理最后一条数据
		            	curIndex[i] = j;
		            	for(var k=curIndex[i];k<(curIndex[i] + showNum < len ? (curIndex[i] + showNum) : len);k++){
		                	id = d.tvlist[k];
		                	tmpHtml += helper.replaceTpl(programTpl,{url:config.channel[i].url,time:id.time,name:id.value});
		                }
		                break;
		            }
		        }
			    html += helper.replaceTpl(channelTpl,{url:config.channel[i].url,icon:config.channel[i].icon,channel:d.channel,programs:tmpHtml});
			}
			$(".tvlive-content").html("");//为刷新做一个内容变化的效果
			setTimeout(function(){
				programList.html(html);
				var firstProgram = $(".tvlive-content a:first-child");
				$(".tvlive-content").height(firstProgram.eq(0).outerHeight(true)*showNum);//生成dom后根据条数设置高度以免刷新时高度固定，不会先收起再展开
				firstProgram.addClass("cur");
			},200);
		},
		init = function(){
			var ajaxSucceed = false;
			curDay = getToday();
			var params = "?app=tv&act=contents&country="+conf.country+"&date="+curDay;
			$.ajax({
				//url: "/widget/home/tvlive/data_"+curDay+".json",
				url: conf.apiUrlPrefix + params,
				dataType: "jsonp",
				jsonp: "jsonp",
				//jsonpCallback: "ghao123_d251a1d7fc7a0ef5",
				jsonpCallback: "ghao123_" + hex_md5(params,16),
				cache: false,
				error: function(XMLHttpRequest, textStatus, errorThrown){
			   		//console.log(textStatus+"-"+errorThrown);
			   		//programList.html(curDay+"has no data");
			    },
				success: function(data){
					if(data.content && data.content.data){
						ajaxSucceed = true;
						hideError();
						tvData[curDay] = data.content.data;
						appendData(tvData[curDay]);
						bindEvents();
					}
				}
			});
			if(!ajaxSucceed) showError();
		};
	tvliveError.click(function(e){
		e.preventDefault();
		clearTimeout(errorTimeout);
		errorTimeout = setTimeout(function(){
			init();
		},200);
	});
	init();
};
module.exports = tvlive;
