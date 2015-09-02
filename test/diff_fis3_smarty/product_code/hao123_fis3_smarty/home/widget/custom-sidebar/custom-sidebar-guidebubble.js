var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');

var guideBubble = function (data) {
	var that = this;

	//数据
	that.guide = data;
	//父元素
	that.sidebar = $(".mod-custom-sidebar");
	//配置
	that.options = {
		time : 5000
	};
	//全局的状态
	that.status = conf.customSidebar.status;
	//特型气泡地址列表
	that.special = conf.customSidebar.specialBubble;
};

/**
  *初始化引导气泡
*/

guideBubble.prototype.init = function() {
	var that = this,
		guide = that.guide,
		queue = $.cookie.get("guideBubbleQueue"),
		update = $.cookie.get("guideBubbleQueue");

	//引导气泡出现和消失的定时器	
	that.showTimer = null;
	that.hideTimer = null;	
	that.version = 0;

	if( guide && !guide.hide ){
		//用户第一次加载或更换版本
		if( (!queue && queue != "none") || (update && update != that.guide.updateVersion) ){
			that.setCookie( "guideBubbleQueue",that.guide.bubbleQueue,1 );
			that.setCookie( "guideBubbleUpdate",that.guide.updateVersion,1 );
		}


		//引导气泡的模板序号
		that.getVersion();
		that.config = $.extend({},that.options,guide.list[that.version]);

		if ( that.version !== "none" ){	
			that.status.isFolded = 0;
			that.status.bubbleExsit = 1;

			that.showTimer = setTimeout(function(){		
				that._render();	
				that._startHideTimer();				
			},300);
			that._bindEvent();
		} else {
			
		}
	}	
};

/**
  *生成引导气泡
*/
guideBubble.prototype._render = function () {
	var that = this,
		config = that.config,
		sidebar = that.sidebar,
		marginTop = sidebar.triggerHandler("getTop",[config.id]),
		elStr = "",
		//引导气泡
		guideBubbleTpl = '<div class="guide-bubble">'
						+  '<span class="bubble-close"></span>',
		//纯文字模式
		plainTextBubbleTpl = '<div class="bubble-wrap open-content">'
							+' <span class="bubble-text">#{text}</span>'
							+'</div>',	
		//图片加文字的模式
		imgWithTextBubbleTpl = '<div class="bubble-wrap open-content">'
							+' <img class="bubble-img" src="#{src}"/>'
							+' <span class="bubble-text">#{text}</span>'
							+'</div>',									
		cssConfig = {
			"marginTop" : marginTop,
			"width" : config.width,
			"height" : config.height
		},
		bubbleTpl = config.img ? imgWithTextBubbleTpl : plainTextBubbleTpl;	

	//特型气泡	
	if( config.tpl ){			
		elStr = guideBubbleTpl + config.tpl + '</div>';
		sidebar.append(elStr);

		//气泡整个是否可点
		that.config.openable && sidebar.find(".guide-bubble").addClass("open-content");

		//加载特型气泡的脚本
		if( config.hao123Mod ){
			//hao123主站的方式
			hao123.lazyLoad.js(that.special[config.id],function(){
				require(config.hao123Mod);
			});
		} else if( config.scriptMod ) {
			//外站的方式
			hao123.lazyLoad.js(config.scriptMod);
		}

	//纯文字或图片加文字的形式	
	} else {
		elStr = guideBubbleTpl + helper.replaceTpl(bubbleTpl,{ "text" : config.text,"src" : "" }) + '</div>';
		sidebar.append(elStr);
	}				
	
	sidebar.trigger("changeAppStatus",[config.id,"hover"]).find(".guide-bubble").css(cssConfig);	
};

/**
  *获取引导气泡的模板序号
*/
guideBubble.prototype.getVersion = function(){
	var cookie = $.cookie.get("guideBubbleQueue").split(","),
		version = cookie[0],
		list = this.guide.list;	

	if( version == "none" ){
		this.version = "none";
		return;
	} else if( !list[version] || !$( ".si-" + list[version].id ).length ){
		this.updateQueue();
		this.getVersion();
	} else {
		this.version = version;
	}
	//return version;	
};

/**
  *设置cookie
*/
guideBubble.prototype.setCookie = function( name,value,expires ){
	$.cookie.set(name, value, {expires:expires * 1 || 30});
};

/**
  *气泡自动消失的定时器
*/
guideBubble.prototype._startHideTimer = function () {
	var that = this,
		sidebar = that.sidebar;

	that.hideTimer = setTimeout(function(){
		sidebar.trigger("changeAppStatus",[that.config.id]).find(".guide-bubble").hide();
		that.status.isFolded = 1;
	},that.config.time);

};

/**
  *终止引导气泡
*/
guideBubble.prototype.terminate = function () {
	var that = this,
		sidebar = that.sidebar;

	sidebar.trigger("changeAppStatus",[that.config.id])
	sidebar.find(".guide-bubble").hide();	
	clearTimeout(that.showTimer);
	clearTimeout(that.hideTimer);
	that.status.isFolded = 1;	
	that.status.bubbleExsit = 0;
};

/**
  *更新气泡队列
*/
guideBubble.prototype.updateQueue = function () {
	var cookie = $.cookie.get("guideBubbleQueue").split(",");

	cookie.length && this.setCookie("guideBubbleQueue",cookie.slice(1).join(),1);	
	cookie.length == 1 && this.setCookie( "guideBubbleQueue","none",1);
};

/**
  *绑定事件
*/
guideBubble.prototype._bindEvent = function () {
	var that = this,
		sidebar = that.sidebar;

	//通过气泡展开内容区	
	sidebar.on("click",".open-content",function(){
		//终止气泡
		that.terminate();
		//更新气泡队列
		that.updateQueue();	
		//展开内容区
		sidebar.trigger("switchContent",[that.config.id]);		
			
	})
	//点击气泡的关闭叉子关闭气泡
	.on("click",".bubble-close",function(){
		//终止气泡
		that.terminate();
		//更新气泡队列
		that.updateQueue();
	})
	//从非气泡处关闭气泡
	.on("terminateBubble",function(e,id){
		//终止气泡
		that.terminate();
		//展开的app是当前持有引导气泡的app时才更新气泡队列
		id == that.config.id && that.updateQueue();
	});
};

module.exports = guideBubble;












