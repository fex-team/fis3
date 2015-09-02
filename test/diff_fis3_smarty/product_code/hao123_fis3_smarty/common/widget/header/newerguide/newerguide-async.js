/**
 * @author: chenguangyin
 *
 * @descrip: 本模块的目的是引导用户访问我们的页面信息，具体过程如下：
 * 用户如果在页面没有进行任何有效点击，当鼠标经过logo旁边时（访问地址栏）显示引导信息
 * 关闭引导信息有三种方式：
 * 1. 点击X按钮，可配置以后是否出现或者永不出现
 * 2. 点击有效区域（搜索框、页面内容等），可配置以后是否出现或者永不出现
 * 3. 刷新页面
 *
 **/


var $ = require("common:widget/ui/jquery/jquery.js"),
	UT = require("common:widget/ui/ut/ut.js"),
	newerguide = {},
	/* 用到的相关元素 */
	CONF = {
		head: $("#top"),
		logo: $(".userbar-logo", "#top").eq(0),
		tip: $("#newerguide"),
		tipClose: $("#newerguideClose"),
		form: $("#searchGroupForm")
	};

newerguide.isSHow = false; /* 引导框是否显示 */
newerguide.clicked = false; /* 是否点击过页面有效区域 */

/* 根据CMS配置的位置信息设置引导框位置，并显示 */
newerguide.showTips = function() {
	CONF.tip && CONF.tip.css(this.data.position).show();
	this.isShow = true;
};

/* 隐藏引导框 */
newerguide.hideTips = function(status, value) {
	var that = this;

	CONF.tip.hide();
	that.isShow = false;
	that.handleCommand(status);
	that.sendUT(value);
};

/* 根据参数发送不同的统计 */
newerguide.sendUT = function(value) {
	UT.send({
		type: "others",
		sort: value,
		position: "newerguide",
		modId: "newerguide"
	});
};

/* 保存cookie，cookie时间为10年 */
newerguide.setCookie = function() {
	$.cookie("newerguide", "close", {
		expires: 10*365
	});
};

/* 删除cookie */
newerguide.deleteCookie = function() {
	$.cookie("newerguide", null);
};

/**
 * @params   event对象
 * @return   boolean值,在区域内发生为true
 * @descrip  验证鼠标事件是否发生在相应区域
 *
 **/
/*
newerguide.showConfirm = function(e) {
	var eventX = e.pageX,
		logoX = CONF.logo.offset().left;

	if ($("html").attr("dir") === "ltr") {
		return (eventX - logoX > 250) ? false : true;
	} else {
		return (logoX - eventX > 250) ? false : true;
	}
};
*/

/**
 * @params   控制引导框显示时间的CMS指令
 * @descrip  当要求下次显示时删除cookie，否则保存cookie
 *
 **/
newerguide.handleCommand = function(order) {
	if (order === "") {
		this.setCookie();
	} else {
		this.deleteCookie();
	}
};

/* 绑定事件 */
newerguide.bindEvent = function() {
	var that = this,
		data = that.data;

	/* 判断鼠标是否经过有效区域并处理，同时发送引导出现次数统计 */
	CONF.head.on("mouseenter", function(e) {
		/*if (!that.clicked && !$.cookie("newerguide") && that.showConfirm(e) && !that.isShow) {*/
		if (!that.clicked && !$.cookie("newerguide") && !that.isShow) {
			that.showTips();
			that.sendUT("show");
		}
	});

	/* 鼠标点击X按钮关闭引导框，并发送X的点击次数统计 */
	CONF.tipClose.on("click", function() {
		that.hideTips(data.isShowAgainBtn, "close");
	});

	/* 点击有效区域（a）时移除引导框，发送统计 */
	$(document).on("click", function(e) {
		if($(e.target).closest("a").length === 1) {
			if (!$.cookie("newerguide") && that.isShow) {
				that.hideTips(data.isShowAgainArc, "link");
			}
			that.clicked = true;
		}
		
	});

	/* 补充有效区域，点击表单时也应处理 */
	CONF.form.on("click", function() {
		if (!$.cookie("newerguide") && that.isShow) {
			that.hideTips(data.isShowAgainArc, "link");
		}
		that.clicked = true;
	});

};

/**
 * @params   CMS配置信息
 * @descrip  模块初始化
 *
 **/
newerguide.init = function(data) {
	this.data = data;
	this.bindEvent();
};


module.exports = newerguide;