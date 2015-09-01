
<%widget name="lv2:widget/site-list-h/css-site-list-base/css-site-list-base.tpl"%>
<%if !empty($body.moduleList)%>
	<%foreach $body.moduleList as $moduleInfo%>
		<%*<%$tempModDir="<%$templateRoot%>web/module/<%$moduleInfo.mod%>.html"%>*%>
		<%if empty($moduleInfo.ishide) %>
			<%widget name="lv2:widget/site-list-h/`$moduleInfo.mod`/`$moduleInfo.mod`.tpl" data=$moduleInfo.data%>
			<%*<%include file='lv2/$tempModDir'data=$moduleInfo.data%>*%>
		<%/if%>
	<%/foreach%>
<%*else是为了兼容前期已经录入的sitesList，否则需要修改所有前期的二级页,等所有二级页都去掉后else也可以去掉*%>
<%else%>
	<%widget name="lv2:widget/site-list-h/link-siteslist/link-siteslist.tpl"%>
<%/if%>
