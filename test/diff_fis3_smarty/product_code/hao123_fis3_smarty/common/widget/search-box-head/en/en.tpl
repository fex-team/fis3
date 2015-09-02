
<%if !empty($body.searchBox.tplUrl)%>
	<%widget name="common:widget/search-box/`$sysInfo.country`/`$body.searchBox.tplUrl`/`$body.searchBox.tplUrl`.tpl"%>
<%else%>
<%script%>
<%strip%>
<%*注意：不能写JS注释*%>
conf.searchGroup = {
	conf:{
		index: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/en/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 10
		},
		lv2: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/en/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
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
		"google_web": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "hp",
				"hl": "en"
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
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"hl": "en",
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
		"google_map": {
			requestQuery: "q",
			url: "http://maps.google.com/maps/suggest",
			callbackFn: "googleMapCallback",
			callbackDataKey: 3,
			requestParas: {
				"cp": "1",
				"hl": "en",
				"gl": "",
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
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "youtube",
				"hl": "en",
				"gl": "US",
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
		"google_news": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "serp",
				"hl": "en",
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
		}
	}
}
<%strip%>
<%/script%>
<%/if%>
