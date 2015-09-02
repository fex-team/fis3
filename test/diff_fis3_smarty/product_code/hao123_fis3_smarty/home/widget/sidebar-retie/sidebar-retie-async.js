var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");
var scroll = require("common:widget/ui/scrollable/scrollable.js");

var SidebarRetie = function( opt ){
	var that = this;
	that.opt = opt;
	that.id = opt.id;
	that.mod = $( "#" + that.id );
	that.container = that.mod.find( ".reties" );
	that.loading = that.mod.find( ".ui-o" );
	that.init();
}

SidebarRetie.prototype = {
	init : function(){
		var that = this;
		that.render();
		that.bindEvent();
		that.initScrollBar();
	},
	bindEvent : function(){
		var that = this;
	},	
	getData : function(){
		var that = this,
			url = ( that.opt.apiPre ? that.opt.apiPre : conf.apiUrlPrefix ) + that.opt.api + "&jsonp=?",
			deferred = $.Deferred();

		$.ajax( {
            url: url,
            dataType: "jsonp"
        } ).done( function( data ){
        	if( data.message.errNum > 0 ){
        		data = data.content.data;
        	}else{
        		data = [];
        	}
        	deferred.resolve( data );
        } ).fail( function(){
        	deferred.reject();
        } );
        return deferred.promise();
	},
	render : function(){
		var that = this,
			deferred = $.Deferred(),
			gotData = that.getData(),
			html = "";
		$.when( gotData )
			.done( function( data ){
				html = that.pieceHtml( data );
				that.container.html( html );
				that.loading.hide();
			} );
	},
	pieceHtml : function( data ){
		var that = this,
			tpl = 	'<li class="retie-item">'
				+ 		'<a class="retie-link" href="#{url}" data-sort="#{index}">'
				+			'<div class="retie-head cf">'
				+				'<span class="retie-time">#{date}</span>'
				+				'<span class="retie-reply">'
				+					'<span class="reply-text">#{replay}</span>'
				+					'<span class="reply-num">#{reply}<i class="trigger"></i></span>'
				+				'</span>'
				+  			'</div>'
				+			'<p>#{title}</p>'
				+			'<i class="#{hot}"></i>'
				+   	'</a>'
				+  	'</li>',
			length = data.length,
			i = 0,
			resHtml = "",
			tmpArr = that.opt.hot.split( "," );
			// 检测当前条是否PM配置了hot图标
			checkHot = function( i ){
				var res = false,
					n = 0,
					len = tmpArr.length;
				for( ; n<len; n++ ){
					if( ( i+1 ) == parseInt( tmpArr[n] ) ){
						res = true;
						break;
					}
				}
				return res;
			};

		for( ; i<length; i++){
			var curData = data[i];
			curData.index = i+1;
			curData.replay = that.opt.replay;
			curData.hot = ( checkHot( i ) ||  curData.hot == "1" ) ? "hot" : "";
			curData.date = that.formatTime( curData.date );
			resHtml = resHtml + helper.replaceTpl( tpl, data[i] );
		}
		
		return resHtml;
	},

	initScrollBar : function(){
		var that = this;
		that.container.scrollable({
			autoHide:false,
			dir:conf.dir
		});
	},
	formatTime : function( timestamp ){
		var that = this,
			resStr,
			time = parseInt( timestamp ),
			formatNumber = that.formatNumber,
			then = new Date( time * 1000 ),
			now = new Date(),
			thenYear = then.getFullYear(),
			thenMonth = then.getMonth(),
			thenDay = then.getDate(),
			thenHour = then.getHours(),
			thenMinute = then.getMinutes(),
			nowYear = now.getFullYear(),
			nowMonth = now.getMonth(),
			nowDay = now.getDate();
		if( thenYear === nowYear && thenMonth === nowMonth && thenDay === nowDay ){
			resStr = that.opt.today + " " + formatNumber( thenHour ) + ":" + formatNumber( thenMinute );
		}else if( thenYear === nowYear && thenMonth === nowMonth && thenDay === nowDay - 1 ){
			resStr = that.opt.yesterday + " " + formatNumber( thenHour ) + ":" + formatNumber( thenMinute );
		}else{
			resStr = formatNumber( thenDay ) + "-" + formatNumber( thenMonth + 1 ) + "-" + thenYear + " " + formatNumber( thenHour ) + ":" + formatNumber( thenMinute );
		}
		return resStr;
	},
	//保证数字时两位数,产出单个字符串的数组如：[0,9]
	formatNumber : function ( number ){
		var res = ( parseInt( number ) + 100 ).toString().split( "" );
		res = res.slice( 1, res.length );
		return res.join( "" );
	}
};

module.exports = SidebarRetie;