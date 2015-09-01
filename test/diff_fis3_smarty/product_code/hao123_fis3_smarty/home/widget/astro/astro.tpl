<style>
    .side-mod-preload-astro{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-astro > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/astro/ltr/ltr.css"%> <%else%> <%require name="home:widget/astro/rtl/rtl.css"%> <%/if%>
	<div class="mod-astro" id="sideAstro" monkey="sideAstro" log-mod="astro">
		<dl>
			<dt>
				<div class="today" id="astroDateBox"><i></i></div>
				<div class="astro-head unselect">
					<i class="astro_ico"></i>
					<span class="astro_name"></span><span class="astro_period"></span><i class="i-pointer"></i>
					<ul class="astro-list">
						<%foreach $body.astro.list as $value%>
							<li class="l-ff">
								<span class="fl" astro_name="<%$value.name%>"><%$value.name%></span>
								<span class="fr"><%$value.period%></span>
							</li>
						<%/foreach%>
					</ul>
				</div>
			</dt>
			<dd>
				<ul class="astro-tab">
					<%foreach $body.astro.tab as $value%>
						<li<%if $value@first%> class="cur"<%/if%>><%$value%></li>
					<%/foreach%>
				</ul>
				<ul class="astro-panel">
					<%section name=i loop=$body.astro.tab|@count%>
					<li<%if $smarty.section.i.first%> style="display:block"<%/if%>>
						<ul class="astro-luck">
							<%foreach $body.astro.luck as $value%>
								<li class="astro-luck_<%$value.type%>">
									<span><small class="triangle"></small><%$value.name%></span>
									<i></i><i></i><i></i><i></i><i></i>
								</li>
							<%/foreach%>
						</ul>
						<div class="astro-desc">
							<p>...</p>
							<p>...</p>
							<i class="i-pointer"></i>
						</div>
					</li>
					<%/section%>
				</ul>
			</dd>
		</dl>
		<a id='astro-error' class='api-error' href='#'><%$head.apiError%></a>
		<!-- <a id='astro-error' href='#'>error</a> -->
		<a class="charts_more" href="<%$body.astro.more.url%>"><%$body.astro.more.text%><i class="arrow_r">›</i></a>
</div>
	<%script%>
		conf.sideAstro = {
			todayReg: "<%$body.astro.todayReg|default:"#{d}/#{m}/#{y}"%>",
			multiTruncate: <%json_encode($body.astro.multiTruncate)%>
		};
		require.async("common:widget/ui/jquery/jquery.js", function ($) {
			$(window).one("e_go.astro", function () {
				require.async(['home:widget/ui/astro/astro.js'],function(sideAstro){
					sideAstro();
				});
			});
			if(!$("#sideMagicBox #sideAstro").length){
				$(window).trigger("e_go.astro");
			}
		});
	<%/script%>
