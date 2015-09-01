<%if $head.dir=='ltr'%> <%require name="home:widget/easter-game/ltr/ltr.css"%> <%else%> <%require name="home:widget/easter-game/rtl/rtl.css"%> <%/if%>
<div class="mod-easter-game" log-mod="easter-game">	
</div>
<%script%>
	conf.easterGame = <%json_encode($body.easterGame)%>;
	require.async("home:widget/easter-game/easter-game-async.js");
<%/script%>	