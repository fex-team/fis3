<%strip%>
<%*   声明对ltr/rtl的css依赖    *%>
<%require name="common:widget/footer-seo/<%$head.dir%>/<%$head.dir%>.css"%>
<%require name="common:widget/footer/<%$head.dir%>/<%$head.dir%>.css"%>

<div class="mod-footer-seo" id="footerSEO" log-mod="footer-seo" style="display: none">
	<div class="l-wrap">
		<div class="footer-links cf">
			<%foreach $body.footerSEO.sort as $sort%>
			<div class="sort sort-<%$sort@index%> cf">
				<%foreach $sort as $column%>
				<ul>
					<%foreach $column as $item%>
					<li><a href="<%$item.link%>" title="<%$item.name%>"><%$item.name%></a></li>
					<%/foreach%>
				</ul>
				<%/foreach%>
			</div>
			<%/foreach%>
		</div>
		<div class="t-c">
			<ul class="box-fot no-hover" log-mod="footer">
			    <%foreach $body.footprint.links as $value%>
			    <li <%if !empty($value.class)%>class="<%$value.class%>"<%/if%>>
			    	<a href="<%$value.url%>"><%$value.name%></a>
			    	<b class="space"></b>
			    </li>
			    <%/foreach%> 
		    	<li>
		    		<p class="fb_like_label red"><a href="<%$body.fb_like.page%>"><%$body.fb_like.label%></a></p>
		    	</li>
		    	<li class="fb_like" log-mod="fb-like"></li>
			</ul>
		</div>
		<div class="footer-copyright">
			<p><%$body.footerSEO.copyright%></p>
		</div>
	</div>
</div>

<%script%>
	<%if !empty($body.fb_like)%>
	conf.fb_like = {
		"locale":"<%$body.fb_like.locale%>",
		"url":"<%$body.fb_like.page|escape:'url'%>",
		"width":<%$body.fb_like.width%>,
		"height":<%$body.fb_like.height%>
	};
	<%/if%>
	require.async("common:widget/ui/jquery/jquery.js", function($){
		$(window).on("load", function(){
			require.async('common:widget/ui/monitor/monitor.js');
			require.async('common:widget/footer-seo/footer-seo-async.js');
		});
	});
<%/script%>
<%/strip%>