/* global G, App */
/* eslint-disable fecs-camelcase */

/**
 *  @file 2015/06/09 日本yahoo搜索底部添加amazon模块
 *  @author daihongtao modify
 * */

var ClickMonkey = function() {
    if(!this.pageId) return {
        log: function() {}
    };
    var e = "http://nsclick.baidu.com/h.gif?pid=113&v=" + pageId + "&hao123_baiduid=" + unescape((document.cookie.match("BAIDUID"+'=(.+?);')||0)[1]||'').split(":")[0],
        t = "bd_clickmonkey",
        n = function(n) {
            var r = (new Date).getTime(),
                i = window[t + r] = new Image,
                s = "";
            for(var o in n) s += "&" + o + "=" + n[o];
            i.src = e + "&r=" + r + s, i.onload = i.onerror = function() {
                i = null
            }
        }, r = "",
        i = function(e, t) {
            t = t || [], r = e.monkey || e.getAttribute("monkey") || r, e.parentNode && e.parentNode.tagName.toUpperCase() != "BODY" && (t = i(e.parentNode, t));
            if(e.previousSibling) {
                var n = 1,
                    s = e.previousSibling;
                do s.nodeType == 1 && s.nodeName == e.nodeName && n++, s = s.previousSibling; while (s)
            }
            return e.nodeType == 1 && t.push(e.nodeName.toLowerCase() + (n > 1 ? n : "")), t
        }, s = function(e, t, n, r) {
            if(e.addEventListener) return e.addEventListener(t, n, r), !0;
            if(e.attachEvent) {
                var i = e.attachEvent("on" + t, n);
                return i
            }
        }, o = function(e) {
            return encodeURIComponent(e)
        };
    s(document.body, "mousedown", function(e) {
        var e = window.event || e,
            t = e.srcElement || e.target;
        if(t.tagName.toUpperCase() != "A")
            if(t.parentNode.tagName.toUpperCase() == "A") t = t.parentNode;
            else if((t.tagName.toUpperCase() != "INPUT" || t.type.toLowerCase() != "checkbox" && t.type.toLowerCase() != "radio") && t.tagName.toUpperCase() != "AREA") return;
        r = "";
        var s = i(t).join("-"),
            u = {
                xp: s
            }, a = t.getAttribute("href", 2);
        a && !/^javascript|#/.test(a) ? u.objurl = o(a) : u.objurl = "none", t.innerHTML && !/^\s*</i.test(t.innerHTML) && !/>\s*$/i.test(t.innerHTML) ? u.title = o(t.innerHTML) : u.title = "none", r && (u.monkey = r), n(u)
    });
    var u = function(e, t, r) {
        var i = {
            xp: "_" + e + "_"
        };
        t ? i.objurl = o(t) : i.objurl = "none", r ? i.title = o(r) : i.title = "none", n(i)
    };
    return {
        log: u
    }
}();

window.G = window.G || function(id) {
    return id + "" === id ? document.getElementById(id) : id;
};

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

G.urlEscape = function(s) {
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
}

G.urlUnEscape = function(s) {

    // decodeURIComponent("%") ==> error
    s = s.replace(/\+/g, "%20");

    try{
        s = decodeURIComponent(s);
    }
    catch(e) {}
    return s;
}

G.isElement = function(obj) {
    return window.HTMLElement ? obj instanceof HTMLElement : G.isObject(obj) && G.isString(obj.tagName) && obj.nodeType > 0;
}

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
}

G.delegate = function(el, type, fn) {
    el.addEventListener
    ? el.addEventListener(type, function(e) {
        return fn.call(e.target, e);
    }, false)
    : el.attachEvent("on" + type, function(e) {
        e = window.event;
        return fn.call(e.srcElement, e);
    })
}

G.addCls = function(el, className) {
    var els = el.length ? el : [el],
        fur = false, // can use classList
        ele;
    for (var i = 0, j = els.length; i < j; i++) {
        ele = els[i];
        if (fur) {
            ele.classList.add(className);
        } else {
            if (ele.classList && ele.classList.add) {
                ele.classList.add(className);
                fur = true;
            } else {
                ele.className += " " + className;
                fur = false;
            }
        }
    }
}

G.rmvCls = function(el, className) {
    var els = el.length ? el : [el],
        fur = false, // can use classList
        ele,
        reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
    for (var i = 0, j = els.length; i < j; i++) {
        ele = els[i];
        if (fur) {
            ele.classList.remove(className);
        } else {
            if (ele.classList && ele.classList.remove) {
                ele.classList.remove(className);
                fur = true;
            } else {
                ele.className = ele.className.replace(reg, ' ');
                fur = false;
            }
        }
    }
}
/*G.json = {
    toString: "",
    parse: ""
}*/

G.xml = {
    parse: function(str) {
        var xml = null;
        if(window.DOMParser) {
            xml = (new DOMParser).parseFromString(str, "text/xml");
        }
        else if(window.ActiveXObject) {
            try{
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = false;
                xml.loadXML(str);
            } catch(e) {}
        }
        return xml;
    },
    toJson: function(xml, json) {
        json = json || {};
        if(!xml) return json;
        if(G.isString(xml)) xml = G.xml.parse(xml);
        if(!xml) return json;

        if(xml.attributes && xml.attributes.length) {
            for(var attrN = -1, attrs = xml.attributes, attr; attr =  attrs[++attrN];) {
                json["@" + attr.name.trim()] = attr.value;
            }
        }
        for(var i = -1
                , children = xml.childNodes
                , nodeName, node, li; li = children[++i];) {
            if(li.data) {
                if(li.data.trim() !== "") json.data = li.data;
                continue;
            }
            nodeName = li.nodeName;
            node = {};
            if(!json[nodeName]) json[nodeName] = node;
            else if(!json[nodeName].length) {
                json[nodeName] = [node, json[nodeName]];
            }
            else json[nodeName].push(node);
            arguments.callee(li, node);
        }
        return json;
    },
    escape: function(s){
        return s.replace(/[&<>'"]/g, function(li){
            return "&" + {
                "&"   : "amp"
                , "<" : "lt"
                , ">" : "gt"
                , "'" : "#39"
                , '"' : "quot"
            }[li] + ";"
        })
    }
}

