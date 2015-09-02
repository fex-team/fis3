/**
 * 处理有tab的情况（有tab就不会有快速导航）
 * @author chenliang
 * @email chenliang08@baidu.com
 * @time 2013/12/25
**/
var $ = require("common:widget/ui/jquery/jquery.js"),
	UT = require("common:widget/ui/ut/ut.js"),
	helper = require("common:widget/ui/helper/helper.js"),
	message = require("common:widget/ui/message/src/message.js");

function SortArea(){
	var that = this;

	$.cookie( "supportCookie", true );
	that.supportCookie = !!jQuery.cookie( "supportCookie" );

	that.opt = conf.sortArea;
	that.tabOpt = that.opt.sortAreaTab;
	that.mod = $( "#" + that.opt.id );
	that.tabs = that.mod.find( ".tabs" );
	that.tabList = that.tabs.find( ".tab-item" );
	that.container = that.mod.find( ".container" );
	that.content = that.container.find( ".content" );
	that.loadingFlower = that.container.find( ".loading" );
	// PM配置特殊字段(强制切换到某tab) > cookie > PM配置 > 默认（默认展示第一个tab）
	that.shouldShow = that.opt.forceShow || ( that.supportCookie && $.cookie( "sortTab" ) ) || that.opt.defaultShow || that.tabList.eq( 0 ).attr( "data-id" );
	that.sendingAjax = {};
	// 获取到的页面片段会存放到这里。会造成内存浪费吗？有必要吗？
	// that.dataCache = {};
	that.init();
}

