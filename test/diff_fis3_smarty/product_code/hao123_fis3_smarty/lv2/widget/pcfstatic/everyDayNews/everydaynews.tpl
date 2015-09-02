<%require name="lv2:widget/pcfstatic/everyDayNews/ltr/ltr.css"%>
<%require name="lv2:widget/pcfstatic/everyDayNews/entertainment/ltr.css"%>
<%require name="lv2:widget/pcfstatic/everyDayNews/hotspot/ltr.css"%>
<%require name="lv2:widget/pcfstatic/everyDayNews/politic/ltr.css"%>
<%require name="lv2:widget/pcfstatic/everyDayNews/royalty/ltr.css"%>
<%require name="lv2:widget/pcfstatic/everyDayNews/sport/ltr.css"%>

<div class="mod-pcf-evedn" id="pcfEveryDayNews">
    <div class="evedn-top">
        <span class="evedn-title"><%$body.everyDayNews.topTitle%></span>
        <i class="i-close"></i>
    </div>
    <div class="tabs-wrap">
        <%foreach $body.everyDayNews.tabs as $tabs%>
            <div class="tab tab<%$tabs@iteration%>"><i class="type-icon"></i><span class="title"><%$tabs.name%></span><i class="line"></i></div>
        <%/foreach%>
    </div>
    <%foreach $body.everyDayNews.tabs as $tabs%>
        <div class="content-wrap <%$tabs.sort%>" log-mod="pcf-everydaynews-<%$tabs.sort%>">
            <%if $tabs.sort=="hotspot"%>
                <div class="slide-wrap"></div>
            <%/if%>
            <div class="error">Oops, something went wrong...</div>
        </div>
    <%/foreach%>
    <a class="morelink" href="<%$body.everyDayNews.morelink%>"><span class="more-text"><%$body.everyDayNews.morelinkTitle%></span><i class="more-icon"></i></a>
</div>

<%script%>
    conf.everyDayNews = {
        sortList: <%json_encode($body.everyDayNews.tabs)%>,
        pcfFr: "<%$body.everyDayNews.pcfFr%>"
    }

    require.async('lv2:widget/pcfstatic/everyDayNews/everydaynews-async.js');
<%/script%>

