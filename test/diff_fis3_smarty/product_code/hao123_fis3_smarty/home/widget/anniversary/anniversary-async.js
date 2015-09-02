/**
 * 两周年纪念活动
 * @author chenliang
 * @time 2013.11.29
 * @email chenliang08@baidu.com
 */

var $ = require( "common:widget/ui/jquery/jquery.js" ),
	UT = require( "common:widget/ui/ut/ut.js" ),
	Helper = require( "common:widget/ui/helper/helper.js" ),
	Bubble = require( "common:widget/ui/bubble/src/bubble.js" ),
	Time = require( "common:widget/ui/time/time.js" );

function Anniversary(){
	var that = this;
	that.opt = conf.anniversary;
	// 记录任务是否完成
	that.missionFinished = false;
	that.bubble = null;
	that.urlParam = Helper.getQuery();
	that.curMission = that.getMission();
	that.curMissionOpt = that.opt[that.curMission];
	that.curMissionMod = $( that.curMissionOpt.targetMod );
	that.id = null;
	that.btn = null;
	that.container = null;
	that.missionCookie = $.cookie( that.curMission );
	// 时间戳
	that.expiredTime = null; 

	if( that.curMission && !that.missionCookie ){
		var targetMod = that.getTargetMod();
		// 监控目标模块是否已经加载，目标模块加载之后再初始化活动
		$.when( targetMod ).done( function(){
			that.init();
		} );
	}
}

