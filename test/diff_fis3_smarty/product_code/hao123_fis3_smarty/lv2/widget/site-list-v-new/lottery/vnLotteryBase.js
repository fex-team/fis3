var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var time = require('common:widget/ui/time/time.js');
require('common:widget/ui/jquery/widget/jquery.ui.datepicker/jquery.ui.datepicker.js');


/**
*该类主要对datePicker和cityPicker控件进行初始化和控制，同时，对彩票组件的状态进行控制
*/
function VnLotteryBase(){
	this._stateCtrl = $(this); //事件句柄，用于发送各类状态事件
	//this._pageType = 0; //父类为0，首页为1，二级页为2

	//以下为事件列表,
	this._CITY_LOADING = 'city_loading';//城市列表加载中
	this._CITY_TIME_OUT = 'city_timeout';//超时
	this._GET_CITY_SUCCESS = 'get_city_success';//获取城市列表成功
	this._GET_CITY_FAILURE = 'get_city_failure';//无城市数据

	this._RESULT_LOADING = 'result_loading';//中奖结果加载中
	this._RESULT_TIME_OUT = 'result_timeout';//超时
	this._GET_RESULT_SUCCESS = 'get_result_success';//获取中奖列表成功
	this._GET_RESULT_FAILURE = 'get_result_failure';//无中奖结果

	this._loadingTimers = {};//对于两个loading状态对应的timer进行管理
}



//初始化datapicker
VnLotteryBase.prototype._initDatePicker = function(){
	var self = this;
	self._$datePicker.datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		showOn: "both",
		buttonText: "<i></i>",
		showAnim: "slideDown",
		showOptions: {direction: "down"},
		dateFormat:  self._conf.lottery.dateFormat,
		minDate:  self._conf.lottery.minDate,
		maxDate:  self._conf.lottery.maxDate,
		hideIfNoPrevNext: true
	});
	$.datepicker.setDefaults(self._conf.datepicker);//localization
	//设置默认日期
	if(time.getForm().hh >= parseInt(self._conf.lottery.changeHour,10)){
		self._$datePicker.datepicker("setDate", "0");//超过设置的小时数，此时默认今日数据已经可用，取今日数据
	}else{
		self._$datePicker.datepicker("setDate", "-1");//否则取昨日数据
	}

};

/**
*设置城市下拉列表
*@param {Array}cities 城市列表
*@param {string}default cityPicker默认显示值，如无该参数，则已cities[0]为显示值
*/
VnLotteryBase.prototype._setCityPicker = function(cities , defaultCity){
	var cityLi = [];
	var length = cities.length;

	if(length){//下拉有数据
		//设置列表
		for(var i = 0 ; i < cities.length-1 ; i++){
			cityLi.push("<li>" , cities[i] , "</li>");
		}
		var list = cityLi.join('');
		this._$cityList.html(list);

		//设置默认显示项
		if(defaultCity){
			this._$cityPicker.val(defaultCity);
		}else{
			this._$cityPicker.val(cities[0]);
		}
	}else{
		this._$cityPicker.val('');
		this._$cityList.html('');
		// return 0;//如果列表为空，则无视defaultCity参数，直接返回
	}
};


//=========================================================
//根据日期获取开奖城市列表
VnLotteryBase.prototype._getCityByDate = function(date){
	var self = this;
	self._cityLoading();
	self._setCityPicker([]);//每次请求城市列表时，现将上一次的结果清空
	var params = "?app=lottery&act=city&country="+self._conf.country+"&date="+date;
	$.ajax({
		url: self._conf.apiUrlPrefix + params,
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: "ghao123_" + hex_md5(params,16),
	    cache: false,
	    success: function(result) {
	    	var cityTimer = self._loadingTimers[self._CITY_LOADING];
	    	if(cityTimer.isTimeout) {
	    		return; //在超时情况下，即使返回数据，仍然不处理
	    	}else{
	    		//clearTimeout(cityTimer.timer);
	    		self._endLoadingTimer(self._CITY_LOADING);
	    	}
	    	if(result && result.message && result.message.errNum >= 0 && result.content && result.content.data){
	    		var data = result.content.data;
	    		if(($.isArray(data) && data.length === 0) || $.isEmptyObject(data)){
	    			self._stateCtrl.trigger(self._GET_CITY_FAILURE);
	    		}
		    	self._stateCtrl.trigger(self._GET_CITY_SUCCESS , [result.content.data]);//一定要加方括号
		    }else{
		    	self._stateCtrl.trigger(self._GET_CITY_FAILURE);
		    }
	    }
	});
};
//根据城市、日期、票号请求结果, code参数可选
VnLotteryBase.prototype._getWinningResult = function(date, city, code){
	var self = this;
	self._resultLoading();
	var params = "?app=lottery&act=search&country=" + self._conf.country
				+ "&code=" + (code?code:null) + "&date=" + date + "&city=" + city;
	$.ajax({
		url: self._conf.apiUrlPrefix + params,
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: "ghao123_" + hex_md5(params,16),
	    cache: false,
	    success: function(result) {
	    	var resultTimer = self._loadingTimers[self._RESULT_LOADING];
	    	if(resultTimer.isTimeout){
	    		return; //在超时情况下，即使返回数据，仍然不处理
	    	}else{
	    		//clearTimeout(resultTimer.timer);
	    		self._endLoadingTimer(self._RESULT_LOADING);
	    	}
	    	/*if(result && result.message && result.message.errNum === 0 && result.content && result.content.data){
	    		var data = result.content.data;
	    		//对空数组和空对象进行判断
	    		if(($.isArray(data) && data.length === 0) || $.isEmptyObject(data)) {
	    			self._stateCtrl.trigger(self._GET_RESULT_FAILURE);
	    		}
		    	self._stateCtrl.trigger(self._GET_RESULT_SUCCESS , [data]);
		    }else{
		    	self._stateCtrl.trigger(self._GET_RESULT_FAILURE);
		    }*/
		    if(result.content.data.awardInfo && result.content.data.awardInfo.length){
		    	var data = result.content.data;
		    	self._stateCtrl.trigger(self._GET_RESULT_SUCCESS , [data]);
		    }else{
		    	self._stateCtrl.trigger(self._GET_RESULT_FAILURE);
		    }
	    }
	});
};
//=========================================================

