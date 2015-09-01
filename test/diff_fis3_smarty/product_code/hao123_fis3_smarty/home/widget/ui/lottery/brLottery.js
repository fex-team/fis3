var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var helper = require('common:widget/ui/helper/helper.js');

var BrLottery = function(){
	var that = this;
	that.conf = conf.lottery;
	// 每个table的模板
	that.tableTpl = "<table class='lottery-table'><tr><th colspan='2'><a class='lottery-table-title lottery-table-title-#{color}' href='#{url}' data-sort='name'>#{name}</a></th></tr><tr><td class='lottery-table-draw'>#{drawText}:#{drawValue}</td><td class='lottery-table-date'>#{date}</td></tr><tr><td class='lottery-table-result' colspan='2'>#{result}</td></tr></table>";
	that._init();
};

// 是否已经发送了滚动统计
BrLottery.hasSendScrollLog = false;

BrLottery.prototype._init = function(){
	var params = "?app=lottery&act=result&country=" + conf.country,
		that = this;
	$.ajax({
		url: conf.apiUrlPrefix + params,
		// url: "/static/home/widget/lottery/data.json",
		dataType: "jsonp",
		jsonp: "jsonp",
		jsonpCallback: "ghao123_" + hex_md5(params,16),
		// jsonpCallback: "ghao123_d251a1d7fc7a0ef5",
		cache: false
	}).done(function(data){
		that.data = data.content.data;
		if(that.data && that.data.length){
			that._render();
		}
	});
};
BrLottery.prototype._render = function(){
	var that = this,
		typelist = that.conf.type,
		html = "",
		lotteryList = $("#brLotteryList");
	// 拼html
	$.each(that.data,function(i,v){
		var type = typelist[v.id];
		html += helper.replaceTpl(that.tableTpl,{
			color: i%2 ? "red" : "green",
			name: type.name,
			url: type.url,
			drawText: that.conf.drawText,
			drawValue: v.draw,
			date: v.date,
			result: that._styleResult(v.result,type.showType)
		});
	});
	// 插到页面
	lotteryList.html(html);
	// 绑定滚动条
	require.async("common:widget/ui/scrollable/scrollable.js",function(){
		lotteryList.scrollable({
			autoHide: false,
			onScroll: function(){
				if(!BrLottery.hasSendScrollLog){
					UT.send({
						modId: "lottery",
						type: "click",
						position: "scrollrole"
					});
					BrLottery.hasSendScrollLog = true;
				}
			}
		});
	});
};
// 根据不同的显示类别showType得到不同的开奖结果模板
BrLottery.prototype._styleResult = function(result,showType){
	var str = "";
	switch(showType)
	{
		// 一行一个
		case "1":
		$.each(result,function(i,v){
			str += (v + "<br/>");
		});
		break;
		// 一行五个
		case "2":
		$.each(result,function(i,v){
			str += (v + "&nbsp;");
			i%5 == 4 && (str += "<br/>");
		});
		break;
		// 一行六个
		case "3":
		$.each(result,function(i,v){
			str += (v + "&nbsp;");
			i%6 == 5 && (str += "<br/>");
		});
		break;
	}
	return str;
};

module.exports = BrLottery;
