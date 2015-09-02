var $ = require('common:widget/ui/jquery/jquery.js');
var __date = require('common:widget/ui/date/date.js');
var time = require('common:widget/ui/time/time.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");
var hex_md5 = require('common:widget/ui/md5/md5.js');
require('common:widget/ui/jquery/jquery.cookie.js');

var pray = function(){
	var prayTimeTable = $("#prayTimeTable"),//礼拜时间table容器
		prayTimeMsArr = [],//存放礼拜时间毫秒数的数组
		prayCityList = conf.pray.cityList,//礼拜城市
		prayNameList = conf.pray.prayNameList,//礼拜名称
		requestTomorrow = 0,//今日全部祷告已过去特定时间后开始显示明天的祷告时间的标志位
		curPrayCity = $("#prayCityPicker .dropdown-input"),//当前选中城市所在的input
		curPrayCityVal,//当前选中城市id
		curPrayCityZone,//当前选中城市时区
		requestData = {},//请求得到的礼拜时间数据
		curDate = Gl.serverNow || new Date(),//当前时间
		dateTpl = conf.pray.prayClock.dateTpl,//日期格式模板
		timeTpl = conf.pray.prayClock.timeTpl,//时间格式模板
		curDateContainer = $("#prayCurDate"),//日期容器
		curTimeContainer = $("#prayCurTime"),//时间容器
		trTpl = "<tr class='#{prayclass}'><td>#{prayname}</td><td class='pray-time'>#{praytime}</td><td class='pray-countdown'>#{praycountdown}</td></tr>",//礼拜时间table中tr模块
		trParams = [],//tr模块替换参数
		curPrayTimeData = [],//存放每次循环中当前礼拜时间按:拆分后得到的小时和分钟
		loadTomorrow = 0,//是否已经载入了明天数据的标识位
		html = "",//插入html
		timeGap = [],//存放祷告时间与当前时间差值的数组，单位是毫秒
		timer,//倒计时定时器
		listOpenFlag = false, //下拉列表是否已展开过的标志

		//时间转12小时制12:15=>12:15PM;24:15=>12:15AM
		to12Hour = function(date,config){
			var hour = parseInt(date.slice(0,date.indexOf(":"))),
				hourClock;
			if(hour > 11 && hour < 24){
				hourClock = config.pm ? " " + config.pm : " PM";
			}else{
				hourClock = config.am ? " " + config.am : " AM";
			}
			if(hour > 12){
				hour -= 12;
				hour = hour < 10 ? "0" + hour : hour;
				date = date.replace(/\d+:/g,hour + ":");
			}
			return date + hourClock;
		},
		//统一此模块时间所属的时区，不论在任何地方访问都显示同一时间
		uniform = function(date){
			date = date || new Date();
			return new Date(date.getTime() + (date.getTimezoneOffset() + curPrayCityZone * 60) * 60 * 1000);
		},
		//生成日期参数
		formDateParam = function(date) {
			!__date.isDate(date) && (date = curDate);
			return date.getFullYear() + "-" +
			((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" +
			(date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
		},
		//生成select下拉列表
		formDropdownlist = function(target,listData){
			var html = "",
				counter = 0,
				targetInput = target.find(".dropdown-input");
			for(var i=0,value;value=listData[i];i++){
				html += ("<li key='"+value.eName+"' zone='"+value.timeZone+"'>"+value.aName+"</li>");
				if(!counter){
					targetInput.val(value.aName).attr({"key":value.eName,"zone":value.timeZone});//默认取下拉中第一个日期为当前日期
				}
				// delete old cookie if existed, TODO: remove later
				$.cookie("sideAstro") && $.cookie('sideAstro', null);
				if($.cookie.get("pray") == i){
					targetInput.val(value.aName).attr({"key":value.eName,"zone":value.timeZone});
				}
				counter++;
			}
			if(!html.length){//下拉无数据
				target.find(".dropdown-input").val("").attr({"key":"","zone":""});
			}
			target.find(".dropdown-list ul").html(html);//.parent().css("width",target.find(".dropdown-input").outerWidth());
		},
		//绑定select事件
		bindDropdownlist = function(){
			//触发下拉列表展开、收起
			/*var topArrow = $(".mod-pray #topArrow"),
				bottomArrow = $(".mod-pray #bottomArrow");*/

			$("#sidePray").on("click",".dropdown-trigger",function(){
				var that = $(this),
					listTriggerArrow = that.find(".dropdown-arrow"),
					list = that.siblings(".dropdown-list");
				if(list.is(":visible")){
					list.slideUp(200);
					listTriggerArrow.removeClass("dropdown-arrow-up");
				}else{
					if(!listOpenFlag){
						list.css("width",curPrayCity.outerWidth());
						listOpenFlag = true;
					}
					list.slideDown(200);
					listTriggerArrow.addClass("dropdown-arrow-up");
					sendStat(true);
				}
			}).on("mousedown",".dropdown-list li",function(){//点击下拉列表项
				var that = $(this),
					newVal = that.text(),
					thatInput = that.parents(".dropdown").find(".dropdown-input"),
					listTriggerArrow = $("#sidePray").find(".dropdown-trigger .dropdown-arrow");
				curPrayCityZone = parseInt(encodeURIComponent(that.attr("zone"))) || parseInt(conf.pray.prayClock.timeZone);
				if(newVal != thatInput.val()){
					thatInput.val(newVal).attr({"key":that.attr("key"),"zone":curPrayCityZone});
					getPrayData(formDateParam(uniform(Gl.serverNow)));
				}
				//fixed by chenliang   dropdown-arrow bug
				listTriggerArrow.removeClass("dropdown-arrow-up");
				$.cookie.set("pray",that.index());
			});
			//收起日期列表
			$(document).on("mousedown", function(e) {
				var el = e.target;
				$(".dropdown-list","#sidePray").each(function(){
					var cur = $(this),
						curTrigger = cur.siblings(".dropdown-trigger")[0];
					if(cur.is(":visible") && el !== curTrigger && !$.contains(curTrigger, el) && el !== cur.find("ul")[0] && el !== cur.find(".scroll-arrow")[0] && el !== cur.find(".scroll-arrow")[1]){
						cur.slideUp(200);
					}
				});
			});
			//下拉列表滚动条事件
			/*topArrow.addClass("disabled");
			bottomArrow.removeClass("disabled");
			topArrow.click(function(event){
				var thisList = $(this).siblings("ul");
				thisList.scrollTop(thisList.scrollTop()-24);
				event.preventDefault();
			});
			bottomArrow.click(function(event){
				var thisList = $(this).siblings("ul");
				thisList.scrollTop(thisList.scrollTop()+24);
				event.preventDefault();
			});
			$(".mod-pray #citylist ul").scroll(function(e){
				var thisObj = $(this);
				thisObj.scrollTop() == 0 ?
					topArrow.addClass("disabled"):
					topArrow.removeClass("disabled");
				(thisObj.height() + thisObj.scrollTop() == thisObj.find("li:first-child").height() * thisObj.find("li").length) ?
					function(){
						bottomArrow.addClass("disabled");
					}():
					bottomArrow.removeClass("disabled");
			});*/
		},

		getPrayData = function(dateStr){
			prayLoading();
			curPrayCityVal = encodeURIComponent(curPrayCity.attr("key"));
			var params = "?app=pray&act=contents&country="+conf.country+"&city="+curPrayCityVal;
			$.ajax({
				//url: "/widget/home/pray/data_"+curPrayCityVal+".json?city="+curPrayCityVal+"&date="+date,
				url: conf.apiUrlPrefix + params,
				dataType: "jsonp",
				jsonp: "jsonp",
				//jsonpCallback: "ghao123_f95bf6e13f5f2404",
				jsonpCallback: "ghao123_" + hex_md5(params,16),
				cache: false,
				success: function(result){
					var prayTimer = loadingTimers[PRAY_LOADING];
			    	if(prayTimer.isTimeout) {
			    		return; //在超时情况下，即使返回数据，仍然不处理
			    	}else{
			    		endLoadingTimer(PRAY_LOADING);
			    	}
			    	if(result && result.message && result.message.errNum >= 0 && result.content && result.content.data){
			    		var data = result.content.data;
			    		if(($.isArray(data) && data.length === 0) || $.isEmptyObject(data)){
			    			stateCtrl.trigger(GET_PRAY_FAILURE);
			    		}
				    	stateCtrl.trigger(GET_PRAY_SUCCESS , [result.content.data , dateStr]);//一定要加方括号
				    }else{
				    	stateCtrl.trigger(GET_PRAY_FAILURE);
				    }
				}
			});
		},
		formPrayData = function(dateStr){
			var data = requestData[dateStr],
				dateArr = dateStr.split("-"),
				tmpData;
			curDate = uniform(Gl.serverNow);
			//console.log("curDate:"+curDate);
			curForm =time.getForm(curDate);
			curTime = curDate.getTime();
			//get 6 pray time
			for(var i=0,td;td=data[i];i++){
				curPrayTimeData = data[i].split(":");
				prayTimeMsArr[i] = new Date(parseInt(dateArr[0]),parseInt(dateArr[1],10)-1,parseInt(dateArr[2],10)).setHours(curPrayTimeData[0],curPrayTimeData[1],0,curDate.getMilliseconds());
				if(requestTomorrow){//是否请求明日数据
					prayTimeMsArr[i] += 3600000*24;
				}
				timeGap[i] = prayTimeMsArr[i] - curTime;
				trParams[i] = {};
				// 增加对时间补零操作
				tmpTime = (curPrayTimeData[0].length > 1 ? curPrayTimeData[0] : "0" + curPrayTimeData[0]) + ":" + (curPrayTimeData[1].length > 1 ? curPrayTimeData[1] : "0" + curPrayTimeData[1]);
				if(conf.pray.prayClock.hourClock == "12"){
					trParams[i].praytime = to12Hour(tmpTime,conf.pray.prayClock.localText);
				}else{
					trParams[i].praytime = tmpTime;
				}
			}
		},
		sendStat = function(ac){
			var utObj = {
                type:"click",
                level:1,
                modId:"pray",
                position:"links",
                country:conf.country
            };
            if(ac) {
            	utObj.ac = "b";
            }
			UT.send(utObj);
		},
		//倒计时回调方法
		countDown = function(){
			formPrayData(formDateParam(uniform(Gl.serverNow)));
			html = "";
			var oldTimeGap,
				tmpTimeGap,
				nearestPray = -1;

			for(var i=0,td;td=prayNameList[i];i++){
				if(timeGap[i] >= 0){//wait to start
					if(nearestPray == -1){
						nearestPray = i;
						trParams[i].prayclass = "cur";
					}else{
						trParams[i].prayclass = "";
					}
					/*hh = Math.floor(timeGap[i]/3600000);
					mm = Math.floor(timeGap[i]%3600000/60000);
					ss = Math.round(timeGap[i]%3600000%60000/1000);*/
					tmpTimeGap = new Date(timeGap[i]);
					hh = tmpTimeGap.getUTCHours();
					mm = tmpTimeGap.getUTCMinutes();
					ss = tmpTimeGap.getUTCSeconds();
					trParams[i].praycountdown = (hh<10?"0"+hh:hh)+":"+(mm<10?"0"+mm:mm)+":"+(ss<10?"0"+ss:ss);
				}else{//starting & started
					trParams[i].prayclass = "passed";
					trParams[i].praycountdown = "--:--:--";
				}
				oldTimeGap = timeGap[i];
				trParams[i].prayname = td;
				html += helper.replaceTpl(trTpl,trParams[i]);
				//timeGap[i] -= 1000;
			}

			if(oldTimeGap <= -3600000 * conf.pray.prayClock.overtime || oldTimeGap > curPrayTimeData[0]*3600000+curPrayTimeData[1]*60000){//如果今日祷告已过去超过指定时间，就显示明日数据
				requestTomorrow = 1;
				if(!loadTomorrow){
					//formPrayData(formDateParam(new Date(curDate.getFullYear()+"-"+(curDate.getMonth()+1)+"-"+(curDate.getDate()+1))));a=new Date(curTime).setDate(curDate.getDate()+1)
					formPrayData(formDateParam(new Date(new Date(curTime).setDate(curDate.getDate()+1))));
					loadTomorrow = 1;
					/*for(var i=0,td;td=prayNameList[i];i++){
						timeGap[i] -= 1000;
					}
					curTime += 1000;*/
					return;
				}
			}else{
				requestTomorrow = 0;
			}
			curForm = time.getForm(new Date(curTime));
			if(conf.pray.prayClock.hourClock == "12"){//12:15=>12:15PM;24:15=>12:15AM
				if(curForm.hh > 11 && curForm.hh < 24){
					curForm.hourClock = "PM";
				}else{
					curForm.hourClock = "AM";
				}
				if(curForm.hh > 12){
					curForm.hh -= 12;
				}
			}else{
				curForm.hourClock = "";
			}
			curTimeContainer.html(helper.replaceTpl(timeTpl,curForm));
			curDateContainer.html(helper.replaceTpl(dateTpl,curForm));
			prayTimeTable.html(html);
			//curTime += 1000;
		},
		init = function(){
			formDropdownlist($("#prayCityPicker"),prayCityList);
			bindDropdownlist();
			curPrayCityZone = parseInt(encodeURIComponent(curPrayCity.attr("zone"))) || parseInt(conf.pray.prayClock.timeZone);
			getPrayData(formDateParam(uniform(Gl.serverNow)));
		};

	/**
	*以下为对盒子进行状态控制的代码
	*@author wayne
	*/
	var $apiErrorBtn = $('#pray-error');//api error btn
	var $sidePray = $('#sidePray');
	var stateCtrl = $({});
	var firstGet = true;
	var loadingTimers = {};//对loading状态对应的timer进行管理

	//有几个ajax请求，就有多少组状态，此处为两组，每组包括loading,timeout,success,failure四种状态
	var PRAY_LOADING = 'pray_loading';
	var PRAY_TIME_OUT = 'pray_time_out';
	var GET_PRAY_SUCCESS = 'get_pray_success';
	var GET_PRAY_FAILURE = 'get_pray_failure';

	var bindStateEvent = function(){
		//绑定首页的错误处理
		var events = {};
		events[PRAY_LOADING] = function(){
			onPrayLoading();
		};
		events[PRAY_TIME_OUT] = function(){
			onPrayTimeout();
		};
		events[GET_PRAY_SUCCESS] = function(e , data , dateStr){
			onGetPraySuccess(data , dateStr);
		};
		events[GET_PRAY_FAILURE] = function(){
			onGetPrayFailure();
		};
		stateCtrl.on(events);

		//无法连接到api,点击后重新获取数据
		$apiErrorBtn.click(function(e){
			e.preventDefault();
			refresh();
		});
	};
	//刷新
	var refresh = function(){
		getPrayData(formDateParam(uniform(Gl.serverNow)));
	};

	var onPrayLoading = function(){
		if(firstGet){
			showLoadingPanel();
		}
	};

	var onPrayTimeout = function(){
		if(firstGet){
			showErrorPanel();
		}
	};

	var onGetPraySuccess = function(data , dateStr){
		if(firstGet){
			showSuccessPanel();
			firstGet = false;
		}
		requestData = data.prayTime;
		requestTomorrow = loadTomorrow = 0;
		formPrayData(dateStr);
		clearInterval(timer);
		timer = setInterval(countDown,1000);
	};

	var onGetPrayFailure = function(){
		showErrorPanel();
	};

	/**
	*由于jsonp无任何错误提示，所以自定义定时器，如超过指定时间仍无数据返回，则视为错误
	*@param {String}timerName 定时器句柄， 此处用loading事件名
	*@param {Number}time 定义超时的时间
	*@param {String}timeoutEvent 超时后需要发送的事件名称
	*/
	var startLoadingTimer = function(timerName , time , timeoutEvent){
		loadingTimers[timerName] = loadingTimers[timerName] || {}; //每次启动时先还原
		loadingTimers[timerName].isTimeout = false;
		loadingTimers[timerName].timer = setTimeout(function(){
			stateCtrl.trigger(timeoutEvent);//发送超时事件
			loadingTimers[timerName].isTimeout = true;
		}, time);
	};

	//中止定时器，当成功获取数据时调用
	var endLoadingTimer = function(timerName){
		if(loadingTimers[timerName]){
			clearTimeout(loadingTimers[timerName].timer);
			loadingTimers[timerName].isTimeout = true; //设置为过期，以防止多次加载数据
		}else{
			//do nothing
		}
	};

	//根据各状态调整界面显示===============================================
	var showSuccessPanel = function(){
		$sidePray.removeClass('status-loading').addClass('status-success');
	};

	var showErrorPanel = function(){
		$sidePray.removeClass('status-loading').addClass('status-error');
	};

	var showLoadingPanel = function(){
		$sidePray.removeClass('status-error status-success').addClass('status-loading');
	};

	//日期列表加载中封装函数
	var prayLoading = function(){
		stateCtrl.trigger(PRAY_LOADING);
		startLoadingTimer(PRAY_LOADING , 10000 , PRAY_TIME_OUT);//以后cms可配时间
	};
	//状态控制代码代码结束
	//==================================================
	bindStateEvent();
	// var loop = 0;
	curDate = time.getTime(function(){
		init();
	})
	/*timer = setInterval(function(){
		//console.log(Gl.serverNow);
		if(Gl.serverNow || loop > 4){
			init();
			clearInterval(timer);
		}
		//console.log(loop);
		loop++;
	},1000);*/
	

	//以下是祷告时间模块增加二维码入口，用于推广一个祷告应用
	var prayAppEntrance = ( function(){
		var sidePray = $('#sidePray');
		// 两个模板是因为PM希望可以控制一些元素是否是a链接
		var tpl = 	'<i class="icon"></i>'
				+	'<div class="popup" style="display:none;">'
				+		'<b class="popup-arrow out"></b>'
        		+		'<b class="popup-arrow in"></b>'
				+		'<div class="content">'
				+			'<a href="#{btnLink}" class="btn" data-sort="btn">#{btnText}</a>'
				+			'<img src="#{imgSrc}" style="display:block;" width="#{imgWidth}" height="#{imgHeight}" title="#{imgTitle}" alt="#{imgTitle}" />'
				+			'<p class="des">#{imgTitle}</p>'
				+		'</div>'
				+	'</div>';
		var iconIsLinkTpl = '<a href="iconLink" data-sort="icon">'
				+				'<i class="icon"></i>'
				+			'</a>'
				+			'<div class="popup" style="display:none;">'
				+			'<b class="popup-arrow out"></b>'
        		+			'<b class="popup-arrow in"></b>'
				+				'<div class="content">'
				+					'<a href="#{btnLink}" class="btn" data-sort="btn">#{btnText}</a>'
				+					'<a href="imgLink" data-sort="img">'
				+						'<img src="#{imgSrc}" style="display:block;" width="#{imgWidth}" height="#{imgHeight}" title="#{imgTitle}" alt="#{imgTitle}" />'
				+					'</a>'
				+					'<p class="des">#{imgTitle}</p>'
				+				'</div>'
				+			'</div>';
		function init( opts ){
			if( !opts ) return;
			render( opts );
			bindEvent();
		}
		function render( opts ){
			var html = opts.iconIsLink !== "1" ? helper.replaceTpl( tpl, opts ) : helper.replaceTpl( iconIsLinkTpl, opts );
			var container = sidePray.find( ".pray-app-entrance" );
			container.html( html );
		}
		function bindEvent(){
			var icon = sidePray.find( ".icon" );
			icon.on( "mouseenter", function(){
				UT.send( {
					modId : "pray-app-entrance",
					position : "icon",
					sort: "icon",
					type : "other"
				} );
			} );
		}
		return init;
	} )();

	prayAppEntrance( conf.pray.prayAppEntrance );
};
module.exports = pray;
