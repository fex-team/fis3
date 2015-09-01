<style>
    .side-mod-preload-gold{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-gold > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/gold/ltr/ltr.css"%> <%else%> <%require name="home:widget/gold/rtl/rtl.css"%> <%/if%>
<div class="mod-gold" id="sideGold" monkey="sidegold" log-mod="gold">
	<div class="mod-side">
		<div class="gold-price">
			<dl id="goldPriceList">
				<%*section name=i loop=6%>
					<dt class="gradient-bg-silver"><i class="gold-icon"></i>ทองคำแทง  96.5%</dt>
					<dd>
						<span class="gold-buy-title">รบซอ (บาท)</span>
						<span class="gold-buy-price">18,400.00</span>
						<span class="gold-sell-title">ขายออก (บาท)</span>
						<span class="gold-sell-price">18,500.00</span>
					</dd>
				<%/section*%>
			</dl>
		</div>
	</div>
	<a id="gold-error" class='api-error' href="#"><%$head.apiError%></a>
	<!-- <a class="gold-error" href="#">error</a> -->
	<a class="charts_more" href="<%$body.gold.moreUrl%>"><%$body.gold.moreText%><i class="arrow_r">&rsaquo;</i></a>
</div>
	<%script%>
		conf.gold = {
			buyText: "<%$body.gold.buyText%>",
			sellText: "<%$body.gold.sellText%>"
		};
		require.async('common:widget/ui/jquery/jquery.js',function($){
			$(window).one("e_go.gold", function () {
				require.async(['home:widget/ui/gold/gold.js'],function(gold){
					gold();
				});
			});
			if(!$("#sideMagicBox #sideGold").length){
				$(window).trigger("e_go.gold");
			}
		});
	<%/script%>
