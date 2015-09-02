<%require name="lv2:widget/launcher/`$head.dir`/`$head.dir`.css"%>
<div class="mod-launcher-mid">
	<div class="mid-inner">
		<div class="left-block">
			<img src="<%$body.launcherMid.fontImage%>" class="left-zi">
			<a href="<%$body.launcherMid.btnUrl%>" class="dl-btn" style="<%$body.launcherMid.btnStyle%>"><%$body.launcherMid.btnContent%></a>
		</div>
		<div class="right-block">
			<div id="rightSlide">
				<ul class="slide-container">
					<%foreach $body.launcherMid.slide as $slideItem%>
						<li class="slide cur"><img src="<%$slideItem.imageUrl%>"></li>
					<%/foreach%>
				</ul>
			</div>
		</div>
	</div>
</div>

<%script%>
	require.async('lv2:widget/launcher/launcher.js',function(launcherInit){
		launcherInit();
	})
<%/script%>