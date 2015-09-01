<%require name="common:widget/header-flat/banner-site/`$head.dir`/`$head.dir`.more.css"%>
<%style%>
    <%if !empty($body.bannerSite.style)%>
	    <%$body.bannerSite.style%>
    <%/if%>
<%/style%>

<div class="mod-banner-site" log-mod="banner-site" id="<%$body.bannerSite.id|default:'fixedBannerSite'%>">
</div>

<%script%>
conf.bannerSite = <%json_encode($body.bannerSite)%>||{};
require.async(["common:widget/header-flat/banner-site/banner-site-async.js"], function (fire) {
	fire("#" + "<%$body.bannerSite.id|default:'fixedBannerSite'%>");
});
<%/script%>
