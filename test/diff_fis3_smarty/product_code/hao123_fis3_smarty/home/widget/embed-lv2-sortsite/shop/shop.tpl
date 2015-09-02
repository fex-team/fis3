<style type="text/css">
	/*recommond*/
	.embed-shop-recommond{
		background-color: #f2f3f5;
		position: relative;
		overflow: hidden;
	}
	.embed-shop-recommond .nav-item{
		float: left;
	}
	.embed-shop-recommond .nav-item-list{
		position: relative;
	}
	.embed-shop-recommond-con{
		margin: 18px 30px 24px;
		overflow: hidden;
	}
	.embed-shop-recommond-list{
		padding: 1px;
		margin-left: 20px;
		float: left;
	}
	.embed-shop-recommond-list.first{
		margin-left: 0;
	}
	.embed-shop-recommond-list a{
		display: block;
		position: relative;
	}
	.embed-shop-recommond-list a:hover{
		outline: 1px solid #34b888;
	}
	.embed-shop-layer{
		display: block;
		position: absolute;
		width: 135px;
		height: 40px;
		background-color: #fff;
		opacity: 0.8;
		filter:alpha(opacity=80);
		bottom: 5px;
		left: 50%;
		margin-left: -68px;
	}
	.embed-shop-item-name, .embedv-shop-item-price{
		position: absolute;
		left: 13px;
	}
	.embed-shop-item-name{
		color: #444;
		white-space: nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
		width: 126px;
		height: 15px;
		bottom: 22px;
	}
	.embedv-shop-item-price{
		color: #212121;
		bottom: 7px;
		font-weight: bold;
	}
	.embed-shop-recommond-con .switch{
		left: 50%;
		margin-left: -100px;
		bottom: 10px;
		position: absolute;
	}
	.embed-shop-recommond-con .switch span{
		display: inline-block;
		*display: inline;
		*zoom:1;
		width: 60px;
		height: 3px;
		margin-left: 10px;
		background-color: #ccc;
		cursor: pointer;
	}
	.embed-shop-recommond-con .switch .switch-item-current{
		background-color: #00af74;
	}
	.embed-shop-recommond .ctrl span{
		display: block;
		position: absolute;
		width: 12px;
		height: 26px;
		color: #fff;
		background-color: #34b888;
		border: 1px solid #31ad80;
		text-align: center;
		line-height: 26px;
		top: 50%;
		margin-top: -13px;
		cursor: pointer;
		font-weight: bold;
	}
	.embed-shop-recommond .ctrl span:hover{
		background-color: #26a677;
		border: 1px solid #19996a;
	}
	.embed-shop-recommond .ctrl .arrow-prev{
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
		left: 0;

	}
	.embed-shop-recommond .ctrl .arrow-next{
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		right: 0;
	}

	/*nav*/
	.embed-shop-title{
		float: left;
		font-weight: bold;
		margin-right:10px;
		line-height: 22px;
	}
	.embed-shop-time{
		color: #999;
		float: right;
	}
	.embed-shop-nav{
		margin: 10px 20px 0px;
		padding-bottom: 5px;
		border-bottom: 1px solid #e6e7e8;
	}
	.embed-shop-nav ul{
		float: left;
	}
	.embed-shop-nav-list{
		float: left;
		
	}
	.embed-shop-nav-list a{
		color: #1aad73;
		display: inline-block;
		*display: inline;
		*zoom:1;
		line-height: 22px;
		padding: 0 5px;
		font-weight: bold;
		border-radius: 3px;
	}

	.embed-shop-nav-list span{
		padding:0 5px;
		color: #e2e2e2;
	}
	.embed-shop-nav-list a:hover{
		background-color: #e7e7e7;
	}
	.embed-shop-nav-list a.current{
		background-color: #e7e7e7;
		cursor: default;
		color: #666;
	}
	/*sort*/
	.embed-shop-sort{
		min-height: 610px;
	}
	.embed-shop-sort-item{
		display: none;
		padding: 10px 10px 0 10px;
	}
	.embed-shop-sort-list{
		float: left;
		margin-left: 10px;
		margin-bottom: 25px;
	}
	.embed-shop-sort-list a{
		display: block;
		position: relative;
	}
	.embed-shop-sort-list a:hover{
		outline: 1px solid #1aad73;
	}
	.embed-shop-list-icon{
		position: absolute;
		display: block;
		width: 12px;
		height: 12px;
		background-color: #1aad73;
		color: #fff;
		text-align: center;
		line-height: 14px;
		left: 0;
		top: 0;
		font-size: 12px;
	}
	.embed-shop-list-icon.special{
		width: 15px;
		height: 15px;
		line-height: 19px;
		background: url(/resource/jp/hometab/list-number-bg.png) no-repeat;
	}
	.embed-shop-list-name, .embed-shop-list-price{
		width: 126px;
		color: #444;
		white-space: nowrap;
		overflow: hidden;
		text-overflow:ellipsis;
	}
	.embed-shop-list-name{
		margin-top: 10px;
	}
	.embed-shop-list-name a:hover{
		text-decoration: underline;
	}
	.embed-shop-list-price{
		font-weight: bold;
		margin-top: 7px;
	}
	#embed-shop-loading{
		visibility: visible !important;
		text-align: center;
	}
	#embedShopSort .loading{
		margin-top: 80px;
		width: 45px;
		height: 44px;
	}
	#embed-shop-loading .loading-desc{
		font-size: 16px;
		font-weight: bold;
		margin-top: 10px;
	}
