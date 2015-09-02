<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/vote-tem-pray/ltr/ltr.css"%> <%else%> <%require name="home:widget/vote-tem-pray/rtl/rtl.css"%> <%/if%>

<div id="voteTemPray" class="mod-vote-tem-pray" log-mod="vote-tem-pray">
	<div class="pray-template">
		 <div class="vote-tel-title pray-title">
			 <span><%$body.voteTemPray.title%></span>
		 </div>
		 <img src="<%$body.voteTemPray.prayImg%>" class="pray-template-img" />
		 <div class="vote-agree-ordis">
			 <div class="vote-agree-pray"><%$body.voteTemPray.agreeBtn%></div>
		 </div>
		 <div class="vote-common-line"></div>
		 <div class="vote-handle-area-result pary-tel">
				<div class="vote-share <%$body.voteTemPray.noteShare%>"><i></i><span><%$body.voteTemPray.shareWhich%></span></div>
		 </div>
    </div>
</div>

<%script%>

	conf.dataTransform = {
		voteItems : <%json_encode($body.voteTemPray)%>
	}

	require.async('home:widget/vote-tem-pray/vote-tem-pray-async.js',function(voteTelPray){
		new voteTelPray();
	});	
<%/script%>