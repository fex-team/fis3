var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require('common:widget/ui/helper/helper.js');
var cycletabs = require("lv2:widget/ui/cycletabs/cycletabs.js");

var App = function(config, modId) {
	this.tpl     = config.baseTpl || '<div class="o-slogan"><a href="#{url}" title="#{title}"><img src="#{imgSrc}" /></a></div><div class="o-content" id="#{wrap}"></div>';

	this.itemTpl = config.itemTpl;
	this.conf    = config;
	this.data    = {};
	this.wrap    = $(config.wrap);

	this.init(config, modId);
};
App.prototype = {
	init: function(conf, modId) {
		var that = this;
		that.createBaseHtml(conf);
		if(conf.ajaxData) {
			that.getAjaxData(conf.ajaxData, that.initSlide, conf.ajaxConf);
		} else {
			that.getNormalData(conf.list, conf, that.initSlide);
		}
		that.bindEvent(modId);
	},
	createBaseHtml: function(conf) {
		var that = this;
		that.wrap.html(helper.replaceTpl(that.tpl, conf.slogan));
	},
	formatData: function(data) {
		var that = this,
		    conf = that.conf;
		if (conf.format) {
			return conf.format.call(that, data);
		} else {
			return data;
		}
	},
	getContent: function(data) {
		var that = this,
			i = 0, j,
			tpl     = that.itemTpl,
			per     = parseInt(that.conf.per, 10),
			tmpObj  = {},
			tmpStr  = "",
			tmpId   = 1,
			dataMap = [];

		that.data = that.formatData(data);
		tmpObj    = that.data;

		// 数据分组记入slide中
		for (j = tmpObj.length; i < j; i++) {
			tmpStr += helper.replaceTpl(tpl, tmpObj[i]);
			tmpId = Math.floor(i / per) + 1;

			if ((i !== 0 && (i + 1) % per === 0) || i === j - 1) {
				dataMap.push({
					"content": tmpStr,
					"id": tmpId
				});
				tmpStr = "";
			}
		}
		return dataMap;
	},
	initSlide: function(data, conf, wrap) {
		var options = {
			offset: 0,
			navSize: 1,
			itemSize: conf.size,
			dir: conf.dir,
			scrollDuration: 400,
			quickSwitch: true,
			autoScroll: false,
			containerId: wrap,
			data: data,
			defaultId: 1
		},
			obj = new cycletabs.NavUI();

		obj.init(options);
		if (data.length < 2) {
			$(".ctrl", $(wrap)).hide();
		}
	},
	getAjaxData: function(conf, callback, ajaxConf) {
		var that = this;
		$.ajax(ajaxConf).done(function(data) {
			var dataGroup = that.getContent(data),
			    wrap      = '#' + that.conf.slogan.wrap;
			
			callback(dataGroup, conf, wrap);
		});
	},
	getNormalData: function(data, conf, callback) {
		var that = this,
		    dataGroup = that.getContent(data),
			wrap = '#' + that.conf.slogan.wrap;
			
		callback && callback(dataGroup, conf, wrap);
	},
	bindEvent: function(modId) {
		this.wrap.on("click", "a", function(e) {
			var $that = $(this);
			if($that.closest('.o-slogan').length) {
				UT.send({
					modId: modId,
					position: "title"
				});
			} else {
				UT.send({
					modId: modId,
					position: "content"
				});
			}
		}).on('click', ".prev", function() {
			UT.send({
				modId: modId,
				ac: "b",
				position: "prev"
			});
		}).on("click", ".next", function() {
			UT.send({
				modId: modId,
				ac: "b",
				position: "next"
			});
		});
	}
};

module.exports = App;