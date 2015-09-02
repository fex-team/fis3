<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/user-guider/ltr/ltr.css"%> <%else%> <%require name="home:widget/user-guider/rtl/rtl.css"%> <%/if%>
<%style%>
	.ui-bubble--new-user-guider{
		visibility: hidden;
	}
<%/style%>

<%script%>
	conf = conf || {};
	conf["<%$mod%>"] = <%json_encode($body["<%$mod%>"])%>;
	conf["<%$mod%>"].isCeiling = "<%$body.headerTest.isCeiling%>";


	require.async(["common:widget/ui/jquery/jquery.js", "home:widget/user-guider/user-guider-async.js"], function($, UserGuider){
		$( function(){
			new UserGuider("<%$mod%>");
		} );
	});
<%/script%>