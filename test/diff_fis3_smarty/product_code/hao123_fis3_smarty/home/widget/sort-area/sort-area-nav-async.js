/**
 * 处理有快速导航的情况（有快速导航就不会有tab）
 * 由于该部分并不是重要且复杂的模块，在重构时对其方法没有进行更细致的拆分。
 * @author chenliang
 * @email chenliang08@baidu.com
 * @time 2013/12/28
**/
var $ = require("common:widget/ui/jquery/jquery.js"),
	UT = require("common:widget/ui/ut/ut.js");

function SortAreaNav(){
	var that = this;

	$.cookie( "supportCookie", true );
	that.supportCookie = !!jQuery.cookie( "supportCookie" );

	that.opt = conf.sortArea;
	that.mod = $( "#" + that.opt.id );
	that.navOpt = that.opt.sortAreaNav.opt;
	that.sortsites = that.mod.find( ".sortsite" );
	that.container = that.mod.find( ".sortsites-tabs-container" );
	that.bubble = that.container.find( ".bubble-like" );
	that.refreshBtn = that.container.find( ".sortsites-tabs-refresh" );
	that.tabLists = that.container.find( ".tab-lists" );
	that.init();
}

SortAreaNav.prototype = {
	init : function(){
		var that = this;
		if( that.container.length < 1 ) return;
		// console.log( !$.cookie( "sortsiteBubble" ) );
		if( !!that.navOpt.showBubble && !$.cookie( "sortsiteBubble" ) ){
			that.showBubble();
		}
		that.bindEvent();
	},
	bindEvent : function(){
		var that = this;
		that.refreshBtn.on( "click", function(){
			that.changeList();
		} );
		that.tabLists.on( "click", ".tab-item", function(){
			var thisItem = this;
			// 重构过程中没有对该部分的逻辑进行细分，该方法处理了重定位、该点击对应的分类区样式改变以及发统计。
			that.changeStatus( thisItem );
		} );
		that.bubble.on( "click", "i", function(){
			that.hideBubble();
			$.cookie( "sortsiteBubble", 1, {expires: 2000} );
		} );
		$( document.body ).on( "mousedown", function(){
			that.sortsites.removeClass("select");
		} );
	},
	showBubble : function(){
		this.bubble.css( "display", "block" );
	},
	hideBubble : function(){
		this.bubble.hide();
	},
	changeList : function(){
		var that = this,
			tabList = that.tabLists,
			listLength = -parseInt( tabList.css( "height" ), 10 ),
			top = parseInt( tabList.css( "top" ), 10 ) - 30;
		UT.send( {
			modId : "sortsites",
			position : "sortsitesTabRefresh",
			type: "click"
		} );
		top = ( top == listLength ) ? 0 : top;	
		top == 0 && tabList.css( "top", "30px" );
		!tabList.is( ":animated" ) && tabList.animate( {"top" : top + "px"} );
	},
	changeStatus : function( item ){
		var that = this,
			itemIndex = $( item ).attr( "item-index" ),
			itemOffSet = 0,
			body = $( "body" ),
			win = $( window ),
			// isHeadCeiled = body.hasClass( "header-fixed" ),
			isSearchboxCeiled = body.hasClass( "header-fixed-up" );
			//itemOffSet = (parseInt((index+1)/2,10)-1)*260+420;
		UT.send({
			position: "sortsitesTabItem",
			modId: "sortsites",
			type: "click",
			modIndex: itemIndex
		});		
		that.sortsites.removeClass( "select" );
		that.sortsites.each( function(){
			var $this = $( this );
			if( itemIndex == $this.attr( "log-index" ) ){
				itemOffSet = $this.offset().top;
				$this.addClass( "select" );
				return false;
			}
		} );
		if( that.navOpt.newHeader && that.navOpt.isCeiling === "1" ){
			if( that.navOpt.ceilingMore == "1" && !isSearchboxCeiled ){
				win.scrollTop( itemOffSet - ( parseInt( that.navOpt.paddingTop1 ) || 140 ) );
			}else{
				win.scrollTop( itemOffSet - ( parseInt( that.navOpt.paddingTop ) || 45 ) );
			}
		}else{
			win.scrollTop( itemOffSet - 50 );
		}
	}
};
module.exports = SortAreaNav;