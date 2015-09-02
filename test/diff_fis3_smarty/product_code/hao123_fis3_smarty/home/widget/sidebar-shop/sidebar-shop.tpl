<%if $head.dir=="ltr"%>
	<%require name="home:widget/sidebar-shop/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/sidebar-shop/rtl/rtl.css"%>
<%/if%>
<div class="mod-sidebar-shop" id="sidebarShop" log-mod="sidebar-shop">
	<div class="shop-search cf">
		<form action="">
			<div class="shop-input-container cf">
				<i></i>
				<input name="shop-input" type="text" class="shop-input" autocomplete="off" />
			</div>
			<input type="button" class="shop-btn" value="" />
		</form>
	</div>
	<div class="shop-scroll-box">
		<div class="shop-content">
			<ul class="shop-items cf">
				<%foreach $body.sidebarShop.items as $item%>
				<li class="shop-list">
					<span class="shop-discount"><%$item.discount%></span>
					<span class="shop-discount-icon"></span>
					<a href="<%$item.link%>" class="img-container" data-sort="goods<%$item@index+1%>">
						<img src="<%$item.imgSrc%>" title="<%$item.name%>" alt="<%$item.name%>" />
					</a>
					<a href="<%$item.link%>" class="name-container" title="<%$item.name%>" data-sort="goods<%$item@index+1%>">
						<p class="shop-name"><%$item.name%></p>
					</a>
					<p class="shop-from text-overflow"><%$item.from%></p>
					<p class="original-price"><%$item.originalPrice%></p>
					<p class="current-price"><%$item.currentPrice%></p>
				</li>
				<%/foreach%>
			</ul>
			<h3 class="more-text"><%$body.sidebarShop.moreText%></h3>
			<ul class="more-links cf">
				<%foreach $body.sidebarShop.moreLinks as $moreLink%>
				<li class="seller">
					<a href="<%$moreLink.link%>" class="img-container" data-sort="link<%$moreLink@index+1%>">
						<img src="<%$moreLink.imgSrc%>" title="<%$moreLink.name%>" />
					</a>
					<a href="<%$moreLink.link%>" class="name-container" data-sort="link<%$moreLink@index+1%>">
						<span><%$moreLink.name%></span>
					</a>
				</li>
				<%/foreach%>
			</ul>
		</div>
	</div>
</div>
</div>

<%script%>
	conf.sidebarShop = {
		"id" : "sidebarShop",
		"searchUrl" : "<%$body.sidebarShop.searchUrl%>"
	};
	require.async( ["common:widget/ui/jquery/jquery.js", "home:widget/sidebar-shop/sidebar-shop-async.js"], function( $, sidebarShop ){
		sidebarShop();
	} );
<%/script%>