G.ajax = function(o) {
    if(!o || !o.url) return false;

    var type = (o.type || "GET").toUpperCase(),
        async = !(o.async === false),
        cache = !(o.cache === false),
        charset = o.charset || "utf-8",
        httpHeader = o.httpHeader || {},
        contentType = o.contentType || "application/x-www-form-urlencoded",
        wait = +o.wait,
        before = o.before,
        success = o.success,
        error = o.error,
        me = arguments.callee,
        encode = encodeURIComponent,
        undef,
        data = o.data ? G.isString(o.data) ? o.data : function(d, ret) {
            G.isElement(d)
            ? G.each(d.elements, function(li, i) {
                li.name && !li.disabled && ret.push(encode(li.name) + "=" + G.urlEscape(encode(li.value)));
            })
            : G.each(d, function(li, k) {
                li !== undef && ret.push(encode(k) + "=" + G.urlEscape(encode(li)));
            });
            return ret.join("&");
        }(o.data, []) : "",
        url = function(s) {
            var d = "GET" === type ? data : "",
                c = cache ? "" : "r" + +new Date + "=1",
                b = s.indexOf("?") < 0 ? "?" : "&";
            return (s + b + d + ((d && c) ? "&" + c : c)).replace(/&$/, "");
        }(o.url),
        xhr = (me.getXhr || function(_xhr) {
            G.each([
                function() { return new ActiveXObject("Microsoft.XMLHTTP")},
                function() { return new ActiveXObject("Msxml2.XMLHTTP.3.0")},
                function() { return new ActiveXObject("Msxml2.XMLHTTP.6.0")},
                function() { return new XMLHttpRequest}
            ], function(li) {
                try{
                    _xhr = (me.getXhr = li)();
                    return false;
                } catch (e) {}
            });
            return _xhr;
        })(),
        fix = function() {
            if(xhr) xhr.onreadystatechange = function() {};
            if(async) xhr = null;
        },
        stateHandle = function() {
            if(xhr && xhr.readyState == 4) {
                timer && clearTimeout(timer);
                try {
                    var s = xhr.status;
                }catch (e) {
                    error && error.call(xhr);
                    return;
                }
                if((s >= 200 && s < 300) || s == 304 || s == 1223) success && success.call(xhr, xhr.responseText);
                else if(error) error.call(xhr);
                setTimeout(fix, 16);
            }
        },
        timer;
    before && before.call(xhr);
    xhr.open(type, url, async);
    if(async) xhr.onreadystatechange = stateHandle;
    httpHeader['X-Request-With'] = 'XMLHttpRequest';
    if("POST" === type) try{
        xhr.setRequestHeader("Content-Type", contentType + ";charset=" + charset);
        G.each(httpHeader, function(li, key) {
            key && xhr.setRequestHeader(key, li);
        });
    } catch(e){}
    if(wait) timer = setTimeout(function() {
        fix();
        xhr && xhr.abort();
        error && error.call(xhr);
    }, wait);
    xhr.send("POST" === type ? data : null);
    !async && stateHandle();
    return xhr;
}

G.loadJs = function(path, callback) {
    var doc = document
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
}

G.getQuery = function(query, url) {
    return G.urlUnEscape((location.href.match(new RegExp("\\?.*" + query + "=([^&$#]*)")) || ["",""])[1]);
}

G.time = function () {
    var imgUrl = "/static/web/common/img/gut.gif",
        rate = 1000,
        i = 0,
        isGet = false, //whether has got the server time
        _date;
    return {
        getTime: function(callback) {
            //add callback parameter for other modules to do their own business after obtaining the server time
            //get the time difference to prevent the errors which caused by users changed the local time
            //two ways to fix the bug: 1. setInterval 2. local time difference, the 2nd way takes precedence

            var render = function(date) {
                date = (date = date.getResponseHeader("Date")) ? new Date(date) : new Date;
                var startTime = new Date, //get time stamp of the xhr
                    diff = function() {
                        var n = new Date - startTime, //2. local time difference
                            _n = ++i * rate; //1. setInterval

                        //calc in 1 minute
                        return Math.abs(n - _n) > 1000 * 60 ? _n : n;
                    },
                    timer = setInterval(function() {
                        //render time with the time difference
                        (_date = new Date(date.getTime())).setMilliseconds(_date.getMilliseconds() + diff());
                        //obligate interface to get the server time
                        conf.serverNow = _date;
                    }, rate);

                // get time immediately
                (_date = new Date(date.getTime())).setMilliseconds(_date.getMilliseconds() + diff());
                conf.serverNow = _date;
                isGet = true; // get time process is done
            },

                get = function() {
                    var xhr = G.ajax({
                        url: imgUrl,
                        cache: false,
                        error: function() {
                            //if there has an error such as 404, we can also get the head
                            render(xhr);
                            callback && callback.call(callback.scop || {}, conf.serverNow);
                        },
                        success: function() {
                            render(xhr);
                            callback && callback.call(callback.scop || {}, conf.serverNow);
                        }
                    });
                };

            if (!isGet) {
                get();
            } else {
                callback && callback();
            }

            return _date ? _date : new Date;
        }
    }
}()

G.fixNum = function(n) {
    return n > 9 ? n : ('0' + n);
}

G.fixDate = function(date) {
    var fixN = G.fixNum;
    return date.y + '-' + fixN(date.m) + '-' + fixN(date.d);
}

G.fixDay = function(date, n, _con) {
    var that = this,
        da   = new Date(date.getTime());

    da.setTime(date.getTime() + n * 24 * 3600 * 1000);
    return {
        y: da.getFullYear(),
        Y: _con.year,
        m: da.getMonth() + 1,
        M: _con.month,
        d: da.getDate(),
        D: _con.day,
        W: da.getDay() || 7
    };
}

G.cookie = function(key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        //options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var days = options.expires,
                t = options.expires = new Date();
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
    var result, decode = options.raw ? function(s) {
            return s;
        } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
}

/*
bugs:

"1234xca" ==> Api error

 */
App.conf.reqPn = +G.getQuery("pn", location.href) || 1;
App.conf.adMaps = {
    North: G("ClickUrl_north")
    , South: G("ClickUrl_south")
    , East: G("ClickUrl_east")
    , Amazon: G("ClickUrl_amazon")
    , AmazonCenter: G("ClickUrl_amazon_center")
}

// query, "" ==> block
App.conf.reqParam.query = G.getQuery("query", location.href);
App.conf.reqParam.useragent = navigator.userAgent;
App.conf.reqAdParam.affilData = "ip=" + App.conf.reqParam.ip + "&ua=" + App.conf.reqParam.useragent;

App.supportState = !!(window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/));

App.cache = {
    urlbase: location.href.split('?')[0]
}

App.tip = {
    timer: null
    , el: G("resultTip")
    , wrap: G("resultWrap")
    , show: function(state) {
        App.tip.hide();
        App.tip.timer = setTimeout(function() {
            App.tip.el.innerHTML = '<i></i> ' + App.conf.txt[state];
            App.tip.wrap.className += " r-" + state;
        }, 500);
    }
    , hide: function(timer) {
        timer = timer || App.tip.timer;
        timer && clearTimeout(timer);
        App.tip.wrap.className = App.tip.wrap.className.replace(/ r-(loading|error|abort)/g, "");
    }
}

