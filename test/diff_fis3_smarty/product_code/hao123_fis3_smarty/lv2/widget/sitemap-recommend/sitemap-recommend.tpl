<%strip%>
<%require name="lv2:widget/sitemap-recommend/`$head.dir`/`$head.dir`.css"%>
<%require name="common:widget/ui/text-overflow/`$head.dir`/`$head.dir`.css"%>

<div class="mod-sitemap-recommend" log-mod="sitemap-recommend">
    <h3><%$body.sitemapRecommend.title%></h3>
    <div class="container cf">
        <%foreach $body.sitemapRecommend.list as $item%>
        <a href="<%$item.href%>"<%if $item@index%3 == 0%> class="first-column"<%/if%>>
            <p class="text-overflow name"><%$item.name%></p>
            <p class="text-overflow desc"><%$item.desc%></p>
        </a>
        <%/foreach%>
    </div>
</div>
<%/strip%>