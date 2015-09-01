var $      = require("common:widget/ui/jquery/jquery.js"),
    helper = require("common:widget/ui/helper/helper.js"),
	UT     = require("common:widget/ui/ut/ut.js");

var tpl = '<div class="ui-bubble ui-bubble-t mod-ff-sethome#{num}" log-mod="sethp-btn" id="setHomeOnFf#{num}" style="display: none;"><b class="ui-arrow ui-bubble_out"></b><b class="ui-arrow ui-bubble_in"></b><a href="#" class="ui-bubble_close mod-ff-sethome-close" onclick="return false" hidefocus="true">×</a><p class="ui-bubble_t" style="text-align: center;margin-bottom: 6px;"><a class="mod-ff-sethome-drag" href="#{url}"><img src="#{imgLogoUrl}" /></a><img src="#{imgArrowUrl}" /><img src="#{imgHomeUrl}" /></p><p class="ui-bubble_t">#{content}</p></div>';

var setHomeOnFf = {
	isShow: false,
	wrap: null,
	init: function(obj, opt) {
		var that = this;
		(obj || $(document.body)).append(helper.replaceTpl(tpl, opt));
		that.wrap = $("#setHomeOnFf" + opt.num);
		that.bindEvent();
	},
	bindEvent: function() {
		var that = this,
		    wrap = that.wrap;
		    
		wrap.on("click", ".mod-ff-sethome-close", function() {
			that.hide();
			UT.send({
				position: "sethome-ff",
				sort: "close",
				type: "click",
				modId: "sethp-btn"
			});
		}).on("dragstart", ".mod-ff-sethome-drag", function() {
			UT.send({
				position: "sethome-ff",
				sort: "drag",
				type: "click",
				modId: "sethp-btn"
			});
		}).on("dragend", ".mod-ff-sethome-drag", function() {
			that.hide();
		});
		$(document.body).on("click",  function() {
			that.hide();
		});
	},
	show: function(option) {
		var that = this,
		    wrap = that.wrap;

		wrap.hide();
		option && wrap.css(option);
		wrap.show();
		that.isShow = true;
	},
	hide: function() {
		var that = this,
		    wrap = that.wrap;

		wrap.hide();
		that.isShow = false;
	},
	toggle: function(op) {
		var that = this;

		if(that.isShow) {
			that.hide();
		} else {
			that.show(op);
		}
	}
};
module.exports = setHomeOnFf;