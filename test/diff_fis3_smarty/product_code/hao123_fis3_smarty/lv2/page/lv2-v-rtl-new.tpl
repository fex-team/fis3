<%extends file='lv2/page/layout/layout-lv2-v-rtl-new.tpl'%>

<%* user bar *%>
<%block name="p-1-1"%>
	<%if !empty($body.headerTest.widget)%>
		<%if $body.headerTest.widget == 'header-flat'%>
			<%widget name="common:widget/`$body.headerTest.widget`/`$body.headerTest.widget`.tpl"%>
		<%else%>
			<%widget name="common:widget/header/`$body.headerTest.widget`.tpl"%>
		<%/if%>
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
	<%if !empty($body.searchBox.flatStyle) && $body.searchBox.flatStyle == "1"%>
		<%widget name="common:widget/search-box-flat/search-box-flat.tpl"%>
	<%/if%>
<%/block%>

<%* sites nav *%>
<%block name="p-3-1"%>
	<%widget name="lv2:widget/channel-breads/channel-breads.tpl"%>
	<%widget name="lv2:widget/nav-list-v-new/nav-list-v-new.tpl"%>
<%/block%>

<%* sites list *%>
<%block name="p-4-1"%>
	<%widget name="lv2:widget/site-list-v-new/site-list-v-new.tpl"%>
	<%** 二级页App容器 **%>
	<%* 如果没有配置，则不调用这个数据 *%>
	<%if $body.extAppMod && ($body.extAppMod.isHidden != 'true')%>
		<%widget name="lv2:widget/lv2-app-new/lv2-app-new.tpl"%>
	<%/if%>
<%/block%>

<%block name="p-5-1"%>
	<%widget name="lv2:widget/backtop-new/backtop-new.tpl"%>
	<%if !empty($body.footerSEO) && $body.footerSEO.isHidden != "1"%>
		<%widget name="common:widget/footer-seo/footer-seo.tpl"%>
	<%else%>
		<%widget name="common:widget/footer/footer.tpl" linkList=$body.footprint.links copyright=$html.copyright uaq=$head.uaq%>
	<%/if%>
<%/block%>