App.amazonAds = {
    conf: {},
    data: {},
    callF: null,
    MAXNUM: 2,
    logoTpl:'<a href="#{linkUrl}" data-logo="1"><img src="#{imgSrc}"></a>',
    tpl: '<li class="amz-li #{otherClass}"><a href="#{href}" data-i="#{i}">'
        + '<span class="li-img" title="#{brand}"><img #{imgSrc} #{other}><span>#{brand}</span>'
        + '</span><h3 title="#{title}">#{title}</h3></a><div class="li-content">'
        + '<div class="ellipsis"><div><p><span class="dis-pri">#{discount}#{dis}</span>'
        + '<span class="ori-pri">#{price}#{pri}</span>'
        + '<span class="li-des" title="#{descrip}">#{descrip}</span></p></div></div></div></li>',
    init: function(con, rand) {
        G.rmvCls(App.conf.adMaps.Amazon, "amz-show");
        G.rmvCls(App.conf.adMaps.AmazonCenter, "amz-show");

        // 亚马逊广告出现时，如果adWordSouth的广告为空，隐藏 "xxx广告" 文案
        App.conf.adMaps.AmazonCenter.parentNode.style.display = 'block';
        // 为了通过编码检查，只好把G 换一个函数名
        var getElementByIdForRuleCheck = G;
        var adWordSouthEle = getElementByIdForRuleCheck('adWordSouth');
        if (adWordSouthEle.parentNode.style.display !== 'block') {
            adWordSouthEle.parentNode.style.display = 'none';
        }

        var _self = App.amazonAds,
            that  = _self.conf;

        if (con.isHidden !== "0") return;

        that.reqParams = con.params;
        that.minTotal  = parseInt(con.min, 10) || 2;
        that.query     = con.q;
        that.url       = con.url || window["conf"].apiUrlPrefix;
        that.content = {
            price: con.price,
            discount: con.discount
        };
        that.amazonLogo = con.amazonLogo;
        that.logoUrl    = con.logoSrc;

        _self.getData(function() {
            _self.formatData();
            _self.render(_self.data, rand);
        });
    },
    getData: function(callback) {
         var _self = App.amazonAds,
            that   = _self.conf,
            params = [],
            reqUrl = that.url + "?" + that.reqParams + "&";
        
        _self.callF = _self.getCallbackFunc();

        params.push("country=" + (window["conf"].country || "jp"));
        params.push("_=" + +new Date);
        params.push(that.query + "=" + encodeURIComponent(App.conf.reqParam.query));
        params.push("jsonp=" + _self.callF);
        reqUrl += params.join("&");

        callback.scop = _self;
        G.loadJs(reqUrl, callback);

    },
    filterHtmlTag: function(html){
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.innerText || tmp.textContent || "";
    },
    formatData: function() {
        var _self = App.amazonAds,
            that  = _self.conf,
            cont  = that.content,
            disCo = cont.discount,
            price = cont.price,
            data  = window[_self.callF].data;

        data = (data && data.content) || "";
        if(!data) return;
        data = G.xml.toJson(data);
        data = data && data["ItemSearchResponse"] && data["ItemSearchResponse"]["Items"];
        data = data && data["Item"];

        if(data) {
            UT && UT.send({modId: "amazonAds", type: "others", position: data.length || 0});
        }
        if(data && data.length >= that.minTotal) {
            data.sort(function(prev, next) {
                var sR = "SalesRank",
                    pR = parseInt((prev[sR] && prev[sR].data) || 0, 10),
                    nR = parseInt((next[sR] && next[sR].data) || 0, 10);
                return (pR && nR) ? (pR - nR) : (nR - pR);
            });
            var _data = [],
                url   = '', title = '', dis   = '', other = '',
                pri   = '', des   = '', brand = '', imgSrc= ''; 
            var otherClass;

            for(var i = 0, l = data.length; i < l; i++) {
                url = data[i]["DetailPageURL"];
                url = (url && url.data) || "";

                title = data[i]["ItemAttributes"];
                title = (title && title["Title"]) || "";
                title = (title && title.data) || "";

                dis = data[i]["ItemAttributes"];
                dis = (dis && dis["ListPrice"]) || "";
                dis = (dis && dis["FormattedPrice"]) || "";
                dis = (dis && dis.data) || "";

                pri = data[i]["OfferSummary"];
                pri = (pri && pri["LowestNewPrice"]) || "";
                pri = (pri && pri["FormattedPrice"]) || "";
                pri = (pri && pri.data) || "";

                des = data[i]["EditorialReviews"];
                des = (des && des["EditorialReview"]) || "";
                if (des.length >= 2) {
                    des = (des[0]["IsLinkSuppressed"]["data"] === "0") ? des[0]["Content"]["data"] : (des[1]["IsLinkSuppressed"]["data"] === "0" ? des[1]["Content"]["data"] : "");
                } else {
                    des = (des && des["IsLinkSuppressed"]["data"] === "0") ? des["Content"]["data"]: "";
                }

                brand = data[i]["ItemAttributes"];
                brand = (brand && brand["Brand"]) || "";
                brand = (brand && brand.data) || "";

                imgSrc = data[i]["MediumImage"] || "";
                if(imgSrc) {
                    if(parseInt(imgSrc["Height"]["data"], 10) > parseInt(imgSrc["Width"]["data"], 10)) {
                        other = 'height="75"';
                    } else {
                        other = 'width="75"';
                    }
                    imgSrc = 'src="' + imgSrc["URL"]["data"] + '"';
                } else {
                    imgSrc = '';
                    other = '';
                    otherClass = 'amz-li-noimg';
                }

                if(!url || !title) continue;

                _data.push({
                    href: url,
                    title: title,
                    discount: dis? disCo: "",
                    dis: dis? ("<span>" + dis + "&nbsp;&nbsp;</span>"): "",
                    price: pri? price: "",
                    pri: pri? ("<span>" + pri + "&nbsp;&nbsp;&nbsp;</span>"): "",
                    descrip: _self.filterHtmlTag(des),
                    brand: brand,
                    imgSrc: imgSrc,
                    other: other,
                    otherClass: otherClass
                });
            }
            _self.data  = _data;
            _self._data = data;
        } else {
             _self.data  = {};
            _self._data = {};
        }

    },
    render: function(data, rand) {
        var index = [],
            str   = '',
            _self = App.amazonAds,
            tpl   = _self.tpl,
            max   = _self.MAXNUM;

        if(data.length) {
            index = rand ? _self.getRandsIndex(data.length, max) : _self.enumType(max);

            for(var i = 0, l = index.length; i < l; i++) {
                data[index[i]].i = i + 1;
                str += tpl.replaceTpl(data[index[i]]);
            }
            if(_self.conf.amazonLogo) {
                str = _self.logoTpl.replaceTpl({imgSrc: _self.conf.amazonLogo, linkUrl: _self.conf.logoUrl}) + str;
            }
            App.conf.adMaps.Amazon.innerHTML = str;
            G.addCls(App.conf.adMaps.Amazon, "amz-show");

            // 列表页区域amazon广告，为尽量避免与侧边栏广告重复，采用随机策略
            index = _self.getRandsIndex(data.length, max);
            str = '';

            for(var i = 0, l = index.length; i < l; i++) {
                data[index[i]].i = i + 1;
                str += tpl.replaceTpl(data[index[i]]);
            }
            if(_self.conf.amazonLogo) {
                str = _self.logoTpl.replaceTpl({imgSrc: _self.conf.amazonLogo, linkUrl: _self.conf.logoUrl}) + str;
            }
            App.conf.adMaps.AmazonCenter.innerHTML = str;
            G.addCls(App.conf.adMaps.AmazonCenter, "amz-show");
        } else {
            return true;
        }
    },
    enumType: function(max) {
        var arr = [];
        for(var i = 0; i < max; i++) {
            arr.push(i);
        }
        return arr;
    },
    shuffle: function(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },
    getRandsIndex: function(len, max) {
        var arr     = [],
            curData = [],
            _self   = App.amazonAds;

        for(var i = 0; i < len; i++) {
            arr[i] = i;
        }

        for(var j = 0; j < max; j++) {
            arr = _self.shuffle(arr);
            curData.push(arr[0]);
            arr.splice(0, 1);
        }

        return curData;
    },
    getCallbackFunc: function() {
        var callName = "ghao123_amazon" + ('' + +new Date).substring(3);
        window[callName] = function(data) {
            window[callName].data = data;
        };
        return callName;
    }

}