</style>
<div id="embed-iframe-shop">
	<div class="embed-shop-recommond" id="embedShopRecommond">
		<div class="embed-shop-recommond-con">

		</div>
	</div>
	<div class="embed-shop-nav cf" id="embedShopNav">
		
	</div>
	<div class="embed-shop-sort" id="embedShopSort">
		<div style="visibility: hidden; display: block;" id="embed-shop-loading">
			<img src="/static/home/widget/embed-lv2-sortsite/img/loading.gif" class="loading">
		</div>
	</div>
</div>

<%script%>
	
	conf.embedlv2 = {
		loadingTime: <%$body.embedlv2sortsite.loadingTime|default:'2500'%>,
		defaultShow:"<%$body.embedlv2sortsite.defaultShow%>",
		navData: {}
	};

	<%foreach $body.embedlv2sortsite.navData as $navItem%>
		conf.embedlv2.navData["<%$navItem.id%>"] = <%json_encode($navItem)%>;
	<%/foreach%>

	conf.embedShopSortsite = {
		slideDir : "<%$body.embedlv2sortsite.shopData.slideDir%>",
		sortName : "<%$body.embedlv2sortsite.shopData.sortName%>",
		autoDuration : "<%$body.embedlv2sortsite.shopData.autoDuration%>",
		scrollDuration : "<%$body.embedlv2sortsite.shopData.scrollDuration%>",
		defaultShow : "<%$body.embedlv2sortsite.shopData.defaultShow%>",
		character : "<%$body.embedlv2sortsite.shopData.character%>",
		hour : "<%$body.embedlv2sortsite.shopData.hour%>",
		minute : "<%$body.embedlv2sortsite.shopData.minute%>",
		second : "<%$body.embedlv2sortsite.shopData.second%>",
		offsetTimeText : "<%$body.embedlv2sortsite.shopData.offsetTimeText%>",
		noLv2 : "<%$body.embedlv2sortsite.shopData.noLv2%>",
		sortItem : {}
	};
	<%foreach $body.embedlv2sortsite.shopData.sortItem as $sortItem%>
		conf.embedShopSortsite.sortItem["<%$sortItem.id%>"] = <%json_encode($sortItem)%>;
	<%/foreach%>

	require.async("home:widget/embed-lv2-sortsite/shop/shop.js");
	

<%/script%>