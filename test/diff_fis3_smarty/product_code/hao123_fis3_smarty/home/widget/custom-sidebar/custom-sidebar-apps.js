var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');
var Drap = require("common:widget/ui/drap/drap.js");

var sidebarApps = function  (data) {
	var that = this;

	//sidebar上可以展现的全集
	that.appList = data;

	that.sidebar = $(".mod-custom-sidebar");
	that.appsWrap = that.sidebar.find(".apps-wrap");
}

/**
  *初始化app列表	
*/

sidebarApps.prototype.init = function () {
	this.index = 1;
	this.groupApps();
	this.addNewApps(this.all[0]);
	this.retContainer(true);
	this.isSwitch();
	this.renderApplistIcon();
	this.bindEvents();

};

/**
  *对app进行预分组处理
*/
sidebarApps.prototype.groupApps = function () {
	var that = this,
		temp = [],
		all = [],
		limit = that.getAppLimit(),
		pages = 1;

	for ( key in that.appList ) {
		var app = that.appList[key];
		app && key != "sidebarApplist" && temp.push(that.appList[key]);
	}
	pages = parseInt(temp.length / limit,10) + (temp.length % limit == 0 ? 0 : 1); 

	for(var i = 0;i < pages; i++ ){
		all.push(temp.slice(limit * i,limit * i + limit));
	}

	that.pages = pages;
	that.all = all;
	that.temp = temp;
	that.length = temp.length;
};

/**
  *对数据进行重新分组处理
*/
sidebarApps.prototype.regroupApps = function () {
	var that = this,
		limit = that.getAppLimit(),
		all = [],
		result = [];

	for(var i = 0;i < that.pages; i++ ){
		all.push(that.temp.slice(limit * i,limit * i + limit));
	}
	for( var j = 0;j < that.temp.length;j++ ){
		result.push(that.temp[j].id);
	}
	
	window.localStorage && (window.localStorage.customSidebar = result.join(",")); 

};

/**
  *生成app定制模块的icon
*/

sidebarApps.prototype.renderApplistIcon = function () {
	var arrow = conf.dir == "ltr" ? "ui-arrow-l" : "ui-arrow-r",
		tpl = '<div class="open-apps icons-wrap si-sidebarApplist" appid="sidebarApplist">'
			+	'<i class="icons"></i>'
			+	'<b class="ui-arrow '+ arrow +' ui-arrow-av"></b>'
			+'</div>';

	this.sidebar.find(".app-content").after(tpl);
};

/**
  *生成app列表
*/

sidebarApps.prototype.renderApps = function (list) {
	var dom = "",
		that = this,
		arrow = conf.dir == "ltr" ? "ui-arrow-l" : "ui-arrow-r",
		appsTpl = '<li class="icons-wrap app-icons-wrap si-#{id}" appid="#{id}">'
				  +	'<img class="icons app-icon" src="#{src}" /><i class="#{class}"></i>'
				  + '<span class="hover-tip"><span>#{hoverTip}</span></span>'
				  +	'<b class="ui-arrow '+ arrow +' ui-arrow-av"></b>'
				  + '</li>';

	for ( var i = 0;i < list.length;i++ ) {
			var widget = list[i].widget[0],
				 del = list[i].noDelete ?   "" : "delete-app";
	
			dom = dom + helper.replaceTpl( appsTpl,{"src" : list[i].src,"hoverTip" : list[i].hoverWord,"id" : list[i].id,"class":del} );
		};	

	return dom;	
};

/**
  *新增新的app列表
*/
sidebarApps.prototype.addNewApps = function (list) {
	var apps = this.renderApps(list),
		ulTpl = '<ul class="applist">'+ apps +'</ul>';
		
	this.appsWrap.append(ulTpl);	
    
}

/**
  *根据浏览器的窗口大小调整app列表的位置	
*/

sidebarApps.prototype.getTop = function () {

	var top = $(window).outerHeight() / 2 - (this.all[0].length + 2) * 60 / 2 ;
	return top;
}

/**
  *获取一屏app的数量
*/

sidebarApps.prototype.getAppLimit = function () {
	var height =  window.outerHeight,
		limit = 0;

	if( height >= 1024 ){
		limit = 11;
	} else if( height >= 900 && height < 1024 ){
		limit = 7;
	} else if ( height >= 768 && height < 900 ){
		limit = 7;
	} else {
		limit = 7;
	}

	return limit;
};


/**
  *重新排列app外框的位置
*/

sidebarApps.prototype.retContainer = function (inanimate) {
	var that = this;
	inanimate ? that.appsWrap.css({"top":that.getTop()+"px"}) : 
				that.appsWrap.animate({"top":that.getTop()+"px"},500);
};

/**
  *是否可以切屏
*/
sidebarApps.prototype.isSwitch = function () {
	var that = this,
		switchBtn = that.sidebar.find(".app-switch");

	that.length > that.getAppLimit() ? switchBtn.addClass("show") : switchBtn.removeClass("show");
};

