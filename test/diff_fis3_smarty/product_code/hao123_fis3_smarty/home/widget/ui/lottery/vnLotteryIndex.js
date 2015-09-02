var $ = require('common:widget/ui/jquery/jquery.js');
var VnLotteryBase = require('home:widget/ui/lottery/vnLotteryBase.js');
require('common:widget/ui/scrollable/scrollable.js');

function VnLotteryIndex(conf){
	var self = this;
	// self._firstGet = true;//只有第一次初始化失败时才进行错误处理，一旦初始化成功；之后所有ajax错误皆不予处理

	//dom节点缓存
	self._$sideLottery = $("#sideLottery"); //module wrapper
	self._$lotterySearch = $("#lotterySearch"); //查询按钮
	self._$lotteryTable = $('#lotteryTable');//中奖列表
	self._$preciseLottery = $('#preciseLottery');
	self._$apiErrorBtn = self._$sideLottery.find('.api-error');//api error btn

	//init函数必须最后调用
	self._init(conf);

}
//继承
VnLotteryIndex.prototype = new VnLotteryBase();

//ui设置相关设置
VnLotteryIndex.prototype._setUI = function(){
	/*this._resetLotteryNum();	*/
	this._$lotteryTable.scrollable({
		autoHide: false
	});
};

//实现获取数据的方法
VnLotteryIndex.prototype._getData = function(){
	this._getCityByDate(this._$datePicker.val());
};

//绑定事件
VnLotteryIndex.prototype._bindEvents = function(){
	var self = this;
	//通用绑定
	self._bindCommonEvents();

	//绑定首页的错误处理
	var events = {};
	events[self._CITY_LOADING] = function(){
		self._onCityLoading();
	};
	events[self._CITY_TIME_OUT] = function(){
		self._onCityTimeout();
	};
	events[self._GET_CITY_SUCCESS] = function(e , data){
		self._onGetCitySuccess(data);
	};
	//获取城市失败实际是指返回数据为空，而非连接不到服务器
	//如果连接不到服务器，则通过_TIME_OUT事件处理
	events[self._GET_CITY_FAILURE] = function(){
		self._onGetCityFailure();
	};
	events[self._GET_RESULT_SUCCESS] = function(e , data){
		self._onGetResultSuccess(data);
	};
	events[self._GET_RESULT_FAILURE] = function(e , data){
		self._onGetResultFailure();
	};
	self._stateCtrl.on(events);

	//无法连接到api,点击后重新获取数据
	self._$apiErrorBtn.click(function(e){
		e.preventDefault();
		self.refresh();
	});

	//查看结果
	self._$lotterySearch.click(function(e){
		var logParams = {};
		self._hideResultTable();
		self._getWinningResult(self._$datePicker.val().trim() , self._$cityPicker.val().trim());
		logParams["position"] = "searchbtn";
		self._sendLog(logParams);
		e.preventDefault();
	});

	self._$sideLottery.find('.charts_more').click(function(){
		self._sendLog();
	});
};

//状态事件处理================================================================
VnLotteryIndex.prototype._onCityLoading = function(){
	// if(this._firstGet){
		this._showLoadingPanel();
	// }
};

VnLotteryIndex.prototype._onCityTimeout = function(){
	/*if(this._firstGet){
		this._showErrorPanel();
	}else{
		this._setCityPicker([]);
	}*/
	this._showCityErrorPanel()
};

VnLotteryIndex.prototype._onGetCitySuccess = function(data){
	this._setCityPicker(data);
	// if(this._firstGet){
		this._showSuccessPanel();
		this._getWinningResult(this._$datePicker.val().trim() , this._$cityPicker.val().trim() , null);
		// this._firstGet = false;
	// }
};

VnLotteryIndex.prototype._onGetCityFailure = function(){
	/*if(this._firstGet){
		//由于当日的彩票结果可能尚未公布，所以当日结果可以为空
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		var day = today.getDate();
		var pickerDate = this._$datePicker.val().split('-');
		if((day == pickerDate[0]) && (month == pickerDate[1]) && (year == pickerDate[2])){

		}else{*/
			this._showCityErrorPanel();
	/*	}
	}else{
		//do nothing
	}	*/
};

VnLotteryIndex.prototype._onGetResultSuccess = function(data){
	this._setResultTable(data.awardInfo,data.winNum);
	this._showResultTable();
	this._setlotteryTip();
};
VnLotteryIndex.prototype._onGetResultFailure = function(data){
	this._setResultTable([]);
	this._showErrorPanel();
};

//设置中奖列表
VnLotteryIndex.prototype._setResultTable = function(awardInfo , winNum){
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
	this._$lotteryTable.html(html);
};

//以下3个方法设置中奖列表ui变化
VnLotteryIndex.prototype._showResultTable = function(){
	$("#lotteryTable,#preciseLottery").fadeTo('fast', 1);
};

VnLotteryIndex.prototype._hideResultTable = function(){
	$("#lotteryTable,#preciseLottery").fadeTo('fast', 0);
};

VnLotteryIndex.prototype._setlotteryTip = function(){
	var date = this._$datePicker.val();
	var city = this._$cityPicker.val();
	date = date.split('-').join('/');
	this._$preciseLottery.text(city + ' - ' + date);
};

//根据各状态调整界面显示===============================================
VnLotteryIndex.prototype._showSuccessPanel = function(){
	this._$sideLottery.removeClass('status-bottom-loading status-bottom-error').addClass('status-success');
};

VnLotteryIndex.prototype._showErrorPanel = function(){
	this._$sideLottery.removeClass('status-bottom-loading status-success').addClass('status-bottom-error');
	this._$apiErrorBtn.html(conf.lottery.apiError);
};

VnLotteryIndex.prototype._showCityErrorPanel = function(){
	this._$sideLottery.removeClass('status-bottom-loading status-success').addClass('status-bottom-error');
	this._$apiErrorBtn.html(conf.lottery.apiError2);
};

VnLotteryIndex.prototype._showLoadingPanel = function(){
	this._$sideLottery.removeClass('status-bottom-error status-success').addClass('status-bottom-loading');
};
//=====================================================================

//刷新，重新获取
VnLotteryIndex.prototype.refresh = function(){
	// this._getData();
	this._getWinningResult(this._$datePicker.val().trim() , this._$cityPicker.val().trim());
};

module.exports = VnLotteryIndex;
