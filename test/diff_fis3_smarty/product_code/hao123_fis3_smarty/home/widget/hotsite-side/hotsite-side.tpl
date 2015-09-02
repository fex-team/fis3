<style>
	.side-mod-preload-hotsite-side{
		border:1px solid #e3e5e6;
		border-bottom:1px solid #d7d8d9;
		background: #f5f7f7;
	}
	.side-mod-preload-hotsite-side > *{
		visibility: hidden;
	}
</style>

<%if $head.dir=='ltr'%> <%require name="home:widget/hotsite-side/ltr/ltr.css"%> <%else%> <%require name="home:widget/hotsite-side/rtl/rtl.css"%> <%/if%>
<%assign var "width" value=100%>
<div class="hotsite-side-wrap">

	<ul class="hotsiteside_menu cf" style="visibility:hidden;">
		<%foreach $body.hotsiteSide.mods as $mod%>
		<li style="width:<%100/$mod@total%>%" log-mod="hotsiteside-<%$mod.type%>">
			<a href="javascript:;" onclick="return false;" class="<%if $mod@first%>cur<%/if%><%if $mod@last%> last<%/if%>" data-type="<%$mod.type%>" data-slide="<%$mod.useSlide%>"><%$mod.title%></a>
			<%if !empty($mod.showHotIcon)%><i class="icon-hot"></i><%/if%>
		</li>
		<%/foreach%>
	</ul>
	<div id="hotsite-side-container">
		<%foreach $body.hotsiteSide.mods as $mod%>

		<div class="hotsiteside_content hotsiteside-<%$mod.type%>" log-mod="hotsiteside-<%$mod.type%>">
			<%if empty($mod.useAjax)%>
				<%if !$mod@first%>
					<textarea style="display:none;">
				<%/if%>

				<%if $mod.type == "image"%>
					<div class="main-item-wrap<%if !empty($mod.useSlide)%> slide-wrap<%/if%>">
						<a href="<%$mod.banner[0].landingpage%>" class="main-item" style="width:238px;height:<%$mod.banner[0].height%>">
							<img src='<%$mod.banner[0].imgSrc%>' width="238" height="<%$mod.banner[0].height%>" data-i="0"/>
							<p class="item-slogon" data-i="0"><%$mod.banner[0].description%></p>
						</a>
					</div>

					<div class="detail-item-wrap cf">
						<%foreach $mod.items as $item%>
						<a href="<%$item.landingpage%>" style="width:73px;height:73px;">
							<img src="<%$item.imgSrc%>" width="73" height="73">
							<div class="item-mask hide" data-index="<%$item@index%>"></div>
						</a>
						<%/foreach%>
					</div>
				<%elseif $mod.type=="apps"%>
					<div class="hotsiteside-app-big-content <%if !empty($mod.useSlide)%> slide-wrap<%/if%>" data-i="big1">
						<a href="<%$mod.banner[0].landingpage%>" class="hotsiteside-app-big" style="width:238px;height:106px;">
							<img src="<%$mod.banner[0].imgSrc%>" width="238" height="<%$mod.banner[0].height%>" title="<%$mod.banner[0].description%>"/>
							<span class="hotsiteside-app-layer"></span>
							<span class="hotsitesid-app-des" title="<%$mod.banner[0].description%>"><%$mod.banner[0].description%></span>
							<span class="hotsiteside-app-starbg">
								<span class="hotsiteside-app-star" style="width:<%$mod.banner[0].starNum/5*100%>%"></span>
							</span>
						</a>
						<a class="hotsiteside-app-mask" href="<%$mod.banner[0].landingpage%>" title="<%$mod.banner[0].description%>"></a>
					</div>
					<ul class="hotsiteside-app-small cf">
						<%foreach $mod.items as $item%>
							<li data-i="small<%$item@index+1%>">
								<a href="<%$item.landingpage%>" style="width:105px;height:108px;">
									<img src="<%$item.imgSrc%>" width="105" height="108" title="<%$item.description%>"/>
									<span class="hotsiteside-app-num"><%$item@index+1%></span>
									<span class="hotsiteside-app-layer"></span>
									<span class="hotsitesid-app-des" title="<%$item.description%>"><%$item.description%></span>
									<span class="hotsiteside-app-starbg">
										<span class="hotsiteside-app-star" style="width:<%$item.starNum/5*100%>%"></span>
									</span>
								</a>
								<a class="hotsiteside-app-mask" href="<%$item.landingpage%>" title="<%$item.description%>"></a>
							</li>
						<%/foreach%>
					</ul>
				<%else%>
					<div class="main-item-wrap<%if !empty($mod.useSlide)%> slide-wrap<%/if%>">
						<a href="<%$mod.banner[0].landingpage%>" class="main-item">
							<img src='<%$mod.banner[0].imgSrc%>' width="238" height="<%$mod.banner[0].height%>" data-i="0"/>
							<p class="item-slogon" data-i="0"><%$mod.banner[0].description%></p>
						</a>
					</div>
					<%foreach $mod.items as $item%>
					<div class="detail-item cf">
						<a href="<%$item.landingpage%>" class="item-pic-wrap"><img src='<%$item.imgSrc%>' width="68" height="68" data-index="<%$item@index%>"/></a>
						<a href="<%$item.landingpage%>" class="item-literal-wrap">
							<span class="item-title" data-index="<%$item@index%>"><%$item.name%></span>
							<span class="item-desc" data-index="<%$item@index%>"><%$item.description%></span>
						</a>
					</div>
					<%/foreach%>
				<%/if%>

					<a href="<%$mod.moreLandingpage%>" class="content-more"><%$mod.moreTitle%><i class="arrow_r">&rsaquo;</i></a>

				<%if !$mod@first%>
					</textarea style="display:none;">
				<%/if%>
			<%/if%>
		</div>
		<%/foreach%>
	</div>
</div>

<%script%>

	conf.hotsiteSide = {
		autoDuration: <%$body.hotsiteSide.conf.interval%>,
		scrollDuration: <%$body.hotsiteSide.conf.slideTime%>,
		dir: "<%$head.dir%>",
		datas: {},
		ajaxOptions : {}
	};

	<%foreach $body.hotsiteSide.mods as $mod%>
		<%if !empty($mod.useSlide)%>
			conf.hotsiteSide.datas["<%$mod.type%>"] = <%json_encode($mod.banner)%>;
		<%/if%>
		<%if !empty($mod.useAjax)%>
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"] = {};
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"].url = "<%$mod.url%>";
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"].api ="<%$mod.api%>";
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"].jsonp ="<%$mod.jsonp%>";
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"].updateTime = "<%$mod.updateTime%>";
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"].moreTitle ="<%$mod.moreTitle%>";
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"].moreLandingpage ="<%$mod.moreLandingpage%>";
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"].soccerTitle ="<%$mod.soccerTitle%>";
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"].moreSoccer ="<%$mod.moreSoccer%>";
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"].moreLink ="<%$mod.moreLink%>";
			conf.hotsiteSide.ajaxOptions["<%$mod.type%>"].week ="<%$mod.week%>";
		<%/if%>
	<%/foreach%>

	require.async("home:widget/hotsite-side/hotsite-side-async.js");
<%/script%>
