/*
icon class
 */

var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');
var messageBubble = require('home:widget/sidebar/sidebar-bubble.js');

var leftSideIcon = function () {
	var that = this;
		// tipOption = conf.sidebar.tipOption[0],
		// list = conf.sidebar.list,


	that.tipOption = conf.sidebar.tipOption[0];
	

	this.list = conf.sidebar.list;
	that.arrow = conf.dir == "ltr" ? "ui-arrow-l" : "ui-arrow-r",
	window.hao123 && hao123.atRightSide && (that.arrow = "ui-arrow-r");
		//这里的气泡实例用来处理红色气泡
		// that.bubble = new messageBubble();
		// sidebar = $("#sidetoolbarContainer");

	that.bubble = new messageBubble();

	that.sidebar = $("#sidetoolbarContainer");
}

leftSideIcon.prototype._clickHandle = function( el ){
	var index = el.index(),
		link = el.attr("icon-link"),
		content = null;
		//type = bubble.getBubbleType( guid );
	if( link.length ){
		window.open( link );
		sidetoolbar.unfoldAll();
	}
	else{
		// for iframe @chenliang
		!el.attr( "hasClicked" ) && el.attr( "hasClicked", "true" ) && this.sidebar.trigger("renderAppContent", [index]);
		this.sidebar.trigger("handleContentFold",[index]);
		this.sidebar.trigger("handleBubbleCookie",[index]);
	}

	!$.cookie.get("sideBarRedIcon") && el.find(".applist-i").text().length && this.bubble.setBubbleCookie( "sideBarRedIcon", this.tipOption );

}

leftSideIcon.prototype._bindEvent = function(){
	var that = this;

	that.sidebar.on("click.hao123",".applist-li",function(){
		var $this = $(this),
			arrow = $this.find("b"),
			index = $this.index();

		//终止气泡	
		$this.trigger("stopGuideBubbleTimer");

		$(".applist-li .ui-arrow").hide();
		$this.find(".applist-div").hide();
		$(".applist-li").removeClass("applist-li_fold");
		if( $this.attr("isflod").length ){
			$this.attr("isflod","");
			arrow.hide();
		}
		else{
			$this.attr("isflod","true");
			arrow.show();
		}
		that._clickHandle( $this );
		that.bubble.handleVisibel( $this.find(".applist-i"),"" );
		UT.send({
			modId:"sidetoolbar",
			type:"click",
			sort:"icons",
			position:$this.attr("icon-name"),
			ac:"b"
		});
	}).
	on("mouseover.hao123",".applist-li",function(){
		var contentStatus = that.sidebar.triggerHandler("getContentStatus"),
			guideBubbleStatus = that.sidebar.triggerHandler("getGuideBubbleStatus");
		
		!contentStatus && !guideBubbleStatus && $(this).find(".applist-div").css("display","table");
	}).
	on("mouseleave.hao123",".applist-li",function(){
		$(this).find(".applist-div").hide();
	}).
	on("changeIconStatus",function( e,el,st ){
		that.changeIconStatus( el,st );
	});

};


leftSideIcon.prototype.init = function(){
	var li = "",
		that = this,
		tipType = this.bubble.getBubbleType( that.tipOption ),
		tipCookie = $.cookie.get("sideBarRedIcon"),
		iconTpl =
			'<li class="applist-li #{id}Icon" icon-name="#{id}"  icon-link="#{link}" isflod="">'
			+	'<img src="#{src}" />'
			+	'<div class="applist-div"><span>#{hoverWord}</span></div>'
			+	'<i class="applist-i">#{tip}</i>'
			+	'<b class="ui-arrow '+ this.arrow +' ui-arrow-av"></b>'
			+'</li>';

	$.each(this.list,function( key,value ){
		if( key > 6 ){
			return false;
		}
		
		li = li + helper.replaceTpl(iconTpl,{"id":value.id,"src":value.src,"hoverWord":value.hoverWord,"link":value.link||"","tip":value.tip||""});
	});
	$(".applist").append(li);
	this._bindEvent();
	//tipCookie && (tipType != tipCookie) && resetCookie( "sideBarRedIcon" );
	$(".applist-i").each(function(i){
		var visibitily = false;
		$(this).text().length && (visibitily = that.bubble.getBubbleVisibility( that.tipOption,"sideBarRedIcon" ));				
		!visibitily && $(this).text("");
		that.bubble.handleVisibel($(this),$(this).text());
	});
};

leftSideIcon.prototype.changeIconStatus = function( el,st ){
	var el = el || $(".applist-li"),
		arrow = el.find("b");
	//选中效果
	if( st === "selected" ){
		el.attr("isflod","true");
		el.removeClass("applist-li_fold");
		arrow.show();
	//hover效果
	} else if ( st === "hover" ) {
		el.addClass("applist-li_fold");
	//默认状态
	} else {
		el.removeClass("applist-li_fold");
		el.attr("isflod","");
		arrow.hide();
	}
};
leftSideIcon.prototype.getMessages = function(){
	var result = 0;

	$(".applist-li").find("i").each(function(i){
		var text = $.trim($(this).text()),
			num;

		if( !text.length ){
			return true;
		} else {
			num = parseInt( text,10 );
			if( !num && num !== 0  ) {
				result = "•••";
				return false;
			} else {
				result = num + result;
			}
		}	
		
	});
	
	return result;

}

module.exports = leftSideIcon;
