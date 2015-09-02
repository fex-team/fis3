
<%script%>
<%strip%>
<%*注意：不能写JS注释*%>
conf.searchGroup = {
	conf:{
		index: {
			logoPath: "/resource/fe/br/minilogo/search_logo/",
			curN: 0,
			delay: 200,
			n: 10
		},
		lv2: {
			logoPath: "/resource/fe/br/minilogo/search_logo/",
			curN: 0,
			delay: 200,
			n: 10
		}
	},
	list: {
		
		"web": {
			"hotWords": "<%$body.searchBox.sBoxTag[0].hotWords%>",
			"engine": [{
				name: "Google Brasil",
				logo: "google_br",
				url: "http://www.google.com.br/",
				action: "http://www.google.com.br/search",
				params: {		
					"hl": "pt-BR"		
				},
				q: "q",
				
				sug: {
					autoCompleteData: false,
					requestQuery: "q",
					url: "http://clients1.google.com.br/s",
					callbackFn: "window.google.ac.h",
					callbackDataKey: 1,
					requestParas: {
						"hl": "pt-BR",
						"sugexp": "lemsnc",
						"xhr": "f"
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
			}, {
				name: "Yahoo",
				logo: "yahoo_web",
				url: "http://br.yahoo.com/",
				action: "http://br.search.yahoo.com/search",
				params: {
				},
				q: "p",
				sug: {
					autoCompleteData: false,
					requestQuery: "command",
					url: "http://sugg.br.search.yahoo.net/gossip-br-sayt/",
					callbackFn: "fxsearch",
					callbackDataKey: 1,
					requestParas: {
						"output": "fxjsonp"
					}
				}
			}
			]
		},
		
		"downloads": {
			"hotWords": "<%$body.searchBox.sBoxTag[1].hotWords%>",
			"engine": [{
				name: "4shared",
				logo: "4shared",
				url: "http://www.4shared.com/",
				action: "http://search.4shared.com/q/1/#{q}",
				params: {
				},
				q: "q",
				sug: {
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
				}
			}]
		},
			
		"video": {
			"hotWords": "<%$body.searchBox.sBoxTag[2].hotWords%>",
			"engine": [{
				name: "YouTube",
				logo: "youtube",
				url: "http://www.youtube.com/?gl=BR&hl=pt",
				action: "http://www.youtube.com/results",
				params: {
				},
				q: "search_query",
				sug: {
					autoCompleteData: false,
					requestQuery: "q",
					url: "http://clients1.google.com/complete/search",
					callbackFn: "google.sbox.p0 && google.sbox.p0",
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
				}
			},{
				name: "Google Vídeos",
				logo: "google_video",
				url: "http://www.google.com.br/videohp?hl=pt-BR",
				action: "http://www.google.com.br/search?",
				params: {
					"tbm": "vid",
					"hl": "pt-BR"
				},
				q: "q",
				sug: {
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
				}
			}]
		},
		"music": {
			"hotWords": "<%$body.searchBox.sBoxTag[3].hotWords%>",
			"engine": [{
				name: "kboing",
				logo: "kboing",
				url: "http://www.kboing.com.br/",
				action: "http://www.kboing.com.br/searchmusic.php?",
				params: {
					"tb": "musica"
				},
				q: "q",
				sug: {
					url: null
					}
				
			}]
		},
		"translator": {
			"hotWords": "<%$body.searchBox.sBoxTag[4].hotWords%>",
			"engine": [{
				name: "Google Tradutor",
				logo: "google_dict",
				url: "http://translate.google.com.br/?hl=pt-BR&tab=nT",
				action: "http://translate.google.com.br/",
				params: {
					hl: "pt-BR"
				},
				q: "q",
				sug: {
					url: null
				}
			}]
		},
		
		"map": {
			"hotWords": "<%$body.searchBox.sBoxTag[5].hotWords%>",
			"engine": [{
				name: "Google Mapas",
				logo: "google_map",
				url: "http://maps.google.com.br/maps?hl=pt-BR&tab=Tl",
				action: "http://maps.google.com.br/maps",
				params: {
					"hl": "pt-BR"
				},
				q: "q",
				sug: {
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
				}
			}]
		},

		"images": {
			"hotWords": "<%$body.searchBox.sBoxTag[6].hotWords%>",
			"engine": [{
				name: "Google Imagens",
				logo: "google_images",
				url: "http://www.google.com.br/imghp?hl=pt-BR&tab=wi",
				action: "http://www.google.com.br/search?",
				params: {
					"tbm": "isch",
					"hl": "pt-BR"
				},
				q: "q",
				sug: {
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
				}
			}]
		},

		"post": {
			"hotWords": "<%$body.searchBox.sBoxTag[7].hotWords%>",
			"engine": [{
				name: "Postbar",
				logo: "postbar",
				url: "http://br.tieba.com",
				action: "http://br.tieba.com/frs/index?",
				params: {
				},
				q: "kw",
				sug: {
					url: null
				}
			}]
		}
	}
}
<%/strip%>
<%/script%>

