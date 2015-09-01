/*
bubble class
 */

var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');

var messageBubble = function(){
	var that = this;

	//数据
	that.guide = conf.sidebar.leftSideGuidBubble || conf.sidebar.guideBubble;
	//父元素
	that.sidebar = $("#sidetoolbarContainer");
	//配置
	that.options = {
		id:"",
		close:1,
		normalTpl:"",
		slideTpl:"",
		timer:null,
		time:5000
	};

};

messageBubble.prototype._renderGuideBubble = function(){
	var that = this,
		config =  that.settings,
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
			"marginTop" : that.index * 59 + "px",
			"width" : config.width,
			"height" : config.height
		},
		bubbleTpl = config.img ? imgWithTextBubbleTpl : plainTextBubbleTpl;	

	if( config.tpl ){			
		elStr = guideBubbleTpl + config.tpl + '</div>';
		$(".sidetoolbar").append(elStr);
		that.settings.openable && $(".sidetoolbar").find(".guide-bubble").addClass("open-content");
		if( config.hao123Mod ){
			hao123.lazyLoad.js(conf.sidebarBubble[that.settings.id],function(){
				require(config.hao123Mod);
			});
		} else if( config.scriptMod ) {
			hao123.lazyLoad.js(config.scriptMod);
		}
		
	} else {
		elStr = guideBubbleTpl + helper.replaceTpl(bubbleTpl,{ "text" : config.text,"src" : "" }) + '</div>';
		$(".sidetoolbar").append(elStr);
	}			
	
	
	
	$(".guide-bubble").css(cssConfig);

};

messageBubble.prototype._startTimer = function(){
	var	that = this,
		el = that.icon;

	that.sidebar.trigger("changeIconStatus",[el,"hover"]);
	that.timer = setTimeout(function(){
		$(".guide-bubble").hide();
		that.sidebar.trigger("changeIconStatus",[el]);
		that.guideBubbleStatus = 0;
	},that.settings.time);
};

messageBubble.prototype._bindEvent = function(){
	var that = this,
		index = that.index,
		el = that.icon;

	that.sidebar.on("click.hao123",".bubble-close",function(){
		that.stopGuideBubbleTimer();	
		that.resetGuideBubbleVersion();				
	}).
	on("click.hao123",".open-content",function(){
		that.sidebar.trigger("handleContentFold",[index]);
		that.stopGuideBubbleTimer();
		that.sidebar.trigger("changeIconStatus",[that.icon,"selected"]);
		that.sidebar.trigger("renderAppContent", [index]) && that.icon.attr( "hasClicked", "true" );
		UT.send({
			modId:"sidetoolbar",
			type:"click",
			position:that.settings.id,
			sort:"bubbleOpenContent",
			ac:"b"
		});
		that.resetGuideBubbleVersion();
	}).
	on("stopGuideBubbleTimer",function(){
		that.stopGuideBubbleTimer();
	}).
	on("getGuideBubbleStatus",function(){
		return that.guideBubbleStatus;
	}).
	on("handleBubbleCookie",function(e,index){
		if( index == that.index	){
			that.resetGuideBubbleVersion();
			that.index = -1;
		} 
	});

};

messageBubble.prototype.stopGuideBubbleTimer = function(){
	var that = this;
	$(".guide-bubble").hide();
	//that.sidebar.trigger("changeIconStatus",[that.icon]);
	that.timer && clearTimeout(that.timer);
	that.guiderTimer && clearTimeout(that.guiderTimer);
	that.guideBubbleStatus = 0;
};

messageBubble.prototype.getBubbleType = function (data) {
	var type = 4;
	if( data.once ){
		type = 1;
	} else if( data.userOption ){
		type = 2;
	} else if( data.timeOption ){
		type = 3; 
	} 
	return type;
};

messageBubble.prototype.getBubbleVisibility = function (data,cookieName) {
 
	var flag = false,
		cookie = $.cookie.get(cookieName),
		type = this.getBubbleType( data );
	
	if( type == 1 ){
		!cookie && (flag = true) && this.setBubbleCookie( cookieName,data );
	} else if(  type == 2 ||  type == 3 ){
		!cookie && (flag = true);
	} else {
		flag = true;
	} 
	return flag;
};

messageBubble.prototype.setBubbleCookie =  function (cookieName,data,value,expires) {
	var type = data ? this.getBubbleType( data ) : "";

	if( type == 3 ){
		value = type;
		expires = data.timeOption;
	}
	
	$.cookie.set(cookieName, value, {expires:expires * 1 || 30});
};

messageBubble.prototype.resetCookie = function( cookieName ){
	$.cookie.set(cookieName,"",{expires: - 1});
};

messageBubble.prototype.resetGuideBubbleVersion = function(){
	var cookie = $.cookie.get("guideBubbleQueue").split(",");

	cookie.length && this.setBubbleCookie("guideBubbleQueue","",cookie.slice(1).join(),1);	
	cookie.length == 1 && this.setBubbleCookie( "guideBubbleQueue","","none",1);

}

messageBubble.prototype.getGuideBubbleVersion = function(){
	var cookie = $.cookie.get("guideBubbleQueue").split(",");
	var version = cookie ? cookie[0] : "";

	return version;	
}

messageBubble.prototype.init = function(){
	var that = this,
		config = that.guide,
		version = 0,
		guideBubbleQueue = $.cookie.get("guideBubbleQueue");

	that.guiderTimer = null;
	
	if(config && !config.hide){
		//如果外站要在页面右侧展现ltr的sidebar，就把气泡干掉
		if( window.hao123 && hao123.atRightSide ){
			return;
		}
		if( !guideBubbleQueue && guideBubbleQueue != "none" ){
			that.setBubbleCookie( "guideBubbleQueue","",that.guide.bubbleQueue,1);
		}
		
		version = that.getGuideBubbleVersion();
		that.settings = $.extend({},that.options,that.guide.list[version]);
		that.guideBubbleStatus = 1;
		that.icon = $("."+that.settings.id+"Icon");
		that.index = that.icon.index();
		if ( version !== "none" ){
			that.guiderTimer = setTimeout(function(){		
				that._renderGuideBubble();	
				that._startTimer();				
			},3000);
			that._bindEvent();
		} else {
			that.guideBubbleStatus = 0;
		}
		
	}
};


messageBubble.prototype.handleVisibel = function( el,message ){
	message = message || "";
	el.text( message );
	message ? el.show() : el.hide();
};


module.exports = messageBubble;
