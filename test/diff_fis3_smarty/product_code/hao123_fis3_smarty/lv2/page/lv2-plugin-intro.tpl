<%extends file='lv2/page/layout/layout-plugin-intro.tpl'%>
<%block name="headInfo"%>
	<meta name="google-site-verification" content="mvqItKhX4YXhFVk-D5VCQEUy7U8DdfJ2UkHiVuBkPZI" />
	<link rel="chrome-webstore-item" href="<%$body.pluginIntroPage.plugin_url%>">
<%/block%>
<%block name="p-1-1"%>
	<%if !empty($body.headerTest.widget)%>
		<%widget name="common:widget/header/`$body.headerTest.widget`.tpl"%>
	<%else%>
		<%widget name="common:widget/header/header.tpl"%>
	<%/if%>
<%/block%>
<%block name="p-2-1"%>
	<%widget name="lv2:widget/plugin-intro/plugin-intro.tpl"%>
<%/block%>

<%block name="p-3-1"%>
	<%widget name="lv2:widget/backtop/backtop.tpl"%>
	<%if !empty($body.footerSEO) && $body.footerSEO.isHidden != "1"%>
		<%widget name="common:widget/footer-seo/footer-seo.tpl"%>
	<%else%>
		<%widget name="common:widget/footer/footer.tpl" linkList=$body.footprint.links copyright=$html.copyright uaq=$head.uaq%>
	<%/if%>
<%/block%>