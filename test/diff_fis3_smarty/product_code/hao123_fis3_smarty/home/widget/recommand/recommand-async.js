/**
 * @author chenliang
 * @email chenliang08@baidu.com
 * @time 2013/11/22
**/
var $ = require("common:widget/ui/jquery/jquery.js"),
	UT = require("common:widget/ui/ut/ut.js"),
	Helper = require("common:widget/ui/helper/helper.js");

function Recommand(){

	var that = this;
	that.options = conf.recommand;
	that.mod = $( "#" + that.options.id );
	that.tabs = that.mod.find( ".tabs" );
	that.allTab = that.tabs.find( ".tab" );
	that.container = that.mod.find( ".container" );
	// 应该展示哪个tab
	// 尽量在conf中拿，不要到DOM中取数据，此处想个别的办法
	that.shouldShow = that.allTab.eq( 0 ).attr( "data-type" ); 
	that.loadingFlower = that.mod.find( ".ui-o" );
	that.sendingAjax = {};
	// 用于存放格式化好的数据，数据格式为{"movie" : {"html":"", "script":""}}
	that.contentData = {};

	that.init();
}

Recommand.prototype = {

	init : function(){
		this.bindEvent();
		this.bindLog();
		this.changeTab( this.shouldShow );
	},

	bindEvent : function(){
		var that = this;
		that.tabs.on( "click", ".tab", function(){

			var thisTab = $( this ).attr( "data-type" );
			that.shouldShow = thisTab;
			that.changeTab( thisTab );
		} );
	},
	/**
	 * param tab{string}
	 */
	changeTab : function( tab ){
		var that = this,
			$tab = that.tabs.find( "." + tab );

		that.allTab.removeClass( "cur" );
		$tab.addClass( "cur" );
		that.hideContents();
		that.loadingFlower.show();

		that.changeContent( tab );
	},
	/**
	 * 切换内容区
	 * param tab{string}
	 */
	changeContent : function( tab ){
		var that = this,
			content = that.container.find( "." + tab ),
			isRenderred = that.render( tab );

		// 渲染完成之后显示内容
		$.when( isRenderred )
			.done( function(){
				that.loadingFlower.hide();
				that.showContent();
				// 如果不是通过异步获取到的页面片段，需要触发子模块的js执行
				if( !that.options.options[tab].useAjax ){
					that.triggerChildModule( tab );
				}
			} )
			.fail( function(){
				that.loadingFlower.hide();
				// do something else
			} );
	},
	
	/**
	 * 渲染内容，但不显示
	 * param tab{string}
	 */ 
	render : function( tab ){
		var that = this,
			deferred = $.Deferred(),
			gotFomatedData = null,
			content = that.container.find( "." + tab ),
			isRenderred = content.hasClass( "hasRenderred" );
		// 如果已经渲染了，直接标记为渲染成功
		if( isRenderred ){
			deferred.resolve();
		// 如果还没有渲染，执行渲染并最总标记为渲染成功或失败
		}else{
			// 拿格式化好的数据
			gotFomatedData = that.fomateData( tab );
			// 得到数据之后执行渲染操作
			$.when( gotFomatedData )
				.done( function(){
					var data = that.contentData[tab];
					// 将html插入DOM树
					content.html( data.html );
					// eval js
					Helper.globalEval( data.script );
					// 标记渲染
					that.container.find( "." + tab ).addClass( "hasRenderred" );
					deferred.resolve();
				} )
				.fail( function(){
					deferred.reject();
				} );
		}
		return deferred.promise();
	},
	/**
	 * 格式化数据，将数据格式化为{"movie" : {"html":"", "script":""}}，便于统一处理
	 * @param tab {string}
	 */
	fomateData : function( tab ){
		var that = this,
			deferred = $.Deferred(),
			$tab = that.tabs.find( "." + tab ),
			content = this.container.find( "." + tab ),
			textarea = content.find( "textarea" ),
			opt = this.options.options[tab],
			curData;
		// 如果已经存在了，说明已经格式化过，直接标记为格式化成功
		if( !$.isEmptyObject( that.contentData[tab] ) ){
			deferred.resolve();
		// 否则，拿到数据并格式化，最后标记成功或失败
		}else{
			curData = that.contentData[tab] = {};

			if( textarea.length ){
				// 格式化
				curData["html"] = textarea.text();
				curData["script"] = "";
				deferred.resolve();
				// that.triggerWhenChildModuleReady();

			}else if( opt.useAjax && !that.sendingAjax[tab] ){
				var url = opt.api ? opt.api : opt.url,
					gotData = that.getData( tab );
				// 应该在这里将已经符合格式的数据存入contentData，但是没学会ajax回调传参的方法，汗。。。
				// 所以直接在ajax回调中将数据存入contentData
				$.when( gotData )
					.done( function(){
						deferred.resolve();
					} )
					.fail( function(){
						deferred.reject();
					} );
			}else{
				///
			}
		}
		return deferred.promise();
	},

	/**
	 * @param tab{string} 需要请求数据的是哪个tab
	 */
	getData : function( tab ){
		var that = this,
			opt = this.options.options[tab],
			url = opt.api ? opt.api : opt.url,
			useJsonp = opt.useJsonp,
			updateTime = opt.updateTime || 4,
			deferred = $.Deferred(),
			success = function( data ){
				// 汗。。。。此处应该在上一层函数中完成
				that.contentData[tab] = data;
				deferred.resolve();
				that.sendingAjax[tab] = false;
			},
			error = function(){
				deferred.reject();
				that.sendingAjax[tab] = false;
			};

		that.sendingAjax[tab] = true;

		$.ajax( {
			url :  that.setTimeStamp( url ),
			dataType : useJsonp ? "jsonp" : "json",
			cache : true

		} ).done( function( data ){
			success( data );
		} ).fail( function(){
			// 如果第一次请求的是api，并且存在url，则再次请求url
			if( url !== opt.url ){
				$.ajax( {
					url :  that.setTimeStamp( opt.url ),
					dataType : "json",
					cache : true
				} ).done( function( data ){
					success( data );
				} ).fail( function(){
					error();
				} );
			}else{
				error();
			}
		} );

		return deferred.promise();
	},

	/**
	 * 当点击tab时，检测子模块是否已经准备完毕，并且在子模块绑定了事件之后触发
	 * 是否需要设置setInterval的次数？ 50ms合适吗？
	 * @param tab {string} tab type
	 **/
	triggerChildModule : function( tab ){
		var that = this,
			timer,
			// 为null或undefined表示子模块需要的js还没有加载完成，为"true"表示子模块需要的js加载完成，为"false"表示子模块没有需要的js需要执行
			childModuleStatus = that.options.childModule[tab];

		timer = setInterval( function(){
			// childModule中之所以不用布尔值，是因为不方便在这里做判断
			// "true"表示子模块需要有js执行，而且已经准备完毕
			if( childModuleStatus === "true" ){
				// 触发绑定在window上的每个模块上可能绑定的事件
				that.mod.trigger( "recommand_" + tab );
				clearInterval( timer );
			// "false"表示子模块没有js需要执行
			}else if( childModuleStatus === "false" ){
				clearInterval( timer );
			}
		}, 50 );
	},
	/**
	 * 隐藏说有的内容，以便显示正确的内容
	 */
	hideContents : function(){
		this.container.find(".content").hide();
	},
	/**
	 * 显示最后一个被点击的tab
	 */ 
	showContent : function(){
		this.container.find( "." + this.shouldShow ).show();
	},
	/**
	 * 目前只发tab区的统计
	 * 是否需要统计内容区？？
	 */
	bindLog : function(){
		var that = this,
			tabs = that.tabs;

		tabs.on( "click", ".tab", function(){
			var sort = $( this ).attr( "data-type" );
			that.sendLog( "tabs", sort );
		} );
	},
	sendLog : function( position, sort ){
		UT.send( {
			type : "click",
			ac : "b",
			modId : "recommand-" + sort,
			position : position,
			sort : sort
		} );
	},
	/**
	 * 为url设置时间戳
	 * @param url {string}
	 * @param [time] {number || string} 为0则每次使用都发生变化，单位是小时，无此参数则默认4小时
	 * 这个方法用到很多次，是不是应该放到哪个组件里？？
	 */ 
	setTimeStamp : function( url, time ){
		var timeStamp,
			date = (new Date()).getTime();

		if(parseInt(time) === 0){
			timeStamp = date;
		}else{
			time = time || 4;
			timeStamp = Math.floor(date/(time * 36e5));
		}

		timeStamp = "timeStamp=" + timeStamp;
	    return url.indexOf("?") < 0 ? (url + "?" + timeStamp) : (url + "&" + timeStamp);
	}
};

module.exports = Recommand;