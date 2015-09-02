<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/rate/ltr/ltr.css"%> <%else%> <%require name="home:widget/rate/rtl/rtl.css"%> <%/if%>

<div class="mod-rate" id="<%$body.rate.id%>" monkey="<%$body.rate.id%>" log-mod="rate">
	<div class="mod-side">
		<div class="rate-inner">
			<%if !empty($body.rate.order)%>
				<%assign var="rateOrder" value=","|explode:$body.rate.order%>
				<%foreach $rateOrder as $mod%>
					<%widget name="home:widget/rate/rate-`$mod`.tpl"%>
				<%/foreach%>
			<%/if%>
		</div>
	</div>
	<%if !empty($body.rate.moreText) && !empty($body.rate.moreUrl)%>
		<a class="charts_more" href="<%$body.rate.moreUrl%>" data-sort="more"><%$body.rate.moreText%><i class="arrow_r">›</i></a>
	<%/if%>
</div>

<%script%>
	conf.rate = <%json_encode($body.rate)%>;
	require.async('common:widget/ui/jquery/jquery.js',function($){
		$(window).one("e_go.rate", function () {
			require.async(['home:widget/rate/rate-async.js'],function(rate){
				new rate();
			});
		});
		if(!$("#sideMagicBox #sideRate").length){
			$(window).trigger("e_go.rate");
		}
	});
<%/script%>
