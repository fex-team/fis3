<%script%>
<%strip%>
<%*注意：不能写JS注释*%>
conf.searchGroup = {
	conf:{
		index: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/tw/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 10,
			defaultTab: "<%$body.searchBox.defaultTab|default:'web'%>"
		},
		lv2: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/tw/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 10,
			defaultTab: "<%$body.searchBox.defaultTab|default:'web'%>"
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
		"google_web": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com.tw/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "hp",
				"hl": "zh-TW"
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
		"yahoo_web": {
			autoCompleteData: false,
			requestQuery: "command",
			url: "http://sugg.tw.search.yahoo.net/gossip-tw/",
			callbackFn: "fxsearch",
			callbackDataKey: 1,
			requestParas: {
				"output": "fxjsonp"
			}
		},
		"hao123": {
			url: null
		},
		"baidu": {
			autoCompleteData: false,
			requestQuery: "wd",
			url: "http://suggestion.baidu.com/su",
			callbackFn: "window.bdsug.sug",
			callbackDataKey: "s",
			charset:"gbk",
			requestParas: {
				"cb": "window.bdsug.sug"
			}
		},
		"google_news": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com.tw/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "serp",
				"hl": "zh-TW",
				"gs_nf": "1",
				"ds": "n"
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
		"yahoo_news": {
			autoCompleteData: false,
			requestQuery: "command",
			url: "http://sugg.tw.search.yahoo.net/gossip-tw-ura",
			callbackFn: "fxsearch",
			callbackDataKey: "1",
			requestParas: {
				"output": "fxjsonp",
				"droprotated": "1",
				"pubid": "184"
			}
		},
		"baidu_news": {
			autoCompleteData: false,
			requestQuery: "wd",
			url: "http://nssug.baidu.com/su",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			charset:"gbk",
			requestParas: {
				"prod": "news"
			}
		},
		"youtube": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "youtube",
				"hl": "zh-TW",
				"gl": "tw",
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
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"google_video": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com.tw/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "video-hp",
				"hl": "zh-TW",
				"ds": "yt"
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
		"baidu_video": {
			autoCompleteData: false,
			requestQuery: "wd",
			url: "http://nssug.baidu.com/su",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			charset:"gbk",
			requestParas: {
				"prod": "video"
			}
		},
		"yahoo_images": {
			autoCompleteData: false,
			requestQuery: "command",
			url: "http://sugg.tw.search.yahoo.net/gossip-tw",
			callbackFn: "fxsearch",
			callbackDataKey: "1",
			requestParas: {
				"output": "fxjsonp",
				"pubid": "183"
			}
		},
		"google_images": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com.tw/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"hl": "zh-TW",
				"client": "img",
				"gs_nf": "1",
				"ds": "i"
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
		"baidu_images": {
			autoCompleteData: false,
			requestQuery: "wd",
			url: "http://nssug.baidu.com/su",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			charset:"gbk",
			requestParas: {
				"prod": "image"
			}
		},
		"facebook": {
			url: null
		},
		"wiki": {
			autoCompleteData: false,
			requestQuery: "search",
			url: "http://zh.wikipedia.org/w/api.php",
			callbackFn: "wikipedia.zh",
			callbackDataKey: "1",
			requestParas: {
				"action": "opensearch",
				"namespace": "0",
				"suggest": "",
				"callback": "wikipedia.zh"
			}
		},
		"baidu_baike": {
			autoCompleteData: false,
			requestQuery: "wd",
			url: "http://nssug.baidu.com/su",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			charset:"gbk",
			requestParas: {
				"prod": "baike"
			}
		},
		"google_dict": {
			url: null
		},
		"yahoo_dict": {
			autoCompleteData: false,
			requestQuery: "command",
			url: "http://sugg.tw.search.yahoo.net/gossip-tw-pub_sayt",
			callbackFn: "fxsearch",
			callbackDataKey: "1",
			requestParas: {
				"output": "fxjsonp",
				"pubid": "560"
			}
		},
		"baidu_dict": {
			autoCompleteData: false,
			requestQuery: "wd",
			url: "http://dictsug.baidu.com/su",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			charset:"gbk",
			requestParas: {
			}
		},
		"google_map": {
			requestQuery: "q",
			url: "http://maps.google.com.tw/maps/suggest",
			callbackFn: "googleMapCallback",
			callbackDataKey: 3,
			requestParas: {
				"cp": "1",
				"hl": "zh-TW",
				"gl": "tw",
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
		"yahoo_map": {
			url: null
		}
	}
}
<%/strip%>
<%/script%>
