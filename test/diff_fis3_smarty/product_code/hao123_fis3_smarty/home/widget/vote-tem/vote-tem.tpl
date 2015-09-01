<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/vote-tem/ltr/ltr.css"%> <%else%> <%require name="home:widget/vote-tem/rtl/rtl.css"%> <%/if%>
<style>
.mod-vote-wraper{visibility:hidden}
</style>
<div id="voteTemWrap" class="mod-vote-wraper" log-mod="vote-wraper">
	<div id="vote-exchange-btn" class="exchange-btn" title="<%$body.voteTem.exchangeBtn%>" style="display:<%if $body.voteTem.isHidden == '1'%>block<%else%>none<%/if%>"></div>
	<div id="voteTem" class="mod-vote-tem"></div>
</div>
<%script%>
	conf.defaultDisplay ={
		defaultNum:<%$body.voteTem.displayDefault%>,
		redirectURL:<%json_encode($body.voteTem.redirectURL)%>
	};

	conf.voteAreaEl = {
		voteArray : <%json_encode($body.voteTem.voteItem)%>
	}

	require.async('home:widget/vote-tem/vote-tem-async.js',function(voteTel){
		new voteTel();
	});	
<%/script%>