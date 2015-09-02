<%require name="home:widget/sidebar-mothersday/`$head.dir`/`$head.dir`.css"%>
<%require name="common:widget/ui/text-overflow/`$head.dir`/`$head.dir`.css"%>


<div class="mod-sidebar-mum" id="sidebarMothersday" log-mod="sidebar-mothersday">
	<div class="banner" style="background:url(<%$body.sidebarMothersday.bannerImg%>);"></div>
	<p class="description"><%$body.sidebarMothersday.description%></p>
	<div class="content">
		<div class="card-panel">
			<div class="list-outer">
				<div class="list-inner">
					<%foreach $body.sidebarMothersday.list as $item%>
						<div class="item-wrapper item-leave" data-imgId="<%$item.imgId%>">
							<div class="img-side">
								<img class="card" src="<%$item.imgUrl%>" alt="I love you!" height="80" width="105">
								<div class="fb-time">
									<div class="num">
										<span class="tri triangle1"></span>
										<span class="tri triangle2"></span>
										<span class="num-text"><%$body.sidebarMothersday.defaultNum%></span>
									</div>
									<div class="share-text"><%$body.sidebarMothersday.shareText%></div>
								</div>
							</div>
							<div class="text-side">
								<div class="text-overflow-block card-text">
									<p><%$item.text%></p>
								</div>
								<div class="btn-g">
									<span class="btn fb-btn"><%$body.sidebarMothersday.fbBtnText%></span>
									<span class="btn email-btn"><%$body.sidebarMothersday.emailBtnText%></span>
								</div>
							</div>
						</div>
					<%/foreach%>
				</div>
			</div>
			<a class="more-link" href="<%$body.sidebarMothersday.moreLink%>"><%$body.sidebarMothersday.moreLinkText%></a>
		</div>
		<div class="email-panel">
			<div class="medium-card">
				<img src="#" alt="card" height="127" width="274">
			</div>
			<div class="input-g">
				<input class="my-input send-to" placeholder="<%$body.sidebarMothersday.sendToText%>">
				<input type="text" class="my-input send-from" placeholder="<%$body.sidebarMothersday.sendFromText%>">
				<textarea class="my-input other-message" maxlength="500" placeholder="<%$body.sidebarMothersday.moreMessageText%>"></textarea>
				<span class="email-error"><%$body.sidebarMothersday.emailError%></span>
			</div>
			<div class="btn-g2">
				<span class="btn btn2 send-btn"><%$body.sidebarMothersday.sendBtnText%></span>
				<span class="btn btn2 back-btn"><%$body.sidebarMothersday.backBtnText%></span>
			</div>
		</div>
	</div>
</div>

<%script%>
	conf.sidebarMothersday = {
		"modId": "sidebarMothersday",
		"ano": "<%$body.sidebarMothersday.ano%>",
		"emailTemplateId": "<%$body.sidebarMothersday.emailTemplateId%>",
		"facebook": <%json_encode($body.sidebarMothersday.facebook)%>,
		"success": "<%$body.sidebarMothersday.successText%>",
		"failure": "<%$body.sidebarMothersday.failureText%>",
	};
	
	require.async("home:widget/sidebar-mothersday/sidebar-mothersday-async.js" , function(mama){
		mama(conf.sidebarMothersday);
	});
<%/script%>

