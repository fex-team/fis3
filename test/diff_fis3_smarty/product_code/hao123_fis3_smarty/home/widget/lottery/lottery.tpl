<style>
    .side-mod-preload-lottery{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-lottery > *{
        visibility: hidden;
    }
</style>

<div class="mod-lottery" id="sideLottery" monkey="sidelottery" log-mod="lottery">
	<%widget name="home:widget/lottery/`$body.lottery.displayType`/`$body.lottery.displayType`.tpl"%>
	<a class='api-error' href='#'><%$body.lottery.apiError|default:$head.apiError%></a>
	<i class='api-loading ui-o'></i>
	<%if !empty($body.lottery.moreUrl) && !empty($body.lottery.moreText)%><a class="charts_more" href="<%$body.lottery.moreUrl%>" data-sort="more"><%$body.lottery.moreText%><i class="arrow_r">&rsaquo;</i></a><%/if%>
</div>
	<%script%>
		<%if !empty($body.datepicker.show) && $body.datepicker.show == "1"%>
		<%*日期控件*%>
		conf.datepicker = <%json_encode($body.datepicker)%>;
		conf.datepicker.firstDay = ~~conf.datepicker.firstDay;
		conf.datepicker.isRTL = !!(~~conf.datepicker.isRTL);
		conf.datepicker.showMonthAfterYear = !!(~~conf.datepicker.showMonthAfterYear);
		<%/if%>
		require.async("common:widget/ui/jquery/jquery.js", function ($) {
			$(window).one("e_go.lottery", function () {
				require.async(['common:widget/ui/lottery/lottery.js'],function(sideLottery){
					sideLottery(conf.pageType);
				});
			});
			if(!$("#sideMagicBox #sideLottery").length){
				$(window).trigger("e_go.lottery");
			}
		});
	<%/script%>
