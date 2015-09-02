<%script%>
<%strip%>
<%*注意：不能写JS注释*%>
conf.searchGroup = {
	conf:{
		index: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/jp/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 10,
			defaultTab: "<%$body.searchBox.defaultTab|default:'web'%>"
		},
		lv2: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/jp/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 10,
			defaultTab: "<%$body.searchBox.defaultTab|default:'web'%>"
		},
		tn: {
			timeStamp: "<%$sysInfo.baiduidCt%>",
			serverTime: "<%$sysInfo.serverTime%>",
			isInList:<%if !empty($root.urlparam.tn) && !empty($head.confTn) && in_array($root.urlparam.tn,explode("|", $head.confTn))%>1<%else%>0<%/if%>,
			timeInterval: 1209600
		}

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
					q: "<%$engine.q|default:'q'%>",
					placeholder: "<%$engine.placeholder%>"
				}<%if !$engine@last%>,<%/if%><%/if%><%/foreach%>
			]
		}<%if !$tag@last%>,<%/if%><%/foreach%>
	},

	sug: {
		"google_jp": {
			requestQuery: "q",
			url: "http://clients1.google.co.jp/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "serp",
				"hl": "ja"
			},
			templ: function(data) {
				var _data = data[1] || [],
					q = data[0],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		<%if !empty($body.useYahooSug)%>
		"yahoo_jp": {
			requestQuery: "query",
			url: "/yahoosug",
			callbackFn: "yahoo_partner_sug",
			callbackDataKey: 1,
			requestParas: {
			}
		},
		<%else%>
		"yahoo_jp": {
			requestQuery: "p",
			url: "http://suggest.search.yahooapis.jp/SuggestSearchService/V3/webassistSearch",
			callbackFn: "yahooSuggest",
			callbackDataKey: 1,
			requestParas: {
				"output": "fxjson",
				"src": "srch",
				"ei": "UTF-8",
				"appid": "GEI3l.2xg673b7_tjztd7mGq8if5tIPm86vXPjoW7cwqM6jdkuEfO73_xNbz8QA-",
				"n": 11,
				"callback": "yahooSuggest"
			}
		},
		<%/if%>
		"baidu_jp": {
			requestQuery: "wd",
			url: "http://sug.baidu.jp/su?",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			requestParas: {	
			}				
		},
		"google_images": {
			requestQuery: "q",
			url: "http://clients1.google.co.jp/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "img",
				"ds": "i",
				"hl": "ja"
			},
			templ: function(data) {
				var _data = data[1] || [],
					q = data[0],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"yahoo_images": {
			requestQuery: "query",
			url: "http://suggest.search.yahooapis.jp/SuggestSearchService/V3/webassistSearch",
			callbackFn: "yahooImgSuggest",
			callbackDataKey: 1,
			requestParas: {
				"output": "json",
				"src": "isrch",
				"ei": "UTF-8",
				"appid": "GEI3l.2xg673b7_tjztd7mGq8if5tIPm86vXPjoW7cwqM6jdkuEfO73_xNbz8QA-",
				"resulsts": 10,
				"callback": "yahooImgSuggest"
			}
		},
		"baidu_images": {
			requestQuery: "wd",
			url: "http://image.baidu.jp/su?",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			requestParas: {					
			}		
		},
		"youtube": {
			requestQuery: "q",
			url: "http://clients1.google.com/complete/search",
			callbackFn: "youtubeCallback",
			callbackDataKey: 1,
			requestParas: {
				"hl": "ja",
				"client": "youtube",
				"gl": "jp",
				"ds": "yt",
				"callback": "youtubeCallback",
				"cp": "1"
			},
			templ: function(data) {
				var _data = data[1] || [],
					q = data[0],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"yahoo_video": {
			requestQuery: "query",
			url: "http://suggest.search.yahooapis.jp/SuggestSearchService/V3/webassistSearch",
			callbackFn: "yahooVideoSuggest",
			callbackDataKey: 1,
			requestParas: {
				"output": "json",
				"src": "vsrch",
				"ei": "UTF-8",
				"appid": "GEI3l.2xg673b7_tjztd7mGq8if5tIPm86vXPjoW7cwqM6jdkuEfO73_xNbz8QA-",
				"resulsts": 10,
				"callback": "yahooVideoSuggest"
			}
		},
		"baidu_video": {
			requestQuery: "wd",
			url: "http://video.baidu.jp/su?",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			requestParas: {					
			}		
		},
		"google_map": {
			requestQuery: "q",
			url: "http://maps.google.co.jp/maps/suggest",
			callbackFn: "googleMapCallback",
			callbackDataKey: 3,
			requestParas: {
				"cp": "1",
				"hl": "ja",
				"gl": "jp",
				"v": "2",
				"clid": "1",
				"json": "a",
				"vpsrc": "1",
				"src": "1",
				"num": "10",
				"numps": "3",
				"callback": "googleMapCallback"
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
					
					detail = detail ? '<span style=" font-weight:bold; color:#999;"> - ' + detail + '</span>' : "";
					
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + detail + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"google_news": {
			requestQuery: "q",
			url: "http://clients1.google.co.jp/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "serp",
				"ds": "n",
				"hl": "ja"
			},
			templ: function(data) {
				var _data = data[1] || [],
					q = data[0],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"jp_jobs": {
			url: null
		},
		"google_dict": {
			url: null
		},
		"yahoo_dict": {
			requestQuery: "query",
			url: "http://suggest.search.yahooapis.jp/SuggestSearchService/V3/webassistSearch",
			callbackFn: "yahooDictSuggest",
			callbackDataKey: 1,
			requestParas: {
				"output": "json",
				".src": "dic_all",
				"appid": "GEI3l.2xg673b7_tjztd7mGq8if5tIPm86vXPjoW7cwqM6jdkuEfO73_xNbz8QA-",
				"crumb": "QKHAOjMgzamLb0jiQkkwyVvZN_UvDCDclNTtYF_zmIZt96JRlxPpz5OweLONIHfY82xzaoagN2EPsJ.006TjkYwNEmA-",
				"resulsts": 10,
				"callback": "yahooDictSuggest"
			}
		},
		"yahoo_chiebukuro": {
			url: null
		},
		"yahoo_auctions": {
			requestQuery: "query",
			url: "http://suggest.search.yahooapis.jp/SuggestSearchService/V3/webassistSearch",
			callbackFn: "yahooSuggest",
			callbackDataKey: 1,
			requestParas: {
				"output": "json",
				".src": "auc",
				"appid": "Hy5EaxCxg66QNDm0cEojk3JOZS470WbaRqWtIpaQ4Tc7s8v6IK8AO45lFd3bwAwJzlZc",
				"resulsts": 10,
				"callback": "yahooSuggest"
			}
		},
		"amazon_shopping": {
		    requestQuery: "q",
			url: "http://completion.amazon.co.jp/search/complete",
			callbackFn: "amazonShoppingCallback",
			callbackDataKey: 1,
			requestParas: {
				"method": "completion",
				"search-alias" : "aps",
				"mkt": 6,
				"callback": "amazonShoppingCallback"
			},
			templ: function(data) {
				var _data = data[1] || [],
					q = data[0],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i] + '">' + _data[i].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"rakuten_shopping": {
		    requestQuery: "q",
			url: "http://api.suggest.search.rakuten.co.jp/suggest",
			callbackFn: "rakutenShoppingCallback",
			callbackDataKey: "result",
			requestParas: {
			    "cl": "dir",
			    "rid": "1252328571",
			    "sid": "1",
			    "oe": "euc-jp",
				"cb": "rakutenShoppingCallback"
			},
			templ: function(data) {
				var _data = data["result"] || [],
				    q   = _data["input"],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"yahoo_shopping": {
			requestQuery: "p",
			url: "http://suggest.shop.yahooapis.jp/Shopping/Suggest/V1/suggester",
			callbackFn: "getJsonData",
			callbackDataNum: 1,
			requestParas: {
				"callback":"getJsonData",
				"output": "json",
				"start": "1",
				"result": "10",
				".src": "shp",
				"brand": "0",
				"da": "0",
				"prod": "0",
				"appid": "dj0zaiZpPWIyYVBwSXI3bmdqYSZzPWNvbnN1bWVyc2VjcmV0Jng9YWU-"
			},
			templ: function(data) {
				var _data = data[1][0].keyword || [],
					q = data[0],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i] + '">' + _data[i].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>');
				}
				return '<ol>' + ret.join("") + '</ol>';
			}	
		}
	}
};
<%/strip%>
<%/script%>
