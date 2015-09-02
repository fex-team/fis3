/**
 * 定义一些常用的工具函数
 * User: ne
 * Date: 13-5-20
 * Time: 下午6:09
 * To change this template use File | Settings | File Templates.

 * Change log:
 * 2013-8-1 11:00	Add Global Eval function by @Frank F.
 */

var helper = {
	/**
	 *    Format datas with a template
	 */
	replaceTpl: function (tpl, data, label) {
		var t = String(tpl),
			s = label || /#\{([^}]*)\}/mg,
			trim = String.trim ||
				function (str) {
					return str.replace(/^\s+|\s+$/g, '')
				};
		return t.replace(s, function (value, name) {
			//从模板获取name,容错处理
			return value = data[trim(name)];
		});
	},

	/**
	 *    Get url's query and put it into an object
	 */
	getQuery: function (url) {
		url = url ? url : window.location.search;
		if (url.indexOf("?") < 0) return {};
		var queryParam = url.substring(url.indexOf("?") + 1, url.length).split("&"),
			queryObj = {};
		for (i = 0; j = queryParam[i]; i++) {
			queryObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
		}
		return queryObj;
	},

	/**
	*	Eval JS code in global scope, support all browsers.
	*/
	globalEval: function( code ) {
        if ( code && /\S/.test(code) ) {
            var method = window.execScript ? "execScript" : "eval";
            window[method](code);
        }
    },
    /**
     * 地址栏url中如果带了指定的参数（如uid），则对应跳转链接的末尾也要带上这个参数（主要用在通过活动客户端进入首页后
     * 通过其他入口进入活动页时能保留首页的uid）
     * @param  {String} url        跳转链接url
     * @param  {String} queryParam 要带上的指定参数
     * @return {String}            拼接好的url
     */
    appendQueryToUrl: function(url, queryParam) {
    	var paramVal;
		// 有passQueryParam并且地址栏url带了queryParam指定的参数
		if(queryParam && (paramVal = this.getQuery(location.href)[queryParam])){
			url += (url.indexOf("?") != -1?"&":"?") + queryParam + "=" + paramVal;
		}
		return url;
	}
};

module.exports = helper;
