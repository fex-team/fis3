<%strip%>
    <%require name="lv2:widget/sitemap-link/`$head.dir`/`$head.dir`.css"%>
    <%require name="common:widget/ui/text-overflow/`$head.dir`/`$head.dir`.css"%>

    <div class="mod-sitemap-link" log-mod="sitemap-link">
        <h3><%$body.sitemapLink.title%></h3>
        <div class="container cf">
            <%foreach $body.sitemapLink.list as $item%>
            <a href="<%$item.href%>"<%if $item@index%6 == 0%> class="first-column"<%/if%>>
                <p class="text-overflow name"><%$item.name%></p>
                <p class="text-overflow desc"><%$item.desc%></p>
            </a>
            <%/foreach%>
        </div>
    </div>
<%/strip%>