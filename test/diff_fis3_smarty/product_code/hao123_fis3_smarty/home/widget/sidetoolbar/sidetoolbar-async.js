var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
var UT = require("common:widget/ui/ut/ut.js");
var lazyload = require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var T = require("common:widget/ui/time/time.js");
var $cookie = require('common:widget/ui/jquery/jquery.cookie.js');


var sideToolBar = function(){
	var arrow = conf.dir == "ltr" ? "ui-arrow-l" : "ui-arrow-r";
	var iconTpl =
			'<li class="applist-li #{id}Icon" icon-name="#{id}"  icon-link="#{link}" isflod="">'
			+	'<img src="#{src}" />'
			+	'<div class="applist-div"><span>#{hoverWord}</span></div>'
			+	'<i class="applist-i">#{tip}</i>'
			+	'<b class="ui-arrow '+arrow+' ui-arrow-av"></b>'
			+'</li>',
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
			+'</div>',
		guidbubbleTpl =
			'<div class="guidbubble#{index} guidbubbles ">'
			+	'<div class="guidbubble-normal">'
			+	'</div>'
			+	'<div class="guidbubble-slide">'
			+	'</div>'
			+	'<span class="guidbubble-close"></span>'
			+'</div>',
		sidetoolbar_foldTpl =
			'<div class="sidetoolbar-close_flod">'
			+'</div>',
		list = conf.sidetoolbar.list,
		guid = conf.sidetoolbar.leftSideGuidBubble,
		tipOption = conf.sidetoolbar.tipOption[0],
		isfold = 0,
		contentindex = 0,
		isLoadWidget = 0,
		guider,guiderTimer,icons,messageb = null;

	/*红色提醒气泡*/
	function messageBubble(){

	}
	messageBubble.prototype = {
		handleVisibel:function( el,message ){
			message ? el.show():el.hide();
		}
	}
	/*api信息获取*/
	function messagePull( api ){
		$.ajax({
			url:api,
			dataType: "jsonp",
			jsonp: "jsonp",
			jsonpCallback: "ghao123_" + hex_md5(params,16),
			cache: false,

			success:function(result){
				messageb.handleVisibel( el,result );
			},
			error:function(){

			}
		});
	}
	/**
		*处理气泡的显隐策略,状态一共有四种

		1) once => 只显示一次
		2) userOption => 用户有过操作便不再显示
		3) timeOption => 间隔一段时间显示，首次记录一个时间，超过设定的时间段以后重新记录时间，在此期间若用户有过操作则不显示
		4) alwaysShow => 每次刷新都显示

		*适用范围包括手工配置的红色提醒气泡和旁边的提醒气泡浮层

	*/
	function getBubbleVisibility( data,cookieName ){
 
		var flag = false,
			cookie = $.cookie.get(cookieName),
			type = getBubbleType( data );
		
		if( type == 1 ){
			!cookie && (flag = true) && setBubbleCookie( cookieName,data );
		} else if(  type == 2 ||  type == 3 ){
			!cookie && (flag = true);
		} else {
			flag = true;
		} 
		return flag;
	}
	/*根据数据配置设置气泡的cookie*/
	function setBubbleCookie( cookieName,data,value,expires ){
		var type = getBubbleType( data );
		value = value || type;		
		if( type == 3 ){
			expires = data.timeOption;
		}
		$.cookie.set(cookieName, type, {expires:expires*1 || 2000});
	}
	/*清除cookie，重置策略*/
	function resetCookie( cookieName ){
		$.cookie.set(cookieName,"",{expires:-1});
	}
	/*判断显隐策略类型*/
	function getBubbleType( data ){
		var type = 4;
		if( data.once ){
			type = 1;
		} else if( data.userOption ){
			type = 2;
		} else if( data.timeOption ){
			type = 3; 
		} 
		return type;
	}
	/*内容区*/
	function leftSideContents( index ){
		var that = this,
			data = list[index];

		that.settings = data.widget[0];
		that.id = data.id;
		that.widget = "#"+ ( that.settings.pageletId || that.settings.widgetId ) +"Content";
		contentindex = index;

	}
	leftSideContents.prototype = {
		constructor: leftSideContents,

		handleStatu:function(){
			var that = this;
			$(".contents").length ? that.handleFold():that.init();
		},
		resetContent:function(){
			$(".contents").removeClass("contents_unfold");
		},
		init:function(){
			var el = "",
				that = this,
				className = "."+that.id;
			$.each(list,function(key,value){
				var settings = value.widget[0];
				el = el + helper.replaceTpl( contentTpl,{"widgetId":settings.pageletId || settings.widgetId,"title":settings.title,"id":value.id} );	
				
			});
			$(".contents-container").append(el);
			that.render();
			!isLoadWidget && $(className).lazyload({autoFireEvent:null});
			!isLoadWidget && $(className).lazyload({triggerAll:true});
			that.handleStatu();
			that.bindEvent();	
		},
		render:function(){
			$(".contents").each(function(i){
				var settings = list[i].widget[0],
					sty = {},
					$this = $(this);
				settings.width && (sty["width"] = settings.width);
				settings.height && (sty["height"] = settings.height);
				$this.css(sty);
				$this.find(".contents-substance").css({width:sty.width-1,height:sty.height});
			});
		},
		//处理内容区的切换
		handleFold:function(){
			var $this = $(this.widget);
			if( $this.hasClass("contents_unfold") ){
				$this.removeClass("contents_unfold");
				isfold = 0;
			}
			else {
				$(".contents").removeClass("contents_unfold");
				$this.addClass("contents_unfold");
				icons.changeStatu("."+this.id+"Icon","selected");
				isfold = 1;
			}
		},
		//绑定内容区的关闭按钮
		bindEvent:function(){
			var that = this;
			$(".contents-title_ar").click(function(){
				var sortId = $(this).attr("sort-id");
				that.resetContent();
				icons.changeStatu(".applist-li");
				isfold = 0;
				UT.send({
					modId:"sidetoolbar",
					type:"click",
					position:sortId,
					sort:"contentArrow",
					ac:"b"
				});
			});
		}


	};
	/*引导气泡*/
	function leftSideGuidBubble( data ){
		var options = {
			id:"",
			close:1,
			normalTpl:"",
			slideTpl:"",
			timer:null,
			time:5000
		},
		that = this;

		that.settings = $.extend({},options,data);
		that.icon = "."+that.settings.id+"Icon";
		that.index = $(that.icon).index();
		that.src = list[that.index].src;
	}
	leftSideGuidBubble.prototype = {
		//初始化气泡外框，大小可定制
		init:function(){
			var that = this,
				top = that.index*59;
			$(".sidetoolbar").append(helper.replaceTpl(guidbubbleTpl,{"index":that.index}));
			$(".guidbubble"+that.index).css("marginTop",top+"px");
			that.settings.width && $(".guidbubble"+that.index).width(that.settings.width);
			that.settings.height && $(".guidbubble"+that.index).height(that.settings.height);
			icons.changeStatu( that.icon,"hover" );
			that._generate();
			that.settings.replaceSrc && that._replaceImg();
			that._bindEvent();

		},
		//构造气泡内容
		_generate:function(){
			var that = this,
				settings = that.settings,
				//上半部分内容
				normaltpl = $(".guidbubble"+that.index).find(".guidbubble-normal"),
				//下半部分内容
				slidetpl = $(".guidbubble"+that.index).find(".guidbubble-slide"),
				//解决gif图片缓存问题添加的随机数
				rnum = Math.random();
			settings.openable && normaltpl.addClass("opencontent");
			normaltpl.append(helper.replaceTpl(settings.normalTpl,{"random":rnum}));
			normaltpl.height(settings.normalTplHeight);
			normaltpl.css("lineHeight",settings.normalTplHeight+"px");
			if( settings.slideTpl.length ){
				slidetpl.append(settings.slideTpl);
				slidetpl.height(settings.slideTplHeight);
				slidetpl.css("lineHeight",settings.slideTplHeight+"px");
			}
			else{
				slidetpl.hide();
			}
			that._initTimer();
			isfold = 1;

		},
		//初始化显隐策略，默认5秒后消失
		_initTimer:function(){
			var that = this;
			that.settings.timer = setTimeout(function(){
				$(".guidbubble"+that.index).hide();
				icons.changeStatu( that.icon );
				isfold = 0;
			},that.settings.time);
			$(".speedresult").length && that.initSpeedtestTimer();
		},
		initSpeedtestTimer:function(){
			var that = this;
			setTimeout(function(){
				$(".speedresult").show();
				$(".processbar").hide();
				$(".testbtn").show();
				that.settings.replaceSrc && that._resetImg();
			},3000);
		},
		stopTimer:function(){
			var that = this;
			$(".guidbubbles").hide();
			that.settings.timer && clearTimeout(that.settings.timer);
			that.settings.replaceSrc && that._resetImg();
			guider = null;
		},
		_replaceImg:function(){
			var settings = this.settings;
			$(this.icon).find("img").attr("src",settings.replaceSrc);
		},
		_resetImg:function( src ){
			var that = this,
				settings = that.settings;
			src = src || that.src;
			if(!that.settings.replaceSrc){
				return;
			}
			$(that.icon).find("img").attr("src",src);
		},
		//绑定一些默认的事件，包括关闭气泡和打开对应内容区
		_bindEvent:function(){
			var el = $(".guidbubble"+this.index),
				that = this;
			el.find(".guidbubble-close").click(function(){
				el.hide();
				that.stopTimer();
				icons.changeStatu( that.icon );				
				isfold = 0;
				setBubbleCookie( "sideBarGuid",guid );
				
			});
			$(".opencontent").click(function(){
				var content = new leftSideContents(that.index);
				messageb.handleVisibel( $(that.icon).find("i"),"" );
				content.handleStatu();
				icons.changeStatu( that.icon,"selected" );
				that.stopTimer();
				setBubbleCookie( "sideBarGuid",guid );
				isfold = 1;
				UT.send({
					modId:"sidetoolbar",
					type:"click",
					position:guid.list[guid.modVersion].id,
					sort:"bubbleOpenContent",
					ac:"b"
				});
				that.settings.replaceSrc && that._resetImg();
			});

		}
	}
	function leftSideIcon(){

	}
	leftSideIcon.prototype = {
		init:function(){
			var li = "",
				tipType = getBubbleType( tipOption ),
				tipCookie = $.cookie.get("sideBarRedIcon");
			$.each(list,function( key,value ){
				li = li + helper.replaceTpl(iconTpl,{"id":value.id,"src":value.src,"hoverWord":value.hoverWord,"link":value.link,"tip":value.tip});
			});
			$(".applist").append(li);
			this._bindEvent();
			tipCookie && (tipType != tipCookie) && resetCookie( "sideBarRedIcon" );
			$(".applist-i").each(function(i){
				var visibitily = false;
				$(this).text().length && (visibitily = getBubbleVisibility( tipOption,"sideBarRedIcon" ));				
				!visibitily && $(this).text("");
				messageb.handleVisibel($(this),$(this).text());
			});
		},
		//处理icon的点击行为，包括打开一个链接或展开内容区
		_clickHandle:function( el ){
			var index = el.index(),
				link = el.attr("icon-link"),
				content = null;
			var	type = getBubbleType( guid );
			if( link.length ){
				window.open( link );
				sidetoolbar.unfoldAll();
			}
			else{
				// for iframe @chenliang
				!el.attr( "hasClicked" ) && el.attr( "hasClicked", "true" );
				content = new leftSideContents( index );
				content.handleStatu();
				!$.cookie.get("sideBarGuid") && (list[index].id == guid.list[guid.modVersion].id)
				&& setBubbleCookie( "sideBarGuid",guid );
			}

			!$.cookie.get("sideBarRedIcon") && el.find(".applist-i").text().length && setBubbleCookie( "sideBarRedIcon",tipOption );

			guider && guider.stopTimer();


		},
		//改变icon的样式状态
		changeStatu:function( el,st ){
			var el = $(el),
				arrow = el.find("b");
			//选中效果
			if( st === "selected" ){
				el.attr("isflod","true");
				el.removeClass("applist-li_fold");
				arrow.show();
			//hover效果
			} else if ( st === "hover" ) {
				el.addClass("applist-li_fold");
			//默认状态
			} else {
				el.removeClass("applist-li_fold");
				el.attr("isflod","");
				arrow.hide();
			}
		},
		_bindEvent:function(){
			var that = this;
			$(".applist-li").on("click",function(){
				var $this = $(this),
					arrow = $this.find("b");
				guiderTimer && clearTimeout(guiderTimer);
				$(".applist-li .ui-arrow").hide();
				$this.find(".applist-div").hide();
				$(".applist-li").removeClass("applist-li_fold");
				if( $this.attr("isflod").length ){
					$this.attr("isflod","");
					arrow.hide();
				}
				else{
					$this.attr("isflod","true");
					arrow.show();
				}
				that._clickHandle( $this );
				messageb.handleVisibel( $this.find(".applist-i"),"" );
				UT.send({
					modId:"sidetoolbar",
					type:"click",
					sort:"icons",
					position:$this.attr("icon-name"),
					ac:"b"
				});
			});
			$(".applist-li").hover(
				function(){
					//如果右侧有元素，则不显示hover提示
					!isfold && $(this).find(".applist-div").css("display","table");
				},
				function(){
					$(this).find(".applist-div").hide();
				}
			);
		}
	}

	//整体
	var sidetoolbar = {
		hasInited:0,
		init:function(){
			$(".sidetoolbar").append(sidetoolbar_foldTpl);
			$("#sidetoolbarContainer").height((list.length+1)*57+list.length+1);
			this.bindEvent();
			!$.cookie.get("sidebarVersion") && $.cookie.set("sidebarVersion",conf.sidetoolbar.version,{expires:2000});
			if( $.cookie.get("sidebarVersion") != conf.sidetoolbar.version ){
				$.cookie.set("sidebarVersion",conf.sidetoolbar.version,{expires:2000});
				$.cookie("sidebartool", "1", {expires:2000});
				$(".sidetoolbar-closebtn").addClass("closebtn_close").css("display","block");
				$(".sidetoolbar").addClass("sidetoolbar_fold");
				this.trigger();
				return;
			}
			//如果分辨率小于1024或者计有cookie则默认收起
			if(!$.cookie.get("sidebartool") && $(document).width() > 1024 || $.cookie.get("sidebartool") == 1){
				$(".sidetoolbar-closebtn").addClass("closebtn_close").css("display","block");
				$(".sidetoolbar").addClass("sidetoolbar_fold");
				this.trigger();
			}
			else{
				$(".sidetoolbar-close_flod").addClass("sidetoolbar_unfold");
				$(".sidetoolbar-closebtn").addClass("closebtn_open").css("display","block");
			}


		},
		//构造
		trigger:function(){
			icons = new leftSideIcon();
			messageb = new messageBubble();
			icons.init();
			if(guid && !guid.hide){
				var type = getBubbleType( guid ),
					sideBarGuid = $.cookie.get("sideBarGuid");
				//如果更换了cookie策略或者更换了气泡版本则重置气泡的cookie	
				((sideBarGuid && sideBarGuid != type) || ($.cookie.get("sideBarGuidVersion") != guid.modVersion)) && resetCookie("sideBarGuid");
				var isInit = getBubbleVisibility( guid,"sideBarGuid" );

				isInit && (isfold = 1) && (guiderTimer = setTimeout(function(){					
					guider = new leftSideGuidBubble(guid.list[guid.modVersion]);
					guider.init();
					$.cookie.set("sideBarGuidVersion", guid.modVersion, {expires:2000});
				},3000));

			}
			this.hasInited = 1;
		},
		
		//收起
		unfoldAll:function(){
			$(".contents").removeClass("contents_unfold");
			icons.changeStatu(".applist-li");
			guider && guider.stopTimer();
			guiderTimer && clearTimeout(guiderTimer);
			isfold = 0;
		},
		//处理点击dropdownList组件的内容时，左侧栏意外收起的情况
		isDropDown:function( list,el ){
			var flag = false;
			for(var i = 0; i<list.length; i++){
				if( $.contains($(list[i])[0],el) ){
					flag = true;
					break;
				}	
			}
			return flag;
		},
		bindEvent:function(){
			var that = this,
				closebtn = $(".sidetoolbar-closebtn"),
				close_flod = $(".sidetoolbar-close_flod"),
				sidetoolbar = $(".sidetoolbar");

			//展开按钮
			$("#sidetoolbarContainer").on("click",".closebtn_open,.sidetoolbar_unfold",function(){
				close_flod.removeClass("sidetoolbar_unfold");
				closebtn.removeClass("closebtn_open").addClass("closebtn_close");
				sidetoolbar.addClass("sidetoolbar_fold");
				$.cookie("sidebartool", "1", {expires:2000});
				!that.hasInited && that.trigger();
				UT.send({
					modId:"sidetoolbar",
					type:"click",
					position:"openBar",
					ac:"b"
				});

			})
			//关闭按钮
			.on("click",".closebtn_close",function(){
				that.unfoldAll();
				close_flod.addClass("sidetoolbar_unfold");
				closebtn.removeClass("closebtn_close").addClass("closebtn_open");
				sidetoolbar.removeClass("sidetoolbar_fold");
				$.cookie("sidebartool", "0", {expires:2000});
				UT.send({
					modId:"sidetoolbar",
					type:"click",
					position:"closeBar",
					ac:"b"
				});

			});
			$(".sidetoolbar-close_flod").hover(
				function(){
					$(".sidetoolbar-closebtn").addClass("sidetoolbar-closebtn_hover");
				},
				function(){
					$(".sidetoolbar-closebtn").removeClass("sidetoolbar-closebtn_hover");
				}
			);

			//点击非左边栏区域时收起内容区
			$(document).on("mousedown",function(e){
				var el = e.target,
					specialDropDown = [],
					dropdownList = list[contentindex].widget[0].bodyDropdown;
				dropdownList && (specialDropDown = dropdownList.split(","));

				if( el != $("#sidetoolbarContainer")[0] && !$.contains($("#sidetoolbarContainer")[0],el)){
					if(specialDropDown.length && that.isDropDown(specialDropDown,el) ){
						return;
					}

					$(".contents").removeClass("contents_unfold");
					icons && icons.changeStatu(".applist-li");
					!guider && (isfold = 0);
				}
			});
		}
	}
	sidetoolbar.init();
};
module.exports = sideToolBar;
