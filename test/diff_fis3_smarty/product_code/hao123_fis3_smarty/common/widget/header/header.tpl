<%style%>
<%if $head.dir=='ltr'%>
@import url('/widget/header/ltr/ltr.css?__inline');
<%else%>
@import url('/widget/header/rtl/rtl.css?__inline');
<%/if%>
<%/style%>
<%widget name="common:widget/header/add-fav-bar/add-fav-bar.tpl"%>
<div class="userbar-wrap" id="top" alog-alias="userBar">
    <div class="userbar l-wrap">
        <%widget name="common:widget/header/logo/logo.tpl"%>
        <div class="userbar-tool <%if $head.dir=='ltr'%>fr<%else%>fl<%/if%>">
            <%widget name="common:widget/header/site-switch/site-switch.tpl"%>
            <%widget name="common:widget/header/account/account.tpl"%>
            <%widget name="common:widget/header/userbar-btn/userbar-btn.tpl"%>
        </div>
        <%if isset($body.banner.src)%>
        <%widget name="common:widget/header/banner/banner.tpl"%>
        <%else%>
        <%widget name="common:widget/header/clock/clock.tpl"%>
        <%widget name="common:widget/header/weather/weather.tpl"%>
        <%/if%>

        <%if !empty($body.newerguide.isShow)%>
        <%widget name="common:widget/header/newerguide/newerguide.tpl"%>
        <%/if%>
    </div>
    <%if !empty($body.tearPage.isShow)%>
    <%widget name="common:widget/header/tear-page/tear-page.tpl"%>
    <%/if%>
</div>
<div id="weatherMoreWrap" class="weather-more_wrap" alog-alias="weatherMore">
    <div class="weather-more_line">
        <ul id="weatherMore" class="weather-more l-wrap"></ul>
    </div>
</div>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="common:widget/header/ltr/ltr.more.css"%> <%else%> <%require name="common:widget/header/rtl/rtl.more.css"%> <%/if%>

