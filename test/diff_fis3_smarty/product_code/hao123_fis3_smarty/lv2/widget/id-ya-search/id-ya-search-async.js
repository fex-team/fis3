var CLASSLIST = document.documentElement.classList !== undefined,
    SPACE = " ";

var DOC  = document,
    BODY = DOC.body;


window.G = window.G || function(id) {
    return id + "" === id ? document.getElementById(id) : id;
};


var input = G("input"),
    form  = G("form"),
    logo  = G("logo"),
    params = G("submitParams");


"".trim || (String.prototype.trim = function() {
    var str = this.replace(/^\s\s*/, ""),
        ws = /\s/,
        i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
});

"".replaceTpl || (String.prototype.replaceTpl = function(o) {
    return this.replace(/#\{([^}]*)\}/mg, function(a, b) {
        b = b.trim();
        return a = (o[b] && o[b].data ? o[b].data : o[b]) || "";
    });
});

!function(types, li) {
    types = types.split("|");
    while(li = types.shift()) !function(li){
        G["is" + li] = function(obj) {
            return li === {}.toString.call(obj).replace(/^\[object (\w+)\]$/, "$1");
        }
    }(li);
}("String|Array|Object|Number");

/*G.urlEscape = function(s) {
    return s.replace(/[\(\)\.\*\{\}\|\[\]\^\\\`\!]/g, function(li){
        return "%" + {
            "("   : "28"
            , ")"  : "29"
            , "."  : "2E"
            , "*"  : "2A"
            , "{"  : "7B"
            , "}"  : "7D"
            , "|"  : "7C"
            , "["  : "5B"
            , "]"  : "5D"
            , "^"  : "5E"
            , "\\" : "5C"
            , "`"  : "60"
            , "!"  : "21"
        }[li]
    });
};*/

/*G.urlUnEscape = function(s) {

    // decodeURIComponent("%") ==> error
    try{
        s = decodeURIComponent(s);
    }
    catch(e) {}
    return s;
};*/

G.isElement = function(obj) {
    return window.HTMLElement ? obj instanceof HTMLElement : G.isObject(obj) && G.isString(obj.tagName) && obj.nodeType > 0;
};

G.each = function(obj, iterator, context) {
    var i = 0,
        li;
    if(G.isArray(obj)) {
        for(li = obj.length; i < li; i++) if(iterator.call(context, obj[i], i, obj) === false) break;
    }
    else if(G.isObject(obj)) {
        for(li in obj) {
            if(obj.hasOwnProperty(li)) if(iterator.call(context, obj[li], li, obj) === false) break;
        }
    }
};

G.delegate = function(el, type, fn) {
    el.addEventListener
    ? el.addEventListener(type, function(e) {
        return fn.call(e.target, e);
    }, false)
    : el.attachEvent("on" + type, function(e) {
        e = window.event;
        return fn.call(e.srcElement, e);
    })
};

G.hasClass = CLASSLIST ? function(el, cls) {
	return el.classList.contains(cls);
} : function(el, cls) {
	return -1 < (SPACE + el.className + SPACE).indexOf(SPACE + cls + SPACE);
};

G.addClass = CLASSLIST ? function(el, cls) {
	el.classList.add(cls);
} : function(el, cls) {
	if (!G.hasClass(el, cls)) el.className += (el.className ? SPACE : "") + cls;
};

G.removeClass = CLASSLIST ? function(el, cls) {
	el.classList.remove(cls);
} : function(el, cls) {
	if (!G.hasClass(el, cls)) return;
	var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	el.className = el.className.replace(reg, SPACE);
};

/*G.getQuery = function(query, url) {
    return G.urlUnEscape((location.href.match(new RegExp("\\?.*" + query + "=([^&$#]*)")) || ["",""])[1]);
};*/

