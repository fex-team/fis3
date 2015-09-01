var $ = require( "common:widget/ui/jquery/jquery.js" );
var modNews = require( "home:widget/news/mod-news.js" );
var helper = require('common:widget/ui/helper/helper.js');
var cycletabs = require('common:widget/ui/cycletabs/cycletabs.js');
var Bubble = require( "common:widget/ui/bubble/src/bubble.js" );
var UT = require('common:widget/ui/ut/ut.js');
require( "common:widget/ui/scrollable/scrollable.js" );


var SidebarVote = function( conf ){
	var that = this;
	that.conf = conf;
	that.id = that.conf.id;
	that.mod = $( "#" + that.id );
	that.tabs = that.mod.find( ".tabs" );
	that.allTab = that.tabs.find( ".tab" );
	that.loading = that.mod.find( ".ui-o" );
	that.container = that.mod.find( ".vote-container" );
	that.allContent = that.container.find( ".content" );
	that.bubbleHtml = '<div class="bubble-sidebar-vote">'
				+	'<b class="ui-arrow bubble_out"></b>'
    			+	'<b class="ui-arrow bubble_in"></b>'
				+	'<span class="sidebar-vote-bubble-info">'
				+	'</span>'
				+'</div>';
	that.shouldShow = that.allContent.eq( 0 );
	that.init( that.conf );
};

