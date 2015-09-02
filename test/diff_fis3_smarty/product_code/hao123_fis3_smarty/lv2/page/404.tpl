<%extends file='lv2/page/layout/layout-404.tpl'%>

<%block name="header-wrap"%>
	<%if !empty($body.headerTest.widget)%>
		<%widget name="common:widget/header-flat/`$body.headerTest.widget`.tpl"%>
	<%else%>
		<%widget name="common:widget/header/header.tpl"%>
	<%/if%>
<%/block%>

<%* user bar *%>
<%block name="user-bar"%>
	<%widget name="common:widget/header-flat/header-flat.tpl"%>
	<%* 新首页的base样式 *%>
	<%widget name="common:widget/css-flatbase/css-flatbase.tpl"%>
<%/block%>

<%block name="404"%>
	<%widget name="lv2:widget/404/404.tpl"%>
<%/block%>

<%* footprint : edited by wmf 2012/9/28 *%>
<%block name="footer"%>
	<%if !empty($body.footerSEO) && $body.footerSEO.isHidden != "1"%>
		<%widget name="common:widget/footer-seo/footer-seo.tpl"%>
	<%else%>
		<%widget name="common:widget/footer/footer.tpl" linkList=$body.footprint.links copyright=$html.copyright uaq=$head.uaq%>
	<%/if%>
<%/block%>