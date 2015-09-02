<%style%>
	.mod-nav-wrap{
		display: none;
		height: 0;
	}
<%/style%>
<%style%>
	<%if $head.dir=='ltr'%> 
		@import url('/widget/header-flat/nav/ltr/ltr.css?__inline');
	<%else%> 
		@import url('/widget/header-flat/nav/rtl/rtl.css?__inline');
	<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%*require name="common:widget/header-flat/nav/`$head.dir`/`$head.dir`.more.css"*%>
<div class="mod-nav-wrap" id="navWrap" log-mod="navigation">
	<ul>
		<%foreach $body.navigation.navData as $navItem%>
			<li class="nav-item" style="width:<%100/$navItem@total%>%" data-sort="<%$navItem.sort%>">
				<div class="nav-el<%if $navItem@first%> nav-first<%/if%>">
					<i class="i-nav" style="background:<%$navItem.backColor%> url(<%$navItem.iconUrl%>) no-repeat;" data-url="<%$navItem.url%>" title="<%$navItem.text%>"></i>
					<div class="nav-text-wrap" data-url="<%$navItem.url%>" title="<%$navItem.text%>">
						<span class="nav-item-text"><%$navItem.text%></span>
						<i class="i-arrow"></i>
					</div>
					<i class="i-hover-arrow"></i>
					<div class="nav-hover-wrap <%$navItem.type%>">
						<div class="nav-reco">
							<ul class="nav-reco-ul">
								<%foreach $navItem.recommend as $reco%>
									<li class="nav-reco-item<%if $reco@first%> first<%/if%>">
										<a href="<%$reco.url%>" class="nav-reco-wrap">
											<img data-src="<%$reco.img%>" class="nav-reco-img">
											<span class="nav-reco-title"><%$reco.title%></span>
											<span class="nav-mask"></span>
										</a>
									</li>
								<%/foreach%>
							</ul>
						</div>
						<div class="nav-tab">
							<ul class="nav-tab-ul" data-idx="<%$navItem@index%>">
								<%foreach $navItem.tabs as $tab%>
								<%if $tab@index < 8%>
								<li class="nav-tab-item<%if $tab@first%> cur<%/if%>" data-url="<%$tab.url%>"><%$tab.title%></li>
								<%/if%>
								<%/foreach%>

								
							</ul><div class="nav-subtab-ul">
								<div class="nav-subtab-item">
									<%foreach $navItem.tabs[0].subtab as $subtab%>
										<a href="<%$subtab.url%>" class="nav-subtab-a"><%$subtab.title%></a>
									<%/foreach%>
								</div>
							</div>
							<%if !empty($navItem.moreUrl)%>
								<a href="<%$navItem.moreUrl%>" class="nav-more"><span><%$navItem.moreText%></span><b>›</b></a>
							<%/if%>
						</div>
					</div>
				</div>
			</li>
		<%/foreach%>
	</ul>
</div>

<%script%>
	conf.nav = {
		data: <%json_encode($body.navigation)%>
	};
	require.async("common:widget/header-flat/nav/nav-async.js", function(nav){
		new nav(conf.nav.data);
	});
<%/script%>