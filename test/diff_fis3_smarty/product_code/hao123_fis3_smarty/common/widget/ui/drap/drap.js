/*
   @param
	    "id":"drapBox",//元素id
		"direct":"xy",//移动方向
		"move":that.move, //移动的处理方法
		"moveCallback":null,//移动后回调
		"circlimit":true //是否限制在父区域移动


	使用
	var d = new Drap({
    	id:"d",
    	circlimit:false,
    	direct:"x"
    })
    d.enable();
*/
var $ = require("common:widget/ui/jquery/jquery.js");
var uid = 0;

var Drap = function(opts,elem){
	var that = this;

	that.opts = $.extend({
		"direct":"xy",//移动方向
		"move":that.move,
		"moveCallback":null,
		"dragStartCallback":null,
		"dropCallback":null,
		"circlimit":true //是否限制在父区域移动
	},opts);

	that.top = 0;
	that.left = 0;
	that.status = 0;
	uid++;

	//事件命名空间。
	that.eventNamespace = "drag_" + uid;
	that.obj = elem;
};

Drap.prototype = {
	//启用
	enable:function(){
		var that = this;

		that.obj.on("mousedown." + that.eventNamespace,function(e){that.handleEvent(e)});
		$(document).on("mousemove." + that.eventNamespace + " mouseup."+ that.eventNamespace,function(e){that.handleEvent(e)});
	},
	//禁用
	unable:function(){
		var that = this;
		that.obj.off("mousedown."+ that.eventNamespace);
		$(document).off("mousemove." + that.eventNamespace + " mouseup."+ that.eventNamespace);
	},
	// 显式触发mouseup，阻止当前的拖拽
	interrupt:function(){
		var that = this;
		$(document).trigger("mouseup."+ that.eventNamespace);
	},
	handleEvent:function(event){
		var that = this,
			ele = event.target,
			opts = that.opts;
		switch(event.type){
			case "mousedown":
				var position = that.obj.position();
					position_top = position.top,
					position_left = position.left;

				//阻止选中
				event.preventDefault();
				that.status = 1;
				that.startpositon = {x:event.pageX,y:event.pageY};
				that.diff = {x:that.startpositon.x-position_left,y:that.startpositon.y-position_top};
				opts.dragStartCallback && opts.dragStartCallback.apply(that, [event]);
				break;
			case "mousemove":
				if(that.status === 1)
				{
					that.endposition = {x:event.pageX,y:event.pageY};
					that.left = that.endposition.x - that.diff.x;
					that.top = that.endposition.y - that.diff.y;
					that.move(event);
				}
				event.preventDefault();
				break;
			case "mouseup":
				if(that.status === 1)
				{
					that.status = 0;
					opts.dropCallback && opts.dropCallback.apply(that, [event]);
				}
				break;
			default:break;
		}
	},
	//修正y方向的高度
	fixTop:function(){
		var that = this,
			opts = that.opts,
			$pobk =  that.obj.offsetParent(),
			height = $pobk.height()-that.obj.outerHeight();

			return that.top < 0?0:(that.top > height?height:that.top);
	},
	//修正x方向的高度
	fixLeft:function(){
		var that = this,
			opts = that.opts,
			$pobk = that.obj.offsetParent(),
			width = $pobk.width()-that.obj.outerWidth();

			return that.left < 0?0:(that.left > width?width:that.left);
	},
	//移动方法
	move:function(event){
		var that = this,
			opts = that.opts;
		if(opts.circlimit){
			that.top = that.fixTop();
			that.left = that.fixLeft();
		}
		if(opts.direct === "xy"){
			that.obj.css({"top":that.top + "px","left":that.left + "px"});
		}
		if(opts.direct === "x"){
			that.obj.css({"left":that.left + "px"});
		}
		if(opts.direct === "y"){
			that.obj.css({"top":that.top + "px"});
		}
		opts.moveCallback && opts.moveCallback.apply(that, [event]);
	}
};

$.fn.drag = function (opts) {
    return this.each(function () {
    	var dragbox = new Drap(opts,$(this));
        $(this).data("data-drag-obj",dragbox);
        dragbox.enable();

    });
};
