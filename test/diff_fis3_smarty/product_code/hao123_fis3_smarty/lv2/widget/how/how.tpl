

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="lv2:widget/how/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/how/rtl/rtl.css"%> <%/if%>

	<%$html.instruction%>
	<%script%>
	require.async('lv2:widget/how/how.js',function(howInit){
		howInit();
	})
<%/script%>
