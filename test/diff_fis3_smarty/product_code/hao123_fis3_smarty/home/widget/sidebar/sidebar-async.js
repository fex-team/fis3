/*
	1.整体sidebar初始化
 */

var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');
var leftSideIcon = require('home:widget/sidebar/sidebar-icon.js');
var leftSideContents = require('home:widget/sidebar/sidebar-content.js');
var messageBubble = require('home:widget/sidebar/sidebar-bubble.js');


window.hao123 || (window.hao123 = {});
window.conf || (window.conf = {});

var sidebar = function(data){
	conf.sidebar = data.sidebar;
	this.hasInited = 0;
	this.list = conf.sidebar.list;
	
	this.icon = new leftSideIcon();
	this.guideBubble = new messageBubble();
	this.redBubble =  new messageBubble();
	this.content = new leftSideContents();
	this.sidebarElement = $("#sidetoolbarContainer");
};

sidebar.prototype.trigger = function(){
	this.icon.init();
	this.guideBubble.init();
	this.content.init();			
	this.hasInited = 1;
};

sidebar.prototype.unfoldAll = function(){
	this.content.foldContent();
	this.icon.changeIconStatus();
	this.guideBubble.stopGuideBubbleTimer();
};

sidebar.prototype.isDropDown = function( list,el ){
	var flag = false;
	for(var i = 0; i<list.length; i++){
		if( $.contains($(list[i])[0],el) ){
			flag = true;
			break;
		}	
	}
	return flag;
};

sidebar.prototype.bindEvent = function(){
	var closebtn = $(".sidetoolbar-closebtn"),
		close_flod = $(".sidetoolbar-close_flod"),
		sidetoolbar = $(".sidetoolbar"),
		_this = this;

	//展开按钮
	this.sidebarElement.on("click.hao123",".closebtn_open,.sidetoolbar_unfold",function(){
		var message = $(".sidetoolbar-close_flod").find(".applist-i");

		close_flod.removeClass("sidetoolbar_unfold");
		closebtn.removeClass("closebtn_open").addClass("closebtn_close");
		sidetoolbar.addClass("sidetoolbar_fold");
		$.cookie.set("sidetoolbar", "1", {expires:2000});
		!_this.hasInited && _this.trigger();
		_this.redBubble.handleVisibel( message );
		UT.send({
			modId:"sidetoolbar",
			type:"click",
			position:"openBar",
			ac:"b"
		});

	})
	//关闭按钮
	.on("click.hao123",".closebtn_close",function(){
		var message = $(".sidetoolbar-close_flod").find(".applist-i");

		_this.unfoldAll();
		close_flod.addClass("sidetoolbar_unfold");
		closebtn.removeClass("closebtn_close").addClass("closebtn_open");
		sidetoolbar.removeClass("sidetoolbar_fold");
		$.cookie.set("sidetoolbar", "0", {expires:2000});
		_this.redBubble.handleVisibel( message,_this.icon.getMessages() );
		UT.send({
			modId:"sidetoolbar",
			type:"click",
			position:"closeBar",
			ac:"b"
		});

	});
	close_flod.hover(
		function(){
			closebtn.addClass("sidetoolbar-closebtn_hover");
		},
		function(){
			closebtn.removeClass("sidetoolbar-closebtn_hover");
		}
	);

	//点击非左边栏区域时收起内容区
	$(document).on("mousedown",function(e){
		var el = e.target,
			specialDropDown = [],
			dropdownList = _this.list[_this.content.getCurrentIndex()].widget[0].bodyDropdown,
			guideBubbleStatus = _this.sidebarElement.triggerHandler("getGuideBubbleStatus");

		dropdownList && (specialDropDown = dropdownList.split(","));

		if( el != _this.sidebarElement[0] && !$.contains(_this.sidebarElement[0],el)){
			if(specialDropDown.length && _this.isDropDown(specialDropDown,el) ){
				return;
			}

			_this.content.foldContent();
			!guideBubbleStatus && _this.icon.changeIconStatus();
		}
	});
};

sidebar.prototype.init = function(){
	var closebtn = $(".sidetoolbar-closebtn"),
		sidetoolbar = $(".sidetoolbar"),
		sidetoolbar_foldTpl = '<div class="sidetoolbar-close_flod"><i class="applist-i">•••</i></div>',
		_this = this,
		len = Math.min(this.list.length,7);

	sidetoolbar.append(sidetoolbar_foldTpl);
	this.sidebarElement.height((len+1)*57+this.list.length+1);
	_this.bindEvent();
	if( !$.cookie.get("sidebarVersion") || ($.cookie.get("sidebarVersion") != conf.sidebar.version) ){
		$.cookie.set("sidebarVersion",conf.sidebar.version,{expires:2000});
		$.cookie.set("sidetoolbar", "1", {expires:2000});
		closebtn.addClass("closebtn_close").css("display","block");
		sidetoolbar.addClass("sidetoolbar_fold");
		this.trigger();
		UT.send({
			modId:"sidetoolbar",
			type:"toggle",
			sort: "open"
		});
		return;
	}
	//如果分辨率小于1024或者计有cookie则默认收起
	if(!$.cookie.get("sidetoolbar") && $(document).width() > 1024 || $.cookie.get("sidetoolbar") == 1){
		closebtn.addClass("closebtn_close").css("display","block");
		sidetoolbar.addClass("sidetoolbar_fold");
		this.trigger();
		UT.send({
			modId:"sidetoolbar",
			type:"toggle",
			sort: "open"
		});
	}
	else{
		$(".sidetoolbar-close_flod").addClass("sidetoolbar_unfold");
		closebtn.addClass("closebtn_open").css("display","block");
		UT.send({
			modId:"sidetoolbar",
			type:"toggle",
			sort: "close"
		});
	}

};

module.exports = hao123.sidebar = sidebar;