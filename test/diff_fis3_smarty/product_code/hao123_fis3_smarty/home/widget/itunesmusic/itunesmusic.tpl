<%if !empty($body.itunesmusic) && $body.itunesmusic.isHidden != 1%>
	<%*   声明对ltr/rtl的css依赖    *%>
	<%require name="home:widget/itunesmusic/`$head.dir`/`$head.dir`.css"%>

	<div class="mod-iTunesMusic box-border" id="sideiTunesMusic">
		<ul class="im-tabControl cf">
			<%foreach $body.itunesmusic.tabItems as $tabControl%>
				<li style="width:<%100/$tabControl@total%>%"  data-track="<%$tabControl@index%>">
					<a href="#"<%if $tabControl@last%> class="last"<%/if%><%if $tabControl@first%> class="current"<%/if%>><%$tabControl.tabName%></a>
				</li>
			<%/foreach%>
		</ul>
		<div class="container">
			<ul class="im-tabContent">
				<%foreach $body.itunesmusic.tabItems as $tabContent%>
					<li data-track="<%$tabContent@index%>">
					</li>
				<%/foreach%>
			</ul>
		</div>
	</div>

	<%script%>
		conf.itunes = {
			timeText: "<%$body.itunesmusic.timeText%>",
			priceIcon: "<%$body.itunesmusic.priceIcon%>",
			tabItems: <%json_encode($body.itunesmusic.tabItems)%>,
			playText: "<%$body.itunesmusic.playText%>",
			stopText: "<%$body.itunesmusic.stopText%>",
			itunesText: "<%$body.itunesmusic.itunesText%>"
		};
		require.async(['home:widget/itunesmusic/itunesmusic-async.js'],function(iTunesMusic){
			new iTunesMusic();
		});
	<%/script%>	
<%/if%>

