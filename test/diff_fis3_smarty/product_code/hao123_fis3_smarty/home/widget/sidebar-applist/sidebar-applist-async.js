var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');
var scroll = require("common:widget/ui/scrollable/scrollable.js");

!function () {
	var appTpl = '<li class="appitem #{installed} al-#{id}">'
				+	'<div class="app-install">'
				+		'<img class="app-icon" src="#{src}"/>'
				+		'<span class="app-info">'
				+			'#{title}&nbsp;&nbsp;<i class="#{new}"></i>'
				+			'<span class="stars">#{stars}</span>'
				+		'</span>'
				+		'<span class="install">'
				+			'<span class="ui-btn ui-btn-s btn-install" appid="#{id}">#{install}</span>'
				+			'<span class="download"><i class="i-download"></i>#{num}</span>'
				+		'</span>'
				+	'</div>'
				+	'<p class="description">#{description}</p>'
				+'</li>',
		manageAppTpl = '<div class="manage">'
						+	'<i class="i-manage"></i><span>#{manage}</span>'							
						+'</div> ',
		sidebar = $(".mod-custom-sidebar"),			
		el = $(".mod-sidebar-applist"),
		WIN = window,
		fullStar = '<i class="fullstar star"></i>',
		emptyStar = '<i class="emptystar star"></i>',
		apps,
		config;


	/**
	  *初始化
	*/			
	function init() {
		hao123.getJSON({
			url: hao123.host + "/" + conf.country + "/applistapi/getAllInfo?",
			params: {
				callback: "appList",
				country: hao123.country,
				module: hao123.appModule
			},
			callbackFuncName: "callback",
			callback: function (result) {
				config = result.sidebar;
				apps = config.list;
				renderApps(result.sidebar);
			}
		});

		
	}	

	/**
  	  *生成评分星星
	*/
	function renderStars(num) {
		var star = "";
		num = parseInt(num,10);
		for(var i = 0;i < 5;i++){
			var el = i < num ? fullStar : emptyStar;
			star = star + el;
		}
	
		return star;
		
	}


	/**
      *生成app列表
	*/
	function renderApps( data ) {
		var install = data.install,
			installed = data.installed,
			manage = data.manage,
			allApps = data.list,
			sidebarApps = hao123.appList.sidebar.list,
			dom = "";

		for ( key in allApps ) {
			var star = renderStars(allApps[key].stars);

			dom = dom + helper.replaceTpl(appTpl,{
				"id" : allApps[key].id,
				"title" : allApps[key].title,
				"install" : sidebarApps[key] ? installed : install,
				"num" : allApps[key].downloadNum,
				"src" : allApps[key].src,
				"description" : allApps[key].description,
				"new" : allApps[key].recommand ? "new" : "",
				"installed" : sidebarApps[key] ? "installed" : "not-installed",
				"stars" : star
			});
		};
		dom = '<div class="container"><ul class="applist">' + dom + '</ul></div>' + helper.replaceTpl(manageAppTpl,{"manage":manage});
		el.append( dom );
		el.find(".applist").scrollable({
			autoHide:false,
			dir:conf.dir
		});

	}
	/**
      *绑定事件
	*/
	function bindEvents() {
		//开始编辑
		el.on("click",".manage",function(){
			conf.customSidebar.status.inProcess ? sidebar.trigger("stopManage") : sidebar.trigger("startManage");
		})
		.on("mousedown",".btn-install",function(){
			$(this).addClass("click");
		})
		.on("mouseup mouseleave",".btn-install",function(){
			$(this).removeClass("click");
		})
		.on("click",".btn-install",function(){
			var app = $(this),
				id = app.attr("appid"),
				data = app;

			if( $(".si-"+id).length ){
				return;
			}
			app.text(config.installed);
			sidebar.trigger("addApp",[id,[apps[id]]]);
			$(".al-" + id).removeClass("not-installed").addClass("installed");
		});

		//删除
		sidebar.on("deleteApp",function(e,id){
			$(".al-" + id).removeClass("installed").addClass("not-installed").find(".btn-install").text(config.install);
		});
	}

	init();		
	bindEvents();			
}();

