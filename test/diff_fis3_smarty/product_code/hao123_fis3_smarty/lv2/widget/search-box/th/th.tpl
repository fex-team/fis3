
<%if !empty($body.searchBox.tplUrl)%>
	<%widget name="lv2:widget/search-box/`$sysInfo.country`/`$body.searchBox.tplUrl`/`$body.searchBox.tplUrl`.tpl"%>
<%else%>
<%script%>
<%strip%>
<%*注意：不能写JS注释*%>
require.async('common:widget/ui/jquery/jquery.js', function () {
conf.searchGroup = {
	conf:{
		index: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/th/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 10
		},
		lv2: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/th/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 10
		}
		<%if isset($body.searchBox.sort)%>, sort: "<%$body.searchBox.sort%>"<%/if%>
	},
	list: {
		<%foreach $body.searchBox.sBoxTag as $tag%>"<%$tag.catagory%>": {
			"engine": [<%foreach $tag.engine as $engine%>
					<%if empty($body.searchboxEngine[$engine.id])%>{
					id: "<%$engine.id%>",
					name: "<%$engine.title%>",
					logo: "<%$engine.logo%>",
					url: "<%$engine.url%>",
					action: "<%$engine.action%>",
					params: {
						<%if !empty($engine.params[0].name)%><%foreach $engine.params as $params%><%if !empty($params.name)%>"<%$params.name%>": "<%$params.value%>"<%if !$params@last%>,<%/if%><%/if%><%/foreach%><%/if%>
					},
					<%if !empty($engine.baiduSug)%>baiduSug:{mod: "<%$engine.baiduSug%>"},<%/if%>
					<%if !empty($engine.otherSug)%>otherSug:{mod: "<%$engine.otherSug%>"},<%/if%>
					q: "<%$engine.q|default:'q'%>"
				}<%if !$engine@last%>,<%/if%><%/if%><%/foreach%>
			]
		}<%if !$tag@last%>,<%/if%><%/foreach%>
	},
	sug: {
		"hao123": {
			autoCompleteData: false,
			requestQuery: "wd",
			url: null,
			callbackFn: "window.bdsug.sug",
			callbackDataKey: "s",
			requestParas: {
				"prod": "thai",
				"cb": "window.bdsug.sug",
				"haobd": jQuery.cookie("BAIDUID")
			},
			templ: false
		},
		"google_th": {
			requestQuery: "q",
			url: null,
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "hp",
				"hl": "th",
				"authuser": "0"
			},
			templ: false
		},
		"yahoo_web": {
			autoCompleteData: false,
			requestQuery: "command",
			url: "http://sugg.us.search.yahoo.net/gossip-us-sayt/",
			callbackFn: "fxsearch",
			callbackDataKey: 1,
			requestParas: {
				"output": "fxjsonp"
			},
		    templ: function(data) {
		        var _data = data[1] || [],
		            q = data[0],
		            ret = [],
		            i = 0,
		            len = _data.length;
		        for (; i < len; i++) {
		          ret.push('<li q="' + _data[i] + '" style="font-weight: normal;">' + _data[i] + '</li>')
		        }
		        return '<ol>' + ret.join("") + '</ol>';
		    }
		},
		"google_images": {
			requestQuery: "q",
			url: "http://clients1.google.co.th/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"hl": "th",
				"client": "img",
				"ds": "i",
				"cp": "4"
			},
			templ: function(data) {
				var _data = data[1] || [],
					q = data[0],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i][0] + '" style="font-weight: normal;">' + _data[i][0] + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"hao123_images": {
			requestQuery: "wd",
			url: "http://sugimg.hao123.co.th/su",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			requestParas: {
				"prod": "image_thai"
			},
			templ: function(data) {
				var _data = data["s"] || [],
					q = data["q"],
					ret = [],
					i = 0,
					len = _data.length;
				for (; i < len; i++) {
					ret.push('<li q="' + _data[i] + '" style="font-weight: normal;">' + _data[i] + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"ps_video": {
	      requestQuery: "wd",
	      url: null,
	      callbackFn: "ps_video",
	      callbackDataKey: "s",
	      requestParas: {
	        "prod" : "video_thai",
	        "sid": "",
	        "cb":"ps_video",
	      },
	      templ: false
	    },
		"youtube": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "youtube",
				"hl": "th",
				"gl": "us",
				"gs_nf": "1",
				"ds": "yt"
			},
			templ: function(data) {
				var _data = data[1] || [],
					q = data[0],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i][0] + '" style="font-weight: normal;">' + _data[i][0] + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"google_video": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.co.th/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "video-hp",
				"hl": "th",
				"ds": "yt"
			},
			templ: function(data) {
				var _data = data[1] || [],
					q = data[0],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i][0] + '" style="font-weight: normal;">' + _data[i][0] + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"mthai": {
			url: null
		},
		"4shared": {
			requestQuery: "search",
			url: "http://dc413.4shared.com/network/search-suggest.jsp",
			callbackFn: "ajaxSuggestions.jsonpCallback",
			callbackDataKey: "suggestions",
			requestParas: {
				"format": "jsonp"
			},
			customUrl: function(para) {
				return this.o.url + "?search=" + btoa(this.q) + "&format=jsonp";
			},
			templ: function(data) {
				var _data = data["suggestions"] || [],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i] + '" style="font-weight: normal;">' + _data[i] + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"filestube": {
			requestQuery: "q",
			url: "http://149.13.65.144:8087",
			callbackFn: "filestube123",
			callbackDataKey: "r",
			charset: "utf-8",
			requestParas: {
				"callback": "filestube123",
				"t": +new Date
			},
			customUrl: function(para) {
				return this.o.url + "/" + encodeURIComponent(this.q) + "?" + para.substr(1);
			}
		},
		"google_map": {
			requestQuery: "q",
			url: "http://maps.google.co.th/maps/suggest",
			callbackFn: "_xdc_._bgnkibby8",
			callbackDataKey: 3,
			requestParas: {
				"cp": "2",
				"hl": "th",
				"gl": "th",
				"v": "2",
				"clid": "1",
				"json": "a",
				"ll": "21.902278,101.469727",
				"spn": "5.706298,39.506836",
				"auth": "ac0dbe60:A6KQ3ztz8bQ13_rnpShsJPs6jOU",
				"src": "1",
				"num": "5",
				"numps": "5",
				"callback": "_xdc_._bgnkibby8"
			},
			templ: function(data) {
				var _data = data[3] || [],
					q = this.q,
					ret = [],
					i = 0,
					len = _data.length,
					detail = "";
				
				for(; i<len; i++) {
					try{detail = _data[i][9][0][0] || _data[i][9][0] || _data[i][9] || "";}
					catch(e){detail = ""}
					
					/*detail = detail ? '<span style=" font-weight:bold; color:#999;"> - ' + detail + '</span>' : "";*/
					
					ret.push('<li q="' + _data[i][0] + '" style="font-weight: normal;">' + _data[i][0] + detail + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"longdo_map": {
			requestQuery: "key",
			url: "http://search2.longdo.com/BWTSearch/HeadSearch",
			callbackFn: "processJSONSuggest",
			requestParas: {
				"ds": "poi,poi2,poi3,s_pg",
				"json": "1",
				"num": "20",
				"anyorder": "1",
				"count": "19"	
			},
			customUrl: function(para) {
				return this.o.url + "?" + para.substr(1) + "&" + this.o.requestQuery + '=' + encodeURIComponent(this.q);
			},
			templ: function(data) {
				var _data = data,
					q = this.q,
					ret = [],
					i = 0,
					len = _data.length;
				
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i].w + '" style="font-weight: normal;">' + _data[i].d + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"longdo_dict": {
			requestQuery: "key",
			url: "http://search.longdo.com/BWTSearch/HeadSearch",
			callbackFn: "processJSONSuggest",
			requestParas: {
				"json": "1",
				"ds": "head",
				"num": "20",
				"count": "7"
			},
			customUrl: function(para) {
				return this.o.url + "?" + para.substr(1) + "&" + this.o.requestQuery + '=' + encodeURIComponent(this.q);
			},
			templ: function(data) {
				var _data = data,
					q = this.q,
					ret = [],
					i = 0,
					len = _data.length;
				
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i].w + '" style="font-weight: normal;">' + _data[i].d + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"google_translate": {
			url: null
		},
		"wiki": {
			autoCompleteData: false,
			requestQuery: "search",
			url: "http://th.wikipedia.org/w/api.php",
			callbackFn: "wikipedia.th",
			callbackDataKey: "1",
			requestParas: {
				"action": "opensearch",
				"namespace": "0",
				"suggest": "",
				"callback": "wikipedia.th"
			},
	        templ: function(data) {
		        var _data = data[1] || [],
		            q = data[0],
		            ret = [],
		            i = 0,
		            len = _data.length;
		        for (; i < len; i++) {
		          ret.push('<li q="' + _data[i] + '" style="font-weight: normal;">' + _data[i] + '</li>')
		        }
		        return '<ol>' + ret.join("") + '</ol>';
	        }
		},
		"filmes": {
			requestQuery: "wds",
			url: "http://th.hao123.com/video/sug",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			requestParas: {},
			templ: function(data) {
		        var _data = data["s"] || [],
		            q = data["q"],
		            ret = [],
		            i = 0,
		            len = _data.length;
		        for (; i < len; i++) {
		          ret.push('<li q="' + _data[i] + '" style="font-weight: normal;">' + _data[i] + '</li>')
		        }
		        return '<ol>' + ret.join("") + '</ol>';
		    }
		}
	}
}
});
<%/strip%>
<%/script%>
<%/if%>