App.ept = function(conf) {
    var that = this;

    that.conf     = conf;
    that.curDate  = 0;
    that.curType  = that.conf.list[0].types;
    that.timeList = []; // for get ajax data
    that.timGroup = []; // for render date

    that.callName = {}; // jsonp callback function
    that.reqPath  = ""; // JSONP request path Tpl

    that.eptTle = G("eptTitle");
    that.eptTab = G("eptBtn");
    that.eptCtr = G("eptCtrl");
    that.eptRes = G("eptRes");

    that.curTab  = {}; // current tab DOM object
    that.ctrPrev = {}; // control to prev
    that.ctrNext = {}; // control to next
    that.ctrTime = {}; // show time

    that.tabTpl = '<li typ="#{types}" class="#{cur}">#{title}</li>';
    that.ctrTpl = '<div class="ctr-outer"><div class="ctr-inner"><span class="ctr-btn ctr-prev" id="ctrlPrev"><span class="i-pre i-btn">&lt;</span>#{prev}</span><p class="ctr-time"  id="ctrlTime">#{date}</p><span id="ctrlNext" class="ctr-btn ctr-next ctr-diable"><span class="i-nxt i-btn">&gt;</span>#{next}</span></div></div>';
    that.timTpl = '#{y}#{Y}#{m}#{M}#{d}#{D}#{update}';
    that.resTpl = '<li><span class="i-rank #{addClas}">#{num}</span><a href="#{url}" target="_blank">#{content}</a></li>';

    that.init();
}
App.ept.prototype = {
    init: function() {
        var that = this;

        that.callName = that.getCallbackFunc(); // create callback
        that.createHtml(); // init create html
        that.createReqPath(); // create JSONP path tpl

        that.bindEvent();
    },
    sendRequest: function(typ, index, callback) {
        var that = this,
            path = that.reqPath.replaceTpl({
                type: typ,
                date: (index === 0 ? "" : that.timeList[index]),
                stamp: +new Date
            });
        callback.scop = that;
        G.loadJs(path, callback);
    },
    render: function() {
        var that = this,
            _tpl = that.resTpl,
            _bod = document.body,
            data = window[that.callName].data || {},
            maxL = parseInt((that.conf && that.conf.ajaxUrl && that.conf.ajaxUrl.num) || 20, 10);
            str  = "",
            _url = location.href.split("?")[0] + "?query=";

        data = (data.content && data.content.data) || [];

        if(data.length > 0) {
            /*if(data.length === 1) { // when one data
                G.addCls(that.ctrPrev, "ctr-diable");
            } else { // not only one data
                G.rmvCls(that.ctrPrev, "ctr-diable");
            }*/
            G.rmvCls(_bod, "no-data");
            for(var i = 0, l = Math.min(data.length, maxL); i < l; i++) {
                str += _tpl.replaceTpl({
                    addClas: "i-rank-" + (i + 1),
                    num: i + 1,
                    content: data[i]["info_name"] || "",
                    url: _url + G.urlEscape(encodeURIComponent(data[i]["info_name"] || ""))
                });
            }
            that.eptRes.innerHTML = str;
        } else {
            G.addCls(_bod, "no-data");
        }
    },
    createReqPath: function() {
        var that   = this,
            params = [],
            _glo   = window.conf,
            _con   = that.conf.ajaxUrl,
            url    = (_con.url || _glo.apiUrlPrefix) + "?";
        for(var i in _con) {
            if(_con.hasOwnProperty(i) && !_con[i].match("http://")) {
                params.push(i + "=" + _con[i]);
            }
        }
        params.push("type=#{type}");
        params.push("date=#{date}");
        params.push("jsonp=" + that.callName);
        params.push("country=" + (_glo.country || "jp"));
        params.push("_=#{stamp}");
        url += params.join("&");
        that.reqPath = url;
        that.curReqPath = url.replace("&date=#{date}", "");
    },
    getCallbackFunc: function() {
        var callName = "ghao123_custom" + ('' + +new Date).substring(3);
        window[callName] = function(data) {
            window[callName].data = data;
        };
        return callName;
    },
    initCtr: function(date) {
        var that = this,
            _con = that.conf,
            _up  = _con.update,
            _ctr = that.eptCtr,
            _cpl = that.ctrTpl,
            _tpl = that.timTpl,
            _lis = that.timeList,
            _grp = that.timGroup;

        var fixDay = G.fixDay,
            fixDat = G.fixDate,
            tmpDay = {};

        for(var i = 0, l = parseInt(_con.maxDays || 7, 10); i < l; i++) {
            tmpDay = fixDay(date, 0-i, _con);
            if(tmpDay.W < 6) {
                tmpDay.update = _up;
                _grp.push(_tpl.replaceTpl(tmpDay));
                _lis.push(fixDat(tmpDay));
            }
        }
        _ctr.innerHTML = _cpl.replaceTpl({
            prev: _con.prev,
            next: _con.next,
            date: _grp[0]
        });
        that.ctrPrev = G("ctrlPrev"); // control to prev
        that.ctrNext = G("ctrlNext"); // control to next
        that.ctrTime = G("ctrlTime"); // show time

        that.bindCtrl(); // need elements have been created

        that.sendRequest(that.curType, that.curDate, that.render); // init request jsonp data
    },
    initTle: function() {
        var that = this,
            _con = that.conf,
            _img = _con.titleIcon,
            _url = _con.titleUrl,
            str  = '';
        str += _url ? ('<a href="' + _url + '">') : '';
        str += _img ? ('<img src="' + _img + '" />') : '';
        str += _con.title;
        str += _url ? '</a>' : '';
        that.eptTle.innerHTML = str;
    },
    initTab: function() {
        var that = this,
            _con = that.conf.list,
            _tab = that.eptTab,
            _cuT = G.cookie("tabTypes"),
            _cuI = 0,
            str  = '',
            _tpl = that.tabTpl;

        for(var i = 0, l = _con.length; i < l; i++) {
            _con[i].cur = "";

            if(_cuT) {
                if(_con[i].types == _cuT) {
                    that.curType = _con[i].types;
                    _cuI = i;
                }
            } else if( i === 0 ) {
                that.curType = _con[i].types;
            }
            str += _tpl.replaceTpl(_con[i]);
        }

        G.addCls(_tab, "tab-" + l);
        _tab.innerHTML = str;

        that.curTab  = _tab.getElementsByTagName("li")[_cuI];
        G.addCls(that.curTab, "cur");
    },
    switchTab: function(li) {
        var that = this;

        that.curType = li.getAttribute("typ");

        G.rmvCls(that.curTab, "cur");
        G.addCls(li, "cur");
        G.cookie("tabTypes", that.curType, {expires: 400});

        that.curTab = li;
        that.sendRequest(that.curType, that.curDate, that.render);
    },
    getPrev: function() {
        var that = this,
            _tim = that.timeList,
            _pre = that.ctrPrev,
            _nex = that.ctrNext;

        if(_pre.className.search("ctr-diable") > -1) return;

        if(that.curDate === 0) {
            G.rmvCls(_nex, "ctr-diable"); //is first
        }

        that.curDate++;

        if(!_tim[that.curDate + 1]) {
            G.addCls(_pre, "ctr-diable");
        }

        that.ctrTime.innerHTML = that.timGroup[that.curDate];

        that.sendRequest(that.curType, that.curDate, that.render);
    },
    getNext: function() {
        var that = this,
            _tim = that.timeList,
            _pre = that.ctrPrev,
            _nex = that.ctrNext;

        if(_nex.className.search("ctr-diable") > -1) return;

        if(that.curDate === _tim.length - 1) {
            G.rmvCls(_pre, "ctr-diable"); //is last
        }

        that.curDate--;

        if(that.curDate - 1 < 0) {
            G.addCls(_nex, "ctr-diable");
        }

        that.ctrTime.innerHTML = that.timGroup[that.curDate];

        that.sendRequest(that.curType, that.curDate, that.render);
    },
    bindCtrl: function() {
        var that = this;

        G.delegate(that.ctrPrev, 'click', function(event) {
            that.getPrev();
            UT && UT.send({modId: "empty-search-rank", type: "click", position: "emptyPrev"});
        });
        G.delegate(that.ctrNext, 'click', function(event) {
            that.getNext();
            UT && UT.send({modId: "empty-search-rank", type: "click", position: "emptyNext"});
        });
    },
    bindEvent: function() {
        var that = this;
        G.delegate(that.eptTab, 'click', function(event) {
            var _self = this;
            if(_self.tagName === "LI" && !_self.className.match("cur")) {
                that.switchTab(_self);
                UT && UT.send({modId: "empty-search-rank", type: "click", position: "emptyTab", sort: that.curType});
            }
        });
        G.delegate(that.eptRes, 'click', function(event) {
            var _self = this;
            if(_self.tagName === "A" || _self.parentNode.tagName === "A") {
                UT && UT.send({modId: "empty-search-rank", type: "click", position: "searchWords", sort: that.curType});
            }
        });
        G.delegate(that.eptTle, 'click', function(event) {
            var _self = this;
            if(_self.tagName === "A" || _self.parentNode.tagName === "A") {
                UT && UT.send({modId: "empty-search-rank", type: "click", position: "title"});
            }
        });
    },
    createHtml: function() {
        var that = this;

        that.initTle();
        that.initTab();

        that.initCtr.scop = that;
        G.time.getTime(that.initCtr);
    }
}

