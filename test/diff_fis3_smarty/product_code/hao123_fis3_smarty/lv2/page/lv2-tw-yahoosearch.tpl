<%extends file='common/page/layout/base.tpl'%>

<%block name="layout"%>
    <%widget name="lv2:widget/tw-yahoosearch/tw-yahoosearch.tpl"%>

	<%if !empty($body.footerSEO) && $body.footerSEO.isHidden != "1"%>
		<%widget name="common:widget/footer-seo/footer-seo.tpl"%>
	<%else%>
		<%widget name="common:widget/footer/footer.tpl" linkList=$body.footprint.links copyright=$html.copyright uaq=$head.uaq%>
	<%/if%>
<%/block%>