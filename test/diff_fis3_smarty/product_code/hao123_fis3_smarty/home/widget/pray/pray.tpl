<style>
    .side-mod-preload-pray{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-pray > *{
        visibility: hidden;
    }
</style>
	<%*   声明对ltr/rtl的css依赖    *%>
	<%if $head.dir=='ltr'%> <%require name="home:widget/pray/ltr/ltr.css"%> <%else%> <%require name="home:widget/pray/rtl/rtl.css"%> <%/if%>
	<div class="mod-pray<%if $body.pray.hourClock == 12%> mod-pray-h12<%/if%><%if !empty($body.pray.moreUrl) && !empty($body.pray.moreText)%> mod-pray-more<%/if%>" id="sidePray" monkey="sidepray" log-mod="pray">
		<div class="mod-side">
			<p><%$body.pray.title%></p>
			<p id="prayCurDate"></p>
			<div class="s-mvm">
				<span class="ib" id="prayCurTime"></span>&nbsp;<span class="ib dropdown dropdown-<%$head.dir%>" id="prayCityPicker">
					<span class="dropdown-trigger">
						<input type="text" class="dropdown-input" readonly="true"/>
						<span class="dropdown-arrow"><i></i></span>
					</span>
					<div id="citylist" class="dropdown-list">
						<ul></ul>
						<!-- <a class="scroll-arrow top-arrow" id="topArrow" href="#"></a>
						<a class="scroll-arrow bottom-arrow" id="bottomArrow" href="#"></a> -->
					</div>
				</span>
			</div>
			<table id="prayTimeTable">
				<%foreach $body.pray.prayNameList as $value%>
					<tr>
						<td><%$value%></td>
						<td class="pray-time"></td>
						<td class="pray-countdown">--:--:--</td>
					</tr>
				<%/foreach%>
			</table>
		</div>
		<span class="api-loading ui-o"></span>
		<a id='pray-error' class='api-error' href='#'><%$head.apiError%></a>
		<%if !empty($body.pray.moreUrl) && !empty($body.pray.moreText)%>
			<a class="charts_more" href="<%$body.pray.moreUrl%>" data-sort="more"><%$body.pray.moreText%><i class="arrow_r">&rsaquo;</i></a>
		<%/if%>
		<%if !empty( $body.pray.prayAppEntrance ) && $body.pray.prayAppEntrance.isHidden !== "1"%>
			<div  class="pray-app-entrance" log-mod="pray-app-entrance">
			</div>
		<%/if%>
</div>
	<%script%>
		conf.pray = {
			prayClock: {
				imgUrl: '/static/web/common/img/gut.gif',
				url: '',
				title: '',
				dateTpl: '<%$body.pray.dateTpl%>',
				timeTpl: <%json_encode($body.pray.timeTpl)%>,
				islDateFix: '<%if isset($body.date.islDateFix)%><%$body.date.islDateFix%><%/if%>' || 0,
				rate: 1000,
				timeZone: '<%$body.pray.commonTimeZone%>',
				hourClock: <%$body.pray.hourClock|default:24%>,
				overtime: '<%$body.pray.overtime%>',
				localText:{
					am: '<%$body.pray.am%>',
					pm: '<%$body.pray.pm%>'
				}
			},
			prayNameList: <%json_encode($body.pray.prayNameList)%>,
			cityList: <%json_encode($body.pray.cityList)%>,
			prayAppEntrance : <%json_encode($body.pray.prayAppEntrance)%>

		};
		require.async("common:widget/ui/jquery/jquery.js", function ($) {
			$(window).one("e_go.pray", function () {
				require.async(['home:widget/ui/pray/pray.js'],function(pray){
					pray();
				});
			});
			if(!$("#sideMagicBox #sidePray").length){
				$(window).trigger("e_go.pray");
			}
		});
	<%/script%>