/**
  *删除app
*/
sidebarApps.prototype.deleteApps = function () {
	var that = this,
		index = this.index - 1,
		ul = that.appsWrap.find(".applist"),
		current = ul.eq( index ),
		prev = ul.eq( index - 1 ),
		next = ul.eq( index + 1 ),
		currentData = that.all[index],
		nextData = that.all[index+1],
		limit = that.getAppLimit(),
		data = [];

	//如果当前分页的数据不为空，用后面的数据补齐
	if( currentData ){
		if( next.length ){
			current.append(next.find("li:first"));
			current.nextAll().remove();

		} else {
			if( nextData ){
				data.push(currentData[limit-1]);
			} else {
				currentData.length == limit && data.push(currentData[limit-1]);
				
			}
			data && current.append(that.renderApps(data));
		}
	//如果为空，则翻到上一屏	
	} else {
		current.remove();
		prev.show();
		this.index = index;

	}
	ul.find(".delete-app").show();
	//that.retContainer();
	that.isSwitch();
	
};

/**
  *添加一个app	
*/
sidebarApps.prototype.addApp = function (id,data) {
	var that = this,
		ul = that.appsWrap.find(".applist"),
		index = that.index - 1,
		current = ul.eq( index ),
		limit = that.getAppLimit(),
		app = $(that.renderApps(data));

	current.prepend(app.fadeIn());
	current.nextAll().remove();
	this.all[index].length == limit && current.find("li:last").remove();
	conf.customSidebar.status.inProcess && ul.find(".delete-app").show();
	that.temp.unshift(data[0]);
	that.getApps(that.temp);
	that.sidebar.trigger("addNewContent",[id,data]);
};

/**
  *app切屏
*/

sidebarApps.prototype.switchApps = function () {
	var that = this,
		ul = that.appsWrap.find(".applist"),
		index = that.index == that.pages ? 1 : (that.index + 1),
		next = ul.eq(index - 1),
		data = that.all[index-1],
		status = conf.customSidebar.status;

	ul.hide();
	next.length ? next.show() : that.addNewApps(data);
	status.inProcess && that.appsWrap.find(".delete-app").show();
	that.index = index;
	status.bubbleExsit && that.sidebar.trigger("terminateBubble");
}

/**
  *app数据查询	
*/
sidebarApps.prototype.getApps = function (array) {
	var temp = [],
		that = this;

	for( var i = 0;i < array.length;i++ ){
		temp.push(array[i].id);
	}
	hao123.getJSON({
		url: hao123.host + "/applistapi?",
		params: {
			callback: "appList",
			country: hao123.country,
			module: hao123.appModule,
			appids: temp.join(",")
		},
		callbackFuncName: "callback",
		callback: function (result) {
			that.appList = result.sidebar.list;
			that.groupApps();
			that.isSwitch();
			that.retContainer();
			window.localStorage && (window.localStorage.customSidebar = temp.join(","));
		}
	});
};

/**
  *启动app拖拽	
*/

sidebarApps.prototype.enableDrag = function () {
	var dragConfig = {
	    	circlimit:true,
	    	direct:"y"
	    },
	    el = $(".app-icons-wrap"),
	    status = conf.customSidebar.status;

    //初始化 拖拽   
    status.inDrag = el.drag(dragConfig);    
	el.parent().height(el.parent().height());
	el.each(function(){
		var $this = $(this),
			top = $this.position().top;
		$this.css({"top":top}).data("top",top);
	});	

	el.css({"position":"absolute"});
	this.handleDrag(true);
};

/**
  *停止app拖拽	
*/

sidebarApps.prototype.disableDrag = function () {
	var	status = conf.customSidebar.status,
		el = status.inDrag;

	if( el.length ){
		el.each(function(){
	    	$(this).data("data-drag-obj").unable()
	    	$(this).css({"position":"relative","top":"0","cursor":"pointer"});
	    });
		el.parent().height("auto");
		this.handleDrag(false);
	}
};

/**
  拖拽排序
*/

sidebarApps.prototype.handleDrag = function (status) {
	var $status = conf.customSidebar.status
		el = $status.inDrag,
		that = this,
		group = that.index - 1,		
		swt = null,
		limit = that.getAppLimit();

	if( !status ){
		el.length && el.off(".appdrag");
		$status.inDrag = "";
		return;
	}

	el.on("mousemove.appdrag",function(){
		var $this = $(this),
			top = $this.data("top"),
			currentTop = $this.position().top,
			prev = $this.prev(),
			next = $this.next();

		el.removeClass("dragging");	
		$this.addClass("dragging");

		if( prev.length && currentTop <= prev.data("top") + 30   ){
			var index = group * limit + $this.index();//在全集中的位置

			prev.css("top",top).before($this);
			$this.data("top",prev.data("top"));
			prev.data("top",top);
			swt = that.temp[index - 1];
			that.temp[index - 1] = that.temp[index]; 
			that.temp[index] = swt;
			that.regroupApps();

		} else if( next.length && currentTop >= next.data("top") - 30 ){
			var index = group * limit + $this.index();

			next.css("top",top).after($this);			
			$this.data("top",next.data("top"));
			next.data("top",top);
			swt = that.temp[index + 1];
			that.temp[index + 1] = that.temp[index]; 
			that.temp[index] = swt;
			that.regroupApps();
		}

	})

	.on("mouseup.appdrag",function(){
		var $this = $(this),
			top = $(this).data("top");
		
		$this.css({"top":top});
	})
	.on("mouseover.appdrag",function(){
		var $this = $(this);
		$(this).data("data-drag-obj").enable();
		$this.css({"cursor":"move"});
	})
	.on("mouseleave.appdrag",function(){
		var $this = $(this),
			top = $(this).data("top");
		
		$this.css({"top":top});
		$this.data("data-drag-obj").unable();
		
	});
};

