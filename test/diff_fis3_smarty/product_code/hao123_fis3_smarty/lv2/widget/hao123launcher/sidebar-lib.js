/*
sidebar lib
@Frank Feng
 */

// Use hao123 & conf namespace
window.hao123 || (window.hao123 = {});
window.conf || (window.conf = {});

// UT
if (!UT) {
var UT={url:"/img/gut.gif",send:function(e,t){e=e||{};var n=window.conf.UT,r=t&&t.url||this.url,i=t&&t.params||n.params,s=e.r=+(new Date),o=window,u=encodeURIComponent,a=o["UT"+s]=new Image,f,l=[];if(i)for(var c in i)i[c]!==f&&e[c]===f&&(e[c]=i[c]);window.hao123&&hao123.sidebarTn&&e.type=="click"&&(e.type="sidebar",e.innertn=hao123.sidebarTn);for(f in e)l.push(u(f)+"="+u(e[f]));a.onload=a.onerror=function(){o["UT"+s]=null},a.src=r+"?"+l.join("&"),a=l=null},attr:function(e,t){var n=e.getAttribute("log-mod");if(!n)e.parentNode&&e.parentNode.tagName.toUpperCase()!="BODY"&&this.attr(e.parentNode,t);else{var r=e.getAttribute("log-index");r&&(t.modIndex=r),t.modId=n}},link:function(e){var t={},n=e.getAttribute("href",2);n&&(/^(javascript|#)/.test(n)?(t.ac="b",t.url="none"):(t.ac="a",t.url=n));var r=e.getAttribute("log-index");r&&(t.linkIndex=r);var i=e.getAttribute("data-sort")||"";i&&(t.sort=i,t.value=e.getAttribute("data-val")||"");var s=e.getAttribute("log-oid");return s&&(t.offerid=s),this.attr(e,t),t}};
}

// Serialize URL query
hao123.getQueryString = function(url) {
	if (url) {
		url = url.split("?")[1];
	}
	var result = {}, queryString = url || location.search.substring(1),
		re = /([^&=]+)=([^&]*)/g,
		m;
	while (m = re.exec(queryString)) {
		result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	return result;
};

// JSONP
hao123.getJSON = function(o) {
	var url = o.url || null,	// jsonp url
		params = o.params || null,	// jsonp parmas
		callbackFuncName = o.callbackFuncName || null,	// callback function's key
		callback = o.callback || new Function(),	// on success callback
		paramsUrl = "",
		jsonp = "";

	if (!url) return false;

	for (var key in params) {
		paramsUrl += "&" + key + "=" + encodeURIComponent(params[key]);
	}

	url += paramsUrl;

	jsonp = hao123.getQueryString(url)[callbackFuncName];

	//是否需自动创建全局函数
	if( callbackFuncName ){
		jsonp = hao123.getQueryString(url)[callbackFuncName];
		window[jsonp] = function() {
			window[jsonp] = undefined;
			var args = Array.prototype.slice.call(arguments); 
			try {
				delete window[jsonp];
			} catch (e) {}
			if (head) {
				head.removeChild(script);
			}
			callback.apply(args, args);
		};
	}

	var head = document.getElementsByTagName('head')[0],
		script = document.createElement('script');

	script.charset = "UTF-8";
	script.src = url;
	head.appendChild(script);
	return true;
};