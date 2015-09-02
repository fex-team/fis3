<%*   声明对ltr/rtl的css依赖    *%>
<%require name="lv2:widget/pcfstatic/news/ltr/ltr.css"%>
<div class="mod-pcfstatic-news" log-mod="pcfstatic-news" log-mod="pcfstatic-news" id="pcfstaticNews">
    <div class="wrap mod<%$body.pcfnews.mod%>">
        <div class="top">
            <i class="i-client"></i>
            <span class="client-title"><%$body.pcfnews.clientTitle%></span>
            <i class="i-close"></i>
        </div>
        <div class="content">
            <%if !empty($body.pcfnews.mod)%>
                <div class="img-wrap float fl-left">
                    <a class="img-wrap" href="<%$body.pcfnews.url%>"><img class="img" src="<%$body.pcfnews.img%>" /></a>
                </div>
            <%/if%>
            <div class="news-wrap float fl-right">
                <a class="news-title" href="<%$body.pcfnews.url%>"><%$body.pcfnews.newsTitle%></a>
                <a class="news-des" href="<%$body.pcfnews.url%>"><%$body.pcfnews.newsDescription%></a>
            </div>
        </div>
        <div class="bottom">
            <a class="readmore" href="<%$body.pcfnews.moreUrl%>"><%$body.pcfnews.moreTitle%></a>
        </div>
    </div>
</div>

<%script%>
conf.pcfnews = {
    "pcfFr": "<%$body.pcfnews.pcfFr%>"
};
require.async('lv2:widget/pcfstatic/news/news-async.js');
<%/script%>