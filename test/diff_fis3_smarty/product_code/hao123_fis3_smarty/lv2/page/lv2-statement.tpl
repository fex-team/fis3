<%extends file='lv2/page/layout/layout-statement.tpl'%>
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

<%block name="p-2-1"%>
    <%widget name="lv2:widget/statement/statement.tpl"%>
<%/block%>