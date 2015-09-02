
<%if !empty($body.searchBox.tplUrl)%>
	<%widget name="common:widget/search-box-4ps/`$sysInfo.country`/`$body.searchBox.tplUrl`/`$body.searchBox.tplUrl`.tpl"%>
<%else%>
<%script%>
<%strip%>
<%*注意：不能写JS注释*%>
require.async('common:widget/ui/jquery/jquery.js', function () {
conf.searchGroup = {
  conf: {
    index: {
      logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/ar/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
      curN: 0,
      delay: 200,
      n: 10
    },
    lv2: {
      logoPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/ar/search_logo<%if $body.searchBox.logoSize == 's'%>_s<%elseif $body.searchBox.logoSize == 'm'%>_m<%/if%>/",
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
        "prod": "eg",
        "cb": "window.bdsug.sug",
        "haobd": jQuery.cookie("BAIDUID")
      },
      templ: false
    },
    "google": {
      requestQuery: "q",
      url: null,
      callbackFn: "window.google.ac.h",
      callbackDataNum: 1,
      requestParas: {
        "client": "hp",
        "hl": "ar",
        "authuser": "0"
      },
      templ: false
    },
    "yahoo": {
      requestQuery: "command",
      url: "http://sugg.us.search.yahoo.net/gossip-us-ura",
      callbackFn: "YUI.Env.DataSource.callbacks.yui_3_3_0_1_1312871021408973",
      callbackDataKey: "r",
      requestParas: {
        "output": "yjsonp",
        "callback": "YUI.Env.DataSource.callbacks.yui_3_3_0_1_1312871021408973"
      },
      templ: function(data) {
        var _data = data["r"] || [],
            q = data["q"],
            ret = [],
            i = 0,
            len = _data.length;
        for (; i < len; i++) {
          ret.push('<li q="' + _data[i][0] + '" style="font-weight: normal;">' + _data[i][0] + '</li>')
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
        "prod" : "video_eg",
        "sid": "",
        "cb":"ps_video",
      },
      templ: false
    },
    "youtube": {
      requestQuery: "q",
      url: "http://suggestqueries.google.com/complete/search",
      callbackFn: "window.yt.www.suggest.handleResponse",
      callbackDataNum: 1,
      requestParas: {
        "hl": "ar",
        "ds": "yt",
        "client": "youtube",
        "hjson": "t",
        "jsonp": "window.yt.www.suggest.handleResponse",
        "cp": "2"
      },

      templ: function(data) {
        var _data = data[1] || [],
            q = data[0],
            ret = [],
            i = 0,
            len = _data.length;
        for (; i < len; i++) {
          ret.push('<li q="' + _data[i][0] + '" style="font-weight: normal;">' + _data[i][0] + '</li>')
        }
        return '<ol>' + ret.join("") + '</ol>';
      }
    },
    "yahoo_video": {
      requestQuery: "command",
      url: "http://gossip-ss.us.search.yahoo.com/gossip-us_ss/",
      callbackFn: "fxsearch",
      callbackDataNum: 1,
      requestParas: {
        "nresults": 8,
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
      url: "http://clients1.google.com.eg/complete/search",
      callbackFn: "window.google.ac.h",
      callbackDataKey: 1,
      requestParas: {
        "hl": "ar",
        "client": "img",
        "sugexp": "gsihc"
      },
      templ: function(data) {
        var _data = data[1] || [],
            q = data[0],
            ret = [],
            i = 0,
            len = _data.length;
        for (; i < len; i++) {
          ret.push('<li q="' + _data[i][0] + '" style="font-weight: normal;">' + _data[i][0] + '</li>')
        }
        return '<ol>' + ret.join("") + '</ol>';
      }
    },
    "hao123_images": {
      requestQuery: "wd",
      url: "http://10.247.1.38:8333/su",
      callbackFn: "window.baidu.sug",
      callbackDataKey: "s",
      requestParas: {
        "prod" : "image_eg"
      },
      templ: function(data) {
        var _data = data["s"] || [],
          q = data["q"],
          ret = [],
          i = 0,
          len = _data.length;
        for(; i<len; i++) {
          ret.push('<li q="' + _data[i] + '" style="font-weight: normal;">' + _data[i] + '</li>')
        }
        return '<ol>' + ret.join("") + '</ol>';
      }
    },
    "yahoo_images": {
      requestQuery: "command",
      url: "http://gossip-ss.us.search.yahoo.com/gossip-us_ss",
      callbackFn: "YUI.Env.DataSource.callbacks.yui_3_5_1_1_1354169017899_293",
      callbackDataKey: 1,
      requestParas: {
        "output": "fxjsonp",
        "nresults": 10,
        "callback": "{callback}",
        "callback": "YUI.Env.DataSource.callbacks.yui_3_5_1_1_1354169017899_293",
        "pubid": 103,
        "queryfirst": 1
      },
      templ: function(data) {
        var _data = data[1] || [],
          q = data[0],
          ret = [],
          i = 0,
          len = _data.length;
        for(; i<len; i++) {
          ret.push('<li q="' + _data[i] + '" style="font-weight: normal;">' + _data[i] + '</li>')
        }
        return '<ol>' + ret.join("") + '</ol>';
      }
    },
    "google_map": {
      requestQuery: "q",
      url: "http://maps.google.com.eg/maps/suggest",
      callbackFn: "_xdc_._bgnkibby8",
      callbackDataKey: 3,
      requestParas: {
        "cp": "2",
        "hl": "ar",
        "gl": "ar",
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

        for (; i < len; i++) {
          try {
            detail = _data[i][9][0][0] || _data[i][9][0] || _data[i][9] || "";
          } catch (e) {
            detail = ""
          }

          /*detail = detail ? '<span style=" font-weight:bold; color:#999;"> - ' + detail + '</span>' : "";*/

          ret.push('<li q="' + _data[i][0] + '" style="font-weight: normal;">' + _data[i][0] + detail + '</li>')
        }
        return '<ol>' + ret.join("") + '</ol>';
      }
    },
    "wikimapia": {
      url: null
    },
    "wiki_ar": {
      requestQuery: "search",
      url: "http://ar.wikipedia.org/w/api.php",
      callbackFn: "wikipedia.ar",
      callbackDataNum: 1,
      requestParas: {
        "action": "opensearch",
        "namespace": "0",
        "suggest": "",
        "callback": "wikipedia.ar"
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
    "google_translate": {
      url: null
    },
    "filmes": {
      requestQuery: "wds",
      url: "http://ar.hao123.com/movie/sug",
      callbackFn: "window.baidu.sug",
      callbackDataKey: "s",
      requestParas: {
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
    }
  }
}	
});
<%/strip%>
<%/script%>
<%/if%>

