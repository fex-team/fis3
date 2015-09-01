<%if $modIndex!=1%>
<textarea style="display:none;">
<%/if%>

<%if $head.dir=='ltr'%>
	<%require name="home:widget/recommand/layout3/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/recommand/layout3/rtl/rtl.css"%>
<%/if%>

<%if !empty($mod.subTpl)%>
<div class="<%$mod.subTpl%>">
<%/if%>
	<div class="layout3-main">
		<a href="<%$mod.banner[0].landingpage%>" class="main-item" data-sort="<%$mod.type%>-banner1"<%if !empty($mod.subTpl)%> title="<%$mod.banner[0].description%>"<%/if%>>
			<img src='<%$mod.banner[0].imgSrc%>'/>
			<span class="des-bg"></span>
			<p class="des">
				<%if !empty($mod.banner[0].icon)%><i class="i-<%$mod.banner[0].icon%>"></i><%/if%>
				<%$mod.banner[0].description%>
			</p>
			<%if !empty($mod.banner[0].starNum)%>
				<span class="star-bg">
					<span class="star" style="width:<%$mod.banner[0].starNum/5*100%>%"></span>
				</span>
			<%/if%>
		</a>
	</div>
	<%foreach $mod.items as $item%>
	<%if empty($item.isHidden)%>
		<div class="layout3-detail cf">
			<a href="<%$item.landingpage%>" class="detail-pic-wrap" data-sort="<%$mod.type%>-small-img<%$item@index+1%>">
				<%if !empty($mod.subTpl)%><span class="num"><%$item@index+1%></span><%/if%>
				<img src='<%$item.imgSrc%>'/>
			</a>
			<a href="<%$item.landingpage%>" class="detail-des-wrap" data-sort="<%$mod.type%>-small-text<%$item@index+1%>">
				<span class="title"><%$item.name%></span>
				<%if !empty($item.starNum)%>
					<span class="star-bg">
						<span class="star" style="width:<%$item.starNum/5*100%>%"></span>
					</span>
				<%/if%>
				<span class="desc"><%$item.description%></span>
			</a>
		</div>
	<%/if%>
	<%/foreach%>
<%if !empty($mod.subTpl)%>
</div>
<%/if%>
<%if !empty($mod.moreTitle) && !empty($mod.moreLandingpage)%>
	<a href="<%$mod.moreLandingpage%>" class="layout3-more" data-sort="<%$mod.type%>-more"><%$mod.moreTitle%><i class="arrow">&rsaquo;</i></a>
<%/if%>

<%script%>
	conf = conf || {};
	conf.recommand = conf.recommand || {};
	conf.recommand.childModule = conf.recommand.childModule || {};
	conf.recommand.childModule.<%$mod.type%> = "false";
<%/script%>

<%if $modIndex!==1%>
</textarea>
<%/if%>
