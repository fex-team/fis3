var $ = require("common:widget/ui/jquery/jquery.js");

//轮播插件
var Slide = function(userOptions) {
	var defaultOption = {
		wrapSelector: ".slide-wrap",
		data: [],
		prevNextHtml: '<a href="javascript:;" class="slide-prev hide">&lsaquo;</a><a href="javascript:;" class="slide-next hide">&rsaquo;</a>',
		interval: 0,
		intervalRef: null,
		currentIndex: 1,
		dir: "ltr",
		slideTime: 500,
		showControl: true
	};
	$.extend(this, defaultOption, userOptions);
};

Slide.prototype = {

	constructor: Slide,

	//跳转到下一张图片
	next: function() {
		this.jump(this.currentIndex + 1, "next");
	},

	//跳转到前一张图片
	prev: function() {
		this.jump(this.currentIndex - 1, "prev");
	},

	//跳转图片
	jump: function(index, type) {
		this.stop();
		var data = this.data;
		var dataLen = data.length;
		var cur = this.currentIndex;
		//点击末尾位置(第一张图片的clone)的next
		if (type == "next" && index == dataLen) {
			$(data[dataLen - 1]).addClass("hide");
			$(data[1]).removeClass("hide");
			cur = 1;
			index = 2;
		//点击开头位置(最后一张的clone)的prev
		} else if (type == "prev" && index == -1) {
			$(data[0]).addClass("hide");
			$(data[dataLen - 2]).removeClass("hide");
			cur = dataLen - 2;
			index = dataLen - 3;
		}
		this.lazyloadImg(index);
		//下一张图片在当前图片前
		if (cur > index) {
			this.animateLTR(cur, index);
		} else {
			this.animateRTL(cur, index);
		}
		this.currentIndex = index;
		this.start();
	},

	//图片延迟加载
	lazyloadImg: function(index) {
		var lazyloadItem = $(this.data[index]);
		var lazyloadImg = lazyloadItem.find("img");
		if (!lazyloadImg.src) {
			lazyloadImg.attr("src", lazyloadImg.attr("data-src"));
		}
	},

	//图片从右到左推动
	animateRTL: function(cur, next) {
		var that = this;
		var currentItem = $(this.data[cur]);
		var nextItem = $(this.data[next]);
		nextItem.removeClass("hide");
		//ltr布局流
		if (this.dir == "ltr") {
			this.container.css({
				"width": "200%"
			}).animate({
				"left": "-100%"
			}, this.slideTime, function() {
				currentItem.addClass("hide");
				that.container.css({
					"width": "100%",
					"left": 0
				});
			});
		//rtl布局流
		} else {
			this.container.css({
				"width": "200%",
				"right": "-100%"
			}).animate({
				"right": 0
			}, this.slideTime, function() {
				currentItem.addClass("hide");
				that.container.css({
					"width": "100%"
				});
			});
		}
	},

	//图片从左到右推动
	animateLTR: function(cur, next) {
		var that = this;
		var currentItem = $(this.data[cur]);
		var nextItem = $(this.data[next]);
		nextItem.removeClass("hide");
		//ltr布局流
		if (this.dir == "ltr") {
			this.container.css({
				"width": "200%",
				"left": "-100%"
			}).animate({
				"left": 0
			}, this.slideTime, function() {
				currentItem.addClass("hide");
				that.container.css({
					"width": "100%"
				});
			});
		//rtl布局流
		} else {
			this.container.css({
				"width": "200%"
			}).animate({
				"right": "-100%"
			}, this.slideTime, function() {
				currentItem.addClass("hide");
				that.container.css({
					"width": "100%",
					"right": 0
				});
			});
		}
	},

	//暂停轮播
	stop: function() {
		if (this.interval && this.intervalRef) {
			clearTimeout(this.intervalRef);
		}
	},

	//开始轮播
	start: function() {
		if (this.interval) {
			this.stop();
			this.intervalRef = setTimeout($.proxy(this.next, this), this.interval);
		}
	},

	//事件绑定
	bindEvent: function() {
		var that = this;
		var prevNextEle = $(".slide-prev, .slide-next");
		$(".slide-prev").on("click", function(e) {
			that.prev();
			e.preventDefault();
		});
		$(".slide-next").on("click", function(e) {
			that.next();
			e.preventDefault();
		});
		this.container.on({
			mouseenter: function() {
				prevNextEle.removeClass("hide");
				that.stop();
			},
			mouseleave: function() {
				prevNextEle.addClass("hide");
				that.start();
			}
		});
	},

	//无缝slide需要在最前和最尾添加一张图片
	prepareLoop: function() {
		var data = this.data;
		var len = data.length;
		var firstClone = $(data[0]).clone();
		var lastClone = $(data[len - 1]).clone();
		firstClone.addClass("hide");
		this.container.append(firstClone).prepend(lastClone);
		this.data.push(firstClone.eq(0));
		this.data.unshift(lastClone.eq(0));
	},

	//初始化
	init: function() {
		//图片小于两张时，不适用
		if (this.data.length < 2) {
			return;
		}
		//IE6停用自动轮播，可以手动切换图片
		if (/MSIE 6.0/.test(navigator.userAgent)) {
			this.interval = 0;
		}
		this.container = $(this.wrapSelector);
		//镜像时，左右尖括号取反
		if (this.dir == "rtl") {
			this.prevNextHtml = '<a href="javascript:;" class="slide-prev hide">&rsaquo;</a><a href="javascript:;" class="slide-next hide">&lsaquo;</a>';
		}
		this.prepareLoop();
		//控制按钮的展示
		if(this.showControl) {
			this.container.append(this.prevNextHtml);
		}
		this.bindEvent();
		this.start();
	}
};

module.exports = Slide;