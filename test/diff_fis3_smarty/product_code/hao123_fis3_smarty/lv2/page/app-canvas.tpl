<%extends file='lv2/page/layout/layout-app-canvas.tpl'%>

<%* user bar *%>
<%block name="p-1-1"%>
	<%widget name="lv2:widget/app-canvas-head/app-canvas-head.tpl"%>
<%/block%>

<%* app recomment top *%>
<%block name="p-2-1"%>
	<%widget name="lv2:widget/app-canvas-top/app-canvas-top.tpl"%>
<%/block%>

<%* app wrap*%>
<%block name="p-3-1"%>
	<%widget name="lv2:widget/app-canvas-iframe/app-canvas-iframe.tpl"%>
<%/block%>

<%* footprint *%>
<%block name="p-4-1"%>
	<%if !empty($body.footerSEO) && $body.footerSEO.isHidden != "1"%>
		<%widget name="common:widget/footer-seo/footer-seo.tpl"%>
	<%else%>
		<%widget name="common:widget/footer/footer.tpl" linkList=$body.footprint.links copyright=$html.copyright uaq=$head.uaq%>
	<%/if%>
<%/block%>