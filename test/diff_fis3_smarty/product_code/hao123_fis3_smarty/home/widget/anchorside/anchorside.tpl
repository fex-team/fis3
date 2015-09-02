<%if $head.dir=='ltr'%> <%require name="home:widget/anchorside/ltr/ltr.css"%> <%else%> <%require name="home:widget/anchorside/rtl/rtl.css"%>
 <%/if%>
<div id="anchorside" class="mod-anchorside" log-mod="anchorside" style="display:none">
	<%if !empty($body.anchorside.imgSrc)%>
		<a class="link" href="<%$body.anchorside.link%>">
			<img src="<%$body.anchorside.imgSrc%>"/>
		</a>
	<%/if%>
	<div>
	<%foreach $body.anchorside.list as $value%>
		<div class="guid-item <%if !empty($value.class)%><%$value.class%><%/if%>" data-type="<%$value.id%>" style="width:<%$value.size|default:46%>px; height:<%$value.size|default:46%>px; line-height:<%$value.size|default:46%>px; ">
			<%if !empty($value.content)%>
				<%$value.content%>
			<%else%>
				<i class="<%$value.id%>" title="<%$value.title%>" style="background: url(<%$value.icon_url|default:$value.defaultIconUrl%>) no-repeat; width:<%$value.size|default:46%>px;"></i>
				<span class="guid-description"><%$value.title%></span>
			<%/if%>
		</div>
	<%/foreach%>
	</div>
</div>
<%script%>
	conf.anchorside = <%json_encode($body.anchorside)%>;
	conf.anchorside.newHeader = "<%$body.headerTest.widget%>";
	conf.anchorside.isCeiling = "<%$body.headerTest.isCeiling%>";
	conf.anchorside.ceilingMore = "<%$body.headerTest.ceilingMore%>";

	require.async('home:widget/ui/anchorside/anchorside.js',function(anchorside){
		anchorside();
	});
<%/script%>