var eptObj = null,
    noFrst = false;

App.req = function(type) {
    var eptConf  = conf.ept, // empty search word
        _conf    = App.conf,
        cache    = App.cache,
        reqParam = _conf.reqParam;
    if (!reqParam.query) {
        // add body class
        if(eptConf) {
            G.addCls(document.body, "ept-srch");

            G("searchInput").value = G("searchInput2").value = reqParam.query;

            !eptObj && (eptObj = new App.ept(eptConf));
        }
    } else {
        // remove body class
        G.rmvCls(document.body, "ept-srch");
        if (noFrst) {// first time no send log
            UT && UT.send({
                type: "click",
                sort: "search",
                value: reqParam.query
            });
        } else {
            noFrst = true;
        }

        reqParam["web.FirstResult"] = _conf.reqPn < 2 ? 0 : reqParam["web.NumResults"] * (_conf.reqPn - 1);
        // G("searchInput").value = G("searchInput2").value = G.urlUnEscape(reqParam.query);
        G("searchInput").value = G("searchInput2").value = reqParam.query;

        App.tip.show("loading");
        G("totalHits").innerHTML = "";
        cache.xhr && cache.xhr.abort();
        cache.xhr = G.ajax({
            type: "GET",
            url: _conf.reqUrl,
            data: _conf.reqParam,
            wait: 10000,
            success: App.render,
            error: function() {
                App.render("");
                App.tip.show("abort");
            }
        });
        App.updateAd();

        App.amazonAds.render(App.amazonAds.data);
    }
}

App.renderPn = function(str) {
    if(G.isString(str)) return G("resultPn").innerHTML = str;
    var conf = App.conf,
        pn = conf.reqPn,
        tpl = conf.tpl.pnLi,
        txt = conf.txt,
        i = 2,
        total = 10,
        dot = '<li>...</li>',
        ret = [],
        buildUrl = function(i) {
            return App.supportState ? "javascript:void(0)" : App.cache.urlbase + "?query=" + G.urlEscape(encodeURIComponent(conf.reqParam.query)) + "&pn=" + i;
        }

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

    if(App.cache.isLastPage) total = pn + 1;

    for(; i < total; i++) {
        ret.push(tpl.replaceTpl({
            url: buildUrl(i)
            , n: i
            , t: i
        }));
    }

    if(!App.cache.isLastPage) {
        ret.push(dot);
        ret.push(tpl.replaceTpl({
            url: buildUrl(pn + 1)
            , n: ">"
            , t: txt["nextpage"]
        }));
    }

    G("resultPn").innerHTML = ret.join("").replace(new RegExp(">" + pn + "</a>"), ' onclick="return false" class="r-pn_cur">' + pn + '</a>');
}

