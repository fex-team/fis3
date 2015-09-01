var $ = require('common:widget/ui/jquery/jquery.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");
/**
 * 汇率模块
 * @author wangmingfei
 * @constructor
 * @this {rate}
 */
var rate = function(){
	var that = this;
	// 汇率的config属性
	that.conf = conf.rate;
	// 计算器部分的config属性
	that.calculator = that.conf.calculator;
	// cms中配置的币种
	that.typeData = that.conf.type;
	// 外容器（id由cms传入）
	that.container = $("#"+that.conf.id);
	// 计算结果的html模板
	that.resultTpl = "<span class='rate-result-from'>#{from}</span> = <strong class='rate-result-to'>#{to}</strong>";
	// 汇率表格的html模板
	that.tableTpl = "<table class='rate-table s-mbm'><tr><th colspan='2' class='rate-table-title gradient-bg-silver' title='#{title}'><i class='rate-icon rate-icon-#{currency}'></i>#{title}</th></tr><tr><td class='rate-from2to'#{fromColor}>#{fromName}</td><td>#{fromValue}</td></tr><tr><td class='rate-to2from'#{toColor}>#{toName}</td><td>#{toValue}</td></tr></table>";
	// 初始化
	that.init();

};
/**
 * 获得所选币种对应的序号，用于给dropdownlist传默认选中项的序号
 *
 * @this {rate}
 * @param {string} id 所选币种对应的值
 */
rate.prototype.getSelIndexById = function(id){
	var that = this,
		selIndex;
	$(that.typeData).each(function(i,v){
		if(v.id === id){
			selIndex = i;
		}
	});
	return selIndex;
};
/**
 * 初始化计算结果和汇率列表
 *
 * @this {rate}
 */
rate.prototype.initResult = function(){
	var that = this,
		params = "?app=exchrate&act=contents&country="+conf.country;

	// get exchange rate data of all countries
	$.ajax({
			url: conf.apiUrlPrefix + params,
			//url: "/static/home/widget/rate/data.json",
			dataType: "jsonp",
			jsonp: "jsonp",
			//jsonpCallback: "ghao123_bc3a4ab6512ea338",
			jsonpCallback: "ghao123_" + hex_md5(params,16),
			cache: false
	}).done(function(data){
		that.rateData = data.content.data;
		that.renderResult();
		that.renderTable();
		that.bindEvents();
		that.initScrollbar();
	});
};
/**
 * 校验输入值的有效性，规则是整数最多10位，小数最多两位的数字
 *
 * @this {rate}
 * @param {string} value
 * @return {boolean} 有效为true，无效为false
 */
rate.prototype.verifyInput = function(value){
	var reg = new RegExp(/^\d{0,10}(\.\d{0,2})?$/);
	return reg.test(value);
};
/**
 * 修正输入值，替换开头到小数点和末尾到小数点连续都是0的情况为一个0
 *
 * @this {rate}
 * @param {string} value
 * @return {string} 修正后的值
 */
rate.prototype.fixInput = function(value){
	return value.replace(/^\./,"0.").replace(/\.$/,".0");
}
/**
 * 校验输入字符的有效性，只接受数字和小数点，功能键接收回退、删除、上下左右方向键
 *
 * @this {rate}
 * @param {string} code
 * @return {boolean} 有效为true，无效为false
 */
rate.prototype.verifyKeyCode = function(code){
	if((48 <= code && code <= 57) || code === 46 || (37 <= code && code <= 40) || code === 8 || code === 13){
		return true;
	}else{
		return false;
	}
};
/**
 * 计算汇率结果，并且修正浮点数计算的误差
 *
 * @this {rate}
 * @param {number} a 兑换金额
 * @param {number} b 汇率
 * @return {number} 计算结果
 */
rate.prototype.calculate = function(a,b){
	var fix = 0;
	a = a.toString();
	b = b.toString();
	~a.indexOf(".") && (fix += a.split(".")[1].length);
	~b.indexOf(".") && (fix += b.split(".")[1].length);
	return a.replace(".","")*b.replace(".","")/Math.pow(10,fix);
};
/**
 * 生成计算结果并更新，输入无效时提示错误信息
 *
 * @this {rate}
 */
rate.prototype.renderResult = function(){
	var that = this,
		$rateResult = that.container.find(".rate-result"),
		$rateAmount = that.container.find(".rate-amount"),
		amount = $.trim($rateAmount.val()) || that.calculator.amount.defaultVal;
	amount = parseFloat(amount,10);
	var fromCurrency = that.rateFromSelect && that.rateFromSelect.value || that.calculator.from.defaultVal,
		toCurrency = that.rateToSelect && that.rateToSelect.value || that.calculator.to.defaultVal;
	// 某项在后端数据中找不到
	if(!that.rateData[fromCurrency + ":" + toCurrency]){
		// from和to的币种不一致，则给出没有数据的提示
		if(fromCurrency !== toCurrency){
			$rateResult.html(that.calculator.errMsg);
			return;
		// from和to的币种一致，则直接用1补全数据
		}else{
			that.rateData[fromCurrency + ":" + toCurrency] = 1;
		}
	}
	$rateResult.html(helper.replaceTpl(that.resultTpl,{
		from: amount + " " + fromCurrency,
		to: that.calculate(amount,that.rateData[fromCurrency + ":" + toCurrency]) + " " + toCurrency
	}));
};
/**
 * 生成基于默认原始币种的汇率表格
 *
 * @this {rate}
 */
rate.prototype.renderTable = function(){
	var that = this,
		html = "",
		defaultFrom = that.calculator.from.defaultVal;
	$(that.typeData).each(function(i,v){
		// exclude the default currency type
		if(v.id !== that.calculator.from.defaultVal){
			html += helper.replaceTpl(that.tableTpl,{
				currency: v.id.toLowerCase(),
				title: v.sname,
				toName: v.id+"/"+defaultFrom,
				toValue: that.rateData[v.id+":"+defaultFrom] || "-",
				toColor: that.conf.color.to ? " style='background:"+that.conf.color.to+"'" : "",
				fromName: defaultFrom+"/"+v.id,
				fromValue: that.rateData[defaultFrom+":"+v.id] || "-",
				fromColor: that.conf.color.from ? " style='background:"+that.conf.color.from+"'" : ""
			});
		}
	});
	that.container.find(".rate-tables").html(html);
};
/**
 * 绑定模块事件
 *
 * @this {rate}
 */
rate.prototype.bindEvents = function(){
	var that = this,
		rateAmount = that.container.find(".rate-amount"),
		rateAmountWrapper = that.container.find(".rate-amount-wrapper"),
		ratePlaceholder1 = that.container.find(".rate-placeholder-1"),//小数点前面的0
		ratePlaceholder2 = that.container.find(".rate-placeholder-2"),//小数点+后面的00
		oldInput="",
		newInput="",
		keyLock = false;
	that.container
	//查询按钮点击
	.on("click calculate.rate",".rate-search",function(){
		rateAmount.val(newInput);
		that.renderResult();
		that.sendStat({sort: "button",ac: "b"});
	})
	/*.on("change",".rate-amount",function(e){
		console.log(1);
	})*/
	.on("keydown",".rate-amount",function(e){
		if(!keyLock){
			keyLock = true;
			oldInput = $(this).val();
		}else{
			e.preventDefault();
		}
	})
	//按键时做无效字符过滤
	.on("keypress",".rate-amount",function(e){
		if(!that.verifyKeyCode(e.which)){
			rateAmountWrapper.addClass("rate-input-error");
			e.preventDefault();
			setTimeout(function(){
				rateAmountWrapper.removeClass("rate-input-error");
			},50);
		}
	})
	//keyup时对输入的整体值做规则校验
	.on("keyup",".rate-amount",function(e){
		newInput = that.fixInput($.trim(rateAmount.val()));
		//符合规则
		if(that.verifyInput(newInput)){
			//输入中已有小数点，则灰色的.00提示隐藏
			if(newInput.indexOf(".") !== -1){
				rateAmountWrapper.removeClass("rate-input-s");
				ratePlaceholder2.hide();
			//输入中没有小数点，则显示灰色的.00提示
			}else{
				rateAmountWrapper.addClass("rate-input-s");
				ratePlaceholder2.show();
			}
		//不符合，则恢复成之前的输入，闪烁红色虚线框提示
		}else{
			rateAmountWrapper.addClass("rate-input-error");
			newInput = oldInput;
			rateAmount.val(oldInput);
			setTimeout(function(){
				rateAmountWrapper.removeClass("rate-input-error");
			},50);
		}
		keyLock = false;
		if(e.which === 13){
			that.container.find(".rate-search").trigger("calculate.rate");
		}
	})
	//获得焦点时，检查输入框是否有值，没有则隐藏灰色提示0和.00
	.on("focus",".rate-amount",function(){
		var input = $.trim($(this).val());
		if(!input.length){
			ratePlaceholder1.hide();
			ratePlaceholder2.hide();
		}
	})
	//失去焦点时，检查输入框是否有值，没有则显示灰色提示0和.00
	.on("blur",".rate-amount",function(){
		if(!$.trim($(this).val()).length){
			ratePlaceholder1.show();
			ratePlaceholder2.show();
			rateAmountWrapper.removeClass("rate-input-s");
		}
	})
	//点击提示时，也会触发输入框的focus事件
	.on("click",".rate-placeholder",function(){
		rateAmount.focus();
	});
};
/**
 * 生成原始货币和目标货币的下拉列表
 *
 * @this {rate}
 */
rate.prototype.initSelector = function(){
	var that = this;
	require.async("common:widget/ui/dropdownlist/dropdownlist.js",function(dropdownlist){
		that.rateFromSelect = new dropdownlist({
			selector: "rateFrom",
			defIndex: that.getSelIndexById(that.calculator.from.defaultVal),
			customScrollbar: 1
		});
		that.rateToSelect = new dropdownlist({
			selector: "rateTo",
			defIndex: that.getSelIndexById(that.calculator.to.defaultVal),
			customScrollbar: 1
		});
	});
};
/**
 * 生成内容区滚动条
 *
 * @this {rate}
 */
rate.prototype.initScrollbar = function(){
	var that = this;
	require.async("common:widget/ui/scrollable/scrollable.js",function(scrollable){
		that.scrollbar = that.container.find(".rate-inner").scrollable({
			autoHide: false,
			onScroll: function(){
				!that.hasEverScroll && that.sendStat({position: "scrollrole"});
				that.hasEverScroll = true;
			}
		});
		that.hasEverScroll = false;
	});
};
/**
 * 发送统计
 *
 * @this {rate}
 */
rate.prototype.sendStat = function(params){
	UT.send(
		$.extend({
	        modId: "rate",
	        country: conf.country,
	        position: "links"
	    },params)
	);
};
/**
 * 模块初始化
 *
 * @this {rate}
 */
rate.prototype.init = function(){
	var that = this;
	that.initSelector();
	that.initResult();
};
module.exports = rate;