SortArea.prototype = {
	/**
	 * 入口（根据不同情况进行初始化）
	 **/
	init : function(){
		var that = this,
			// 用户是否来自特殊渠道
			isFromSpecialTn = that.opt.spcTn && that.checkTn(),
			spcTnShowWhich = that.opt.spcTnShowWhich,
			isCurrentTab;

		// 先绑定统计事件，再绑定业务事件。不要调整顺序，否则统计会出错
		that.bindLog();
		that.bindEvent();
		// 如果来自特殊tn号，自动打开PM配置的tab，并自动重新定位
		if( isFromSpecialTn && spcTnShowWhich ){
			// 特殊tn > cookie
			that.shouldShow = spcTnShowWhich;
			// DOM ready之后再重新定位，减少因搜索框focus导致的重定位失效
			$( function(){
				that.relocation();
			} );
		}
		// 应该显示的是已经是正在显示的
		isCurrentTab = that.tabList.filter( "." + that.shouldShow ).hasClass( "current" );
		if( !isCurrentTab ){
			that.changeTab( that.shouldShow, false );
		}
	},
	/**
	 * 为tab绑定事件
	 **/
	bindEvent : function(){
		var that = this;
		that.tabs.on( "click", ".tab-item", function(){
			var thisTab = $( this ),
				tab = that.shouldShow = thisTab.attr( "data-id" ),
				isCurrentTab = thisTab.hasClass( "current" ),
				thisTabOpt = that.tabOpt[tab];
			// 如果用户点击的是当前tab，并且有相应的二级页，新窗口打开二级页
			if( isCurrentTab ){
				if( !thisTabOpt.noLv2 ){
					that.toLv2Page( tab, thisTabOpt.lv2Url );
				}
			}else{
				that.changeTab( tab, true );
				that.relocation();
				$.cookie( "sortTab", tab, { expires : 1800 } );
			}
		} );
	},
	/**
	 * 处理tab的样式切换，同时触发内容切换
	 * @param tab{string}
	 * @param isClick{boolean} 是否用户点击
	 */
	changeTab : function( tab, isClick ){
		var that = this;
		that.tabList.removeClass( "current" );
		that.tabList.filter( "." + tab ).addClass( "current" );

		if( !isClick ){
			// 如果用户对默认切换到的内容区有操作，模拟一次tab切换（没有进行真正的tab切换，只是为了发送一条统计信息）（排除第一个tab（分类区））
			that.content.not( ":first" ).filter( "." + tab ).one( "click", function(){
				that.tabList.filter( "." + tab ).trigger( "simulateClick" );
			} );
		}

		that.changeContent( tab );
	},
	/**
	 * 切换内容
	 * @param tab{string} tab的类型（和tab模板中的data-type一致）
	 */
	changeContent : function( tab ){
		var that = this,
			isRenderred = that.render( tab ),
			timer;
		that.hideContents();
		that.showLoadingFlower();
		// that.hideLoadingFlower不能放到always中，因为always中的方法是放到done或fail中的代码执行之后执行
		$.when( isRenderred )
			.done( function(){
				that.hideLoadingFlower();
				that.showContent( that.shouldShow );
			} )
			.fail( function(){
				that.hideLoadingFlower();
				// do something else
			} );
		// 如果是需要调用createContent-async.js的情况，例如日本购物
		timer = setInterval( function(){
			if( that.opt.clildModuleReady[tab] === "true" ){
				that.mod.trigger( "sortArea.tabClicked_" + tab );
				clearInterval( timer );
			}else if( that.opt.clildModuleReady[tab] === "false" ){
				clearInterval( timer );
			}
		}, 16 );
	},
	/**
	 * 渲染内容，但不显示
	 * @param tab{string}
	 */
	render : function( tab ){
		var that = this,
			deferred = $.Deferred(),
			content = that.content.filter( "." + tab ),
			gotData = null,
			isRenderred = content.hasClass( "renderred" ),
			data;
		// 如果渲染了，直接标记渲染成功
		if( isRenderred ){
			deferred.resolve();
		}else{
			// 如果没有渲染，先去获取数据
			gotData = that.getData( tab );
			$.when( gotData )
				// 如果获取成功
				.done( function( data ){
					// data = that.dataCache[tab];
					// 如果数据为空，标记渲染失败
					if( $.isEmptyObject( data ) ){
						deferred.reject();
					}else{
						content.html( data.html );
						helper.globalEval( data.script );
						content.addClass( "renderred" );
						deferred.resolve();
					}
				} )
				.fail( function(){
					deferred.reject();
				} );
		}
		return deferred.promise();
	},
	/**
	 * 获取数据
	 * @param tab{string}
	 */
	getData : function( tab ){
		var that = this,
			deferred = $.Deferred(),
			thisTabOpt = that.tabOpt[tab],
			timeout = thisTabOpt.timeout,
			updataTime = thisTabOpt.updateTime,
			url = thisTabOpt.api ? thisTabOpt.api : thisTabOpt.url,
			success = function( data ){
				// that.dataCache[tab] = data;
				deferred.resolve( data );
				that.sendingAjax[tab] = false;
			},
			error = function(){
				deferred.reject();
				that.sendingAjax[tab] = false;
			};
		// // 如果缓存中已经有数据，直接返回
		// if( that.dataCache[tab] ){
		// 	deferred.resolve();
		// 	return;
		// };
		that.sendingAjax[tab] = true;
		// 为了防止api长时间获取不到数据影响用户体验。设置超时时间，使api在一定时间内失败，从而去取静态资源
		timeout = ( ( url === thisTabOpt.api ) && timeout ) ? parseInt( timeout ) : 0;
		$.ajax( {
				url : that.setTimeStamp( url, updataTime ),
				dataType : "json",
				timeout : timeout,
				cache : true
		} )
		.done( function( data ){
			success( data );
		} )
		.fail( function(){
			// 如果刚刚是访问api失败，则这次去取静态文件
			if( url != thisTabOpt.url ){
				$.ajax( {
					url : that.setTimeStamp( thisTabOpt.url ),
					dataType : "json",
					cache : true
				} )
				.done( function( data ){
					success( data );
				} )
				.fail( function(){
					error();
				} );
			}else{
				error();
			}
		} );
		return deferred.promise();
	},
	/**
	 * 显示shouldShow的内容
	 * @param tab{string}
	 */
	showContent : function( tab ){
		var that = this;
		that.content.filter( "." + tab ).show();
	},
	/**
	 * 隐藏content中的所有内容
	 * @param tab{string}
	 */
	hideContents : function( tab ){
		var that = this;
		that.content.hide();
	},
	/**
	 * 隐藏菊花
	 */
	showLoadingFlower : function(){
		var that = this;
		that.loadingFlower.show();
	},
	/**
	 * 显示菊花
	 */
	hideLoadingFlower : function(){
		var that = this;
		that.loadingFlower.hide();
	},
	/**
	 * 点击当前tab时，如果该tab有二级页，跳转到相应二级页，否则不进行跳转
	 * @param tab{string}
	 * @param lv2Url{string} 如果有这个参数，说明二级页url和tab id不一致，使用lv2Url，否则使用tab id
	 */
	toLv2Page : function( tab, lv2Url ){
		lv2Url = lv2Url ? lv2Url : tab;
		window.open( "/" + lv2Url + "?from=hao123_tab" );
	},
	/*
	 * 是否来自指定的渠道
	 * PM会配置一个以|分割的字符串，用来区分多个渠道
	 */
	checkTn : function(){
		var that = this,
			spcTn = that.opt.spcTn,
			arr = spcTn.split("|"),
			urlParamTn = ( helper.getQuery() )["tn"],
			bool = false;

		if( !urlParamTn ) return bool;
		for(var i=0, len=arr.length; i<len; i++){
			if(urlParamTn === arr[i] && arr[i] ){
				bool =  true;
				break;
			}
		}
		return bool;
	},
	/**
	 * 为url设置时间戳
	 * @param url {string}
	 * @param [time] {number || string} 为0则每次使用都发生变化，单位是小时，无此参数则默认4小时
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
	},
	/**
	 * 重新定位tab位置
	 * 需要注意定位的时机，搜索框的focus可能会影响重定位的效果（无用户触发的重定位，如日本的特殊tn重定位）
	 */
	relocation : function(){
		var that = this,
			win = $( window ),
			offset = that.mod.offset().top,
			newHeader = that.opt.newHeader,
			isCeiling = that.opt.isCeiling,
			ceilingMore = that.opt.ceilingMore,
			// 判断searchbox是否已经显示到页头中
			isSearchboxCeiled = $( "body" ).hasClass( "header-fixed-up" ),
			// 页头吸顶但是searchbox没有吸顶时使用
			paddingTop = that.opt.paddingTop,
			// 重定位时searchbox没有吸顶，但重定位后searchbox吸顶的情况下使用
			paddingTop1 = that.opt.paddingTop1;
		//判断是否有页头吸顶，解决重定位和页头吸顶的冲突。@光印
		if( newHeader && isCeiling === "1" ){
			if( ceilingMore == "1" && !isSearchboxCeiled ){
				win.scrollTop( offset - ( parseInt( paddingTop1 ) || 140 ) );
			}else{
				win.scrollTop( offset - ( parseInt( paddingTop ) || 35 ) );
			}
		}else{
			win.scrollTop( offset );
		}
	},
	/**
	 * 绑定统计，和业务逻辑分离，单独绑定事件
	 */
	bindLog : function(){
		var that = this;
		that.tabs.on( "click", ".tab-item", function(){
			var elem = $( this ),
				type = $( this ).attr( "data-id" );

			if( elem.hasClass( "current" ) ){
				that.sendLog( "lv2", type );
			}else{
				that.sendLog( "tabs", type );
			}
		} );
		// 当默认切换了tab，且用户对默认切换的tab中的内容有操作时，模拟一次tab点击
		that.tabList.one( "simulateClick", function(){
			that.sendLog( $( this ).attr( "data-id" ) );
		});
	},
	/**
	 * 封装一下发送统计的函数
	 **/
	sendLog : function( position, sort ){
		UT.send( {
			type : "click",
			ac : "b",
			// 保持和重构前统一
			modId : "embedlv2",
			position : position,
			sort : sort
		} );
	}
};

module.exports = SortArea;
