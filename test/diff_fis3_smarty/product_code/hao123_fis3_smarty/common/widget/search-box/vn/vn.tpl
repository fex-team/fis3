
<%if !empty($body.searchBox.tplUrl)%>
	<%widget name="common:widget/search-box/`$sysInfo.country`/`$body.searchBox.tplUrl`/`$body.searchBox.tplUrl`.tpl"%>
<%else%>
<%script%>
<%strip%>
<%*注意：不能写JS注释*%>
conf.searchGroup = {
	conf:{
		index: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/vn/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 8
		},
		lv2: {
			logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/vn/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
			curN: 0,
			delay: 200,
			n: 8
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
		"google_vn": {
			requestQuery: "q",
			url: "http://clients1.google.com.vn/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				client: "hp",
				hl: "vi",
				cp:"1",
				gs_id: "c"
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
			url: "http://clients1.google.com.vn/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataNum: 1,
			requestParas: {
				client:"img",
				ds:"i",
				hl:"vi",
				gs_is:"1",
				cp:"1",
				gs_id:"k"
			},
			customUrl: function(para) {
				return this.o.url + "?" + para.substr(1) + "&" + this.o.requestQuery + '=' + encodeURIComponent(this.q);
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
		"youtube": {
			autoCompleteData: false,
			requestQuery: "q",
			url: "http://clients1.google.com/complete/search",
			callbackFn: "window.google.ac.h",
			callbackDataKey: 1,
			requestParas: {
				"client": "youtube",
				"hl": "vi",
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
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"google_video": {
			requestQuery: "q",
			url: "http://suggestqueries.google.com/complete/search",
			callbackFn: "window.google.ac.hr",
			callbackDataNum: 1,
			requestParas: {
				hl:"vi",
				gl:"ZZ",
				ds:"yt",
				client:"suggest",
				hjson:"t",
				jsonp:"window.google.ac.hr",
				cp:"1"
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
			url: null
		},
		"google_dict": {
			url: null
		},
		"mp3.zing": {
			url: null
		},
		"nhaccuatui": {
			url: null
		},
		"google_map": {
			requestQuery: "q",
			url: "http://maps.google.com/maps/suggest",
			callbackFn: "_xdc_._2gqj8p7jf",
			callbackDataNum: 3,
			requestParas: {
				clid:"1",
				cp:"2",
				hl:"th",
				gl:"",
				json:"a",
				ll:"21.739091,106.704712",
				num:"5",
				numps:"5",
				spn:"1.347031,4.938354",
				src:"1",
				v:"2",
				callback:"_xdc_._2gqj8p7jf",
				auth:"d95a99a2:MA69F0jNrYbAN5QJuDKDqwnr1rU"
			},
			customUrl: function(para) {
				return this.o.url + "?" + para.substr(1) + "&" + this.o.requestQuery + '=' + encodeURIComponent(this.q);
			},
			templ: function(data) {
				var _data = data[3] || [],
					q = this.q,
					ret = [],
					i = 0,
					len = _data.length;
					
				var detail = "";
				
				for(; i<len; i++) {
					try{detail = _data[i][9][0][0] || _data[i][9][0] || _data[i][9] || "";}
					catch(e){detail = ""}
					
					detail = detail ? '<span style=" font-weight:bold; color:#999;"> - ' + detail + '</span>' : "";
					
					ret.push('<li q="' + _data[i][0] + '">' + _data[i][0].replace(q, '<span class="sug-query">' + q + '</span>') + detail + '</li>')
				}
				return '<ol>' + ret.join("") + '</ol>';
			}
		},
		"diadiem": {
			url: null
		},
		"google_answers": {
			url: null
		},
		"yahoo_answers": {
			url: null
		}
	}
}
<%/strip%>
<%/script%>
<%/if%>
