/**
 * Created with JetBrains PhpStorm.
 * User: ne
 * Date: 13-5-20
 * Time: 下午3:51
 * To change this template use File | Settings | File Templates.
 */

//jQuery.hao123.localcookie

//【所有的jQuery插件依赖要写清楚，可以不导出】
require('common:widget/ui/jquery/jquery.js');  //jquery+cookie
require('common:widget/ui/localstorage/localstorage.js');


(function ($, undefind) {
	var n = "localcookie", r = 0, i = 1, s = 2, o;
	$.widget("hao123." + n, $.hao123.storage, {options: {localKey: "FLASHID", cookieKey: "BAIDUID"}, _create: function () {
		var t = this;
		t.readyState = r, t.callbackList = [], t.element.bind(n + "ready",function () {
			t.readyState = i, t._calllback(!0)
		}).bind(n + "fail", function () {
				t.readyState = s, t._calllback(!1)
			}), $.hao123.storage.prototype._create.call(this)
	}, _calllback: function (e) {
		var t = this, n, r, i;
		for (i = 0, r = t.callbackList.length; i < r; i++)n = t.callbackList[i], n(e)
	}, _init: function () {
		var n = this, r = n.options;
		n.val(r.localKey, function (n) {
			var i;
			return n ? (i = $.cookie(r.localKey), n != i && $.cookie(r.localKey, n, {expires: 2e3}), undefind) : (i = $.cookie(r.cookieKey), $.cookie(r.localKey, i, {expires: 2e3}), i)
		})
	}, wait: function (e, n) {
		var o = this, u = !1;
		switch (o.readyState) {
			case r:
				o.callbackList.push(function (t) {
					u !== !1 && (u !== !0 && clearTimeout(u), e(t))
				}), n !== undefind ? u = setTimeout(function () {
					u = !1, e(!1)
				}, n) : u = !0;
				break;
			case i:
				setTimeout(function () {
					e(!0)
				}, 0);
				break;
			case s:
			default:
				setTimeout(function () {
					e(!1)
				}, 0)
		}
	}}), $.hao123.localcookie.getInstance = function () {
		return o ? o : o = $(document).localcookie()
	}
})(jQuery);