var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");
var valentine = function(){
	var that = this;
	that.config = conf.valentine;
	that.container = $("#" + that.config.id);
	that.writeArea = that.container.find(".writeletter");
	that.sendArea = that.container.find(".sendletter");
	that.mask = that.container.find(".mask");
	that.inputs = that.container.find(".input");
	that.names = that.container.find(".name");
	that._init();
};
valentine.prototype = {
	// init
	_init: function(){
		var that = this;
		that._bindPlaceholder();
		that.config.fbShare && that._shareFb(that.config);
		that._bindEvents();
	},
	// write letter action
	_writeLetter: function(names){
		var that = this;
		that.writeArea.hide();
		that.sendArea.show();
		that._writeName(names);
		that.mask.show();
	},
	// write names on the image, including animation and form url of the send button
	// @param {array} names user inputs
	_writeName: function(names){
		var that = this,
			hearts = that.container.find(".heart"),
			url = helper.replaceTpl(that.config.url,{
				to: encodeURIComponent(names[0]),
				from: encodeURIComponent(names[1])
			});
		that._resetInput();
		that.container.find(".btn-sendletter").attr("href",url);
		// red heart animation
		hearts.each(function(i,v){
			var $this = $(this),
				newOffset = that.names.eq(i).position();
			$this
			.show()
			.animate({
				top: newOffset.top,
				left: newOffset.left
				},{
				duration: 500,
				complete: function(){
					// hide and reset positions of red heart when animation complete
					$this.removeAttr("style");
					that.names.eq(i).html(names[i]);
				}
			});
		});
	},
	// resume to write letter panel
	_resumeWrite: function(){
		var that = this;
		that.writeArea.show();
		that.sendArea.hide();
		that.mask.hide();
	},
	// reset inputs and remove names from image
	_resetInput: function(){
		var that = this;
		that.inputs.each(function(){
			$(this).val("").siblings(".placeholder").show();
		});
		that.names.html("");
	},
	// get names from two inputs
	_getNames: function(){
		var that = this,
			nameArr = [];
		$.each(that.inputs, function(k,v){
			nameArr[k] = v.value;
		});
		return that.nameArr = nameArr;
	},
	_shareFb: function(opt,data){
		var that = this;
		require.async('home:widget/ui/fb-feed/fb-feed.js',function(){
			$.extend(opt,{
				callback: {
	                onClick: function(){
	                	opt.data = {
	                		from: that.nameArr[1],
	                		to: that.nameArr[0]
	                	};
	                    that._log({sort: this.className});
	                }
	            }
			});
            that.container.find(".btn-share").bindFBShare(opt);
        });
	},
	// bind placeholder interaction
	_bindPlaceholder: function(){
		var that = this;
		that.container
		.on("focus", ".input", function(){
			var $this = $(this);
			if(!$this.val()){
				$this.siblings(".placeholder").hide();
			}
			that._log({sort: "input-"+$this.attr("name")});
		})
		.on("blur", ".input", function(){
			var $this = $(this);
			if(!$this.val()){
				$this.siblings(".placeholder").show();
			}
		})
		.on("click", ".placeholder", function(){
			var $this = $(this);
			$this.siblings(".input").trigger("focus");
		});
	},
	// bind button event
	_bindEvents: function(){
		var that = this;
		that.container
		.on("click", ".btn-writeletter", function(){
			that._writeLetter(that._getNames());
			that._log({sort: this.className});
		})
		.on("click", ".btn-sendletter, .close", function(){
			that._resumeWrite();
			that._log({sort: this.className});
		});
	},
	// send log
	_log: function(opt){
		UT.send($.extend({
            modId: "valentine",
            position: "links",
            ac: "b"
        },opt));
	}
};
module.exports = valentine;
