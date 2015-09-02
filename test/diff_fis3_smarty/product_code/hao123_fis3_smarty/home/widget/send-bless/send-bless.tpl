<%if $head.dir=='ltr'%>
	<%require name="home:widget/send-bless/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/send-bless/rtl/rtl.css"%>
<%/if%>

<div id="sendBless" class="mod-send-bless" log-mod="send-bless" style="display:none; visibility:hidden;">
	<a href="<%$body.sendBless.landingpage%>" class="cake-link"></a>
	<div class="landing-btn"><a href="<%$body.sendBless.landingpage%>"><%$body.sendBless.landingBtnText%></a></div>
	<div class="bless-btn"><%$body.sendBless.sendBlessBtnText%></div>
	<div class="num-container">
		<i></i>
		<span class="con"></span>
		<span class="dash"></span>
		<span class="con"></span>
		<span class="con"></span>
		<span class="con"></span>
		<span class="dash"></span>
		<span class="con"></span>
		<span class="con"></span>
		<span class="con"></span>
		<em class="left"></em>
		<em class="right"></em>
	</div>
	<span class="close"></span>
</div>

<%script%>
	conf = conf || {};
	conf.sendBless = {
		id : "sendBless",
		opt : <%json_encode($body.sendBless)%>
	}
	
	require.async("home:widget/send-bless/send-bless-async.js", function( sendBless ){
		(new sendBless()).init();
	});
<%/script%>