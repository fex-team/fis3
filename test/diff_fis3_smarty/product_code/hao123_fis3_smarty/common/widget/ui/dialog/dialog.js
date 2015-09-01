var $ = require("common:widget/ui/jquery/jquery.js");
require("common:widget/ui/drap/drap.js");

var Dialog = function($el,opt){
    var self = this,
    	defaultOpt = {
			width: 100,
			height: 100,
			position: "absolute",
			// display: "block",
			modal: 0,
			draggable: 1,
			initOnce: 0,
			tpl: {
				head: "<div class='head'><span>title</span><i class='close'>&times;</i></div>",
				content: "<div class='content'>content</div>",
				foot: "<div class='foot'>footer</div>"
			}
		};

    typeof opt == "function" && (opt = opt.call());
    self.opt = $.extend(defaultOpt,opt);

    self._init($el);
};
// class variables
Dialog.counter = 0;
Dialog.mask = null;
Dialog.PCLASS = "g-dialog";

var fn = Dialog.prototype;

/**
 * modal
 *
 * @param {Object} argument comment
 */
fn._modalise = function(){
	if(!Dialog.mask){
		Dialog.mask = $("<div class='dialog-mask' id='dialogMask'></div>").appendTo($("body"));
		/*Dialog.mask.css({
			width: "100%",
			height: "100%",
			backgroundColor: "#000",
			opacity: ".5"
		});*/
	}
	/*if(Dialog.mask.is(":hidden")){
		Dialog.mask.show();
	}*/
	if(this.opt.display == "none"){
		Dialog.mask.hide();
	}else{
		Dialog.mask.show();
		// 禁止滚动
		$("html").addClass("freeze-scroll");
	}

};

/**
 * get $el
 *
 * @param {Object} argument comment
 */
fn._getElement = function($el){
	var self = this,
		html = "";
	$.each(self.opt.tpl, function(i,v){
		html += v;
	});
	return (
		$el ?
		(function(){
			// $el.html("<i class='close'>&times\;</i>");
			$el.addClass(Dialog.PCLASS).html(html);
			return $el;
		})() :
		(function(){
	    	var dialogId = "dialog_auto_" + Dialog.counter++;
	    	if($("#" + dialogId).length){
	    		arguments.callee();
	    	}else{
	    		var $newDialog = $("<div id='" + dialogId + "' class='" + Dialog.PCLASS + (self.opt.customClass ? " " + self.opt.customClass : "") + "'>" + html + "</div>");
	    		$newDialog.appendTo($("body"));
	    		return $newDialog;
	    	}
	    })()
	);
};

/**
 * adjust position
 *
 * @param {Object} argument comment
 */
fn._adjustPos = function(opt){
	var self = this;

	// 默认在可视区域内居中
	if(opt.top == undefined){
    	$.extend(opt, {
	    	// "top": "50%",
	    	"top": opt.position == "absolute" ? $(document).scrollTop() + $(window).height()/2 : "50%",
	    	"margin-top": -parseInt(opt.height, 10)/2
	    });
    }
    if(opt.left == undefined){
    	$.extend(opt, {
	    	// "left": "50%",
	    	"left": opt.position == "absolute" ? $(document).scrollLeft() + $(window).width()/2 : "50%",
	    	"margin-left": -parseInt(opt.width, 10)/2
	    });
    }
};

/**
 * draggable
 *
 * @param {Object} argument comment
 */
fn._draggable = function(){
	var self = this;

	self.$el.drag({
		circlimit: false
	});
};

/**
 * show interface
 *
 * @param {Object} argument comment
 */
fn.show = function(speed){
	var self = this;
	self.opt.customBodyClass && $("body").addClass(self.opt.customBodyClass);
	if(self.opt.modal){
		Dialog.mask.show();
		// 恢复滚动
		$("html").addClass("freeze-scroll");
	}
	self.$el.show(speed);
	return self;
};

/**
 * close interface
 *
 * @param {Object} argument comment
 */
fn.close = function(speed){
	var self = this;
	self.opt.customBodyClass && $("body").addClass(self.opt.customBodyClass);
	if(self.opt.modal){
		Dialog.mask.hide();
		// 恢复滚动
		$("html").removeClass("freeze-scroll");
	}
	self.$el.hide(speed);
	return self;
};

/**
 * destroy interface
 *
 * @param {Object} argument comment
 */
fn.destroy = function(){
	var self = this;
	this.$el.remove();
};

/**
 * bind events
 *
 * @param {Object} argument comment
 */
fn._bindEvents = function(opt){
	var self = this;

	self.$el.on("click", ".close", function(){
		self.close();
	});
};

fn._initStyle = function(opt){
	var STYLES = ["width", "height", "position", "top", "left", "margin-top", "margin-left", "backgroundColor", "display"],
    	styleOpt = {};
    $.each(STYLES, function(k, v) {
    	opt[v] && (styleOpt[v] = opt[v]);
    });
	this.$el.css(styleOpt);
};

/**
 * init
 *
 * @param {Object} argument comment
 */
fn._init = function($el){
	var self = this,
		opt = self.opt;

	// modal
	opt.modal && self._modalise();

	// get $el
	self.$el = self._getElement($el);
    // adjust position
    self._adjustPos(opt);

    // (debug-only)random background color
    opt.debug && (opt.backgroundColor = "RGB(" + Math.floor(Math.random()*255) + " ," + Math.floor(Math.random()*255) + " ," + Math.floor(Math.random()*255) + ")");

    self.opt.customBodyClass && $("body").addClass(self.opt.customBodyClass);
    // init dialog styles
    self._initStyle(opt);

	// draggable
	opt.draggable && self._draggable();

	// bind events
	self._bindEvents(opt);

	// bind complete callback
	opt.onComplete && opt.onComplete.call(self);
};

// jQuery plugin wraper
$.fn.extend({
    /**
     * create dialog from an existed dom
     *
     * @param {Object} argument comment
     */
    dialog: function(args) {
        return new Dialog(this, args);
    },

    /**
     * create dialog from a dom interaction
     *
     * @param {Object} argument comment
     */
    bindDialog: function(type,args) {
    	var self = this;
    	self.on(type+".dialog", function(e){
    		e.preventDefault();
    		if(args.initOnce && self.data("dialogObj")){
    			self.data("dialogObj").show();
    		}else{
    			self.data({
    				"etype": type+".dialog",
    				"dialogObj": new Dialog(null, args)
    			});
    		}
    	});
    },

	/**
	 * unbind bindDrag event interface
	 *
	 * @param {Object} argument comment
	 */
	unBindDialog: function(){
		this.off(self.data("etype"));
	}
});

module.exports = Dialog;
