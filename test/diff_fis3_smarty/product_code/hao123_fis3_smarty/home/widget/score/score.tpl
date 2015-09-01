<style>
    .side-mod-preload-score{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-score > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/score/ltr/ltr.css"%> <%else%> <%require name="home:widget/score/rtl/rtl.css"%> <%/if%>
	<div class="mod-score" id="sideScore" monkey="sidescore" log-mod="score">
		<div class="mod-side">
			<p class="score-powerby"><%$body.score.powerby%></p>
			<p class="score-title"><%$body.score.title_1%>&nbsp;<span id="scoreTotal"></span>&nbsp;<%$body.score.title_2%></p>
			<p class="score-label"><%$body.score.label%></p>
			<div class="scroll-container">
				<div class="score-wrapper scroll-pane">
					<ul id="scoreList" class="scroll-list"></ul>
				</div>
				<a class="scroll-arrow top-arrow" id="scoreTopArrow" href="#"></a>
				<a class="scroll-arrow bottom-arrow" id="scoreBottomArrow" href="#"></a>
			</div>
			<a class="gradient-bg-green s-mtm" id="scoreSearch" href="#"><%$body.score.searchText%></a>
		</div>
		<a id='score-error' class='api-error' href='#'><%$head.apiError%></a>
		<!-- <a class='score-error' href='#'>error</a> -->
	</div>
	<%script%>
		require.async('common:widget/ui/jquery/jquery.js',function($){
			$(window).one("e_go.score", function () {
				require.async(['home:widget/ui/score/score.js'],function(score){
					score();
				});
			});
			if(!$("#sideMagicBox #sideScore").length){
				$(window).trigger("e_go.score");
			}
		});
	<%/script%>