Anniversary.prototype = {

	/**
	 * 初始化执行绑定事件、绑定统计、定位、显示行为
	 */
	init : function(){

		var that = this,
			initBubble = that.initBubble();

		that.initDom();
		that.bindEvent();
		that.show();
		// $(function(){
		that.relocation( that.curMissionMod, that.bubble );
		// });
	},
	/**
	 * 获取活动目标，可能目标加载的较晚，所以使用setInterval获取
	 * 该方法为异步方法，依赖该方法执行时，需要$.when()进行监控
	 */
	getTargetMod : function(){
		var that = this,
			target = that.curMissionMod,
			deferred = $.Deferred(),
			timer;

			if( target.length < 1 ){
				timer = setInterval( function(){
					target = that.curMissionMod = $( that.curMissionOpt.targetMod );
					if( target.length ){
						clearInterval( timer );
						deferred.resolve();
					}
				}, 500 );
			}else{
				deferred.resolve();
			}

			return deferred.promise();
	},
	/**
	 * 重定位
	 */
	relocation : function( elem, bubble ){

		var win = $( window ),
			winHeight = win.height(),
			navOffset = elem.offset().top,
			bubbleHeight = bubble.height(),
			focusEle = $( "*:focus" ),
			timer,
			times = 0,
			maxTimes = 100;
		// 因为浏览器会自动定位到focus的元素，因此需要获取到focus的元素，取消focus
		timer = setInterval( function(){
			// 如果没找到这个元素，或者没有超过最大尝试次数
			if( focusEle.length < 1 && times < maxTimes ){
				focusEle = $( "*:focus" );
				times ++;

			}else{
				// 找到这个元素后取消focus
				focusEle.blur();
				navOffset = elem.offset().top;
				// if( navOffset > winHeight - bubbleHeight ){
				// 	$( "html,body" ).scrollTop( navOffset - 100 );

				// }else 
				// 

				if( elem.css( "position" ) !== "fixed" ){
					// console.log( navOffset );
					$( window ).scrollTop( navOffset - 200 );
				}
				
				clearInterval( timer );
			}
			
		}, 30 );
	},
	/**
	 * 从url上获取到任务，得到一个叫mission的参数的值
	 * @return {string} 任务名称
	 */
	getMission : function(){
		return this.urlParam.mission;
	},
	/**
	 * 初始化气泡
	 * 使用了common中的气泡组件 @光印
	 */
	initBubble : function(){
		var that = this;

		that.bubble = that.curMissionMod.bubble( {
			wrapOpt : {
				modId : that.curMissionOpt.modId,
				content : that.curMissionOpt.text,
				direc : that.curMissionOpt.arrowDir,
				before : "<i class='decorate'></i>"
			},
			btnOpt : {
				content : that.curMissionOpt.btnText
			},
			pos : {
				left : parseInt( that.curMissionOpt.left ),
				top : parseInt( that.curMissionOpt.top )
			},
			callback : {
				"ui-bubble_close" : function(){
					var expiresTime = that.getExpiredTime();
					that.bindLog( that.curMission, "closer");

					$.when( expiresTime ).done( function(){
						$.cookie( that.curMission , 1, {expires: that.expiredTime});
					} );
				},
		        "ui-btn": function( wrap, e ) {
		        	var expiresTime = that.getExpiredTime();

		            that.hide();
		            that.bindLog( that.curMission, "btn" );

					$.when( expiresTime ).done( function(){
						$.cookie( that.curMission , 1, {expires: that.expiredTime});
					} );
		            // 发送完请求时会跳转页面，所以最后执行
		            that.sendAjax();
		        }
			}
		} );
	},
	/**
	 * 该方法负责在气泡初始化之后，为anniversary初始化一些对DOM元素生成的jQuery对象的引用
	 */
	initDom : function(){
		this.id =$( "#bubble" + this.curMissionOpt.modId );
		this.btn = this.id.find( ".ui-btn" );
		this.container = this.id.find( ".ui-bubble_t" );
	},
	/**
	 * 获取服务器时间0:00时间点的date对象，客户端并不一定是0:00，写到全局属性里
	 * 该方法为异步方法，依赖该方法执行时，需要$.when()进行监控
	 * @return promise {Oject} 
	 */
	getExpiredTime : function(){

		var that = this,
			deferred = $.Deferred();

		Gl.time.getTime( function(){

			var serverD = Gl.serverNow || new Date(),
				year = serverD.getFullYear(),
				month = serverD.getMonth(),
				day = serverD.getDate(),
				nextDay = new Date( year, month, ( day + 1 ), 00, 00, 00 ),
				clientD = new Date(),
				timeStamp = clientD.getTime() + ( nextDay.getTime() - serverD.getTime());
				resDay = new Date(),
				resDay.setTime( timeStamp ),
				that.expiredTime = resDay,
				deferred.resolve();
		} );

		return deferred.promise();
	},
	/**
	 * 进行了定位等初始化之后，将弹出框显示出来
	 */
	show : function(){
		this.bubble.show();
	},
	/**
	 * 隐藏弹出框
	 */
	hide : function(){
		this.bubble.hide();
	},
	/**
	 * 发送一条信息给后台 @晓坤、天宇
	 */
	sendAjax : function(){
		var that = this,
			api = this.opt.api,
			country = conf.country,
			uid = this.urlParam.uid,
			anoReset = this.urlParam.anoreset,
			anoTask = this.urlParam.anotask,
			app = this.urlParam.app;
		// 通知后端任务完成
		var finishTask = $.ajax( {
			url : conf.apiUrlPrefix + "?app=" + app + "&act=finishTask&ano=" + anoTask + "&country=" + country + "&uid=" + uid + "&jsonp=?",
			dataType : "jsonp",
			cahce : false
		} );
		// 通知后端重置抽奖
		var reset = $.ajax( {
			url : conf.apiUrlPrefix + "?app=" + app + "&act=reset&ano=" + anoReset + "&country=" + country + "&uid=" + uid + "&jsonp=?",
			dataType : "jsonp",
			cahce : false
		} );
		// 本页跳转，需要等上面两个ajax请求都成功完成后再跳转，所以需要监听这两个请求
		$.when( finishTask, reset ).done( function(){
			that.toOtherPag();
		} );
	},
	/**
	 * 跳转到其它页面
	 */
	toOtherPag : function( url ){
		window.location = this.opt.activityPage;
		// window.open( this.opt.activityPage );
	},
	/**
	 * 切换气泡中的内容
	 */
	changeBubbleStatus : function(){
		var bubbleOpt = this.curMissionOpt,
			text = bubbleOpt.text,
			finishedText = bubbleOpt.finishedText;

		if( this.missionFinished ){
			this.container.text( finishedText );
			this.btn.addClass( "show" );

		}else{
			this.container.text( text );
			this.btn.removeClass( "show" );
		}
	},

	bindEvent : function(){
		var that = this;

		$( that.curMissionMod ).on( "click", that.curMissionOpt.target, function(){
			that.missionFinished = true;
			that.changeBubbleStatus();
		} );
	},

	bindLog : function( position, sort ){
		UT.send({
			type : "click",
			modId : "anniversary",
			position : position,
			sort : sort
		});
	}
}

module.exports = Anniversary;