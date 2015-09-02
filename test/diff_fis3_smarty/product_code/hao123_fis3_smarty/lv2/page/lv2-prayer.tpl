<%extends file='lv2/page/layout/layout-prayer.tpl'%>

<%* user bar *%>
<%block name="p-1-1"%>
<%if !empty($body.headerTest.widget)%>
<%widget name="common:widget/header/`$body.headerTest.widget`.tpl"%>
<%else%>
<%widget name="common:widget/header/header.tpl"%>
<%/if%>
<%/block%>


<%* how *%>
<%block name="p-2-1"%>
<%widget name="lv2:widget/prayer/prayer.tpl"%>
<%/block%>

<%* footprint *%>
<%block name="p-3-1"%>
	<%if !empty($body.footerSEO) && $body.footerSEO.isHidden != "1"%>
		<%widget name="common:widget/footer-seo/footer-seo.tpl"%>
	<%else%>
		<%widget name="common:widget/footer/footer.tpl" linkList=$body.footprint.links copyright=$html.copyright uaq=$head.uaq%>
	<%/if%>
<%/block%>