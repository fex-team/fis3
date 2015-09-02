var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');
var sidebarApps = require('home:widget/custom-sidebar/custom-sidebar-apps.js');
var sidebarContent = require('home:widget/custom-sidebar/custom-sidebar-content.js');
var sidebarGuideBubble = require('home:widget/custom-sidebar/custom-sidebar-guidebubble.js');
var sidebarMessageBubble = require('home:widget/custom-sidebar/custom-sidebar-messagebubble.js');

var customSidebar = function (data) {
	var that = this,
		data = data.sidebar,
		applist = data.list;

	/*sidebar的全局状态*/
	//app 当前展开的app
	//isFolded 是否有模块展开或是否有引导气泡展现
	//bubbleExsit 是否有引导气泡存在
	//inProcee 是否处于编辑状态
	//hasInited sidebar是否已经初始化过
	//messgeBubble 手工配置的红色气泡
	//inDrag 是否处于app拖拽的状态
	//iClose sidebar是否处于关闭的状态
	conf.customSidebar.status = {
		app : "",
		isFolded : 1,
		bubbleExsit : 0,
		inProcess : 0,
		hasInited : 0,
		messageBubble : "",
		inDrag : "",
		isClose : 0
	};

	that.sidebar = $(".mod-custom-sidebar");
	that.version = data.version;
	that.list = applist;
	that.status = conf.customSidebar.status;

	that.apps = new sidebarApps( applist );
	that.content = new sidebarContent( applist );
	that.guideBubble = new sidebarGuideBubble( data.guideBubble );
	that.messageBubble = new sidebarMessageBubble( data.tipOption[0],data.apiInfo );

}


/**
  *初始化sidebar 	
*/
customSidebar.prototype.init = function () {
	var cookie = $.cookie.get("sidebar");

	if( !cookie && $(document).width() > 1024 || (cookie != this.version)  ){
		this.trigger();
	} else {
		var swi = this.sidebar.find(".sidebar-switch"),
			wrap = this.sidebar.find(".sidebar-wrap");

		swi.addClass("switch-out");		
		wrap.addClass("sidebar-fold");
		this.status.isClose = 1;
	}

	this.bindEvents();
};

/**
  *初始化内容
*/
customSidebar.prototype.trigger = function () {
	var that = this;

	//初始化app列表
	that.apps.init();
	//初始化内容区
	that.content.init();
	//初始化引导气泡
	that.guideBubble.init();
	//初始化红色提醒气泡
	that.messageBubble.init();
	//标识状态
	that.status.hasInited = 1;
	that.status.isClose = 0;
	//清除关闭cookie
	$.cookie.set("sidebar",that.version,{expires:-1}); 
};

/**
  *收起sidebar
*/
customSidebar.prototype.fold = function () {
	var that = this;

	that.status.isClose = 1;
	that.content.foldAll();
	that.guideBubble.terminate();
	that.sidebar.trigger("stopManage");
	$.cookie.set("sidebar",that.version,{expires:30});
};

/**
  *fix the dropdownlist bug
*/
customSidebar.prototype.isDropDown = function( list,el ){
	var flag = false;
	for(var i = 0; i<list.length; i++){
		if( $(list[i]).length && $.contains($(list[i])[0],el) ){
			flag = true;
			break;
		}	
	}
	return flag;
};

customSidebar.prototype.bindEvents = function () {
	var that = this,
		sidebar = that.sidebar,
		time = -1,
		status = that.status;

	sidebar.on("click",".switch-arrow,.arrow-wrap",function(){
		var swi = sidebar.find(".sidebar-switch"),
			wrap = sidebar.find(".sidebar-wrap");

		swi.toggleClass("switch-out");		
		wrap.toggleClass("sidebar-fold");
		if( wrap.hasClass("sidebar-fold") ){
			that.fold();
		} else {
			$.cookie.set("sidebar",that.version,{expires:-1}); 
			!status.hasInited && that.trigger();
			status.isClose = 0;
			sidebar.trigger("removeMessage",["",swi]);
		}

	});

	//点击非左边栏区域时收起内容区
	$(document).on("mousedown",function(e){
		var el = e.target,
			specialDropDown = [],
			dropdownList = "";
			
		if( status.app ){
			dropdownList = that.list[status.app].widget[0].bodyDropdown;
			dropdownList && (specialDropDown = dropdownList.split(","));
		}		

		if( el != that.sidebar[0] && !$.contains(that.sidebar[0],el)){
			if(specialDropDown.length && that.isDropDown(specialDropDown,el) ){
				return;
			}

			that.content.foldAll();
			that.sidebar.trigger("stopManage");
		}
	});
};

module.exports = customSidebar;