<%style%>
    @import url('/widget/id-ya-search/ltr/ltr.css?__inline');
<%/style%>

<div class="l-wrap">
    <div class="l-top">
        <div class="se-hd">
            <div class="se-lg" log-mod="se-logo">
                <a href="<%$body.search_conf.searchLink%>" title="<%$body.search_conf.searchTitle%>" id="logo">
                    <img src="<%$body.search_conf.searchLogo%>">
                </a>
            </div>
            <div class="se-search cf" log-mod="search-box">
                <form action="<%$body.search_conf.action|default:'/search-result'%>" method="GET" target="_self" id="form">
                    <input type="text" class="se-input" autocomplete="off" name="query" maxlength="2048" id="input" size="41">
                    <button class="se-submit" type="submit"></button>
                    <div id="submitParams" class="se-param"></div>
                </form>
            </div>
            <%if !empty($body.search_conf.yahooLogo)%>
            <div class="se-lg-ya">
                <img src="<%$body.search_conf.yahooLogo%>">
            </div>
            <%/if%>
        </div>
        <%if !empty($body.search_conf.moreLinks)%>
            <ul class="se-list cf" id="searchCategory" log-mod="category">
                <%foreach $body.search_conf.moreLinks as $val%>
                    <li><a href="<%$val.url%>" data-url="<%$val.url%>" target="_self" data-typ="<%$val.type%>"><%$val.name%></a></li>
                <%/foreach%>
            </ul>
        <%/if%>
        <div class="se-num"><%$body.search_conf.resultNumBefore%><span id="resultNum"></span><%$body.search_conf.resultNumAfter%></div>
    </div>
    <div class="l-content">
        <div class="l-main">
            <div id="tipQuery"><%$body.search_conf.emptyQuery%></div>
            <div id="spellResults" log-mod="spell-result"></div>
            <div id="topResults" log-mod="top-result"><h3 class="ad-title"><%$body.globalConf.adTitle|default:'Ads'%></h3></div>
            <div id="relatedResults" log-mod="related-result"></div>
            <div id="tipResults"><%$body.search_conf.emptyTips%></div>
            <div id="mainResults" log-mod="main-result"></div>
            <div id="bottomResults" log-mod="bottom-result"><h3 class="ad-title"><%$body.globalConf.adTitle|default:'Ads'%></h3></div>
            <ul id="PageNavigation" log-mod="page-nav" class="r-pn cf"></ul>
        </div>
        <div class="l-side">
            <div id="rightResults" log-mod="right-result"></div>
        </div>
    </div>
    
    <div class="l-foot">
    <%$html.specialFoot%>
    </div>
</div>
<%script%>
window.App = {};
App.G = {};
App.G.urlUnEscape = function(s) {
    try{
        s = decodeURIComponent(s);
    }
    catch(e) {}
    return s;
};
App.G.getQuery = function(query) {
    return App.G.urlUnEscape((location.href.match(new RegExp("\\?.*" + query + "=([^&$#]*)")) || ["",""])[1]);
};
App.conf = {
    query   : App.G.getQuery("query"),
    pn      : parseInt(App.G.getQuery("pn"), 10) || 1,
    category: App.G.getQuery("category") || "web"
};
App.inspConf = {
    accessId: '<%$body.globalConf.accessId%>',
    signature: '',
    <%if !empty($body.globalConf.country)%>country: '<%$body.globalConf.country%>',<%/if%>
    <%if !empty($body.globalConf.language)%>language: '<%$body.globalConf.language%>',<%/if%>
    sellerRatings: true,
    adultFilter: '<%$body.globalConf.adultFilter%>',
    deviceSegments:{
        tablet:'<%$body.globalConf.tabletSegment%>',
        mobile: '<%$body.globalConf.mobileSegment%>'
    }
};
App.signatureUrl = conf.apiUrlPrefix + ("<%$body.globalConf.signatureUrl%>" || "?app=infospacetoken&act=contents&query=#{query}&country=#{country}&vk=1&jsonp=#{jsonp}");
App.sugConf = <%json_encode($body.sug)%>;
App.pageNavConf = {
  prepage:"<%$body.search_conf.prepage%>",
  nextpage: "<%$body.search_conf.nextpage%>"  
};
require.async("lv2:widget/id-ya-search/id-ya-search-async.js");
<%/script%>
