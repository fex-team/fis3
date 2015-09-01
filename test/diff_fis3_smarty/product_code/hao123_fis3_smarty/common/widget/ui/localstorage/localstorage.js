//【所有的jQuery插件依赖要写清楚，可以不导出】
require('common:widget/ui/jquery/jquery.js');
//jQuery.hao123.storage

(function ($, undefind) {
	function c(e) {
		function s(e) {
			n = e, c = l, s = function () {
			}, o(e)
		}

		function o(e) {
			var t, n, i;
			t = r.length;
			for (n = 0; n < t; n++)i = r[n], i(e)
		}

		function u(e) {
			var t;
			e < i ? (t = f[e], t(function (t) {
				t ? s(t) : u(e + 1)
			})) : s(!1)
		}

		function a(e) {
			r.push(e)
		}

		function l(e) {
			setTimeout(function () {
				e(n)
			}, 0)
		}

		var n = undefind, r = [], i = f.length;
		c = a, a(e), setTimeout(function () {
			u(0)
		}, 0)
	}

	function h(e) {
		return e.replace(/[_\s]/g, function (e) {
			return e == "_" ? "__" : "_s"
		})
	}

	function p(e) {
	}

	function d(n) {
		var r, i;
		r = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? document.documentMode || +RegExp.$1 : undefind;
		if (r && r < 9) {
			i = $('<div style="display:none"></div>').appendTo("body")[0], i.addBehavior("#default#userData");
			function s(e) {
				return e = h(e), i.load(e), i.getAttribute(e)
			}

			function o(e, t) {
				e = h(e), i.setAttribute(e, t), i.save(e)
			}

			n({get: s, set: o})
		} else n(!1)
	}

	function v(n) {
		function l() {
			return f = f || i.swf.getMovie(s)
		}

		function c(e) {
			var t, n;
			n = setInterval(function () {
				t = l(), t && t.flashInit && t.flashInit() && (clearInterval(n), e())
			}, 50)
		}

		function h(e) {
			var t, n;
			return t = l(), t && (n = t.call("read", [u, String(e)])), n
		}

		function p(e, t) {
			var n;
			n = l(), n && n.call("write", [u, String(e), t])
		}

		var r, i = r = i || {version: "1.5.2.2"};
		i.guid = "$BAIDU$", i.$$ = window[i.guid] = window[i.guid] || {global: {}}, i.dom = i.dom || {}, i.dom.g = function (e) {
			return e ? "string" == typeof e || e instanceof String ? document.getElementById(e) : !e.nodeName || e.nodeType != 1 && e.nodeType != 9 ? null : e : null
		}, i.g = i.G = i.dom.g, i.browser = i.browser || {}, i.browser.opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ? +(RegExp.$6 || RegExp.$2) : undefind, i.dom.insertHTML = function (e, t, n) {
			e = i.dom.g(e);
			var r, s;
			return e && (e.insertAdjacentHTML && !i.browser.opera ? e.insertAdjacentHTML(t, n) : (r = e.ownerDocument.createRange(), t = t.toUpperCase(), t == "AFTERBEGIN" || t == "BEFOREEND" ? (r.selectNodeContents(e), r.collapse(t == "AFTERBEGIN")) : (s = t == "BEFOREBEGIN", r[s ? "setStartBefore" : "setEndAfter"](e), r.collapse(s)), r.insertNode(r.createContextualFragment(n)))), e
		}, i.insertHTML = i.dom.insertHTML, i.swf = i.swf || {}, i.swf.version = function () {
			var e = navigator;
			if (e.plugins && e.mimeTypes.length) {
				var t = e.plugins["Shockwave Flash"];
				if (t && t.description)return t.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".") + ".0"
			} else if (window.ActiveXObject && !window.opera)for (var n = 12; n >= 2; n--)try {
				var r = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + n);
				if (r) {
					var i = r.GetVariable("$version");
					return i.replace(/WIN/g, "").replace(/,/g, ".")
				}
			} catch (s) {
			}
		}(), i.string = i.string || {}, i.string.encodeHTML = function (e) {
			return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
		}, i.encodeHTML = i.string.encodeHTML, i.swf.createHTML = function (e) {
			e = e || {};
			var t = i.swf.version, n = e.ver || "6.0.0", r, s, o, u, a, f, l = {}, c = i.string.encodeHTML;
			for (u in e)l[u] = e[u];
			e = l;
			if (!t)return"";
			t = t.split("."), n = n.split(".");
			for (o = 0; o < 3; o++) {
				r = parseInt(t[o], 10), s = parseInt(n[o], 10);
				if (s < r)break;
				if (s > r)return""
			}
			var h = e.vars, p = ["classid", "codebase", "id", "width", "height", "align"];
			e.align = e.align || "middle", e.classid = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000", e.codebase = "http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0", e.movie = e.url || "", delete e.vars, delete e.url;
			if ("string" == typeof h)e.flashvars = h; else {
				var d = [];
				for (u in h)f = h[u], d.push(u + "=" + encodeURIComponent(f));
				e.flashvars = d.join("&")
			}
			var v = ["<object "];
			for (o = 0, a = p.length; o < a; o++)f = p[o], v.push(" ", f, '="', c(e[f]), '"');
			v.push(">");
			var m = {wmode: 1, scale: 1, quality: 1, play: 1, loop: 1, menu: 1, salign: 1, bgcolor: 1, base: 1, allowscriptaccess: 1, allownetworking: 1, allowfullscreen: 1, seamlesstabbing: 1, devicefont: 1, swliveconnect: 1, flashvars: 1, movie: 1};
			for (u in e)f = e[u], u = u.toLowerCase(), m[u] && (f || f === !1 || f === 0) && v.push('<param name="' + u + '" value="' + c(f) + '" />');
			e.src = e.movie, e.name = e.id, delete e.id, delete e.movie, delete e.classid, delete e.codebase, e.type = "application/x-shockwave-flash", e.pluginspage = "http://www.macromedia.com/go/getflashplayer", v.push("<embed");
			var g;
			for (u in e) {
				f = e[u];
				if (f || f === !1 || f === 0) {
					if ((new RegExp("^salign$", "i")).test(u)) {
						g = f;
						continue
					}
					v.push(" ", u, '="', c(f), '"')
				}
			}
			return g && v.push(' salign="', c(g), '"'), v.push("></embed></object>"), v.join("")
		}, i.swf.create = function (e, t) {
			e = e || {};
			var n = i.swf.createHTML(e) || e.errorMessage || "";
			t && "string" == typeof t && (t = document.getElementById(t)), i.dom.insertHTML(t || document.body, "beforeEnd", n)
		}, i.browser.ie = i.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? document.documentMode || +RegExp.$1 : undefind, i.array = i.array || {}, i.array.remove = function (e, t) {
			var n = e.length;
			while (n--)n in e && e[n] === t && e.splice(n, 1);
			return e
		}, i.lang = i.lang || {}, i.lang.isArray = function (e) {
			return"[object Array]" == Object.prototype.toString.call(e)
		}, i.lang.isFunction = function (e) {
			return"[object Function]" == Object.prototype.toString.call(e)
		}, i.lang.toArray = function (e) {
			if (e === null || e === undefind)return[];
			if (i.lang.isArray(e))return e;
			if (typeof e.length != "number" || typeof e == "string" || i.lang.isFunction(e))return[e];
			if (e.item) {
				var n = e.length, r = new Array(n);
				while (n--)r[n] = e[n];
				return r
			}
			return[].slice.call(e)
		}, i.swf.getMovie = function (e) {
			var t = document[e], n;
			return i.browser.ie == 9 ? t && t.length ? (n = i.array.remove(i.lang.toArray(t), function (e) {
				return e.tagName.toLowerCase() != "embed"
			})).length == 1 ? n[0] : n : t : t || window[e]
		}, r.undope = !0;
		var s = "flashStorage", o = __uri("./swf/LocalStorage.swf"), u = "$hao123$", a, f;
		a = i.swf.createHTML({id: s, url: o, width: "1", height: "1", allowscriptaccess: "always", ver: "9.0.0", vars: {width: 1, height: 1}}), a ? (target = [0], i.dom.insertHTML($('<div style="font-size:0;line-height:0;height:1px"></div>').appendTo("body")[0], "beforeEnd", a)) : n(!1), c(function () {
			n({get: h, set: p})
		})
	}

	var n = "storage", r = 0, i = 1, s = 2, o = 3, u = "ready", a = "fail", f, l;
	$.widget("hao123." + n, {options: {cache: !0}, _create: function () {
		var e = this, t = e.options;
		e.state = i, e.cache = [], c(function (n) {
			n ? (e.storage = n, e.state = s, t.cache && e._popCache(), e._trigger(u, null, n)) : (e.state = o, e._trigger(a))
		})
	}, _popCache: function () {
		var e = this, t = e.cache, n = t.length, r, i, s, o;
		for (r = 0; r < n; r++)i = t[r], s = i[0], o = i[1], e._valAfterReady(2, s, o)
	}, _valCallback: function (e, n) {
		var r = this, i = r.element, s;
		s = n.call(i[0], r.storage.get(e), e), s !== undefind && r.storage.set(e, s)
	}, _valBeforReady: function (e, n, r) {
		var i = this, s = i.options, o = i.element, u = undefind;
		switch (e) {
			case 0:
			case 1:
				u = null;
				break;
			case 2:
			default:
				s.cache && i.cache.push([n, r])
		}
		return u
	}, _valAfterReady: function (n, r, i) {
		var s = this, o = undefind;
		switch (n) {
			case 0:
				o = null;
				break;
			case 1:
				o = s.storage.get(r), o === undefind && (o = null);
				break;
			case 2:
			default:
				$.isFunction(i) ? s._valCallback(r, i) : s.storage.set(r, i)
		}
		return o
	}, _valAfterError: function (e, n, r) {
		var i = undefind;
		switch (e) {
			case 0:
			case 1:
				i = null;
				break;
			case 2:
			default:
		}
		return i
	}, val: function (e, n) {
		var u = this, a = undefind, f = arguments.length;
		switch (u.state) {
			case r:
			case i:
				a = u._valBeforReady(f, e, n);
				break;
			case s:
				a = u._valAfterReady(f, e, n);
				break;
			case o:
			default:
				a = u._valAfterError(f, e, n)
		}
		return a
	}}), f = [v], $.hao123.storage.getInstance = function () {
		return l ? l : l = $(document).storage()
	}
})(jQuery);