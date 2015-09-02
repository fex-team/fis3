
<%if !empty($body.searchBox.tplUrl)%>
	<%widget name="common:widget/search-box/`$sysInfo.country`/`$body.searchBox.tplUrl`/`$body.searchBox.tplUrl`.tpl"%>
<%else%>
<%script%>
<%strip%>
<%*注意：不能写JS注释*%>
conf.searchGroup = {
	conf:{
		index: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/id/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 10
		},
		lv2: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/id/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 10
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
					q: "<%$engine.q|default:'q'%>"
				}<%if !$engine@last%>,<%/if%><%/if%><%/foreach%>
			]
		}<%if !$tag@last%>,<%/if%><%/foreach%>
	},
	sug: {
		"google": {
			requestQuery: "q",
			url: "http://clients1.google.co.id/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "serp",
				"hl": "id"
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
		"google_images": {
			requestQuery: "q",
			url: "http://clients1.google.co.id/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "img",
				"ds": "i",
				"hl": "id"
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
		"google_map": {
			requestQuery: "q",
			url: "http://maps.google.co.id/maps/suggest",
			callbackFn: "googleMapCallback",
			callbackDataKey: 3,
			requestParas: {
				"cp": "1",
				"hl": "id",
				"gl": "id",
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
		"youtube": {
			requestQuery: "q",
			url: "http://clients1.google.com/complete/search",
			callbackFn: "youtubeCallback",
			callbackDataKey: 1,
			requestParas: {
				"hl": "id",
				"client": "youtube",
				"gl": "id",
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
		"4shared": {
			requestQuery: "search",
			url: "http://dc446.4shared.com/network/search-suggest.jsp",
			callbackFn: "ajaxSuggestions.jsonpCallback",
			callbackDataKey: "suggestions",
			requestParas: {
				"format": "jsonp"
			},
			customUrl: function(para) {
				return this.o.url + "?search=" + btoa(this.q) + "&format=jsonp";
			}
		},
		"google_dict": {
			url: null
		},
		"yahoo_web": {
			autoCompleteData: false,
			requestQuery: "command",
			url: "http://sugg.id.search.yahoo.com/gossip-id-sayt/",
			callbackFn: "fxsearch",
			callbackDataKey: 1,
			requestParas: {
				"output": "fxjsonp"
			}
		},
		"wiki": {
			autoCompleteData: false,
			requestQuery: "search",
			url: "http://id.wikipedia.org/w/api.php",
			callbackFn: "wikipedia.id",
			callbackDataKey: "1",
			requestParas: {
				"action": "opensearch",
				"namespace": "0",
				"suggest": "",
				"callback": "wikipedia.id",
				"format":"json"
			}
		},
		"google_news": {
			url: null
		}
	}
}
<%/strip%>
<%/script%>
<%/if%>
