/*
sidebar content class
 */

var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');

window.hao123 || (window.hao123 = {});

var leftSideContents = function(){
	    this.list = conf.sidebar.list;
		this.sidebar = $("#sidetoolbarContainer");
		this.isLoadWidget = 0;
		this.index = 0;
};

leftSideContents.prototype.render = function(){
	var el = "",
		_this = this,
		contentTpl =
			'<div class="contents" id="#{widgetId}Content">'
			+	'<div class="contents-title">'
			+		'<span class="contents-title_t">#{title}</span>'
			+		'<span class="contents-title_ar" sort-id="#{id}"></span>'
			+	'</div>'
			+	'<div class="contents-substance" id="#{widgetId}">'
			+		'<div class="loading">'
			+			'<div class="ui-o"></div>'
			+		'</div>'
			+	'</div>'
			+	'</div>';
		$.each(this.list,function(key,value){
			if( key > 6 ){
				return false;
			}
			var settings = value.widget[0];
			el = el + helper.replaceTpl( contentTpl,{"widgetId":settings.pageletId || settings.widgetId,"title":settings.title,"id":value.id} );	
			
		});
		$(".contents-container").append(el);
		$(".contents").each(function(i){
			var settings = _this.list[i].widget[0],
				sty = {},
				$this = $(this);
			settings.width && (sty["width"] = settings.width);
			settings.height && (sty["height"] = settings.height);
			$this.css(sty);
			$this.find(".contents-substance").css({width:sty.width-1,height:sty.height});
		});
}

leftSideContents.prototype.handleContentFold = function(index){
	var settings = this.list[index].widget[0],
		widget = "#"+ ( settings.pageletId || settings.widgetId ) +"Content",
		$this = $(widget),
		icon = $("."+this.list[index].id+"Icon"),
		_this = this;

	if( $this.hasClass("contents_unfold") ){
		$this.removeClass("contents_unfold");
		_this.contentStatus = 0;
	}
	else {
		$(".contents").removeClass("contents_unfold");
		$this.addClass("contents_unfold");
		this.sidebar.trigger("changeIconStatus",[icon,"selected"]);
		_this.contentStatus = 1;
	}
	_this.index = index;
};

leftSideContents.prototype.renderAppContent = function (index) {
	var	widget = this.list[index].widget[0],
		widgetId = widget.widgetId,
		widgetContainer = widget.pageletId || widgetId,
		appType = widget.appType ? widget.appType : "",
		iframeUrl = widget.iframeUrl ? widget.iframeUrl : "",
		width = widget.width ? widget.width : "",
		height = widget.height ? widget.height : "";
	

	hao123.asyncLoad && hao123.asyncLoad({
		module: "home",
		fileType: "tpl",
		containerId: widgetContainer,
		widgetName: "open-api",
		widgetId:[{id: widgetId}],
		api: hao123.host + "/openapi",
		// for common iframe
		appType : appType,
		iframeUrl : iframeUrl,
		width : width,
		height : height
	});
};

leftSideContents.prototype.bindEvent = function(){
	var _this = this;
		this.sidebar.on("click.hao123",".contents-title_ar",function(){
			var sortId = $(this).attr("sort-id");
			_this.foldContent();
			_this.sidebar.trigger("changeIconStatus",[$(".applist-li")]);
			_this.contentStatus = 0;
			UT.send({
				modId:"sidetoolbar",
				type:"click",
				position:sortId,
				sort:"contentArrow",
				ac:"b"
			});
		}).
		on("handleContentFold",function(e,index){
			_this.handleContentFold( index );
		}).
		on("getContentStatus",function(){
			return _this.contentStatus;
		}).
		on("renderAppContent", function (e, index) {
			_this.renderAppContent(index);
		});
};

leftSideContents.prototype.init = function () {
	var _this = this;
	this.contentStatus = 0;
	_this.render();
	_this.bindEvent();	
};

leftSideContents.prototype.foldContent = function(){
	$(".contents").removeClass("contents_unfold");
	this.contentStatus = 0;
};

leftSideContents.prototype.getCurrentIndex = function(){
	return this.index;
};

module.exports = leftSideContents;