G.loadJs = function(path, callback) {
    var doc = DOC
        , readyState = "readyState"
        , onreadystatechange = "onreadystatechange"
        , readyState = "readyState"
        , script = "script"
        , pos = doc.getElementsByTagName(script)[0]
        , loaded
        , node
        , li;
    if(path + "" === path) path = [path];
    while(li = path.shift()) {
        node = doc.createElement(script);
        node.onload = node.onerror = node[onreadystatechange] = function() {
            if(loaded || (node[readyState] && !(/^c|loade/.test(node[readyState])))) return;
            node.onload = node.onerror = node[onreadystatechange] = null;
            loaded = 1;
            if(callback && callback.scop) {
                callback.call(callback.scop);
            } else {
                callback && callback();
            }
        };
        node.async = 1;
        node.src = li;
        pos.parentNode.insertBefore(node, pos);
    }
};
G.cookie = function (key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        //options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

App.conf.category = {
    "web": "web",
    "images": "images",
    "video": "video",
    "news": "news"
}[App.conf.category] || "web";
App.conf.query = App.conf.query.trim();
App.conf.baseUrl = location.href.split("?")[0];

App.sugInit = function() {
    G.loadJs([App.sugConf.sugPath], function() {
		var defaultData = App.sugConf.conf,
			sug = {};

		sug = Gl.suggest(input, {
			classNameWrap: "sug-search",
			classNameQuery: "sug-query",
			classNameSelect: "sug-select",
			autoFocus: false,
			requestQuery: defaultData.requestQuery,
			requestParas: defaultData.requestParas,
			url: defaultData.url,
			callbackFn: defaultData.callbackFn,
			callbackDataKey: defaultData.callbackDataKey,
			templ: defaultData.templ || function(data) {
				var _data = data[1] || [],
					q = data[0],
					ret = [],
					i = 0,
					len = _data.length;
				for (; i < len; i++) {
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0] + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			},
			onMouseSelect: function() {
				G.cookie("LV2_s_q", input.value.substring(0,50),{expires: 1});
			}
		});
    });
};
App.categoryInit = function() {
	var i = 0,
	    o = G("searchCategory").getElementsByTagName("a"),
	    index = -1,
	    l = o.length;
	for(; i < l;i++) {
		if(o[i].getAttribute("data-typ") === App.conf.category) {
			index = i;
			break;
		}
	}
	G.addClass(o[(index < 0) ? 0 : index], "cur");

	G.delegate(G("searchCategory"), "click", function(e) {
		if(this.tagName != "A" || G.hasClass(this, 'cur')) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            return;
        }
		this.href = this.getAttribute("data-url").replaceTpl({
			//"q": G.urlEscape(encodeURIComponent(input.value))
			"q": encodeURIComponent(input.value.trim())
		});
		G.cookie("LV2_s_s", this.getAttribute("data-typ"),{expires:1});
	});
};
App.search = function() {
	var paramsTpl = "";
	paramsTpl += "<input type='hidden' name='category' value='" + App.conf.category + "'>";
	paramsTpl += "<input type='hidden' name='pn' value='" + App.conf.pn + "'>";
	params.innerHTML = paramsTpl;

	input.value = App.conf.query;
};
App.renderPn = function(maxPage) {
    /*if(G.isString(str)) return G("PageNavigation").innerHTML = str;*/
    var pn  = App.conf.pn,
        tpl = '<li><a href="#{url}" data-n="#{n}" target="_self">#{t}</a></li>',
        txt = App.pageNavConf,
        i = 2,
        total = 10,
        dot = '<li>...</li>',
        ret = [],
        buildUrl = function(i) {
            return App.conf.baseUrl + "?query=" + encodeURIComponent(App.conf.query) + "&pn=" + i + "&category=" + App.conf.category;
        },
        isLastPage = (pn >= maxPage);

    if(pn > 1) ret.push(tpl.replaceTpl({
        url: buildUrl(pn - 1)
        , n: "<"
        , t: txt["prepage"]
    }));
    ret.push(tpl.replaceTpl({
        url: buildUrl(1)
        , n: 1
        , t: 1
    }));

    if(pn > 7){
        ret.push(dot);
        i = pn - 5;
        total = pn + 5;
    }

    if(isLastPage) total = pn + 1;

    for(; i < total; i++) {
        ret.push(tpl.replaceTpl({
            url: buildUrl(i)
            , n: i
            , t: i
        }));
    }

    if(!isLastPage) {
        ret.push(dot);
        ret.push(tpl.replaceTpl({
            url: buildUrl(pn + 1)
            , n: ">"
            , t: txt["nextpage"]
        }));
    }
    
    G("PageNavigation").innerHTML = ret.join("").replace(new RegExp(">" + pn + "</a>"), ' onclick="return false" class="r-pn_cur">' + pn + '</a>');
};

