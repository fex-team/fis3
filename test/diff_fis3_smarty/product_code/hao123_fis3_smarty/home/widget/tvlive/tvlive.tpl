<style>
    .side-mod-preload-tvlive{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
        min-height: 302px;
    }
    .side-mod-preload-tvlive > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/tvlive/ltr/ltr.css"%> <%else%> <%require name="home:widget/tvlive/rtl/rtl.css"%> <%/if%>
	<div class="mod-tvlive" id="sideTvlive" monkey="sideTvlive" log-mod="tvlive">
		<ul class="mod-side">
			<%*foreach $body.tvlive.channel as $value%>
				<li>
					<a class="tvlive-channel gradient-bg-silver" href="<%$value.url%>"><span class="<%$value.icon%>"><i></i></span><%$value.icon%></a>
					<div class="tvlive-content">
						<%section name=i loop=4%>
							<a href="<%$value.url%>" class="tvlive-program">
								<span class="tvlive-time">12:20-13:30</span>
								<span class="tvlive-name">圆梦之旅</span>
							</a>
						<%/section%>
					</div>
				</li>
			<%/foreach*%>
		</ul>
		<a id='tvlive-error' class='api-error' href='#'><%$head.apiError%></a>
		<!-- <a class='tvlive-error' href='#'>error</a> -->
		<a class="charts_more" href="<%$body.tvlive.moreUrl%>"><%$body.tvlive.moreText%><i class="arrow_r">&rsaquo;</i></a>
	</div>
	<%script%>
		conf.tvlive = {
			channel: <%json_encode($body.tvlive.channel)%>,
			showNum: "<%$body.tvlive.showNum%>"
		};
		require.async('common:widget/ui/jquery/jquery.js',function($){
			$(window).one("e_go.tvlive", function (e,data) {
				require.async(['home:widget/ui/tvlive/tvlive.js'],function(tvlive){
					tvlive(data);
				});
			});
			if(!$("#sideMagicBox #sideTvlive").length){
				$(window).trigger("e_go.tvlive");
			}
		});
	<%/script%>
