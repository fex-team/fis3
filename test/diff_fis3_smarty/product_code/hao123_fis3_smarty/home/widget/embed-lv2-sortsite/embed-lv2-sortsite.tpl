	<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/embed-lv2-sortsite/ltr/ltr.css"%> <%else%> <%require name="home:widget/embed-lv2-sortsite/rtl/rtl.css"%> <%/if%>
	
	<div log-mod="embedlv2" id="embedlv2" style="visibility:hidden;" class="<%if $head.dir=='rtl' || !empty($head.sideBeLeft)%>s-mlm<%else%>s-mrm<%/if%>">
		<ul id="embed-iframe-nav" class="cf">
			<li class="nav-item home current" data-url="/" data-id="home" style="width:<%$body.embedlv2sortsite.navHomeWidth|default:9%>%; *width:<%($body.embedlv2sortsite.navHomeWidth|default:9)-0.2%>%">
				<a href="#index" class="home-link" target="_self"><i <%if !empty($body.embedlv2sortsite.navHomeWidth)%>style="<%if $head.dir=="ltr"%>margin-right:10px;<%else%>margin-left:10px;<%/if%>"<%/if%>></i><span><%$body.embedlv2sortsite.navHomeName%></span></a>
				<span class="border"></span>
				<em></em>
			</li>
			<%foreach $body.embedlv2sortsite.navData as $navItem%>
				<li class="nav-item <%$navItem.id%> <%if $navItem@last%>last-nav<%/if%>"  data-url='<%$navItem.url%>' data-id="<%$navItem.id%>" style="width:<%(100-$body.embedlv2sortsite.navHomeWidth|default:9)/$navItem@total%>%;">
					<a href="#<%$navItem.id%>" class="lv2-link" target="_self">
						<i <%if !empty($navItem.spcIco)%>style="<%$navItem.spcIco%> width:42px; height:42px; position:absolute; top:-14px; z-index:3;"<%/if%>></i><span <%if !empty($navItem.spcIco)%>style="<%if $head.dir=="ltr"%>margin-left: 42px;<%else%>margin-right: 42px;<%/if%>"<%/if%>><%$navItem.name%></span>
					</a>
					<span class="border"></span>
					<em></em>
				</li>
			<%/foreach%>
		</ul>
	</div>
	<div id="embed-iframe-wrapper" <%if empty($body.embedlv2sortsite.defaultShow) || $body.embedlv2sortsite.defaultShow === "home"%>style="display:none;"<%/if%> class="<%if $head.dir=='rtl' || !empty($head.sideBeLeft)%>s-mlm<%else%>s-mrm<%/if%>">
		<div id="embed-iframe-loading" style="visibility:hidden;">
			<img class="loading" src="./img/loading.gif" />
			<div class="loading-desc">
				<%$body.embedlv2sortsite.loadingText%>
			</div>
		</div>
	</div>
	<%script%>

		conf.embedlv2 = {
			loadingTime: <%$body.embedlv2sortsite.loadingTime|default:'2500'%>,
			defaultShow:"<%$body.embedlv2sortsite.defaultShow%>",
			navData: {},
			newHeader : "<%$body.headerTest.widget%>",
			isCeiling : "<%$body.headerTest.isCeiling%>",
			ceilingMore:"<%$body.headerTest.ceilingMore%>",
			paddingTop : "<%$body.embedlv2sortsite.paddingTop%>",
			paddingTop1 : "<%$body.embedlv2sortsite.paddingTop1%>",
			spcTn : "<%$body.embedlv2sortsite.spcTn%>",
			spcTnDefaultShow : "<%$body.embedlv2sortsite.spcTnDefaultShow%>"
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

		require.async('home:widget/embed-lv2-sortsite/embed-lv2-sortsite-async.js');

	<%/script%>

