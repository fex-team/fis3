var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var scroll = require("common:widget/ui/scrollable/scrollable.js");

var sidebarShop = function(){
	var opt = conf.sidebarShop,
		id = opt.id;
	if( !id ) return;
	var mod = $( "#" + id ),
		content = mod.find( ".shop-content" ),
		searchForm = mod.find( ".shop-search form" ),
		searchBtn = searchForm.find( ".shop-btn" ),
		searchInput = searchForm.find( ".shop-input" );

	function init(){
		initScroll();
		bindEvent();
		bindLog();
	}
	function bindEvent(){
		searchBtn.on( "click", function( e ){
			submitSearch();
		} );
		$( document ).on( "keydown", function( e ){
			if( e.which == 13 && searchInput.is( ":focus" ) ){
				e.preventDefault();
				submitSearch();
			}
		} );
	}
	function submitSearch(){
		var text = searchInput.val(),
			url = opt.searchUrl;
		searchForm.attr( "action", url + text + ".html" );
		searchForm.submit();
	}
	function bindLog(){	
		searchForm.on( "submit", function(){
			var text = searchInput.val();
			UT.send( {
				modId : "sidebar-shop",
				position : "submit",
				ac : "b",
				sort : text ? text : "null"
			} );
		} );
		
	}
	function initScroll(){
		content.scrollable( {
			autoHide:false,
			dir:conf.dir,
			onWheel: function(){
				content.trigger( "scrollBar" );
			},
			onScroll: function(){
				// scrollToBottom
				if(this.state.y == -this.state._y){
					content.trigger( "scrollToBottom" );
				}
			},
			onEndDrag: function(){
				// log -> 滚动条拖动和点击统计
				content.trigger( "dragBar" );
			}
		} );
		content.one( "scrollBar", function(){
			UT.send( {
				modId : "sidebar-shop",
				position : "scrollbar",
				sort : "scroll",
				type : "other"
			} );
		} );
		content.one( "scrollToBottom", function(){
			UT.send( {
				modId : "sidebar-shop",
				position : "scrollbar",
				sort : "scrollToBottom",
				type : "other"
			} );
		} );
		content.one( "dragBar", function(){
			UT.send( {
				modId : "sidebar-shop",
				position : "scrollbar",
				sort : "dragBar",
				type : "other"
			} );
		} );
	}
	return init;
}();

module.exports = sidebarShop;