/**
  *抖动效果
*/
sidebarApps.prototype.shaking = function (start) {
	var el = $(".app-icons-wrap:visible"),
		timer = this.shakeTimer;
	
	timer && el.removeClass("shaking") && clearInterval(timer);

	if( start ){
		this.shakeTimer = setInterval(function(){
			el.toggleClass("shaking");
		},70);	
	} 
	

};

/**
  *绑定事件
*/

sidebarApps.prototype.bindEvents = function () {
	var that = this,
		sidebar = that.sidebar,
		status = conf.customSidebar.status;

	//app的icon	
	sidebar
	.on("mouseover",".app-icons-wrap",function(){
		var $this = $(this),
			id = $this.attr("appid"),
			top = $this.position().top,
			tip = $this.find(".hover-tip");


		status.isFolded && tip.addClass("dis-table");
	})
	.on("mouseleave",".app-icons-wrap",function(){
		$(this).find(".hover-tip").removeClass("dis-table");
	})
	.on("click",".app-icons-wrap,.open-apps",function(){
		var $this = $(this),
			id = $this.attr("appid"),
			app = status.app;

		if( status.inProcess && !$this.hasClass("open-apps") ){
			return;
		}
		//展开或收起内容区	
		sidebar.trigger("switchContent",[id]);
		//隐藏app描述
		$this.find(".hover-tip").removeClass("dis-table");
		//显隐icon的箭头
		if( app != id ){
			conf.customSidebar.currentApp = id;
		} else {
			$this.removeClass("app-selected");
		}
	})
	.on("click",".open-apps",function(){
		sidebar.trigger("stopManage");
	})
    
    //icon区切屏按钮
	.on("mousedown",".switch-icon",function(){
		that.switchApps();		
		$(this).addClass("click");
		if( !status.inProcess ){
			sidebar.trigger("foldAll");
		} else {
			that.disableDrag();
			that.enableDrag();
			that.shaking(true);
		}
	}).on("mouseup",".switch-icon",function(){
		$(this).removeClass("click");
	}).on("mouseleave",".switch-icon",function(){
		$(this).removeClass("click");
	})

	//删除app
	.on("mousedown",".delete-app",function(){
		var app = $(this).parent(),
			id = app.attr("appid"),
			index = that.index;	

		that.disableDrag();	
		app.fadeOut(function(){
			app.remove();
			that.appList[id] = "";
			that.groupApps();
			that.deleteApps();
			sidebar.trigger("deleteApp",[id]).trigger("removeContent",[id]);
			that.getApps(that.temp);
			that.enableDrag();
			that.shaking(true);
		});
	})
	.on("mouseover",".delete-app",function(){
		$(this).css("cursor","pointer");
	})
	//切换appicon的选中状态
	.on("changeAppStatus",function( e,id,status ){
		var app = $(".si-"+id);

		if( status == "selected" ){
			sidebar.find(".app-icons-wrap,.open-apps").removeClass("app-selected");
			app.addClass("app-selected"); 
		} else if( status == "hover" ){
			app.addClass("app-hover"); 
		} else {
			app.removeClass("app-hover app-selected");
		}
		
	})

	.on("getTop",function( e,id ){
		var app = $(".si-"+id),
			offset = app.position().top;

		if( id != "sidebarApplist"){
			offset = that.getTop() + offset + "px";
		}	
		
		return offset;
	})

	//开始编辑
	.on("startManage",function(){
		status.inProcess = 1;
		sidebar.trigger("removeMessage",["",sidebar]);
		that.appsWrap.find(".delete-app").show();
		that.enableDrag();
		that.shaking(true);
	})

	//结束编辑
	.on("stopManage",function(){
		status.inProcess = 0;
		that.appsWrap.find(".delete-app").hide();
		that.disableDrag();
		that.shaking(false);
	})

	//新增一个app
	.on("addApp",function( e,id,data ){
		that.disableDrag();
		that.addApp(id,data);
		if( status.inProcess ){
			that.enableDrag();
			that.shaking(true);
		}

	});

	//其它操作icon的状态

	$(window).resize(function(){
		that.appsWrap.css("top",that.getTop()+"px");	
	});
};

module.exports = sidebarApps;