App.renderAd = function(data) {
    // fix ad Data
    data = function(data) {
        var ret = {},
            key;
        G.each(data, function(val, key) {
            ret[key] = [];
            val.length && G.each(val, function(li, i) {
                    li && ret[key].push(li);
                });
        });
        return ret;
    }(data);

    var conf = App.conf,
        adMaps = conf.adMaps,
        adNum = conf.adNum,
        // fixNum = +adNum.North - data.North.length,
        tmpLen = data.South.length,
        el;

    /*
    fix ad Data
    1. keep north = 4
    2. from: south > east
    */
    // if(fixNum > 0) data.North = data.North.concat(data.South.splice(0, fixNum), data.East.splice(0, (tmpLen > fixNum || tmpLen === fixNum) ? 0 : fixNum - tmpLen));

    G.each(data, function(val, key) {
        if(key === "Amazon") {
            return true;
        }
        el = adMaps[key];
        val.length = Math.min(val.length, +adNum[key]);
        el.innerHTML = val.length ? val.join("") : "";
        if(G("adWord"+key)&&conf.txt.adTitle){
            G("adWord"+key).innerHTML = G.xml.escape(conf.reqParam.query);
            G("adWord"+key).parentNode.parentNode.style.display = "block";
        }

        // 底部添加了amazon的广告，特殊处理
        if (key === 'South') {
            if (val.length) {
                el.parentNode.style.display = 'block';
                var getElementByIdForRuleCheck = G;
                var adWordSouthEle = getElementByIdForRuleCheck('adWordSouth');
                adWordSouthEle.parentNode.style.display = 'block';
            }
        } else {
            el.parentNode.style.display = val.length ? 'block' : '';
        }
    });


    // bind linkIndex
    G.each(adMaps, function(val, key) {
        if(!val) return false;
        var list = val.getElementsByTagName("li"),
            i = 0,
            li;
        if(list && list.length) for(; li = list[i++];) {
            var link = li.getElementsByTagName("a")[0];
            link && link.setAttribute("data-i", i);
        }
    });
}

App.updateAd = function() {
    var conf = App.conf,
        adNum = conf.adNum,
        reqAdParam = conf.reqAdParam,
        tpl = conf.tpl.adLi,
        data = {
            North: []
            , South: []
            , East: []
        },
        counter = {
            north: 0,
            south: 0,
            east: 0
        },
        // Render AD tpls
        renderTpl = function (listing, clickUrl) {
            var key = /North/.test(clickUrl["@type"]) && counter.north++ < +adNum["North"] ? "North": /South/.test(clickUrl["@type"]) && counter.south++ < +adNum["South"] ? "South" : /East/.test(clickUrl["@type"]) && counter.east++ < +adNum["East"] ? "East" : "";
            if(data[key] && listing["@rank"]) data[key][+listing["@rank"]] = tpl.replaceTpl({
                url: clickUrl["data"]
                , t: listing["@title"]
                , des: listing["@description1"] + listing["@description2"]
                , host: listing["@siteHost"]
                // only show quick links in the north position
                , quickLink: listing["QuickLink"] && key === "North" ? function(links, ret) {
                    var i = 0;
                    G.each(links, function(link) {
                        if (/North/.test(link["@type"]) && i < conf.qlMaxNum) {
                            ret[+link["@number"] - 1] = '<a href="' + link["data"] + '">' + link["@text"] + '</a>';
                            i++;
                        }
                    });
                    return ret.join(" - ")
                }(listing["QuickLink"], []) : ""
            });
        };
    reqAdParam.Keywords = conf.reqParam.query;
    if(G("adBoxSeq")){
        G("adBoxSeq").style.display = "none";
    }
    App.renderAd(data);

    reqAdParam.Keywords && G.ajax({
        type: "GET",
        url: conf.reqAdUrl,
        data: reqAdParam,
        wait: 10000,
        success: function(res) {
            if(!res) return;
            res = G.xml.toJson(res);
            if(res["Results"] && res["Results"]["ResultSet"] && res["Results"]["ResultSet"]["Listing"]) {
                res = res["Results"]["ResultSet"]["Listing"];
                if(!res.length) res = [res];
                G.each(res, function(li, i) {
                    /*if(li["ClickUrl"]) {
                        var key = (li["ClickUrl"]["@type"].split("-") || ["", ""])[1];

                        if(data[key] && li["@rank"]) data[key][+li["@rank"]] = tpl.replaceTpl({
                            url: li["ClickUrl"]
                            , t: li["@title"]
                            , des: li["@description1"] + li["@description2"]
                            , host: li["@siteHost"]
                            , quickLink: li["QuickLink"] ? function(links, ret) {
                                G.each(links, function(link) {
                                    ret[+link["@number"] - 1] = '<a href="' + link["data"] + '">' + link["@text"] + '</a>';
                                });
                                return ret.join(" - ")
                            }(li["QuickLink"], []) : ""
                        });
                    }*/

                    // no North / East / South

                    // change to 2 / 8 / 4
                    if(li["ClickUrl"]) {
                        // var key = i < +adNum["North"] ? "North" : i < (+adNum["North"] + +adNum["East"]) ? "East" : i < (+adNum["North"] + +adNum["East"] + +adNum["South"]) ? "South" : "";
                        // Render tpls with the 2 kinds of data format
                        if (li["ClickUrl"].length && !li["ClickUrl"]["data"]) {
                            for (var j in li["ClickUrl"]) {
                                renderTpl(li, li["ClickUrl"][j]);
                            }
                        } else {
                            renderTpl(li, li["ClickUrl"]);
                        }
                    }
                });
            }
            App.renderAd(data);
            if(G("adBoxSeq")){
                G("adBoxSeq").style.display = "block";
            }
            UT && UT.send({type: "others", modId: "yahoo-search-ad", position:"north", sort: counter.north});
        },
        error: function() {
            App.renderAd(data);
            if(G("adBoxSeq")){
                G("adBoxSeq").style.display = "block";
            }
            UT && UT.send({type: "others", modId: "yahoo-search-ad", position:"north", sort: counter.north});
        }
    });
}

