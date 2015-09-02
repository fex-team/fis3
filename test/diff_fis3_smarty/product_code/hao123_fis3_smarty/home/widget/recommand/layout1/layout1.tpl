<%if $modIndex!=1%>
<textarea style="display:none;">
<%/if%>

<%if $head.dir=='ltr'%>
	<%require name="home:widget/recommand/layout1/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/recommand/layout1/rtl/rtl.css"%>
<%/if%>
	
<div class="layout1-big" data-i="big">
	<a href="<%$mod.banner[0].landingpage%>" class="big"  title="<%$mod.banner[0].description%>" data-sort="<%$mod.type%>-banner1">
		<img src="<%$mod.banner[0].imgSrc%>" width="238" height="106" style="display:block;" title="<%$mod.banner[0].description%>"/>
		<span class="layer"></span>
		<span class="des" title="<%$mod.banner[0].description%>"><%$mod.banner[0].description%></span>
		<span class="star-bg">
			<span class="star" style="width:<%$mod.banner[0].starNum/5*100%>%"></span>
		</span>
		<span class="mask"></span>
	</a>
	
</div>
<ul class="layout1-small cf">
	<%foreach $mod.items as $item%>
		<li data-i="small<%$item@index+1%>">
			<a href="<%$item.landingpage%>" title="<%$item.description%>" data-sort="<%$mod.type%>-small<%$item@index+1%>">
				<img src="<%$item.imgSrc%>" width="105" height="108" style="display:block;" title="<%$item.description%>"/>
				<span class="num"><%$item@index+1%></span>
				<span class="layer"></span>
				<span class="des" title="<%$item.description%>"><%$item.description%></span>
				<span class="star-bg">
					<span class="star" style="width:<%$item.starNum/5*100%>%"></span>
				</span>
				<span class="mask"></span>
			</a>
			
		</li>
	<%/foreach%>
</ul>

<a href="<%$mod.moreLandingpage%>" class="layout1-more" data-sort="<%$mod.type%>-more"><%$mod.moreTitle%><i class="arrow">&rsaquo;</i></a>

<%script%>
	conf = conf || {};
	conf.recommand = conf.recommand || {};
	conf.recommand.childModule = conf.recommand.childModule || {};
	conf.recommand.childModule.<%$mod.type%> = "false";
<%/script%>

<%if $modIndex!==1%>
</textarea>
<%/if%>