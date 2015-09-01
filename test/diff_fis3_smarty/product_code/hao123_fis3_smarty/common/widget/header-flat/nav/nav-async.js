var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require('common:widget/ui/helper/helper.js');
var message = require('common:widget/ui/message/src/message.js');
var scroll = require("common:widget/ui/scrollable/scrollable.js");

require('common:widget/ui/slide/slide.js');
require('common:widget/ui/slide/plugin/pagination.js');
require('common:widget/ui/slide/plugin/animate.js');
require('common:widget/ui/slide/plugin/control.js');

var nav = function(navData){
	var navOption = {
		$mod: $('#navWrap'),
		selectId: "",
		preloadTpl: ""
	};
	var navTpl = {
		//导航hover推荐区
		// navReco: ['<li class="nav-reco-item#{first}">',
		// 			'<a href="#{url}" class="nav-reco-wrap">',
		// 				'<img src="#{img}" class="nav-reco-img">',
		// 				'<span class="nav-reco-title">#{title}</span>',
		// 				'<span class="nav-mask"></span>',
		// 			'</a>',
		// 		'</li>'].join(''),
		//导航hovertab区
		navTabCon: '<a href="#{url}" class="nav-subtab-a">#{title}</a>'
	};
	$.extend(this, navOption, navTpl, navData);

	this.init();
}
nav.prototype = {
	/**
	 * 初始化入口
	 */
	init: function(){
		var self = this;
		self._bindEvent();
		self._adjustPos();
	},
	_adjustPos: function(){
		var self = this;
		var $mod = self.$mod;
		var $navItem = $mod.find('.nav-item');
		var winWidth = $mod.parent().width();

		$.each($navItem, function(i,item){
			var $item = $(item);
			var restWidth = winWidth - $item.position().left;
			var $navCard = $item.find('.nav-hover-wrap');
			var navCardWidth = $navCard.outerWidth();

			if (restWidth<navCardWidth) {
				var leftPos = navCardWidth - restWidth;
				$navCard.css('left',-leftPos);
			}
		});
	},
	/**
	 * 绑定事件
	 */
	_bindEvent: function(){
		var self = this;
		var $mod = self.$mod;
		var navCmsData = self.navData;
		var timer;
		var scrollbar = [];
		message.on("module.flow.switch",function(){
            self._adjustPos();
        });

		$mod
		.on('mouseenter', '.nav-item', function(){
			var _this = $(this);
			var _index = _this.index();
			var _navText = _this.find('.nav-text-wrap');
			var _navHover = _this.find('.nav-hover-wrap');
			var _arrow = _this.find('.i-hover-arrow');
			var _subItem = _this.find('.nav-subtab-item');
			var _smallArrow = _this.find('.i-arrow');
			var _itemData = navCmsData[_index];
			var _navStyle = {
				backgroundColor: _itemData.backColor,
				borderColor: _itemData.backColor,
				color: "#ffffff"
			};
			var _bar = _this.find('.mod-scroll');
			_navText.css(_navStyle);
			_smallArrow.addClass('i-arrow-hover');
			
			timer = setTimeout(function(){
				_arrow.show();
				_navHover.show();
			},300);

			if(!_bar.length){

				scrollbar.push(
					{
						index: _index,
						element: _subItem.scrollable({
									autoHide:true
								})
					}
				);
			}
			if (!_itemData.state) {
				_itemData.state = true;
				self._renderHover(_index);
			}
		})
		.on('mouseleave', '.nav-item', function(){
			var _this = $(this);
			var _navText = _this.find('.nav-text-wrap');
			var _navHover = _this.find('.nav-hover-wrap');
			var _arrow = _this.find('.i-hover-arrow');
			var _smallArrow = _this.find('.i-arrow');

			timer && clearTimeout(timer);
			_navHover.hide();
			_arrow.hide();
			_navText.removeAttr('style');
			_smallArrow.removeClass('i-arrow-hover');
		})
		.on('click', '.nav-text-wrap,.i-nav', function(){
			var _this = $(this);
			var _navText = _this.find('.nav-text-wrap');
			var _url = _this.data('url');
			var _sort = _this.closest('.nav-item').data('sort');
			var obj = {
				ac: "b",
				position: "nav-item",
				sort: _sort
			};
			if (_url) {
				window.open(_url);
			}
			self._sendLog(obj);
		})
		.on('mouseenter', '.nav-tab-item', function(e){
			var _this = $(this);
			var navCmsData = self.navData;
			var _parIndex = _this.parent().data('idx');
			var _index = _this.index();
			var _subHtml = "";
			var navTabCon = self.navTabCon;
			$.each(navCmsData[_parIndex].tabs[_index].subtab, function(k,v){
				_subHtml += helper.replaceTpl(navTabCon,v);
			});
			
			_this.siblings().removeClass('cur');
			_this.addClass('cur');
			_this.parent().next().find('.nav-subtab-item').html(_subHtml);

			$.each(scrollbar, function(i,item){
				if (item.index === _parIndex) {
					item.element.goTo({y:0});
				}
			});
		})
		.on('click', '.nav-tab-item', function(e){
			var _this = $(this);
			var _url = _this.data('url');
			var _sort = _this.closest('.nav-item').data('sort');
			var obj = {
				ac: "b",
				position: "first",
				sort: _sort
			};
			self._sendLog(obj);
			if (_url&&_this.hasClass('cur')) {
				window.open(_url);
			}
		})
		.on('click', '.nav-reco-item', function(){
			var _this = $(this);
			var _sort = _this.closest('.nav-item').data('sort');
			var obj = {
				position: "recommend",
				sort: _sort
			};
			self._sendLog(obj);
		})
		.on('click', '.nav-subtab-a', function(){
			var _this = $(this);
			var _sort = _this.closest('.nav-item').data('sort');
			var obj = {
				position: "second",
				sort: _sort
			};
			self._sendLog(obj);
		});
	},
	/**
	 * 渲染hover层
	 */
	_renderHover: function(index){
		var self = this;
		var $mod = self.$mod;
		var $navItem = $mod.find('.nav-item').eq(index);
		var $navReco = $navItem.find('.nav-reco-item');
		
		$.each($navReco, function(i, item){
			var $item = $(item);
			var $img = $item.find('.nav-reco-img');
			$img.attr('src', $img.data('src'));
		});
	},
	/**
	 * 发送统计
	 */
	_sendLog: function(obj){
		UT.send($.extend(obj,{
			"modId":"navigation",
			"type":"click"
		}));
	}
}
module.exports = nav;