//城市列表加载中封装函数
VnLotteryBase.prototype._cityLoading = function(){
	this._stateCtrl.trigger(this._CITY_LOADING);
	this._startLoadingTimer(this._CITY_LOADING , 10000 , this._CITY_TIME_OUT);//以后cms可配时间
};

//中奖结果加载中封装函数
VnLotteryBase.prototype._resultLoading = function(){
	this._stateCtrl.trigger(this._RESULT_LOADING);
	this._startLoadingTimer(this._RESULT_LOADING , 10000 , this._RESULT_TIME_OUT);
};

/**
*由于jsonp无任何错误提示，所以自定义定时器，如超过指定时间仍无数据返回，则视为错误
*@param {String}timerName 定时器句柄， 此处用loading事件名
*@param {Number}time 定义超时的时间
*@param {String}timeoutEvent 超时后需要发送的事件名称
*/
VnLotteryBase.prototype._startLoadingTimer = function(timerName , time , timeoutEvent){
	var self = this;
	self._loadingTimers[timerName] = self._loadingTimers[timerName] || {}; //每次启动时先还原
	self._loadingTimers[timerName].isTimeout = false;
	self._loadingTimers[timerName].timer = setTimeout(function(){
		self._stateCtrl.trigger(timeoutEvent);//发送超时事件
		self._loadingTimers[timerName].isTimeout = true;
	}, time);
};

//中止定时器，当成功获取数据时调用
VnLotteryBase.prototype._endLoadingTimer = function(timerName){
	var self = this;
	if(self._loadingTimers[timerName]){
		clearTimeout(self._loadingTimers[timerName].timer);
		self._loadingTimers[timerName].isTimeout = true; //设置为过期，以防止多次加载数据
	}else{
		//do nothing
	}
};

//对日期选择器控件和城市选择器控件进行事件绑定
VnLotteryBase.prototype._bindCommonEvents = function(){
	var self = this;

	//城市列表跟随日期控件联动
	self._$datePicker.change(function(){
		self._getCityByDate(self._$datePicker.val());
	});

	//发送统计数据
	self._$datePicker.click(function(){
		self._sendLog({postion:"date",ac:"b"});
	}).next('.ui-datepicker-trigger').click(function(){
		self._sendLog({position:"date",ac:"b"});
	});

	//展开城市列表
	self._$listTrigger.click(function(){
		if(self._$cityList.is(":visible")){
			self._$cityList.slideUp(200);
		}else{
			self._$cityList.slideDown(200);
			self._sendLog({position:"city",ac:"b"});
		}
	});

	//收起城市列表
	$(document).on("mousedown", function(e) {
		var el = e.target;
		if(self._$cityList.is(":visible") && el !== self._$listTrigger[0]
			&& el !== self._$listTrigger[1] && !jQuery.contains(self._$listTrigger[0], el)
			&& !jQuery.contains(self._$listTrigger[1], el))
		{
			self._$cityList.slideUp(200);
		}
	});

	//选择城市
	self._$cityList.on("mousedown",'li',function(e){
		self._$cityPicker.val($(this).text());
	});
};

//发送统计数据
VnLotteryBase.prototype._sendLog = function(extraparams){
	var self = this;
	var params = {
        type:"click",
       // level:self._pageType,
        modId:"lottery"
       // country:self._conf.country
    };
    for(var i in extraparams){
    	params[i] = extraparams[i];
    }
	UT.send(params);
};

/**
*设置cms配置量，以及需要用到的datePicker、cityPicker、cityList的选择器
*/
VnLotteryBase.prototype._setConf = function(conf){
	if(!conf) {
		console.log('arg miss');
		return;
	}
	this._conf = conf;

	this._$datePicker = $('#datepicker');//日期列表控件
	this._$cityPicker = $('#citypicker');//城市列表
	this._$cityList = $('#citylist');
	this._$listTrigger = $("#citypicker , #citypicker + .lottery-trigger");//城市列表的下拉小三角，触发器
};

//初始化UI(抽象函数)
VnLotteryBase.prototype._setUI = function(){};
//绑定事件(抽象函数)
VnLotteryBase.prototype._bindEvents = function(){};
//获取数据(抽象函数)
VnLotteryBase.prototype._getData = function(){};
//刷新，重新获取数据
VnLotteryBase.prototype.refresh = function(){};

/**
*通用的初始化函数
*@param {Object|Array} conf 包含cms配置量，以及需要用到的datePicker、cityPicker、cityList的选择器
*/
VnLotteryBase.prototype._init = function(conf){
	var self = this;
	self._setConf(conf);
	self._initDatePicker();
	self._setUI();
	self._bindEvents();
	self._getData();
};

module.exports = VnLotteryBase;
