<style>
    .side-mod-preload-charts{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-charts > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/charts/ltr/ltr.css"%> <%else%> <%require name="home:widget/charts/rtl/rtl.css"%> <%/if%>



<%assign var="chartsOrder" value=","|explode:$body.charts.chartsOrder%>
	<div class="mod-charts box-border" id="sideCharts" monkey="sidecharts">

		<ul class="charts_menu cf">
			<%foreach $chartsOrder as $cmod%>
				<li style="width:<%100/$cmod@total%>%" log-mod="<%$body.<%$cmod%>.chartsType%>-charts">
					<a href="#"<%if $cmod@last%> class="last"<%/if%> menutype="<%preg_replace('/Charts(\[\w*\])*/','',$cmod)%>" subtype="<%preg_replace('/\w*(\[(\w+)\])*$/','$2',$cmod)%>" rqnum="<%$body.<%$cmod%>.numPerRequest%>"  type="<%$cmod%>"><%$body.<%$cmod%>.title%></a>
					<%if !empty($body.<%$cmod%>.icon) && $body.<%$cmod%>.icon == "new"%><i class="icon-new_red"></i><%/if%>
				</li>
			<%/foreach%>
		</ul>
		<%foreach $chartsOrder as $cmod%>
			<div class="charts_content<%if isset($body.<%$cmod%>.showType)%> charts-mode<%$body.<%$cmod%>.showType%><%/if%>" log-mod="<%$body.<%$cmod%>.chartsType%>-charts">
				<div class="chartslist mod-side hover charts-<%preg_replace('/Charts(\[\w*\])*/','',$cmod)%>">
					<%if $cmod == "musicCharts"%>
						<i class="icon-bg"></i>
					<%/if%>
					<ul></ul>
				</div>
				<a class="charts_more" <%if !empty(<%$body.<%$cmod%>.offerid%>)%> log-oid="<%$body.<%$cmod%>.offerid%>" <%/if%> href="<%$body.<%$cmod%>.moreUrl%>" data-sort="side<%preg_replace('/Charts/','',$cmod)%>"><%$body.<%$cmod%>.moreText%><i class="arrow_r">&rsaquo;</i></a>
				<%if !empty($body.<%$cmod%>.error)%>
					<a class="charts_error" href="#"><%$body.<%$cmod%>.error%></a>
				<%/if%>
			</div>
		<%/foreach%>
</div>
	<%script%>
		<%if !empty($body.charts)%>
		//		榜单模块

		conf.charts = {
			isLoop: <%$body.charts.loopOpts.open|default:0%>,
			loopSpeed: <%$body.charts.loopOpts.speed|default:5000%>
		};

		<%if !empty($body.charts.notUseApi)%>
			<%assign var="chartsNotUseApi" value=","|explode:$body.charts.notUseApi%>
			<%foreach $chartsNotUseApi as $modNotUseApi%>
				conf.charts["<%$modNotUseApi%>Data"] = <%json_encode($body["<%$modNotUseApi%>"].items)%>;
				conf.charts["<%$modNotUseApi%>Config"] = <%json_encode($body["<%$modNotUseApi%>"].config)%>;
			<%/foreach%>
		<%/if%>

		require.async(["common:widget/ui/jquery/jquery.js", "common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js"], function($) {

			$(window).one("e_go.charts", function (e , item) {
				require.async(['home:widget/ui/charts/charts.js'],function(sideCharts){
					sideCharts(item);
				});
			});
			if(!$("#sideMagicBox #sideCharts").length){
				$(window).trigger("e_go.charts");
				$(window).on("locate.charts" , function(e , item){
				//按照原有设计，此处应该在调用后解绑，但是由于jquery不支持多级名空间，
				//所以。。。。只能如此了，但是此处的绑定仅是处理charts模块尚未初始化的情况
					if( $('.charts_menu').length === 0 ){
						$(window).trigger("e_go.charts" , item);
					}
				});
			}
		});
		<%/if%>
	<%/script%>
