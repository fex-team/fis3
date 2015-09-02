<%extends file='lv2/page/layout/layout-lv2-h.tpl'%>

<%* user bar *%>
<%block name="p-1-1"%>
    <%if !empty($body.headerTest.widget)%>
		<%widget name="common:widget/header/`$body.headerTest.widget`.tpl"%>
	<%else%>
		<%widget name="common:widget/header/header.tpl"%>
	<%/if%>
<%/block%>

<%* search group *%>
<%block name="p-2-1"%>
<%if !empty($body.searchBox.widget)%>
		<%widget name="common:widget/`$body.searchBox.widget`/`$body.searchBox.widget`.tpl"%>
	<%else%>
		<%widget name="common:widget/search-box/search-box.tpl"%>
	<%/if%>
	<%if $body.headerTest.userbarBtnIsHidden === '0'%>
		<%widget name="common:widget/header/userbar-btn-test/userbar-btn-test.tpl"%>
	<%/if%>
<%/block%>

<%* sites list *%>
%* sites nav *%>
<%block name="p-3-2"%>
	<%widget name="lv2:widget/nav-list-h/nav-list-h.tpl"%>
<%/block%>

<%* sites list *%>
<%block name="p-3-1"%>
	<%widget name="lv2:widget/site-list-h/site-list-h.tpl"%>

<%/block%>

<%block name="p-4-1"%>
	<%widget name="lv2:widget/backtop/backtop.tpl"%>
	<%if !empty($body.footerSEO) && $body.footerSEO.isHidden != "1"%>
		<%widget name="common:widget/footer-seo/footer-seo.tpl"%>
	<%else%>
		<%widget name="common:widget/footer/footer.tpl" linkList=$body.footprint.links copyright=$html.copyright uaq=$head.uaq%>
	<%/if%>
<%/block%>