<style>
	.side-mod-preload-promote{
		border:1px solid #e3e5e6;
		border-bottom:1px solid #d7d8d9;
		background: #f5f7f7;
	}
	.side-mod-preload-promote > *{
		visibility: hidden;
	}
</style>

<%if $head.dir=='ltr'%> <%require name="home:widget/promote/ltr/ltr.css"%> <%else%> <%require name="home:widget/promote/rtl/rtl.css"%> <%/if%>

<dl class="mod-promote" id="sidePromote" monkey="sidePromote" log-mod="promote">
	<%foreach $body.promote.mods as $mod%>
		<dt class="gradient-bg-silver unselect promote-tab promote-tab-<%$mod.type%><%if $mod@first%> cur<%/if%>" data-type="<%$mod.type%>" data-slide="<%$mod.useSlide%>" log-mod="promote-<%$mod.type%>">
			<i class="promote-tab-icon"></i><%$mod.title%><i class="triangle"></i>
		</dt>
		<dd class="promote_content promote-<%$mod.type%><%if !$mod@first%> hide<%/if%>" log-mod="promote-<%$mod.type%>">

			<%if !$mod@first%>
			<textarea>
			<%/if%>

			<div class="main-item-wrap<%if !empty($mod.useSlide)%> slide-wrap<%/if%>">
				<a href="<%$mod.banner[0].landingpage%>" class="main-item" title="<%if !empty($mod.banner[0].name)%><%$mod.banner[0].name%><%elseif !empty($mod.banner[0].description)%><%$mod.banner[0].description%><%/if%>">
					<img src='<%$mod.banner[0].imgSrc%>' style="height:<%$mod.banner[0].height%>px" data-i="0"/>
					<%if !empty($mod.banner[0].description)%>
						<p class="item-slogon" data-i="0">
							<%if $mod.type == "video"%>
								<%if !empty($mod.banner[0].name)%><span class="item-title" data-index="<%$item@index%>"><%$mod.banner[0].name%></span><%/if%>
								<span class="item-desc" data-index="<%$item@index%>"><%$mod.banner[0].description%></span>
							<%else%>
								<%$mod.banner[0].description%>
							<%/if%>
						</p>
					<%/if%>
					<%if $mod.type == "video"%><i class="icon-video"></i><%/if%>
				</a>
			</div>

			<%if $mod.type == "image"%>

				<div class="detail-item-wrap">
					<%foreach $mod.items as $item%>
					<a href="<%$item.landingpage%>"<%if !empty($item.description)%> title="<%$item.description%>"<%/if%>>
						<img src="<%$item.imgSrc%>" width="105" height="63">
						<%if !empty($item.description)%><p class="item-slogon" data-i="0" data-index="<%$item@index%>"><%$item.description%></p><%/if%>
					</a>
					<%/foreach%>
				</div>

			<%else%>

				<%foreach $mod.items as $item%>
					<a href="<%$item.landingpage%>" class="detail-item<%if $item@first%> bd-tn<%/if%>" title="<%if !empty($item.name)%><%$item.name%><%elseif !empty($item.description)%><%$item.description%><%/if%>">
						<img src='<%$item.imgSrc%>' class="item-pic-wrap" width="50" height="35" data-index="<%$item@index%>"/>
						<span class="item-literal-wrap">
							<%if !empty($item.name)%><span class="item-title" data-index="<%$item@index%>"><%$item.name%></span><%/if%>
							<%if !empty($item.description)%><span class="item-desc" data-index="<%$item@index%>"><%$item.description%></span><%/if%>
						</span>
						<%if $mod.type == "video"%><i class="icon-video"></i><%/if%>
					</a>
				<%/foreach%>

			<%/if%>

			<a href="<%$mod.moreLandingpage%>" class="content-more"><%$mod.moreTitle%><i class="arrow_r">&rsaquo;</i></a>

			<%if !$mod@first%>
			</textarea>
			<%/if%>
		</dd>
	<%/foreach%>
</dl>

<%script%>
	var slideMods = {};
	<%foreach $body.promote.mods as $mod%>
		<%if !empty($mod.useSlide)%>
			slideMods["<%$mod.type%>"] = <%json_encode($mod.banner)%>;
		<%/if%>
	<%/foreach%>
	conf.promote = {
		autoDuration: <%$body.promote.conf.interval%>,
		scrollDuration: <%$body.promote.conf.slideTime%>,
		dir: "<%$head.dir%>",
		datas: slideMods
	};
	require.async("home:widget/promote/promote-async.js");
<%/script%>
