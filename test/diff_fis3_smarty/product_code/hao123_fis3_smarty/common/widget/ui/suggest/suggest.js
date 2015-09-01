/*
author: 斯人
QQ: 103024979
Email: leecade@163.com

todo:

1. 分离出配置参数中可能会reset的部分，便于在reset时参照，避免每次reset都要声明false，如，目前重置时，要禁用的的参数必须写{url:false,tpl:false}

2. callbackDataNum 未用undef判断很不严谨，很有可能为0

3. 增加隐藏但未清空的状态记录

4. 序号同步

bugs:

1. chrome 必须按END（输入框空值时）两次才能滚动页面

2. chrome浏览器+google输入法未改变input值时即会触发change


update: 2011.12.21

1. 增加onMouseSelect事件接口（通过鼠标点选sug后触发），以适应统计需求

update: 2011.11.28

1. 增加onFill事件接口，以兼容之前版本
2. 更新input value时过滤html标签，之前版本有，改写时忘加了
3. 增加一个启动监控的条件，必须实例拥有url，方便切换时可能遇到无sug的搜索

update: 2011.10.25
1. 更改了sug触发的逻辑，之前通过比对当前输入词与查询词，不同则触发。这导致了比较严重的bug，比如当前输入"a"，切换焦点关闭sug后，再次输入"a"不再触发sug。（百度首页亦同，等我去提醒他们）
2. 回车的保持sug隐藏策略（保留选中项、索引等）

update: 2011.10.15
1. 增加参数t控制请求时是否增加时间戳

update:

2011.10.8 代码重构:

1. 大幅度提升代码压缩比

2. 抽离工具函数，便于迁移至现成js框架下

3. 考虑之前的对齐方式可能会侵入布局结构（比如依赖于input外层元素并需设其为相对定位），增加一种无依赖的纯绝对定位方式（动态计算input坐标）

4. 考虑input外层元素可能为绝对定位等情况，不再强制设其为相对定位，增加判断

5. 抽离shim样式，避免动态计算高度

6. 考虑兼容autoCompleteData模式、支持noSubmit、屏蔽IE6下ESC清空input值等情况，劫持onkeydown，即：重复绑定input的keydown，请用on(input, "keydown", function(){...})形式

7. 参考google增加策略：持续按上/下键时延迟响应和按ESC关闭后通过上/下键可以打开并保持选择项
*/

var UT = require("common:widget/ui/ut/ut.js");