SidebarVote.prototype = {
	init : function( conf ){
		var that = this;
		that.changeTab( 0 );
		that.bindEvent();
		that.initBubbleContainer();
	},
	bindEvent : function(){
		var that = this;
		that.tabs.on( "click", ".tab", function( e ){
			var curTab = $( this ),
				index = that.allTab.index( curTab );
				type = curTab.attr( "data-type" );
			that.changeTab( index );
			UT.send( {
				modId : "sidebar-vote",
				position : "tab",
				sort : type
			} );
		} );
	},
	changeTab : function( index ){
		var that = this,
			curTab = that.allTab.eq( index );
			// curTab = that.tabs.find( "." + type );
		that.allTab.removeClass( "current" );
		curTab.addClass( "current" );
		that.shouldShow = that.allContent.eq( index );
		that.changeContent( index );
	},
	changeContent : function( index ){
		var that = this,
			deferred = $.Deferred(),
			curContent = that.allContent.eq( index ),
			render = that.render( index );
			// curContent = that.container.find( "." + type );
		that.allContent.hide();
		that.loading.show();
		$.when( render )
			.done( function(){
				that.shouldShow.show();
				that.loading.hide();
			} )
			.fail( function(){
			} );
	},
	render : function( index ){
		var that = this,
			deferred = $.Deferred(),
			curConf = that.conf.items[index],
			curContent = that.allContent.eq( index ),
			curHtml = "",

			//异步获取新闻模块的数据
			api = curConf.api,
			type = curConf.type,
			gotData;
		if( curContent.hasClass( "renderred" ) ){
			deferred.resolve();
			return;
		}
		// 渲染新闻模块
		if( api ){
			gotData = that.getData( ( curConf.apiPre ? curConf.apiPre : conf.apiUrlPrefix ) + api + "&jsonp=?" );
			$.when( gotData )
				.done( function( data ){
					that.renderNews( index, data["15"] );
					curContent.addClass( "renderred" );
					deferred.resolve();
				} )
				.fail( function(){
					deferred.reject();
				} );
		// 渲染政党模块
		}else{
			that.renderParty( index, curConf.containerItems );
			curContent.addClass( "renderred" );
			deferred.resolve();
		}
		return deferred.promise();
	},
	// 模板不通用，只能单独拼, 新闻
	renderNews : function( index, data ){
		var that = this,
			curContent = that.allContent.eq( index ),
			containerTpl = '<div class="new-container">'
						+		'<div class="new-content">'
						+			'<div class="news-slide">'
						+			'</div>'
						+			'<ul class="news-items">'
						+			'</ul>'
						+		'</div>'
						+	'</div>',
			tpl =   '<li class="news-item item-text">'
				+		'<a href="#{url}" data-sort="news" class="news-text">'
				// +			'<img src="#{img}" title="#{title}" alt="#{title}" />'
				+			'<span>#{title}</span>'
				+			'<i class="#{icon}"></i>'
				+		'</a>'
				+		'<p class="news-des">#{formatedTime}</p>'
				+	'</li>',

			html = "",

			i = 0,
			len = data.length,
			// 剔除了没有图片的新闻生成的新数组
			// newData = [],
			slideData = [],
			bubbles = [];

		init();

		function init(){
			renderNewsContainer();
			renderNewsList();
			initscrollBar();
			bindEvent();
		}
		function bindEvent(){
			curContent.on( "mouseenter", ".news-item", function(){
				var index = curContent.find( ".news-item" ).index( $(this) );
				showBubble( index );
			} ).
			on( "mouseleave", ".news-item", function(){
				var index = curContent.find( ".news-item" ).index( $(this) );
				that.bubbleContainer.hide();
			} );
		}
		function renderNewsContainer(){
			curContent.html( containerTpl );
		}
		function renderNewsList(){
			var newsContainer = curContent.find( "ul" ),
				html = "",
				n;

			for( ; i<len; i++ ){
				if( i%4 == 0 ){
					var index = Math.floor( Math.random() * 4 );
					data[i+index].icon = "icon-hot"
				}

				data[i].formatedTime = formatTime( data[i].updateTime );
				html += helper.replaceTpl( tpl, data[i] );
			}
			newsContainer.html( html );
		}
		function initscrollBar(){
			var scrollContainer = curContent.find( ".new-content" );
			scrollContainer.scrollable();
		}
		function formatTime( timestamp ){
			var date = timestamp ? new Date( parseInt( timestamp ) * 1000 ) : "",
				res = "";
			if( !!date ){
				var year = date.getFullYear(),
					month = date.getMonth(),
					day = date.getDate(),
					hour = date.getHours(),
					minute = date.getMinutes();
				res = formatNumber( day ) + "/" + formatNumber( month + 1 ) + "/" + year + " " + formatNumber( hour ) + ":" + formatNumber( minute );
			}
			return res;
		}
		//保证数字时两位数,产出单个字符串的数组如：[0,9]
		function formatNumber( number ){
			var res = ( parseInt( number ) + 100 ).toString().split( "" );
			res = res.slice( 1, res.length );
			return res.join( "" );
		}
		function showBubble( index ){
			var text = data[index].description,
				curNews = curContent.find( ".news-item" ).eq( index ),
				container = that.bubbleContainer,
				arrowIn = container.find( ".bubble_in" ),
				arrowOut = container.find( ".bubble_out" ),
				offset = curNews.offset(),
				win = $( window ),
				containerH;
			if( !text || window.hao123 && window.hao123.atRightSide ){
				return;
			}
			container.find( ".sidebar-vote-bubble-info" ).html( text );
			containerH = container.height();
			if( win.height() < offset.top - win.scrollTop() + containerH ){
				var arrowTop = 32 + offset.top - win.scrollTop() + containerH - win.height() +  "px",
					bubbleTop;
				arrowIn.css( "top", arrowTop );
				arrowOut.css( "top", arrowTop );
				bubbleTop = win.height() - containerH - 20;
			}else{
				arrowIn.css( "top", "12px" );
				arrowOut.css( "top", "12px" );
				bubbleTop = offset.top - win.scrollTop();
			}

			container.css( { left : offset.left + 290, top : bubbleTop } );
			container.show();
		}
	},
	// 模板不通用，拼装政党
	renderParty : function( index, data ){
		var that = this,
			curContent = that.allContent.eq( index ),
			tpl =   '<li class="party-item">'
				+		'<a href="#{link}" data-sort="party">'
				+			'<img src="#{imgSrc}" />'
				+			'<span class="party-name">#{name}</span>'
				+		'</a>'
				+	'</li>',
			html = '<ul class="party-items cf">',
			i = 0,
			len = data.length,
			lists;

		init();
		function init(){
			createContent();
			bindEvent();
		}
		function createContent(){
			for( ; i<len; i++ ){
				html += helper.replaceTpl( tpl, data[i] );
			}

			html += '</ul>';
			curContent.html( html );
			lists = curContent.find( ".party-item" );
		}
		function bindEvent(){
			curContent.on( "mouseenter", ".party-item", function(){
				var index = curContent.find( ".party-item" ).index( $( this ) );
				showBubble( index );
			} ).on( "mouseleave", ".party-item", function(){
				that.bubbleContainer.hide();
				that.bubbleContainer.removeClass( "top bottom" );
			} );
		}
		function showBubble( index ){
			var text = data[index].des,
				curParty = curContent.find( ".party-item" ).eq( index ),
				container = that.bubbleContainer,
				offLeft = 25,
				offTop = 75,
				win = $( window ),
				className = "top",
				offset = curParty.offset(),
				arrowIn = container.find( ".bubble_in" ),
				arrowOut = container.find( ".bubble_out" ),
				containerH;
			if( !text || window.hao123 && window.hao123.atRightSide ){
				return;
			}

			container.find( ".sidebar-vote-bubble-info" ).html( text );
			containerH = container.height()
			if( win.height() < offset.top - win.scrollTop() + containerH + 100 ){
				className = "bottom";
				offTop = - containerH - 37;
			}
			container.addClass( className );
			if( container.hasClass( "top" ) ){
				arrowIn.css( "top", "-14px" );
				arrowOut.css( "top", "-15px" );
			}else if( container.hasClass( "bottom" ) ){
				arrowIn.css( "top", containerH+30 + "px" );
				arrowOut.css( "top", containerH+31 + "px" );
			}
			container.css( { left : offset.left + offLeft, top : ( offset.top + offTop - win.scrollTop() )} );
			container.show();
		}
	},
	initBubbleContainer : function (){
		var that = this;
		$( "body" ).append( that.bubbleHtml );
		that.bubbleContainer = $( ".bubble-sidebar-vote" );
	},
	getData : function( url ){
		var that = this,
			deferred = $.Deferred();
		$.ajax( {
			url : url,
			dataType : "jsonp"
		} ).done( function( data ){
			var d = data.message.errNum > 0 ? data.content.data.contents : [];
			deferred.resolve( d );
		} ).fail( function(){
			deferred.reject();
		} );
		return deferred.promise();
	}
};
module.exports = SidebarVote;
