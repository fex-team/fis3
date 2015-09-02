<%extends file='lv2/page/layout/layout-sitemap.tpl'%>

<%* user bar *%>
<%block name="head"%>
    <%if !empty($body.headerTest.widget)%>
        <%widget name="common:widget/header-flat/`$body.headerTest.widget`.tpl"%>
    <%else%>
        <%widget name="common:widget/header/header.tpl"%>
    <%/if%>
<%/block%>

<%block name="sitemap-title"%>
    <%widget name="lv2:widget/sitemap-title/sitemap-title.tpl"%>
<%/block%>

<%block name="sitemap-content"%>
    <%widget name="lv2:widget/sitemap-content/sitemap-content.tpl"%>
<%/block%>

<%block name="sitemap-link"%>
    <%widget name="lv2:widget/sitemap-link/sitemap-link.tpl"%>
<%/block%>

<%block name="sitemap-recommend"%>
    <%widget name="lv2:widget/sitemap-recommend/sitemap-recommend.tpl"%>
<%/block%>

<%block name="footer"%>
    <%if !empty($body.footerSEO) && $body.footerSEO.isHidden != "1"%>
        <%widget name="common:widget/footer-seo/footer-seo.tpl"%>
    <%else%>
        <%widget name="common:widget/footer/footer.tpl" linkList=$body.footprint.links copyright=$html.copyright uaq=$head.uaq%>
    <%/if%>
<%/block%>