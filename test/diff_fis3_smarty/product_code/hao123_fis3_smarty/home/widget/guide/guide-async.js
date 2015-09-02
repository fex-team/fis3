var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");

//新手引导插件
var Guider = function(options) {
	var defaultOptions = {
		data: [],
		currentIndex: 0,
		buttons: {
			next: "next",
			start: "start",
			close: "<span class='btn-guide-close'>x</span>"
		},
		interval: 0,
		timeoutRef: null,
		contentWidth: 960,
		fadeOutTime: 500,
		slideTime: 1000,
		preloadImg: []
	};
	$.extend(this, defaultOptions, options);

	//获取左偏移量
	//this.left = $(this.benchmark).offset().left; 在IE下和其它模块合并代码执行会在benchmark生成前，换以下方案
	var clientWidth = document.documentElement.clientWidth;
	var contentWidth = this.contentWidth;
	this.left = clientWidth > contentWidth ? (clientWidth - contentWidth) / 2 : 0;
};

Guider.prototype = {

	constructor: Guider,

	//展现引导
	open: function() {
		var len = this.data.length;
		var firstFrame = this.data[0];
		var cur = this.currentIndex;
		//引导内容的html结构
		var contentTpl = "<div class='guide-main-wrap guide-frame#{cur}' id='newUserGuide' data-index='#{cur}' log-mod='new-user-guide' style='left: #{left}px; top: #{top}px;'>" 
			+ " #{closeBtn}"
			+ "	<div class='guide-main'>#{firstFrameContent}</div>" 
			+ "	<div class='guide-btn-wrap'><button class='btn-guide-next'>#{nextBtn}</button></div>" 
			+ "	<div class='guide-progress-wrap'>#{progressContent}</div>" 
			+ "</div>" 
			+ "<div class='guide-mask'></div>";
		var progressContent = "";
		//进度条的html结构
		var progressContentTpl = "<div class='guide-progress guide-progress-#{index}'>"
			+ " <i class='i-frame0 i-progress-line'></i>"
			+ " <i class='i-frame0 i-progress-round'></i>"
			+ " <span class='progress-title'>#{title}</span>"
			+"</div>"
		//以下为添加进度条内容
		for (var i = 0; i < len; i++) {
			progressContent += helper.replaceTpl(progressContentTpl, {
				index: i,
				title: this.data[i].title
			});
		}
		var content = helper.replaceTpl(contentTpl, {
			cur: cur,
			left: this.left,
			top : firstFrame.marginTop,
			closeBtn: this.buttons.close,
			firstFrameContent: firstFrame.content,
			nextBtn: this.buttons.next,
			progressContent: progressContent
		});
		$(document.body).append(content);
	},

	//关闭引导
	close: function() {
		var fadeOutTime = this.fadeOutTime;
		$(".guide-main-wrap").fadeOut(fadeOutTime);
		$(".guide-mask").fadeOut(fadeOutTime);
		this.clearTimeout();
	},

	//跳转到下一帧
	next: function() {
		var len = this.data.length;
		var cur = this.currentIndex;
		var that = this;
		this.clearTimeout();
		//点击时，当前帧不是最后一帧
		if (cur < len - 1) {
			var nextFrame = this.data[cur + 1];
			this.currentIndex++;
			//预加载下一帧图片资源
			this.preLoad();
			//引导内容'推动'效果
			$(".guide-main").animate({
				left: -this.contentWidth
			}, this.slideTime, function() {
				$(this).html(nextFrame.content).css("left", that.contentWidth).animate({ left: 0 }, that.slideTime);
				$(".guide-main-wrap").addClass("guide-frame" + that.currentIndex).removeClass("guide-frame" + (that.currentIndex - 1));
				$(".guide-main-wrap").attr( "data-index", that.currentIndex );
				$(".guide-main-wrap").css( "top", that.data[that.currentIndex].marginTop+"px" );
			});
			//倒数第二帧，清除进度条，显示'start'按钮
			if (cur == len - 2) {
				$(".btn-guide-next").text(this.buttons.start);
				$(".guide-progress-wrap").empty();
			//跟新进度条
			} else {
				$(".guide-progress").eq(cur + 1).addClass("guide-progress-over");
			}
			this.setTimeout();
		//最后一帧点击时，关闭引导
		} else {
			this.close();
		}
	},

	//更新视图区位置
	updatePosition: function() {
		var clientWidth = document.documentElement.clientWidth;
		var contentWidth = this.contentWidth;
		var left = clientWidth > contentWidth ? (clientWidth - contentWidth) / 2 : 0;
		this.left = left;
		$(".guide-main-wrap").css("left", left);
	},

	//设置定时器
	setTimeout: function() {
		if (this.interval) {
			this.timeoutRef = setTimeout($.proxy(this.next, this), this.interval);
		}
	},

	//清除定时器
	clearTimeout: function() {
		if (this.interval && this.timeoutRef) {
			clearTimeout(this.timeoutRef);
		}
	},

	//预加载下一帧图片
	preLoad: function() {
		var cur = this.currentIndex;
		var preloadImg = this.preloadImg
		if(cur < preloadImg.length){
			var img = new Image();
			img.src = preloadImg[cur];
		}
	},

	//绑定事件
	bindEvent: function() {
		var that = this;
		var context = $(".guide-main-wrap");
		$(".btn-guide-close, .btn-guide-start", context).on("click", function() {
			that.close();
		});
		$(".btn-guide-next", context).on("click", function() {
			that.next();
		});
		//if you set window.onresize in IE before the document is completely loaded, it won't work.
		$(window).resize(function(){
			that.updatePosition();
		});
	},
	bindLog : function(){
		var guide = $( "#newUserGuide" ),
			closer = guide.find( ".btn-guide-close" ),
			btn = guide.find( ".btn-guide-next" );

		closer.on( "click", function(){
			sendLog( "closer" );
		} );
		btn.on( "click", function(){
			sendLog( "btn" );
		} );

		function sendLog( sort ){
			UT.send( {
				type : "other",
				ac : "b",
				modId : "newUserGuide",
				position : parseInt( guide.attr( "data-index" ) ) + 1,
				sort : sort
			} );
		}
	},
	//是否为IE6
	checkIE6: function(){
		return /MSIE 6.0/.test(navigator.userAgent);
	},

	//初始化
	init: function() {
		//IE6下效果不好，不予显示
		if(!this.checkIE6()){
			this.preLoad();
			this.open();
			this.bindEvent();
			this.bindLog();
			this.setTimeout();
		}
	}
};

module.exports = Guider;