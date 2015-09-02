<%*widget需要传递变量$linkList和copyright*%>


<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="common:widget/footer/ltr/ltr.css"%> <%else%> <%require name="common:widget/footer/rtl/rtl.css"%> <%/if%>
<script>
	window.conf || (window.conf = {});
	<%if !empty($body.fb_like)%>
		conf.fb_like = {
			"locale":"<%$body.fb_like.locale%>",
			"url":"<%$body.fb_like.page|escape:'url'%>",
			"width":<%$body.fb_like.width%>,
			"height":<%$body.fb_like.height%>
		}
	<%/if%>
</script>

<div class="l-wrap t-c">
	<ul class="box-fot no-hover" log-mod="footer">
	    <%foreach $linkList as $value%>
		    <li <%if !empty($value.class)%>class="<%$value.class%>"<%/if%>>
		    	<a href="<%$value.url%>"><%$value.name%></a>
		    	<b class="space"></b>
		    	<!--<%if !$value@last%><b class="space"></b><%/if%>-->
		    </li>
	    <%/foreach%> 
	    	<li>
	    		<p class="fb_like_label"><a href="<%$body.fb_like.page%>"><%$body.fb_like.label%></a></p>
	    	</li>
	    	<li class="fb_like" log-mod="fb-like"></li>
	</ul>
	<%if !empty($copyright)%>
		<%$copyright%>
	<%/if%>	
</div>

<%script%>
	require.async('common:widget/ui/monitor/monitor.js');
	require.async('common:widget/footer/footer-async.js');
<%/script%>
