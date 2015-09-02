
<%if !empty($body.searchBox.tplUrl)%>
	<%widget name="common:widget/search-box-4ps/`$sysInfo.country`/`$body.searchBox.tplUrl`/`$body.searchBox.tplUrl`.tpl"%>
<%else%>
<%script%>
<%strip%>
<%*注意：不能写JS注释*%>
require.async('common:widget/ui/jquery/jquery.js', function () {
conf.searchGroup = {
	conf:{
		index: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/br/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 10
		},
		lv2: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/br/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
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
			url: "http://search.hao123.com.br/r/su",
			callbackFn: "window.bdsug.sug",
			callbackDataKey: "s",
			requestParas: {
				"prod": "br",
				"cb": "window.bdsug.sug"
			},
			templ: function(data) {
				var _data = data['s'] || [],
					q = data['q'],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i] + '">' + _data[i].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"google_br": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com.br/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "hp",
				"hl": "pt-BR",
				"authuser": "0"
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
			url: "http://sugg.br.search.yahoo.net/gossip-br-sayt/",
			callbackFn: "fxsearch",
			callbackDataKey: 1,
			requestParas: {
				"output": "fxjsonp"
			}
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
			}
		},
		"ps_video": {
			autoCompleteData: false,
			requestQuery: "wd",
			url: "http://search.hao123.com.br/r/su",
			callbackFn: "window.bdsug.sug",
			callbackDataKey: "s",
			requestParas: {
				"prod": "video_br",
				"cb": "window.bdsug.sug"
			},
			templ: function(data) {
				var _data = data['s'] || [],
					q = data['q'],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i] + '">' + _data[i].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
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
				"hl": "pt",
				"gl": "br",
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
			url: "http://clients1.google.com.br/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "video-hp",
				"hl": "pt-BR",
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
		"kboing": {
			url: null
		},
		"google_dict": {
			url: null
		},
		"google_map": {
			requestQuery: "q",
			url: "http://maps.google.com.br/maps/suggest",
			callbackFn: "_xdc_._bgnkibby8",
			callbackDataKey: 3,
			requestParas: {
				"cp": "100",
				"hl": "pt-BR",
				"gl": "br",
				"v": "2",
				"clid": "1",
				"json": "a",
				"ll": "-14.239424,-53.186502",
				"spn": "24.779743,86.572266",
				"auth": "ac0dbe60:A6KQ3ztz8bQ13_rnpShsJPs6jOU",
				"src": "1",
				"num": "10",
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
					
					detail = detail ? '<span style=" font-weight:bold; color:#999;"> - ' + detail + '</span>' : "";
					
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + detail + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"google_images": {
			requestQuery: "q",
			url: "http://clients1.google.com.br/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "img",
				"ds": "i",
				"hl": "pt-BR"
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
		"hao123_images": {
			requestQuery: "wd",
			url: "http://sugimg.hao123.com.br/su",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			requestParas: {
				"prod" : "image_brazil"
			},
			templ: function(data) {
				var _data = data["s"] || [],
					q = data["q"],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
					ret.push('<li q="' + _data[i] + '">' + _data[i].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"postbar": {
			url: null
		},
		"filmes": {
			requestQuery: "wds",
			url: "http://br.hao123.com/movie/sug",
			callbackFn: "window.baidu.sug",
			callbackDataKey: "s",
			requestParas: {
			}
		},
		"americanas": {
		    requestQuery: "q",
			url: "http://busca.americanas.com.br/autocomplete/search.php",
			callbackFn: "window.americanas",
			callbackDataKey: "sugestoes",
			requestParas: {
				"prod" : "image_brazil",
				"type": "1",
				"numsugestoes": "12",
				"numprods": "0",
				"callback":"window.americanas"
			},
			templ: function(data, q) {
				var _data = data["sugestoes"] || [],
					ret = [],
					i = 0,
					len = _data.length;
				for(; i<len; i++) {
				    if(_data[i].categoria) {
				        continue;
				    }
					ret.push('<li q="' + _data[i].consulta + '">' + _data[i].consulta.replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"walmart": {
		    url: null
		},
		"netshoes": {
		    url: null
		},
		"buscape": {
		    url: null
		},
		"zoom": {
		    requestQuery: "q",
			url: "http://s.zst.com.br/static/autocomplete-index-r/.js",
			callbackFn: "zoomAutoCompleteBlackBoard.notify",
			callbackDataKey: "completions",
			customUrl: function(para) {
			    var str = this.q.split("").join("/") + ".js?_=" + +new Date;
			    return this.o.url.replace(".js", str);
			},
			templ: function(data) {
				var _data = data["completions"] || [],
					ret = [],
					i = 0,
					q = data["key"],
					tmp = "",
					len = _data.length;
				var isStr = function(value){
				    return typeof value === 'string';
				};
				for(; i<len; i++) {
				    
				    if(!_data[i]) {
				        continue;
				    }
					tmp = isStr(_data[i]) ? _data[i] : (_data[i].type === "FILTER" ? _data[i]["completion"] : false);
					tmp && ret.push('<li q="' + tmp + '">' + tmp.replace(q, '<span class="sug-query">' + q + '</span>') + '</li>');
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

