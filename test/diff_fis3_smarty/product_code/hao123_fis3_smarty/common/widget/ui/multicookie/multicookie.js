//use cookie format: {"sideAstro":"astro=1|lock=1"} to minimize the cookie number
var $ = require('common:widget/ui/jquery/jquery.js');
var multicookie = function(){
	return {
		//read a specific key's value
		readCookie: function(target,key){
			if(!!$.cookie(target)){
				var astroCookie = $.cookie(target).split('|'),
					astroCookieGroup = {};
				for(var i = 0, li; li = astroCookie[i]; i++) {
					li = li.split('=');
					astroCookieGroup[li[0]] = li[1];
				}
				return astroCookieGroup[key];
			}else{
				return ;
			}
		},
		//write a specific key's value
		writeCookie: function(target,key,value){
			var astroCookieGroup = {},
				astroCookieStr = "";
			if(!!$.cookie(target)){
				var	astroCookie = $.cookie(target).split('|');
				for(var i = 0, li; li = astroCookie[i]; i++) {
					li = li.split('=');
					astroCookieGroup[li[0]] = li[1];
				}
				
			}
			astroCookieGroup[key] = value;
			for(k in astroCookieGroup){
				astroCookieStr += (k + "=" + astroCookieGroup[k] + "|");
			}
			$.cookie(target,astroCookieStr.slice(0,-1),{expires: 2000});		
		}
	};
}();
module.exports = multicookie;