App.result = function() {
	App.styles = {
		adStyles: {
			urlColor: '58a33f',
			backgroundColor: 'F9FCFF',
			textColor: '222',
			titleUnderline: false
		},
		algoStyles: {
			urlColor: '58a33f',
			textColor: '222',
			titleUnderline: false
		}
	};

	App.inspConf.query = App.conf.query;
	App.inspConf.page = App.conf.pn;
	App.inspConf.category = App.conf.category;
	App.inspConf.sellerRatings = true;
	App.inspConf.containers = {
		'top': {
			id: 'topResults',
			styles: App.styles.adStyles
		},
		'main': {
			id: 'mainResults',
			styles: App.styles.algoStyles
		},
		'bottom': {
			id: 'bottomResults',
			styles: App.styles.adStyles
		},
		'right': {
			id: 'rightResults'
		},
		'related': {
			id: 'relatedResults'
		},
		'spelling': {
			id: 'spellResults'
		}
	};
	App.inspConf.searchUrlFormat = (location.href.split("?"))[0] + '?query={searchTerm}&pn=' + App.conf.pn + '&category=' + App.conf.category;

	App.inspConf.onComplete = function(details) {
		if (details && (parseInt( details["mainResultCount"] || 0, 10) > 0)) {
			G("resultNum").innerHTML = details["maxAlgoResultCount"];
			App.renderPn(parseInt(details["maxAlgoPage"]||1, 10));
			G.addClass(BODY, "full-result");
            window.UT && UT.send({
                type: "others",
                position: (parseInt(details["topResultCount"], 10) || parseInt(details["bottomResultCount"], 10)) ? 1 : 0,
                modId: "result-num"
            });
		} else {
			G.addClass(BODY, "ept-result");
            window.UT && UT.send({
                type: "others",
                position: 0,
                modId: "result-num"
            });
		}
	};
};

App.bind = function() {
	G.delegate(form, "submit", function() {
		G.cookie("LV2_s_q", input.value.substring(0,50),{expires:1});
	});
	G.delegate(G("PageNavigation"), 'click', function(e) {
		if(this.tagName != "A" || G.hasClass(this, 'r-pn_cur')) return;
		G.cookie("LV2_s_p", "1",{expires:1});
	});

	(function(){
		var query = G.cookie("LV2_s_q"),
		    page  = G.cookie("LV2_s_p"),
		    sort  = G.cookie("LV2_s_s");
		if(query !== null) {
			window.UT && UT.send({
				type: "click",
                position: "search",
                modId: "search-box",
                value: query
			});
			G.cookie("LV2_s_q", null, {});
		}
		if(page !== null) {
			window.UT && UT.send({
				type: "click",
                position: "nextPage",
                modId: "page-nav"
			});
			G.cookie("LV2_s_p", null, {});
		}
		if(sort !== null) {
			window.UT && UT.send({
				type: "click",
                position: sort,
                modId: "category"
			});
			G.cookie("LV2_s_s", null, {});
		}
	})();
};

App.init = function() {
	if(App.conf.query) {
		App.result();
		insp.search.doSearch(App.inspConf);
	} else {
		G.addClass(BODY, 'ept-query');
	}
};

App.getSignature = function() {
    var callName = "ghao123_idsearch" + ('' + +new Date).substring(2, 10);
    window[callName] = function(data) {
        window[callName].data = data;
    };
    G.loadJs([App.signatureUrl.replaceTpl({
        query: encodeURIComponent(App.conf.query),
        country: conf.country || "id",
        jsonp: callName
    })], function() {
        var data = window[callName].data || null;
        data = data && data.content && data.content.data;
        data = data && data.signer;
        if(data) {
            App.inspConf.signature = data;
        }
        App.init();
        window[callName] = null;
    });
};

(function() {
    G.addClass(BODY, 'l-' + App.conf.category);
    App.search();
    App.sugInit();
    App.categoryInit();
    App.bind();
    App.getSignature();
})();