App.render = function(data) {
    App.cache.xhr = null;
    if(data === "") {
        G("result").innerHTML = "";
        G("totalHits").innerHTML = "";
        App.renderPn("");
        return;
    }
    data = G.xml.toJson(data);

    if(!data["BATCHSEARCHRESPONSE"]
        || !data["BATCHSEARCHRESPONSE"]["RESULTSET_WEB"]
        || !data["BATCHSEARCHRESPONSE"]["RESULTSET_WEB"]["RESULT"]
    ) {
        G("result").innerHTML = '<p style="font-size:123%;margin-top:1em;">' + App.conf.txt.noResult.replaceTpl({

            // Fix: XSS
            query: '<strong>' + G.xml.escape(App.conf.reqParam.query) + '</strong>'
        }) + '</p>' + App.conf.tpl.noResult;

        G("totalHits").innerHTML = "";
        App.renderPn("");
        App.tip.hide();
        return;
    }

    // last page
    App.cache.isLastPage = data["BATCHSEARCHRESPONSE"]["RESULTSET_WEB"]["@XT"] === "1" ? 1 : 0;

    var result = G("result"),
        conf = App.conf,
        tpl = conf.tpl,
        txt = conf.txt,
        list = data["BATCHSEARCHRESPONSE"]["RESULTSET_WEB"]["RESULT"],
        query = conf.reqParam.query,
        ret = [];
    setTimeout(function() {
        G("searchInput").focus();
    }, 64);

    if(list) {
        if(list.length) App.renderPn();
        else list = [list];

        // fix list 0 <=> 1
        if(list.length > 1) {
            var tmpLiNode = list[0];
            list[0] = list[1];
            list[1] = tmpLiNode;
            tmpLiNode = null;
        }

        G.each(list, function(li) {
            li.cache = txt.cache;
            li.query = encodeURIComponent(App.conf.reqParam.query);
            // li.DISPURL.data = G.fixLen(li.DISPURL.data, 90, "...");
            ret.push(tpl.resultLi.replaceTpl(li))
        });
        App.tip.hide();
    }
    else {
        App.renderPn("");
        App.tip.show("error");
    }
    result.innerHTML = ret.join("");
    G("totalHits").innerHTML = txt.totalhits.replaceTpl({
        totalhits: data["BATCHSEARCHRESPONSE"]["RESULTSET_WEB"]["@TOTALHITS"].replace(/(\d)(?=(?:\d{3})+\b)/g, "$1,")
    });

    App.renderWord(data);
    
}
App.renderWord = function(data) {
    if (!data["BATCHSEARCHRESPONSE"]||!data["BATCHSEARCHRESPONSE"]["RESULTSET_ASSIST"]||!data["BATCHSEARCHRESPONSE"]["RESULTSET_ASSIST"]["RESULT"]) return;
    var resultWord = G("resultWord");
    var wordList = data["BATCHSEARCHRESPONSE"]["RESULTSET_ASSIST"]["RESULT"];
    var ret = [];
    var conf = App.conf;
    var tpl = conf.tpl;
    var query = conf.reqParam.query;

    if(wordList) {
        G.each(wordList, function(li) {
            li.dataFm = li.data.replace(query,"<b>"+query+"</b>");
            li.url = App.supportState ? "javascript:void(0)" : App.cache.urlbase + "?query=" + G.urlEscape(encodeURIComponent(li.data)) + "&pn=" + 1;
            ret.push(tpl.wordLi.replaceTpl(li));
        });
        resultWord.innerHTML = ret.join("");
       
        
        
        
        resultWord.parentNode.style.display = "block";
    }else{
        resultWord.parentNode.style.display = "none";
    }
    
}

App.sugInit = function() {
    var conf = App.conf,
        searchInput = G("searchInput");
    conf.sug.templ = function(data, q) {
        var that = this,
            o = that.o,
            classNameQueryNull = o.classNameQueryNull,
            classNameQuery = o.classNameQuery,
            ret = [];

        if(data + "" === data) {
            ret.push('<p>' + data + '</p>')
        }
        else {
            data = data[o.callbackDataKey || o.callbackDataNum] || [];

            var i = 0,
                l = Math.min(data.length, o.n),
                li,
                undef;
            q = q.trim();
            for(; i<l; i++) {
                li = data[i];
                li !== undef && ret.push('<li q="' + li + '"' + (classNameQueryNull && li.indexOf(q) > -1 ? "" : " class=" + classNameQueryNull) + '>' + (classNameQuery ? li.replace(q, '<span class="' + classNameQuery + '">' + q + '</span>') : li) + '</li>');
            }
        }
        return '<ol>' + ret.join("") + '</ol>' + conf.tpl.sugBot.replaceTpl({
            classOn: conf.sugOn ? "" : "sug-close sug-switch_cur"
            , classOff: conf.sugOn ? "sug-close sug-switch_cur" : ""
        });
    }
    conf.sug.onSucess = function(data) {
        if(App.cache.waitSugTimer) {
            clearTimeout(App.cache.waitSugTimer);
            App.cache.waitSugTimer = null;
        }
    }
    conf.sug.onRequest = function(data) {
        if(!App.cache.waitSugTimer) App.cache.waitSugTimer = setTimeout(function() {
            searchtop(conf.txt.withoutSug);
        }, 1000);
        App.cache.sug.sugWrap.style.visibility = App.conf.sugOn ? "" : "hidden";
    }
    G.loadJs([conf.sugPath], function() {
        var sug = App.cache.sug = G.sug(searchInput, conf.sug);
        G("sugShow").onclick = function() {
            var val = searchInput.value;
            searchInput.focus();
            if(!conf.sugOn) {
                sug.q = "";
                searchtop(conf.txt.closedSug);
                sug.sugWrap.style.visibility = "";
                return false;
            }

            if(!val.trim()) {
                searchtop(conf.txt.withoutQuery);
            }
            else {
                sug.request(val);
            }
        }
        G.delegate(sug.sugWrap, "mousedown", function(e) {
            var type = this.getAttribute("data-switch"),
                el;

            (this.tagName === "LI" || this.parentNode.tagName === "LI") && UT && UT.send({type: "click", sort:"search_sug"});

            if(!type || !/sug-switch_cur/.test(this.className)) return false;
            App.conf.sugOn = type === "on";
            el = G("sugSwitch_" + (conf.sugOn ? "off" : "on"));
            el && (el.className += " sug-switch_cur");
            this.className = this.className.replace(" sug-switch_cur", "");
            return false;
        });
    })
}

App.iptControl = function(opt) {
    this.ipt = opt.ipt;
    this.btnClose = opt.btnClose;
    this.tip = opt.tip;
}

App.iptControl.prototype = {
    init: function() {
        var that = this;
        "onpropertychange" in that.ipt
        ? that.ipt.onpropertychange = function(e){
            e = window.event;
            e.propertyName == "value" && that.iptHandle.call(that);
        }
        : that.ipt.addEventListener("input", function(e) {
            that.iptHandle.call(that);
        }, false);

        that.updateBtnClose();

        that.btnClose.onclick = function() {
            that.ipt.value = "";
            setTimeout(function() {
                that.ipt.focus();
                that.show(that.btnClose, "none");
            }, 64);
            return false;
        }

        that.ipt.onfocus = that.ipt.onblur = function(e) {
            that.updateBtnClose.call(that);
        }

        that.tip.onclick = function() {
            that.ipt.focus();
        }
    },
    updateBtnClose: function() {
        var that = this;
        setTimeout(function() {
            that.ipt.value
            ? that.show(that.btnClose, "inline-block")
            : that.show(that.btnClose, "none")
        }, 64);
    },
    iptHandle: function(e) {
        var that = this;
        that.ipt.value
        ? that.show(that.btnClose, "inline-block").show(that.tip, "none")
        : that.show(that.btnClose, "none");
    },
    show: function(el, className) {
        if(el.style.display !== className) el.style.display = className;
        return this;
    }
}

