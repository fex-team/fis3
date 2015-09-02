var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');

window.hao123 || (window.hao123 = {});

var sidebarContent = function (data) {
	//数据
	this.list = data;
	//sidebar
	this.sidebar = $(".mod-custom-sidebar");
};

/**
  * 初始化
*/

sidebarContent.prototype.init = function () {
	var that = this,	
		data = {"id":"sidebarApplist","fullsize":"fullsize","widget":[{"widgetId":"sidebar-applist","title":"New app"}]};

	that.list["sidebarApplist"] = data;

	that.renderAppContent(that.list);
	that.bindEvents();
};

/**
  *生成app内容框	
*/

sidebarContent.prototype.renderAppContent =  function (list) {
	var el = "",
		that = this,
		contentTpl =
			'<div class="content-wrap sc-#{id} #{fullsize}">'
			+	'<div class="app-title">'
			+		'<span class="title">#{title}</span>'
			+		'<span class="content-close"></span>'
			+	'</div>'
			+	'<div class="app-substance" id="#{widgetId}">'
			+	'<span class="widget-load"></span>'
			+	'</div>'
			+	'</div>';
		
	for ( key in list ) {
			if( !list[key] ){
				continue;
			}
			var widget = list[key].widget[0],
				fullsize = list[key].fullsize || "";

			el = el + helper.replaceTpl( contentTpl,{"widgetId":widget.pageletId || widget.widgetId,"id":list[key].id,"title":widget.title,"fullsize" : fullsize} );
		};		
			
	that.sidebar.find(".app-content").append(el);
};

/**
  *加载app的内容
*/

sidebarContent.prototype.loadApp = function ( widgetId,pageletId ) {
	hao123.asyncLoad && hao123.asyncLoad({
		module: "home",
		fileType: "tpl",
		containerId: pageletId || widgetId,
		widgetName: "open-api",
		widgetId:[{id: widgetId}],
		api: hao123.host + "/openapi"
	});
};
/**
  *计算内容区的位置
*/
sidebarContent.prototype.getPosition = function ( id,height ) {
	var height = parseInt(height,10),
		max = $(window).outerHeight() - 60,
		iconTop = parseInt(this.sidebar.triggerHandler("getTop",[id]),10),
		top = iconTop / 3.5;	

	if( height != "auto" ){
		if( top + height > max ){
			top = top - 40;
			top <= 0 && (top = 0);
			return top;
		} else {
			top = (top + height) < (iconTop + 60) ? (iconTop + 20 - height) : top;	
		}
			
	} 


	return top;
};

/**
  *处理内容区的切换
*/

sidebarContent.prototype.switchContent = function ( id ) {
	var current = $(".sc-"+id),
		status = conf.customSidebar.status,
		sidebar = this.sidebar,
		list = this.list[id].widget[0],
		width = list.width || "auto",
		height = list.height || "auto",
		top = current.hasClass("fullsize") ? 0 : this.getPosition( id,height ),
		style = {"width":width,"top":top};

	if( current.hasClass("show") ){
		current.removeClass("show");
		status.isFolded = 1;
		status.app = "";
	} else {
		status.bubbleExsit && sidebar.trigger("terminateBubble",[id]);
		status.messageBubble && status.messageBubble == id && sidebar.trigger("resetMessageCookie");
		sidebar.trigger("removeMessage",[id]);
		sidebar.trigger("changeAppStatus",[id,"selected"]).find(".content-wrap").removeClass("show");
		!current.hasClass("fullsize") && current.css(style);
		current.find(".app-substance").height(height);
		current.addClass("show");
		status.isFolded = 0;
		status.app = id;
	}
	//加载对应的模块
	!current.hasClass("hasloaded") && current.addClass("hasloaded") && this.loadApp( list.widgetId,list.pageletId );
};

/**
  *收起所有内容区
*/

sidebarContent.prototype.foldAll = function () {
	var status = conf.customSidebar.status;

	if( status.app ){
		this.sidebar.trigger("changeAppStatus",[status.app]);
		status.app = "";
	}
	this.sidebar.find(".content-wrap").removeClass("show");
	status.isFolded = 1;
};

/**
  *绑定事件
*/

sidebarContent.prototype.bindEvents = function () {
	var that = this,
		sidebar = that.sidebar,
		status = conf.customSidebar.status;

	sidebar.on("switchContent",function( e,id ){
		that.switchContent( id );
	})
	.on("addNewContent",function(e,id,data){
		that.list[id] = data[0];
		that.renderAppContent(data);
	})
	.on("removeContent",function(e,id){
		$(".sc-"+id).remove();
	})
	.on("click",".content-close",function(){
		sidebar.trigger("changeAppStatus",[status.app]).find(".content-wrap").removeClass("show");
		sidebar.trigger("stopManage");
		status.app = "";
		status.isFolded = 1;
	})
	.on("foldAll",function(){
		that.foldAll();
	});
};


module.exports = sidebarContent;