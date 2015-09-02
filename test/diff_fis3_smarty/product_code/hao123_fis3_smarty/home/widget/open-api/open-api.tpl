<%foreach $openApi.widgetId as $id%>
	<%widget name="`$openApi.widgetPathRoot`/`$id`/`$id`.tpl" mode="quickling" pagelet_id="`$id`" is_rend=false mid="sidebar-`$id`" mod_id = "sidebar-`$id`"%>
<%/foreach%>


