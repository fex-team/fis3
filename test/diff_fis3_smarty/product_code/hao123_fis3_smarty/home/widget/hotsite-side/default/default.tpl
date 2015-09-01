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