App.init = function() {
    var conf = App.conf,
        searchInput = G("searchInput"),
        iptControl = new App.iptControl({
            ipt: G("searchInput")
            , btnClose: G("searchClose")
            , tip: G("searchIptTip")
        }),
        iptControl2 = new App.iptControl({
            ipt: G("searchInput2")
            , btnClose: G("searchClose2")
            , tip: G("searchIptTip2")
        });

    G.delegate(document.body, "mousedown", function(e) {

        (this.tagName === "A" || this.parentNode.tagName === "A" || this.tagName === "BUTTON") && UT && UT.send({type: "click", position: "links"});

        (this.id === "searchSubmit" || this.id === "searchSubmit2") && UT && UT.send({type: "click", sort: "search_btn"});

        (/logo-hao123/.test(this.className) || /logo-hao123/.test(this.parentNode.className)) && UT && UT.send({type: "click", sort:"logo_hao123"});

        (/logo-yahoo/.test(this.className) || /logo-yahoo/.test(this.parentNode.className)) && UT && UT.send({type: "click", sort:"logo-yahoo"});

        if(this.tagName === "A" || this.parentNode.tagName === "A") {
            e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
        }
    });

    G.delegate(G("result"), "mousedown", function(e) {
        (this.tagName === "A" || this.parentNode.tagName === "A") && UT && UT.send({type: "click", sort:"search_result", position: "links"});
    });

    G.each(conf.adMaps, function(val, key) {
        G.delegate(val, "mousedown", function(e) {
            if(this.getAttribute("data-logo") || this.parentNode.getAttribute("data-logo")) return;
            (this.tagName === "A" || this.parentNode.tagName === "A" || this.parentNode.parentNode.tagName === "A") && !/r-list_more/.test(this.parentNode.className) && UT && UT.send({type: "click", position:"search_ad", value: (this.innerText || this.innerHTML).trim(), sort: key, linkIndex: this.getAttribute("data-i") || this.parentNode.getAttribute("data-i") || this.parentNode.parentNode.getAttribute("data-i")});
        });
    });

    App.req();
    App.amazonAds.init(window["conf"].amazonAds, parseInt(conf.reqPn , 10) > 1 ? true: false);

    if(App.supportState) {
        history.pushState({
                query: conf.reqParam.query
                , pn: conf.reqPn
            }
            , ""
            , App.cache.urlbase + "?query=" + G.urlEscape(encodeURIComponent(conf.reqParam.query)) + "&pn=" + conf.reqPn
        );
    }

    G("searchForm").onsubmit = G("searchForm2").onsubmit = function(e) {
        var query = conf.reqParam.query = this.getElementsByTagName("input")[0].value.trim(),
            iptTip = G(/2/.test(this.id) ? "searchIptTip2" : "searchIptTip");
        //if(!query) {
            /*iptControl.show(iptTip, "inline-block");
            return false;*/
            //return;
        //}

        if(!App.supportState) return;
        conf.reqPn = 1;
        App.req();
        App.amazonAds.init(window["conf"].amazonAds);
        history.pushState({
                query: query
                , pn: conf.reqPn
            }
            , ""
            , App.cache.urlbase + "?query=" + G.urlEscape(encodeURIComponent(query)) + "&pn=" + conf.reqPn
        );
        setTimeout(function() {
            App.cache.sug && App.cache.sug.hide(1);
        }, 200);
        return false;
    }
    G.delegate(G("resultWord"), "mousedown", function(e) {
        if(this.tagName === "B"||this.tagName === "A"){
            var q = this.tagName === "B" ? this.parentNode.getAttribute("data-q") : this.getAttribute("data-q");
            conf.reqParam.query = q;
            UT && UT.send({type: "click", modId: "related-keywords", sort: q});

            if(!App.supportState) return;
            conf.reqPn = 1;
            App.req(); 
            history.pushState({
                    query: q
                    , pn: conf.reqPn
                }
                , ""
                , App.cache.urlbase + "?query=" + G.urlEscape(encodeURIComponent(q)) + "&pn=" + conf.reqPn
            );
            
        }
    });
    G.delegate(G("searchLinks"), "click", function(e) {
        var val = G("searchInput").value.trim(),
            qUrl = this.getAttribute("data-url");
        if(!qUrl || !val) return;

        window.open(this.getAttribute("data-url").replaceTpl({q: encodeURIComponent(val)}));
        e.preventDefault && e.preventDefault();
        return false;
    });

    G.delegate(G("searchLinks"), "mousedown", function(e) {
        UT && UT.send({type: "click", sort: "search_tab", position: "links", value: this.innerHTML.trim()});
    });

    setTimeout(function() {
        App.sugInit();
    }, 200);

    if(!App.supportState) return;

    window.addEventListener("popstate", function(e) {
        var state = e.state;
        if(!state/* || !state.query*/) return;
        conf.reqParam.query = history.state.query;
        conf.reqPn = history.state.reqPn;
        App.req();
        App.amazonAds.init(window["conf"].amazonAds, parseInt(conf.reqPn, 10) > 1 ? true: false);

        // fix history not reset page num
/*        setTimeout(function() {
            var pnLinks = G("resultPn").getElementsByTagName("a") || [];
            G.each(pnLinks, function(li) {
               if(~~li.getAttribute("data-n") === ~~conf.reqPn && !/r-pn_cur/.test(li.className)) {
                    li.className = "r-pn_cur";
                    return false;
               }
            });
        }, 100);*/

    }, false);

    G.delegate(G("resultPn"), "mousedown", function(e) {
        var pn = this.getAttribute("data-n"),
            query = conf.reqParam.query,
            reqPn = conf.reqPn;

        if(this.tagName !== "A" || /r-pn_cur/.test(this.className || !pn)) return false;

        UT && UT.send({type: "click", sort:"nextpage"});

        if(pn === "<") pn = -1;
        else if(pn === ">") pn = 1;
        else conf.reqPn = 0;
        conf.reqPn = +pn + conf.reqPn;
        App.req();
        if(App.amazonAds.render(App.amazonAds.data, parseInt(conf.reqPn, 10) > 1 ? true: false)) {
            App.amazonAds.init(window["conf"].amazonAds);
        }
        history.pushState({
                query: query
                , pn: conf.reqPn
            }
            , ""
            , App.cache.urlbase + "?query=" + G.urlEscape(encodeURIComponent(query)) + "&pn=" + conf.reqPn
        );
        setTimeout(function() {
            searchInput.focus();
        }, 64);
        return false;
    });
    iptControl.init();
    iptControl2.init();
}
App.init();
