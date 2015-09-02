<%strip%>
    <%require name="lv2:widget/sitemap-content/`$head.dir`/`$head.dir`.css"%>
    <%require name="common:widget/ui/text-overflow/`$head.dir`/`$head.dir`.css"%>

    <div class="mod-sitemap-content" log-mod="sitemap-content">
        <h3><%$body.sitemapContent.title%></h3>
        <div class="container cf">
            <%foreach $body.sitemapContent.list as $item%>
            <a href="<%$item.href%>"<%if $item@index%6 == 0%> class="first-column"<%/if%>>
                <p class="text-overflow name"><%$item.name%></p>
                <div class="text-overflow-block desc">
                    <p><%$item.desc%></p>
                </div>
            </a>
            <%/foreach%>
        </div>
    </div>
<%/strip%>