;;(function(WIN, DOC, undef) {

//fastst trim, form: http://blog.stevenlevithan.com/archives/faster-trim-javascript
String.trim || (String.prototype.trim = function() {
	var str = this,
		str = str.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
});

//replace string by object, like "#{name}"
String.replaceTpl || (String.prototype.replaceTpl = function(o) {
	return this.replace(/#\{([^}]*)\}/mg, function(a, b) {
		return a = o[b.trim()]
	});
});

//encode html code("&", "<", ">", """, "'")
//实体字符全用Unicode表示
//IE不支持单引号的实体名称，故转为实体编号"&#39;"
//增加对"©"符的转义
String.htmlEncode || (String.prototype.htmlEncode = function() {
	return String(this).replace(/\x26/g,'&amp;').replace(/\x3c/g,'&lt;').replace(/\x3E/g,'&gt;').replace(/\x22/g, "&quot;").replace(/\x27/g, "&#39;").replace(/\xA9/g, "&copy;");
});

var SPACE = " ",
	NULL = null,
	htmlReg = /<[^>]+>/g,	//过滤html标签
	
	//IE8报错
	//CLASSLIST = !!(WIN.Element && Element.prototype.hasOwnProperty("classList")),
	CLASSLIST = document.documentElement.classList !== undef,
	isIE = /\w/.test('\u0130'),
	isIE6 = isIE && !WIN.XMLHttpRequest,
	isIE9 = DOC.documentMode && DOC.documentMode === 9,

/*
if use any library, these functions can be replaced like:
hasClass = T.baidu.hasClass
*/

//namespace "window", "window.a", "a", "a.b.c" and any custom context
/*
ns = function(s, context) {
	if(!s) return s;
	var ret = s.replace(/^window.?/, "").split("."),
		li;
	context = context || WIN;
	while(li = ret.shift()) context = context[li] = context[li] || {};
	return context;
},

ns = function(s, context) {
	context = context || WIN;
	if(!s) return context;
	var ret = s.replace(/^window\.?/, "").split("."),
		li;
	ret.pop();
	while(li = ret.shift()) context = context[li] = context[li] || {};
	return context;
},
*/
namespace = function(s) {
	if(!s) return;
	var ret = s.split("."),
		len = ret.length,
		context = window,
		i = 0,
		p;
	
	//兼容处理形如"baidu.sug.xx"的回调方法名
	if(len > 1) {
		for(; i < len - 1; i++){
			p = ret[i];
			context = (0 === i && context[p]) ? context[p] : p in context ? context[p] : context[p] = {};
		}
	};
	return context;
},

hasClass = CLASSLIST ? function(el, cls) {
	return el.classList.contains(cls);
} : function(el, cls){
	return -1 < (SPACE + el.className + SPACE).indexOf(SPACE + cls + SPACE);
},
addClass = CLASSLIST ? function(el, cls) {
	el.classList.add(cls);
} : function(el,cls) {
	if (!hasClass(el,cls)) el.className += (el.className ? SPACE : "") + cls;
},
removeClass = CLASSLIST ? function(el,cls) {
	el.classList.remove(cls);
} : function(el,cls) {
	if(!hasClass(el,cls)) return;
	var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
	el.className = el.className.replace(reg, SPACE);
},
on = DOC.addEventListener ? function(el,type,callback){
	el.addEventListener(type, callback, !1);
} : function(el,type,callback){
	el.attachEvent("on" + type, callback);
},
bind = function(el, type, fun) {
	on(el, type, function(e) {
		e = e || WIN.event;
		var el = e.srcElement || e.target;
		fun.call(el, e);
	});
},
getStyle = isIE ? function(el, style) {
	style = style.replace(/\-(\w)/g, function(a, b){
		return b.toUpperCase();
	});
	return el.currentStyle[style];
} : function(el, style) {
	return DOC.defaultView.getComputedStyle(el, null).getPropertyValue(style)
},
getCookie = function(name) {
	var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
},

//construct
_sug = function(el, o) {
	
	//ignore "new"
	if(!(this instanceof _sug)) return new _sug(el, o);
	
	var that = this;
	
	//"id" or el
	that.el = el + "" === el ? DOC.getElementById(el) : el;
	//null/undefind
	if(!that.el) return;
	
	//default arguments
	that.o = {
		
		//样式接口及默认样式名
		classNameWrap: o.classNameWrap || "sug-wrap",			//suggest内容面板className
		classNameQuery: o.classNameQuery,						//查询词高亮样式，如不定义则不增加span标签（避免和回调数据重复定义）
		classNameQueryNull: o.classNameQueryNull,				//提示条目不能匹配查询词时
		classNameSelect: o.classNameSelect || "sug-select",		//列表选中样式（方向键选择响应和鼠标hover）
		classNameClose: o.classNameClose || "sug-close",		//关闭按钮样式
		classNameShim: o.classNameShim || "sug-shim",			//ie6下shim样式
		locAbs: o.locAbs || false,								//提示层是否绝对定位（默认相对于input外框定位）
		
		pressDelay: o.pressDelay === undef ? 3 : o.pressDelay,	//上/下键选择的延迟程度，false||0||null ==> 禁止干涉（浏览器默认速度很快，难以准确选择）, 1 ==> 禁止按住连续选择（只能通过多次敲击进行选择），Num ==> 数字(>1)越大，响应越慢，未配置该参数 ==> 3
		autoFocus: o.autoFocus || false,						//自动获取焦点
		delay: o.delay || 200,									//调整触发相应速度
		n: o.n || 10,											//最多显示列表数
		t: o.t || true,											//请求时是否自动附加时间戳
		
		//数据接口配置
		autoCompleteData: o.autoCompleteData || false,			//autoComplete模式（数组），优先
		//or
		url: o.url || false,									//数据url
		charset: o.charset,										//未配置则不设置script节点该属性
		
		//回调接口配置，根据返回数据形式任选一种：
		callbackFn: o.callbackFn || false,						//回调函数名，允许链式字符串
		//or
		callbackName: o.callbackName || false,					//回调变量名，允许链式字符串
		
		
		//配置返回数据中的填充内容，根据数据格式任选一种:
		callbackDataKey: o.callbackDataKey || false,			//json（如{s: [$1,$2,$3]}，这里callbackDataKey为"s"）
		//or
		callbackDataNum: o.callbackDataNum || false,			//array（如[s,[$1,$2,$3]]，这里callbackDataNum为1）
		
		
		requestQuery: o.requestQuery || false,					//数据请求API接口中的查询参数
		requestParas: o.requestParas || {},						//请求数据时的自定义参数
		
		
		//是否自动提交表单
		noSubmit: o.noSubmit || false,						//默认为true
		
		
		//注册事件
		onSelect: o.onSelect,		//鼠标点选或回车提交时（在表单提交前）

		onSearchDirect: o.onSearchDirect, // 搜索直达统计
		onCheckForm: o.onCheckForm, // 当表单通过submit()方法提交时触发，添加haobd参数

		onMouseSelect: o.onMouseSelect,	//鼠标点选后触发（在表单提交前）
		onShow: o.onShow,			//提示层显示时
		onHide: o.onHide,			//提示层隐藏时
		onFill: o.onFill,  			//input内容被填充时
		onRequest: o.onRequest,		//*每次请求前（用于修正url）
		onSucess: o.onSucess,		//每次请求数据成功时
		onError: o.onError,			//每次请求数据失败时
		onQueryChange: o.onQueryChange,  //query发生变化时触发
		onKeyEsc: o.onKeyEsc, //按下ESC键时
		customUrl: o.customUrl || false,		//增加一个自定义拼装请求URL和参数的接口
		
		templ: o.templ || false									//暴露的自定义模板
	}
	
	//el(input)'s wrap
	that.wrap = that.el.parentNode;
	
	//初始化
	that.init();
},

//ths prototype's shortcut
_ = _sug.prototype;

_.init = function() {
	
	var that = this,
		o = that.o;
	
	//init layout
	that.layoutInit();
	
	that.reset();
	
	//init input handle
	that.inputHandle();
	
	//if need autoFocus
	o.autoFocus && setTimeout(function() {
		that.el.focus();
	}, 16);
	
	//autoComplete模式
	if(o.autoCompleteData) return;
	
	var callbackFn = o.callbackFn,
		context = namespace(callbackFn, true),
		ret = callbackFn.split("."),
		lastName = ret.pop();
		
	//common callback(callbackFn || callbackName)
	that.callback = function(data) {
		
		data = data || {};
		
		var self = arguments.callee;
		
		//callback's multiton pattern
		that = callbackFn && self.repeat ? self.context || that : that;
		
		that.o.onSucess && that.o.onSucess.call(that);
		
		/*
		if(!data) {
			that.hide(1);
			that.isHide = false;
			return;
		}
		*/
		
		var key = that.o.callbackDataKey || that.o.callbackDataNum,
		
			//callback([a1, a2, a3])
			_data = key ? data[key] : data;
		
		if(!_data || !_data.length) {
			that.hide(1);
			
			//if nondata reset isHide state
			that.isHide = false;
			return;
		}
		
		that.fill(data, that.q);
		that.show();
		
		//cache data
		that.cache[that.q] = data;
	};
	
	//mark the same name callback
	if(context[lastName]) context[lastName].repeat = true;
	
	//callbackFn refer to callback
	else if(callbackFn) context[lastName] = that.callback;
}

//reset
_.reset = function(o) {
	
	var that = this,
		k;
		
	for(k in o) that.o[k] = o[k];
	
	//cache
	that.cache = {};
		
	//cache last query
	that.q = "";
	
	//current selected item(synchronize keyboard and mouse)
	that.s = NULL;
	
	//current selected item's index(update when content change)
	that.i = -1;

	that.val = ""; //用于获取请求SUG数据的词

	//timer
	that.inputTimer();
	
	//重置隐藏状态，否则切换tab会认为isHide
	that.isHide = false;
	
	//隐藏
	that.hide(1);
}
//layoutInit
_.layoutInit = function() {
	var that = this,
		o = that.o,
		wrap = o.locAbs ? DOC.body : that.wrap,
		
		//sug layer's wrap
		sugWrap = that.sugWrap = DOC.createElement("div");
	
	that.el.setAttribute("autocomplete", "off");
	
	//fix IE6'z-index bug
	if(isIE6) {
		
		//shim's height unknown
		var shim = that.shim = sugWrap.appendChild(DOC.createElement("iframe"));
		shim.src = "about:blank";
		addClass(shim, o.classNameShim);
		shim.frameBorder = 0;
		shim.scrolling = "no";
		that.content = sugWrap.appendChild(sugWrap.cloneNode(null));
	} else {
		that.content = sugWrap;
	}
	addClass(sugWrap, o.classNameWrap);
	
	//set the input's prentNode's position if "locAbs" is true and it's "position" isn't "absolute"
	!o.locAbs && getStyle(wrap, "position") === "static" && (wrap.style.position = "relative");
	
	wrap.appendChild(sugWrap);
}

//显示
_.show = function() {
	this.sugWrap.style.display = "";
	
	//that.isHide = false;
	//注册onShow
	this.o.onShow && this.o.onShow.call(this);
}

//隐藏
//hide sug layer, 0||null ==> reset and !clear, 1 ==> clear and reset, 2 ==> !clear and !reset
_.hide = function(type) {
	var that = this;
	that.sugWrap.style.display = "none";
	
	//updata that.q,or (a——andiod) after submit,input a,can't triggers sug
  	that.q = that.el.value;
	
	if(type != 2) {
		that.s = NULL;
		that.i = -1;
	}
	
	type == 1 && that.fill();
	
	//注册onHide
	that.o.onHide && that.o.onHide.call(that);
}

_.holdFocus = function(el, e) {
	if(e.preventDefault) {
		e.preventDefault();
	} else {
		el.onbeforedeactivate = function() {
			WIN.event.returnValue = false;
			el.onbeforedeactivate = null;
		}
	}
}

//inputTimer, 1||true ==> start, 0||false||null ==> stop
_.inputTimer = function(n) {
	
	var that = this,
		el = that.el,
		t = that.t,
		value;
	
	//start
	if(n) {

		//增加一个启动监控的条件，必须实例拥有url，方便切换时可能遇到无sug的搜索
		if(t || (!that.o.autoCompleteData && !that.o.url)) return;
		
		that.t = setInterval(function() {
			value = el.value;
			
			//input值为空直接隐藏不触发更新
			if(!value.trim()) {
				that.hide(1);
				that.q = value;

				that.o.onQueryChange && that.o.onQueryChange.call(that);
				return;
			}
			
			//输入值与上次更新值不同时触发更新（包含空格）
			if(value !== that.q) {
				that.updata(value);
			} else {
				that.val = value; // 确保SUG请求已缓存（不发送SUG请求）时也可以获得用户实时输入值
			}
			
			that.o.onQueryChange && that.o.onQueryChange.call(that, !!value.trim());
			
			/*FF监控bug
			//NUL ==> hide
			if(!value.trim()) {
				that.hide(1);
				
				
				//当输入 ==> 清空 然后切换tab时会出现bug，临时修复
				clearInterval(that.t);
				that.t = 0;
				
				//记录当前值
				that.q = value;
				return;
			}
			//更新触发显示逻辑！
			clearInterval(that.t);
			that.t = 0;
			that.updata(value);
			*/
		}, that.o.delay);
	}
	
	//stop
	else {
		t && clearInterval(that.t);
		that.t = 0;
	}
}

//get index form list
_.getIndex = function(el, list) {
	var l = list.length;
	while(l--) if(list[l] === el) return l;
	return -1;
}

//get eligible el form wrap
_.matchEl = function(el, wrap, fun) {
	while(el !== wrap) {
		if(fun.call(el)) return el;
		el = el.parentNode
	}
	return NULL;
}

_.submitForm = function() {
	var form = this.el.form;
	if(form.onsubmit) {
		form.onsubmit();
	} else {

		this.o.onCheckForm && this.o.onCheckForm(form);
		form.submit();
	}
	//this.q = this.el.value;
}

//move by keydown
_.keydownMove = function(k) {
	
	var that = this,
		ol = that.sugWrap.getElementsByTagName("OL")[0];
		
		//console.log(that.i)
	if(!ol) return;
	if(that.isHide) {
		that.isHide = false;
		return;
	}
	
	var list = ol.getElementsByTagName("LI"),
		l = list.length,
		el = that.el,
		s = that.s,
		o = that.o,
		classNameSelect = o.classNameSelect,
		q = that.q || "",
		li;
	if(s) {
		removeClass(s, classNameSelect);
		
		//updata index
		that.i = that.getIndex(s, list);
		
		//置空当前选中项
		that.s = NULL;
	}
	
	//fix
	that.i === undef && (that.index = -1);
	that.i !== -1 && removeClass(list[that.i], classNameSelect);
	
	//根据键值判断是向上/下选择
	if(k === 40) {
		that.i++;
	} else if(k === 38){
		that.i--;
	}
	
	//UP when init
	if(that.i === -2) {
		that.i = l - 1;
	}
	
	//above
	else if(that.i === l){
		el.value = q;
		that.i = -1;
	}
	else if(that.i === -1) {
		el.value = q;
	}
	
	if(that.i !== -1 && that.i !== l) {

		li = list[that.i];
		addClass(li, classNameSelect);
		!o.autoCompleteData && (el.value = li.getAttribute("q").replace(htmlReg, ""));
		that.s = li;
	}
}

_.inputHandle = function() {
	var that = this,
		o = that.o,
		el = that.el,
		form = el.form,
		sugWrap = that.sugWrap,
		classNameSelect = o.classNameSelect,
		autoCompleteData = o.autoCompleteData,
		pressCount = 0,
		k;

	// 解决keydown弹窗在firefox、IE下阻止的问题
	el.onkeypress = function(e) {
		e = e || window.event;
		k = e.keyCode;

		var targt = that.s? that.s.getElementsByTagName("a")[0] : null,
			url = "";

		if(k === 13 && targt) {
			url = targt.getAttribute("href");
			that.el.blur();
			
			window.open(url);

			if(e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
		}
	}

	el.onkeydown = function(e) {
		e = e || window.event;
		k = e.keyCode;

		
		// ESC key,hide and reset input value
		if(k === 27) {
			that.hide(2);
			//排除掉空数据，没想到更好的方法
			sugWrap.getElementsByTagName("ol")[0] && (that.isHide = true);
			!autoCompleteData && (el.value = that.q);
			that.inputTimer();

			that.o.onKeyEsc && that.o.onKeyEsc.call(that);
			
			//IE8也会清空，为保证策略一致，全屏蔽
			//fix IE6 ESC clear input'value
			//if(isIE6) return false;
			
			return false;
		}
		
		// direction key(PgUp, PgDn, End, Home, Left, Up, Right, Down)
		else if(k > 32 && k < 41) {
			//change input's focus when value is null because maybe autoFocus
			//bug: chrome按两次end才能滚动
			if (!el.value && sugWrap.style.display === "none") {
				el.blur();
			}
			
			//DOWN/UP key
			else if(k === 40 || k === 38) {
				if(!o.pressDelay || pressCount++ === 0) {
					//if isHide just show
					that.isHide && that.show();
					that.keydownMove(k);
					that.inputTimer();
				} else if(pressCount === o.pressDelay) {
					pressCount = 0;
				}
				
				//stop nonIE default event,like:chrome press UP key will set cursor position to the first
				!isIE && e.preventDefault();
			}
		}
		
		// ENTER key
		else if(k === 13) {
			that.inputTimer();
			
			//保持隐藏策略
			that.hide(2);
			
			//onSelect
			o.onSelect && o.onSelect.call(that);

			// 搜索直达统计
			if(that.s && hasClass(that.s, "sug-url")) {
				o.onSearchDirect && o.onSearchDirect(that.s, el.value, that.val);
			}

			//增加autoCompleteData模式
			if(autoCompleteData) {
				/*
				var list = sugWrap.getElementsByTagName("OL")[0].getElementsByTagName("LI");
				el.value = list[that.index].getAttribute("q");
				return false;
				*/
				
				el.value = that.s ? that.s.getAttribute("q").replace(htmlReg, "") : "";

				//注册onFill
				that.o.onFill && that.o.onFill.call(that);
				return false;
			}

			//noSubmit
			if(o.noSubmit) return false;
		}
		
		//block some comb key,like (Alt, Ctrl, Tab)
		else if(k > 8 && k < 19) {
			
			//chrome press ALT will lose focus
			//排除tab键，允许脱离焦点
			k !==9 &&that.holdFocus(el, e);
			return;
		}
		
		//other keys
		else {
			that.inputTimer(1);
		}
	}
	
	on(el, "keyup", function() {
		//reset pressCount
		pressCount = 0;
	})
	
	on(el, "blur", function() {
		that.hide(2);
		
		//排除掉空数据，没想到更好的方法
		sugWrap.getElementsByTagName("ol")[0] && (that.isHide = true);
		that.inputTimer();
	});
	
	bind(sugWrap, "mouseover", function() {
		
		//match the "li" tag
		var li = that.matchEl(this, sugWrap, function() {
			return this.tagName === "LI";
		});
		
		if(!li) return;
		that.s && removeClass(that.s, classNameSelect);
		addClass(li, classNameSelect);
		that.s = li;
	});
	
	bind(sugWrap, "mouseout", function() {
		var li = that.matchEl(this, sugWrap, function() {
			return this.tagName === "LI";
		});
		this.tagName === "LI" && this !== li && removeClass(li, classNameSelect)
	});
	
	on(sugWrap, "mousedown", function(e) {
		that.inputTimer();
		
		//hold input's focus
		that.holdFocus(el, e);
	});
	
	bind(sugWrap, "mouseup", function(e) {
		
		var ol = sugWrap.getElementsByTagName("OL")[0],
			li;
			//val = el.value; // search input current value
		
		//block the right mouse button
		if(!ol || e.which && e.which > 2 || e.button && (e.button !== 1 && e.button !== 4)) return;
		
		hasClass(this, o.classNameClose) && that.hide();
		
		//match the "li" tag
		li = that.matchEl(this, sugWrap, function() {
			return this.tagName === "LI";
		});
		
		if(!li) return;
		
		el.value = li.getAttribute("q").replace(htmlReg, "");
		that.hide();
		that.inputTimer();
		o.onSelect && o.onSelect.call(that);
		
		
		//updata index
		that.i = that.getIndex(li, ol.getElementsByTagName("LI"));

		//注册onFill
		that.o.onFill && that.o.onFill.call(that);

		// 当点击元素是直达网址时表单不提交，以链接形式打开网站，同时发送统计数据
		if(hasClass(li, "sug-url")) {
			o.onSearchDirect && o.onSearchDirect(li, el.value, that.val);
			return true;

		} else {
			o.onMouseSelect && o.onMouseSelect.call(that, li);
		}

		!o.autoCompleteData && !o.noSubmit && that.submitForm();
	});
}


//fill content(NUL arguments ==> clear)
_.fill = function(data, q) {
	var that = this,
		content = that.content;
		
	if(arguments.length < 2) {
		content.innerHTML = "";
		return;
	}
	
	var o = that.o,
		templ = o.templ,
		classNameQueryNull = o.classNameQueryNull,
		classNameQuery = o.classNameQuery;
		
	this.content.innerHTML = templ ? templ.call(that, data, q) : function() {
		
		data = data[o.callbackDataKey || o.callbackDataNum] || [];
		
		var i = 0,
			l = Math.min(data.length, o.n),
			ret = [],
			li;
		
		//与baidu策略保持一致
		q = q.trim();
		for(; i<l; i++) {
			li = data[i];
			li !== undef && ret.push('<li q="' + li + '"' + (classNameQueryNull && li.indexOf(q) > -1 ? "" : " class=" + classNameQueryNull) + '>' + (classNameQuery ? li.replace(q, '<span class="' + classNameQuery + '">' + q + '</span>') : li) + '</li>');
		}
		return '<ol>' + ret.join("") + '</ol>';
	}();
}

_.updata = function(q) {
	var that = this,
		data = that.o.autoCompleteData || that.cache[q];
	
	that.q = q;
	that.i = -1;
	that.isHide = false;	//updata isHide state
	
	//1.from autoCompleteData or cache
	if(data !== undef) {

		//fix autoComplete模式下可能data为空数组，此时不显示提示层
		if(that.o.autoCompleteData && !data.length) return;
		
		that.fill(data, q);
		that.show();
		return;	
	}
	
	//2.request
	that.request(q);
}

//数据请求方法
_.request = function(q) {
	
	var that = this,
		o = that.o,
		callbackFn = o.callbackFn,
		callbackName = o.callbackName,
		onSucess = o.onSucess,
		onError = o.onError,
		onRequest = o.onRequest,
		callback = that.callback,

		encod = encodeURIComponent,

		url = o.url,
		customUrl = o.customUrl,
		para = o.requestParas,
		ret = [],
		k, li;
		
	//callback by callbackFn(switch the that'ref)
	//if(callbackFn) (li = namespace(callbackFn)).repeat && (li.context = that);
	if(callbackFn) {
		var context = namespace(callbackFn),
			lastFnName = callbackFn.split(".").pop();
		
		//重新注册callback，有可能callbackFn被动态改变了
		context[lastFnName] = that.callback;
		if(context[lastFnName].repeat) {
			context[lastFnName].context = that;
		}
	}
	
	//callback by onload state
	else if(callbackName) {
		li = that.script;
		
		//IE
		if(li.readyState){
			li.onreadystatechange = function(){
				if(li.readyState == "loaded" || li.readyState == "complete"){
					li.onreadystatechange = NULL;
					
					onSucess && onSucess.call(that);
					callback(callbackName);
				}
			};
		}
		
		//Others
		else {  
			li.onload = function(){
				onSucess && onSucess.call(that);
				callback(callbackName);
			};
		}
	}
	
	onError && (that.script.onerror = function(){
		onError.call(that);
	});
	
	//creat new script or replace(nonIE and IE9 will not send request when change url)
	if(!that.script || !isIE || isIE9) {
		var ref = DOC.getElementsByTagName('script')[0];

		li = DOC.createElement("script");
		li.type = "text/javascript";
		li.async = true;
		
		if(that.script) {
			ref.parentNode.replaceChild(li, that.script);
		}
		
		else {
			ref.parentNode.insertBefore(li, ref);
		}
		that.script = li;
	}
	
	//may modify this.o.requestParas or this.o.url before request
	onRequest && onRequest.call(this);
	
	para = function() {
		for(k in para) ((li = para[k]) !== undef) && ret.push(encod(k) + '=' + encod(para[k]));
		
		//增加时间戳
		o.t && ret.push(encod("t") + '=' + encod(+new Date));
		return ret.join("&");
	}();
	
	//charset可能动态设置
	//o.charset && (that.script.charset = o.charset);
	that.script.charset = o.charset ? o.charset : "";
	that.script.src = customUrl && customUrl.call(that, para) || url + '?' + o.requestQuery + '=' + encodeURIComponent(q) + '&' + para;

	that.val = q;  // 获取请求SUG的词
}

//copy to G.sug
WIN.Gl || (WIN.Gl = {}), Gl.suggest = Gl.sug = _sug;

})(window, document);