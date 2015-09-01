/*
* 样式需要依赖popup.css
* @require popup.css
*/

var $ = require("common:widget/ui/jquery/jquery.js");
var Helper = require("common:widget/ui/helper/helper.js");

/**************************************
*弹窗插件

*参数说明:
	height - 高度
	width - 宽度
	module - 是否为静态弹窗
	title - 标题
	content - 内容
	closeIcon - 是否显示关闭图标
	key - 弹窗的标识(推荐使用)
	button - 按钮控制
		show - 是否显示
		buttons - 按钮数组
			text - 按钮文字
			focus - 默认按钮(true)
			classes - 定义按钮的class
			callback - 回调函数
	tpl - 模板（可以修改closeIcon）
	parent - 父容器
	left - 左边距
	top - 上边距
	dir - 文字流

*使用示例:
	var popup = new Popup(options);
	popup.init();
	或参见"common:widget/login-popup/login-popup.js"
**************************************/
var Popup = function (userOptions) {
	var defaultOptions = {
		width: 300,
		height: 200,
		module: true,
		title: "",
		content: "",
		closeIcon: true,
		button: {
			show: false
		},
		key: "",
		tpl: {
			entire: "#{maskTpl}"
				+  "<div class='ui-popup #{dir}' data-key='#{key}'>"
				+  	"<div class='popup-title-wrap'>"
				+		"<span class='popup-title'>#{title}</span>#{closeTpl}"
				+	"</div>"
				+	"<div class='popup-content'>"
				+		"#{content}"
				+	"</div>"
				+	"#{buttonTpl}"
				+  "</div>",
			mask: "<div class='ui-popup-mask' data-key='#{key}'></div>",
			closeIcon: "<i class='i-popup-close popup-close'>x</i>",
			buttonWrap: "<div class='popup-button-wrap'>#{buttons}</div>",
			button: "<button class='#{classes}' data-index='#{index}'>#{text}</button>"
		},
		parent: document.body,
		left: null,
		top: null,
		dir: "ltr"
	};
	$.extend(this, defaultOptions, userOptions);
};

Popup.prototype = {

	constructor: Popup,

	//组件初始化
	init: function() {
		this.generate();
		this.render({
			width: this.width,
			height: this.height
		});
		this._bindEvent();
	},

	//生成弹出框
	generate: function() {
		$(this.parent).append(this._mergeTpl());
		this._defineContainer();
	},

	//去除弹出框
	remove: function() {
		this.popupContainer.add(this.maskContainer).remove();
		this._unbindEvent();
	},

	//更新弹出层大小、位置等样式
	//参数"containerCss"可由调用者控制弹出框额外样式
	render: function(containerCss) {
		var thisLeft = this.left;
		var thisTop = this.top;
		var documentEle = document.documentElement;
		this.popupContainer.css($.extend({
			left: thisLeft !== null ? thisLeft : (documentEle.clientWidth - this.width) / 2,
			top: thisTop !== null ? thisTop : (documentEle.clientHeight - this.height) / 2
		}, containerCss ? containerCss : {}));
	},

	//事件绑定（非对外API以"_"标识）
	_bindEvent: function() {
		var that = this;
		var buttons = that.button.buttons;
		var defaultButton = that.popupContainer.find(".popup-button-default");
		//包含"popup-close"类元素的点击事件将会关闭弹窗
		$(".popup-close", that.popupContainer).one("click", $.proxy(that.remove, that));
		//按钮点击时执行回调函数
		$(".popup-button-wrap button", that.popupContainer).one("click", function() {
			var index = $(this).attr("data-index");
			var callback = buttons[index].callback;
			callback && callback();
		});
		//绑定按键快捷方式
		//"keydown"后为事件的namespace
		$(window).on("keyup.popup", function(e) {
			//按下"esc"将会关闭弹窗
			if (e.which == 27) {
				that.remove();
			//按下"enter"将会触发默认按钮的点击事件
			}else if(e.which == 13 && that.button.show){
				defaultButton.trigger("click");
			}
		});
		//浏览器大小发生改变时，弹窗位置也相应调整（水平垂直居中），暂时不用
		/*$(window).on("resize.popup", function(){
			that.render();
		});*/
	},

	//取消一些事件绑定
	_unbindEvent: function(){
		//取消namespace为"popup"的事件绑定
		$(window).off(".popup");
	},

	//button的拼装
	_getButtons: function() {
		var tpl = this.tpl;
		var buttons = this.button.buttons;
		var buttonStr = "";
		for (var i = 0; i < buttons.length; i++) {
			var button = buttons[i];
			var tplObj = {
				//可能会有多余空格，不影响
				classes: button.focus ? button.classes + " popup-button-default" : button.classes,
				text: button.text,
				index: i
			};
			buttonStr += Helper.replaceTpl(tpl.button, tplObj);
		}
		return Helper.replaceTpl(tpl.buttonWrap, { buttons: buttonStr });
	},

	//模板的拼装
	_mergeTpl: function() {
		var tpl = this.tpl;
		var key = this.key;
		var tplObj = {
			maskTpl: this.module ? Helper.replaceTpl(tpl.mask, { key: key }) : "",
			title: this.title,
			closeTpl: this.closeIcon ? tpl.closeIcon : "",
			buttonTpl: this.button.show ? this._getButtons() : "",
			key: key,
			content: this.content,
			dir: this.dir
		};
		return Helper.replaceTpl(tpl.entire, tplObj);
	},

	//确定两个容器
	_defineContainer: function() {
		var key = this.key;
		var keyAttrLimit = key ? "[data-key=" + key + "]" : "";
		this.popupContainer = $(".ui-popup" + keyAttrLimit);
		this.maskContainer = $(".ui-popup-mask" + keyAttrLimit);
	}

};

/*jquery扩展，暂时不用
$.fn.extend({
	popup: function(args){
		if(!args){
			args = {};
		}
		args.content = this.text();
		return this.each(function(){
			var popup = new Popup(args);
			popup.init();
		});
	}
});*/

module.exports = Popup;