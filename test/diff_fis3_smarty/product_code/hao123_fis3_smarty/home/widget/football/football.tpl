<style>
    .side-mod-preload-football{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-football > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/football/ltr/ltr.css"%> <%else%> <%require name="home:widget/football/rtl/rtl.css"%> <%/if%>
	<div class="mod-football" id="sideFootball" monkey="sideFootball" log-mod="football">
		<div class="mod-side">
			<div class="football-type s-mbm pr">
				<label for="footballTypePicker"<%if empty($body.football.typeText)%> style="display:none"<%/if%>><%$body.football.typeText%>:</label>
				<select id="footballType"<%if !empty($body.football.typeWidth)%> style="width:<%$body.football.typeWidth%>px"<%/if%>>
				</select>
			</div>
			<div class="football-games pr">
				<ul class="football-tab" id="footballTab">
					<%*foreach $body.football.gameDate as $value%>
					<li<%if $value@index == 1%> class="cur"<%/if%>><%$value%></li>
					<%/foreach*%>
				</ul>
				<i class="football-arrow-up s-mbm" id="footballUpArrow"><i class="i-pointer"></i></i>
				<ul id="footballGameLists">
					<%foreach $body.football.gameDate as $value%>
					<li class="football-game-list-wrapper">
						<ul class="football-game-list" id="footballGameList_<%$value@index%>"></ul>
					</li>
					<%/foreach%>
				</ul>
				<i class="football-arrow-down" id="footballDownArrow"><i class="i-pointer"></i></i>
			</div>
		</div>
		<a id='football-error' class='api-error' href='javascript:;'><%$head.apiError%></a>
		<a class="charts_more" href="<%$body.football.moreUrl%>"><%$body.football.moreText%><i class="arrow_r">&rsaquo;</i></a>
	</div>
	<%script%>
		conf.football = <%json_encode($body.football)%>;
		require.async('common:widget/ui/jquery/jquery.js',function($){
			$(window).one("e_go.football", function (e,data) {
				require.async(['home:widget/ui/football/football.js'],function(football){
					new football(data);
				});
			});
			if(!$("#sideMagicBox #sideFootball").length){
				$(window).trigger("e_go.football");
			}
		});
	<%/script%>
