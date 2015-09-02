var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require('common:widget/ui/helper/helper.js');
var cycletabs = require("common:widget/ui/cycletabs/cycletabs.js");

!function starthelper () {
	var liItem = '<li class="li-item">'
				+ '<a class="a-item" href="#{url}">'
				+	'<img src="#{src}" class="item-img" />'
				+	'<span class="opacity-title"><span class="title text">#{title}</span></span>'
				+ '</a>'
			+ '</li>',
		ulItem = '<ul class="ul-content cf">',
		_conf = conf.pcf_starthelper,
		el = $(".div-con",".mod-pcfstatic-starthelper"),
		mod = _conf.modType;//有两种模式，一种为两图一组，一种为一图一组

	/*****PCF统计*****/
	var userid = window.location.search.match(/(^|&|\\?)id=([^&]*)(&|$)/i);	
	var PCF_conf = {
		params: {
			fr: _conf.pcfFr,
			id: userid === null ? "/" : userid[2]
		}
	};
	var PCF = {
		url: "http://www.pcfaster.com/static/img/pvi.gif",
		send: function(e, t) {
			e = e || {};
			var n = PCF_conf,
				r = t && t.url || this.url,
				i = t && t.params || n.params,
				s = e.t = +(new Date),
				o = window,
				u = encodeURIComponent,
				a = o["PCF" + s] = new Image,
				f, l = [];
			if (i) for (var c in i) i[c] !== f && e[c] === f && (e[c] = i[c]);
			for (f in e) l.push(u(f) + "=" + u(e[f]));
			a.onload = a.onerror = function() {
				o["PCF" + s] = null
			}, a.src = r + "?" + l.join("&"), a = l = null
		}
	};	
	PCF.send({act: "loaded"});
	var canSetHome = true;
	//判断是否有openUrl方法
	function hasOpenUrl(){
		return external && external.PCFCommon && external.PCFCommon.OpenUrl;
	}
	//停止事件的默认行为
	function stopDefault(e) {
		if (e && e.preventDefault) {
			e.preventDefault();

		} else {
			window.event.returnValue = false;

		}
	}
	//关闭按钮的响应事件
	function closeWindow(){
		PCF.send({act: "close"});
		javascript: try {
			window.external.Close();
		} catch (e) {
			window.close();
		}
	}
	//设置首页
	function setHome(){
		if ($("#setHome").attr("checked") && canSetHome) {
			canSetHome = false;
			if (external && external.SetHomePageEx !== undefined) {
				external.SetHomePageEx(_conf.setHome.link, '', '', 2, 2);
				external.SetHomePageEx('', _conf.setHome.link, '', 2, 2);
				external.SetHomePageEx('', '', _conf.setHome.link, 2, 2);
			}
		}
	}
    /*******业务代码********/
	//内容组装
	function renderData(){
		var resultData = [],
			dom = "",
			tempArray = [],
			randomArray = "",
			len = 0,
			links = _conf.list;

		//第一组出现的内容随机选择，后面直接顺序排下来
		//randomArray = mod == 1 ? links.splice(ran,2) : links.splice(ran,1);	
		//mod == 1 ? links.unshift( randomArray[0],randomArray[1] ) : links.unshift( randomArray[0] );
	
		for (var i = 0; i < links.length; i++) {
			if( !links[i] || links[i].hide ) {
				continue;
			}
			tempArray.push(helper.replaceTpl( liItem,{"url" : links[i].url,"src" : links[i].imgSrc,"title" : links[i].title,"index" : i}) );
		};

		len = mod == 1 ? Math.ceil( tempArray.length / 2 ) : tempArray.length;

		for (var j = 0; j < len ; j++) {
			dom = ""; 

			if( mod == 1 ){
				for (var n = 0; n < 2; n++) {
					if ( !tempArray.length ){
						break;
					}
					dom = dom + tempArray.shift();
				};

				dom = ulItem + dom + '</ul>';
			} else {
				dom = ulItem + tempArray[j] + '</ul>';
			}
			
			resultData.push({ "content" : dom,"id" : j+1 });
		};
		
		return resultData;
	}	

	function generateList(){
		var data = renderData(),
			cyc = null;

		//两图模式下，如果只有一组，左右切换按钮不可点	
        mod == 1 && data.length == 1 && $(el).addClass("arrow-disabled");
		var options = {
				offset: 0,
				navSize: 1,
				itemSize: mod == 1 ? 320 : 380,
				autoScroll: _conf.autoScroll ? true : false,
				dir:conf.dir,
				autoScrollDirection:"forward",
				autoDuration: _conf.autoDuration,
				scrollDuration: 300,
				quickSwitch: true,
				containerId: el,
				data: data,
				defaultId: 1
			};

		cyc = new cycletabs.NavUI();
		cyc.init(options);
	}

	function bindEvents(){
		el.on("mouseover",".a-item",function(){
			$(this).addClass("a-item-hover");
		}).
		on("mouseleave",".a-item",function(){
			$(this).removeClass("a-item-hover");
		}).
		on("mousedown",".prev,.next",function(){
			$(this).addClass("arrow-down");
		}).
		on("mouseup",".prev,.next",function(){
			$(this).removeClass("arrow-down");
		}).
		on("mouseover",".switch-item",function(){
			UT.send({
				type:"click",
				ac:"b",
				position:"switch",
				modId:"pcfstatic-starthelper"
			});
			$(this).trigger("click");
		}).
		on("click",".prev,.next",function(){
			UT.send({
				type:"click",
				ac:"b",
				position:"switch",
				modId:"pcfstatic-starthelper"
			});
		});
		$(document).on("click",function(e){
			var t = e.target,
				el = $(t);

			
			if (t.tagName === 'SPAN' || t.tagName === 'IMG' || t.tagName === 'A' || t.tagName === "I") {
				setHome();
			}
			if (t.tagName=="INPUT" || t.tagName == "LABEL") {
				UT.send({modId:"homepage", type:"other"});
			}else{
				for (var n = 0; n <= 2; n++) {
					if (t.tagName === "BODY" || t.tagName === "HTML") break;
					if (t.tagName === "A") {
						var data = UT.link(t);
						if(t.getAttribute("log-mod")=="more"){
							data.type = "other";
							UT.send(data);
						}else{
							PCF.send({
								act: "click_link",
								pos: 'content'
							});
							if(hasOpenUrl() && data.url && data.url != "none"){
								external.PCFCommon.OpenUrl(data.url);
								stopDefault(e);
							}
						}
						break;
					}
					t = t.parentNode;
				}
			}
		});

		mod == 1 && el.find(".switch").css("marginLeft",-el.find(".switch").width()/2-3);
	}

	generateList();
	bindEvents();
	
	
}();














