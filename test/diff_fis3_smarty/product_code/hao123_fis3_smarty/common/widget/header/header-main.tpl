
<%*    页头的抽样逻辑都需要在这里添加 *%>
<%if !empty($body.headerTest.widget)%>
		<%widget name="common:widget/header/`$body.headerTest.widget`.tpl"%>
<%else%>
		<%widget name="common:widget/header/header.tpl"%>
<%/if%>