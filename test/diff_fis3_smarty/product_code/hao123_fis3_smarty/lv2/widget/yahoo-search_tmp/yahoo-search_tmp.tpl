
<%style%>
    @import url('/widget/yahoo-search_tmp/ltr/ltr.css?__inline');
<%/style%>

<%script%>
window.App = {};
App.conf = {
    reqUrl: "<%$root.body.search_conf.reqUrl%>"
    , reqParam: <%json_encode($root.body.search_conf.reqParam)%>
    , reqAdUrl: "<%$root.body.ad_conf.reqAdUrl%>"
    , reqAdParam: <%json_encode($root.body.ad_conf.reqAdParam)%>
    , adNum: <%json_encode($root.body.ad_conf.adNum)%>
    , qlMaxNum: "<%$root.body.ad_conf.qlMaxNum%>"
    , txt: <%json_encode($root.body.txt)%>
    , tpl: {
        resultLi: '<li class="r-li"><div class="r-li_hd"><h3><a href="#{REDIRECTURL}">#{TITLE.HTML.HL}</a></h3></div><div class="r-li_bd"><p>#{ABSTRACT.BEST.HTML.HL}</p></div><div class="r-li_ft"><span class="r-li_u"><abbr title="#{DISPURL}">#{DISPURL}</abbr></span></div></li>'

        , pnLi: '<li><a href="#{url}" data-n="#{n}" target="_self">#{t}</a></li>'

        , adLi: '<li class="r-li"><div class="r-li_hd"><h3><a href="#{url}">#{t}</a></h3></div><div class="r-li_bd"><p>#{des}</div><div class="r-li_ft"><p class="r-li_host">#{host}</p><div class="r-li_quick">#{quickLink}</div></div></li>'

        , sugBot: '<div class="sug-bot cf"><span class="fl s-arr sug-close"></span><span class="fr sug-switch">キーワード入力補助 <a id="sugSwitch_on" class="#{classOn}" data-switch="on" href="javascript:void(0)" onclick="return false">ON</a> - <a id="sugSwitch_off" class="#{classOff}" data-switch="off" href="javascript:void(0)" onclick="return false">OFF</a></span></div>'
        , noResult: '<%$root.html.noResult%>'
    }
    , sugOn: "<%$root.body.sug.sugOn%>"
    , sugPath: "<%$root.body.sug.sugPath%>"
    , sug: <%json_encode($root.body.sug.conf)%>
}
App.conf.reqParam.ip = "<%$sysInfo.userip%>";
conf.ept = <%json_encode($body.eptWord)%>;
conf.amazonAds = <%json_encode($body.amazonAds)%> || {};
require.async("lv2:widget/yahoo-search_tmp/yahoo-search_tmp-async.js");
<%/script%>
