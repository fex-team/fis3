<%extends file='common/page/layout/base.tpl'%>
<%block name="layout"%>
    <div class="l-hd">
    <div class="l-w cf">
        <div class="l-l cf">
            <div class="logo logo-hao123">
                <a href="<%$body.logo.hao123.url%>" title="<%$body.logo.hao123.title%>"></a>
            </div>
            <div class="s">
                <div class="s-hd">
                    <ul class="cf" id="searchLinks">
                    <%foreach $body.search_conf.moreLinks as $value%>
                        <%if !empty($value.class)%>
                        <li class="<%$value.class%>"><a href="<%$value.url%>" onclick="return false"><%$value.name%></a></li>
                        <%else%>
                        <li class="<%$value.class%>"><a href="<%$value.url%>" data-url="<%$value.query%>"><%$value.name%></a></li>
                        <%/if%>
                    <%/foreach%>
                    </ul>
                </div>
                <div class="s-bd cf">
                <form action="/yahoo_search-tmp" id="searchForm" target="_self">
                    <div class="fl s-ipt">
                        <input name="query" id="searchInput" size="42" type="text" autocomplete="off">
                        <a target="_self" onclick="return false" id="searchClose" href="###" class="s-btn_close"></a>
                        <span id="searchIptTip" class="s-ipt_tip"><%$body.txt.noInput%></span>
                    </div>
                    <div class="fl s-btn">
                        <button type="submit" id="searchSubmit"><%$body.search_conf.buttonName%></button>
                    </div>
                </form>
                </div>
                <div class="s-ft">
                    <span id="sugShow" class="s-arr"></span>
                </div>     
                <div class="s-tt" id="totalHits"></div>   
            </div>
        </div>
        <div class="l-r">
            <div class="fl logo logo-yahoo">
                <a href="<%$body.logo.yahoo.url%>" title="<%$body.logo.yahoo.title%>"></a>
            </div>
        </div>
    </div>
</div>

<div class="l-w cf c-main">
    <div class="l-l r-wrap c-rsl r-loading" id="resultWrap">
        <div class="r-list r-list_ad r-list_ad_north">
            <div class="r-list_more"><%$html.ad_more_link%></div>
            <ul id="ClickUrl_north"></ul>
        </div>
        <ul class="r-list r-list_ama cf" id="ClickUrl_amazon">
        </ul>
        <div class="r-tip" id="resultTip"></div>
        <ul id="result" class="r-list r-padding"></ul>
        <div class="r-list r-list_ad r-list_ad_south">
            <div class="r-list_more"><%$html.ad_more_link%></div>
            <ul id="ClickUrl_south"></ul>
        </div>
        <ul id="resultPn" class="r-pn cf"></ul>
    </div>
    <div class="l-l r-wrap c-ept" id="emptySearchWord">
        <div class="ept-tle" id="eptTitle"></div>
        <ul class="ept-btn" id="eptBtn"></ul>
        <div class="ept-ctrl" id="eptCtrl"></div>
        <div class="ept-result">
            <ul class="ept-res" id="eptRes"></ul>
            <div class="ept-tip"><%$body.eptWord.withoutResult%></div>
        </div>
    </div>
    <div class="l-r">
        <div class="ad-box"><%$html.rakuten%></div>
        <div class="r-list r-list_ad r-list_ad_east">
            <div class="r-list_more"><%$html.ad_more_link%></div>
            <ul id="ClickUrl_east"></ul>
        </div>
    </div>
</div>

<div class="l-ft">
    <div class="l-w s-wrap cf">
        <div class="l-l">
            <div class="s">
                <div class="s-bd cf">
                <form action="/yahoo_search-tmp" id="searchForm2" target="_self">
                    <div class="fl s-ipt">
                        <input name="query" id="searchInput2" size="42" type="text" autocomplete="off">
                        <a target="_self" onclick="return false" id="searchClose2" href="###" class="s-btn_close s-btn_close__bot"></a>
                        <span id="searchIptTip2" class="s-ipt_tip"><%$body.txt.noInput%></span>
                    </div>
                    <div class="fl s-btn">
                        <button type="submit" id="searchSubmit2">検索</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
        <div class="l-r"></div>
    </div>
    <%$html.about%>
</div>
<%widget name="lv2:widget/yahoo-search_tmp/yahoo-search_tmp.tpl"%>
<%/block%>