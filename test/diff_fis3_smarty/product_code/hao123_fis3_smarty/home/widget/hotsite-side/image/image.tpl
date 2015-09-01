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