var $ = require('common:widget/ui/jquery/jquery.js');
var VnLotteryBase = require('lv2:widget/site-list-v-new/lottery/vnLotteryBase.js');

function VnLotteryLv2(conf){
	var self = this;
	self._isInit = false;
	//self._pageType = 2;//页面类型

	//分析页面url
	self._decodeURL();

	//dom节点缓存
	self._$lotteryLv2Search = $("#lotteryLv2Search");//查询按钮
	self._$lotteryTable = $('#lotteryTable');//中奖列表
	self._$preciseLottery = $('#preciseLottery');

	self._init(conf);

}
//继承
VnLotteryLv2.prototype = new VnLotteryBase();

//解析url,获取日期和城市，以及是否为首页跳转
VnLotteryLv2.prototype._decodeURL = function(){
	if(/\?date=(.+)&city=([^&]+)/.exec(location.search)){
		this._date = decodeURIComponent(RegExp.$1),
		this._city = decodeURIComponent(RegExp.$2);
		if(/code=(.+)/.exec(location.search)){
			this._code = decodeURIComponent(RegExp.$1);
		}
	}
};

//设置中奖列表
VnLotteryLv2.prototype._setResultTable = function(awardInfo , winNum){
	var html = "";
	var reg;
	//如果中奖，高亮显示中奖号码
	for(var i=0,td;td=awardInfo[i];i++){
		for(var j=0,no;no=winNum[j];j++){
			reg = new RegExp("(^|\\D)("+no+")($|\\D)","g");
			td.code = td.code.replace(reg,"$1<span class='red'>$2</span>$3");
		}
		html += "<tr><td class='col_l'>" + td.price + "</td><td class='tc'>" + td.code + "</td></tr>";
	}
	this._$lotteryTable.find('th').parent().siblings().remove().end().after(html);
};

//设置ui相关
VnLotteryLv2.prototype._setUI = function(){
	var date;
	if(this._date){
		date = $.datepicker.parseDate(this._conf.lottery.dateFormat , this._date);
	}else{
		date = this._conf.lottery.defaultDate;
	}
	this._$datePicker.datepicker("setDate" , date);
	//取得datepicker当前显示值
	this._date = this._$datePicker.val();
};

//打开页面时实现获取数据的方法
VnLotteryLv2.prototype._getData = function(){
	this._getCityByDate(this._date);
};

//绑定事件
VnLotteryLv2.prototype._bindEvents = function(){
	var self = this;
	//通用绑定
	self._bindCommonEvents();

	//在二级页中目前不做错误处理
	var events = {};
	events[self._GET_CITY_SUCCESS] = function(e , data){
		self._onGetCitySuccess(data);
	};
	events[self._GET_RESULT_SUCCESS] = function(e , data){
		self._onGetResultSuccess(data);
	};
	self._stateCtrl.on(events);

	//二级页查询按钮
	self._$lotteryLv2Search.click(function(){
		self._hideResultTable();
		self._getWinningResult(self._$datePicker.val().trim() , self._$cityPicker.val().trim());
		self._sendLog();
	});
};

//状态事件处理================================================================
VnLotteryLv2.prototype._onGetCitySuccess = function(data){
	if(!this._isInit){
		if(this._city){
			this._setCityPicker(data , this._city);
		}else{
			this._setCityPicker(data);
		}
		//第一次初始化时，自动获取中奖列表
		var date = this._$datePicker.val().trim();
		var city = this._$cityPicker.val().trim();
		var code = this._code || null;
		this._getWinningResult(date , city , code);
		this._isInit = true;
		delete this._city;
	}else{
		this._setCityPicker(data);
	}
};

VnLotteryLv2.prototype._onGetResultSuccess = function(data){
	this._setResultTable(data.awardInfo,data.winNum);
	this._showResultTable();
	this._setlotteryTip();
};
//===========================================================

//以下3个方法设置中奖列表ui变化
VnLotteryLv2.prototype._showResultTable = function(){
	this._$lotteryTable.fadeTo('fast', 1);
};

VnLotteryLv2.prototype._hideResultTable = function(){
	this._$lotteryTable.fadeTo('fast', 0);
};

VnLotteryLv2.prototype._setlotteryTip = function(){
	var date = this._$datePicker.val();
	var city = this._$cityPicker.val();
	date = date.split('-').join('/');
	this._$preciseLottery.text(city + '-' + date);
};

module.exports = VnLotteryLv2;
