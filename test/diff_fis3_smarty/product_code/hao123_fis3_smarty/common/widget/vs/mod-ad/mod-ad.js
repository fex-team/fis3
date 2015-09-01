/**
 * author : Wang,Wei(Int'l PM)<wangwei33@baidu.com>
 */
(function($){
	var admod = {
		init:function(){
			var that = this;
			that.box = $(".adlist-mod");
			that.defaultTimes = 3000;
			that.modtype = "intervalOrder";
			that.bindEvent();
		},
		bindEvent:function(){
			var that = this;
			that.box.each(function(){
				var ele = this;
				ele.adIndex = 0;
				ele.adLength = $(ele).children().length;

				if(ele.adLength > 1){
					ele.times =   $(ele).attr("data-time");
					ele.modtype = $(ele).attr("data-type");
					//设置默认值
					ele.times = ele.times?parseInt(ele.times):that.defaultTimes;
					ele.modtype = ele.modtype?ele.modtype:that.modtype;

					ele.timer = setInterval(function(){
						that[ele.modtype].call(ele);
					},ele.times);
				}
			});
			that.hoverBind();
		},
		hoverBind:function(){
			var that = this;
			that.box.hover(function(){
				if(this.timer){
					clearInterval(this.timer);
					this.timer = null;
				}
			},function(){
				var ele = this;
				if(ele.adLength > 1){
					ele.timer = setInterval(function(){
						that[ele.modtype].call(ele);
					},ele.times);
				}
			})
		},
		intervalRandom:function(){
			this.adIndex = Math.floor(Math.random()*this.adLength);
			admod.changeEle.call(this);
		},
		intervalOrder:function(){
			if(this.adIndex === this.adLength - 1){
				this.adIndex = 0;
			}else{
				this.adIndex++;
			}
			admod.changeEle.call(this);
		},

		changeEle:function(){
			$(this).children(':visible').hide();
			$(this).children().eq(this.adIndex).show();
		}
	};
	admod.init();

})(jQuery);