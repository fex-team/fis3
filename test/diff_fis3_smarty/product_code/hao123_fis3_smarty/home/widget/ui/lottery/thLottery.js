var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');

var	datePicker = $("#datepicker");
var	dateList = $("#datelist");
var	listTrigger = $("#datepicker,#datepicker + .lottery-trigger");
var lotteryNum = $("#lotteryNum");
var lotteryNumDefault = lotteryNum.val();
var lotterySearch = $("#lotterySearch");
var lotteryTable = $("#lotteryTable");

//生成日期下拉列表
var formDropdownlist = function(data){
	var listdata = data;
	var html = "";

	if(listdata.length){//下拉有数据
		for(var i=0,li;i<6&&(li=listdata[i]);i++){
			html += "<li>" + li + "</li>";
			if(!i){
				datePicker.val(li);//默认取下拉中第一个日期为当前日期
			}
		}
	}else{//下拉无数据
		datePicker.val("");
	}
	dateList.html(html);
};
//生成开奖信息表格
var formResultTable = function(awardInfo){
	var html = "";

	for(var i=0,td;td=awardInfo[i];i++){
		if(!i){
			html += "<dt class='gradient-bg-orange'>" + td.price + "</dt><dd class='orange'>" + td.code + "</dd>";
		}else{
			html += "<dt>" + td.price + "</dt><dd>" + td.code + "</dd>";
		}
	}
	lotteryTable.html(html);
};
//请求日期列表
var requestDate = function(){
	dateLoading();
	var params = "?app=lottery&act=date&country=" + conf.country;
	$.ajax({
		url: conf.apiUrlPrefix + params,
		//url: "/widget/home/lottery/date.json",
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: "ghao123_" + hex_md5(params,16),
		//jsonpCallback: "jQuery1_1",
	    cache: false,
	    success: function(result) {
	    	// if(data.content && data.content.data){
	    	// 	ajaxSucceed = true;
	    	// 	hideError();
		    // 	data = data.content.data;
		    // 	formDropdownlist(data);
		    // 	requestResult(listdata[0]);
	    	// }
	    	var dateTimer = loadingTimers[DATE_LOADING];
	    	if(dateTimer.isTimeout) {
	    		return; //在超时情况下，即使返回数据，仍然不处理
	    	}else{
	    		//clearTimeout(cityTimer.timer);
	    		endLoadingTimer(DATE_LOADING);
	    	}
	    	if(result && result.message && result.message.errNum >= 0 && result.content && result.content.data){
	    		var data = result.content.data;
	    		if(($.isArray(data) && data.length === 0) || $.isEmptyObject(data)){
	    			stateCtrl.trigger(GET_DATE_FAILURE);
	    		}
		    	stateCtrl.trigger(GET_DATE_SUCCESS , [result.content.data]);//一定要加方括号
		    }else{
		    	stateCtrl.trigger(GET_DATE_FAILURE);
		    }
	    }
	});
};
//根据日期来请求开奖信息
var requestResult = function(date){
	resultLoading();
	var params = "?app=lottery&act=tsearch&tdate="+date+"&country="+conf.country;
	$.ajax({
		url: conf.apiUrlPrefix + params,
		//url: "/widget/home/lottery/rs_"+parseInt(date)+".json",
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: "ghao123_" + hex_md5(params,16),
		//jsonpCallback: "jQuery1_1",
	    cache: false,
	    success: function(result) {
	    	// if(data.content && data.content.data){
		    // 	data = data.content.data;
	    	// 	formResultTable(data.awardInfo);
	    	// 	lotterySearch.attr("href",data.url);
	    	// }
	    	var resultTimer = loadingTimers[RESULT_LOADING];
	    	if(resultTimer.isTimeout) {
	    		return; //在超时情况下，即使返回数据，仍然不处理
	    	}else{
	    		endLoadingTimer(RESULT_LOADING);
	    	}
	    	if(result && result.message && result.message.errNum >= 0 && result.content && result.content.data){
	    		var data = result.content.data;
	    		if(($.isArray(data) && data.length === 0) || $.isEmptyObject(data)){
	    			stateCtrl.trigger(GET_RESULT_FAILURE);
	    		}
		    	stateCtrl.trigger(GET_RESULT_SUCCESS , [result.content.data]);//一定要加方括号
		    }else{
		    	stateCtrl.trigger(GET_RESULT_FAILURE);
		    }
	    }
	});
};
//初始化查询面板，在页面加载时使用
var initPanel = function(){
	requestDate();
};
//绑定事件
var bindEvents = function(){

	//展开日期列表
	listTrigger.click(function(){
		if(dateList.is(":visible")){
			dateList.slideUp(200);
		}else{
			dateList.slideDown(200);
			sendLog(true);
		}
	});
	//收起日期列表
	$(document).on("mousedown", function(e) {
		var el = e.target;

		if(dateList.is(":visible") && el !== listTrigger[0] && el !== listTrigger[1] && !jQuery.contains(listTrigger[0], el) && !jQuery.contains(listTrigger[1], el)){
			dateList.slideUp(200);
		}
	});
	//选择日期，开奖信息跟随日期列表联动
	dateList.on("mousedown","li",function(){
		var date = $(this).text();
		if(date != datePicker.val()){
			datePicker.val(date);
			requestResult(date);
		}
	});
	//点击查询按钮时将用户输入的号码添加到查询url后面，忽略用户输入号码的空格
	lotterySearch.click(function(){
		var inputNum = lotteryNum.val().replace(/\s/g,"");
		lotteryNum.val(inputNum);
		if(inputNum.length){
			lotterySearch.attr("href",lotterySearch.attr("href").replace(/#.*$/,"")+"#"+encodeURIComponent(inputNum));
		}else{
			lotterySearch.attr("href",lotterySearch.attr("href").replace(/#.*$/,""));
		}
		sendLog(true);
	});

	$("#datepicker,.mod-lottery .ui-datepicker-trigger,.mod-lottery .charts_more").click(function(){
		sendLog(true);
	});

};

//发送统计数据
var sendLog = function(ac){
	var utObj = {
        type:"click",
        position:"links",
        modId:"lottery"
    };
    if(ac) {
    	utObj.ac = "b";
    }
	UT.send(utObj);
};


/**
*以下为对盒子进行状态控制的代码
*@author wayne
*/
var $sideLottery = $("#sideLottery");
var $apiErrorBtn = $sideLottery.find('.api-error');//api error btn
var stateCtrl = $({});
var firstGet = true;
var loadingTimers = {};//对loading状态对应的timer进行管理

//有几个ajax请求，就有多少组状态，此处为两组，每组包括loading,timeout,success,failure四种状态
var DATE_LOADING = 'date_loading';
var DATE_TIME_OUT = 'date_time_out';
var GET_DATE_SUCCESS = 'get_date_success';
var GET_DATE_FAILURE = 'get_date_failure';

var RESULT_LOADING = 'result_loading';
var RESULT_TIME_OUT = 'result_time_out';
var GET_RESULT_SUCCESS = 'get_result_success';
var GET_RESULT_FAILURE = 'get_result_failure';

var bindStateEvent = function(){
	//绑定首页的错误处理
	var events = {};
	events[DATE_LOADING] = function(){
		onDateLoading();
	};
	events[DATE_TIME_OUT] = function(){
		onDateTimeout();
	};
	events[GET_DATE_SUCCESS] = function(e , data){
		onGetDateSuccess(data);
	};
	events[GET_DATE_FAILURE] = function(){
		onGetDateFailure();
	};
	events[GET_RESULT_FAILURE] = function(){
		onGetResultFailure();
	};
	events[GET_RESULT_SUCCESS] = function(e , data){
		onGetResultSuccess(data);
	};
	events[RESULT_TIME_OUT] = function(){
		onResultTimout();
	};
	// events[RESULT_LOADING] = function(){
	// 	onResultLoading();
	// };
	stateCtrl.on(events);

	//无法连接到api,点击后重新获取数据
	$apiErrorBtn.click(function(e){
		e.preventDefault();
		refresh();
	});
};
//刷新
var refresh = function(){
	requestDate();
};

var onDateLoading = function(){
	if(firstGet){
		showLoadingPanel();
	}
};

var onDateTimeout = function(){
	if(firstGet){
		showErrorPanel();
	}
};

var onGetDateSuccess = function(data){
	formDropdownlist(data);
	requestResult(data[0]);
};

var onGetDateFailure = function(){
	showErrorPanel();
};

var onGetResultSuccess = function(data){
	if(firstGet){
		showSuccessPanel();
		firstGet = false;
	}
	formResultTable(data.awardInfo);
	lotterySearch.attr("href",data.url);
};

var onGetResultFailure = function(){
	if(firstGet){
		showErrorPanel();
	}
};

var onResultTimout = function(){
	if(firstGet){
		showErrorPanel();
	}
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
	$sideLottery.removeClass('status-loading').addClass('status-success');
};

var showErrorPanel = function(){
	$sideLottery.removeClass('status-loading').addClass('status-error');
};

var showLoadingPanel = function(){
	$sideLottery.removeClass('status-error status-success').addClass('status-loading');
};

//日期列表加载中封装函数
var dateLoading = function(){
	stateCtrl.trigger(DATE_LOADING);
	startLoadingTimer(DATE_LOADING , 10000 , DATE_TIME_OUT);//以后cms可配时间
};

var resultLoading = function(){
	stateCtrl.trigger(RESULT_LOADING);
	startLoadingTimer(RESULT_LOADING , 10000 , RESULT_TIME_OUT);
};
//状态控制代码代码结束
//==================================================
//初始化方法
var init = function(){
	bindStateEvent();
	//初始化内容区
	initPanel();
	//绑定事件
	bindEvents();
};

module.exports = init;
