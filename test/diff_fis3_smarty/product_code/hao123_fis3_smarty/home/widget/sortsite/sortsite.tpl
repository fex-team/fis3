<%style%>
<%if $head.dir=='ltr'%>
	<%if !empty($body.embedlv2sortsite) && $body.embedlv2sortsite.isHidden !== "true"%>
		@import url(/widget/sortsite/ltr/ltr-sortsite-embedlv2.css?__inline");
	<%else%>
		@import url('/widget/sortsite/ltr/ltr.css?__inline');
	<%/if%>

<%else%> 
	<%if !empty($body.embedlv2sortsite) && $body.embedlv2sortsite.isHidden !== "true"%>
		@import url(/widget/sortsite/rtl/rtl-sortsite-embedlv2.css?__inline");
	<%else%>
		@import url('/widget/sortsite/rtl/rtl.css?__inline');
	<%/if%>
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%>
	<%require name="home:widget/sortsite/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/sortsite/rtl/rtl.css"%>
<%/if%>

	<%if !empty($body.coolSort.tabDescription)%>
		<div class="sortsites-tabs-container<%if !empty($head.sideBeLeft)%> s-mlm<%/if%>" log-mod="sortsites">
			<div class="bubble-like">	
					<span><%$body.coolSort.bubbleLike%></span>	
					<i></i>
				</div>
			<div class="sortsites-tabs">
				<span class="sortsites-tabs-description">
					<i></i>
					<%$body.coolSort.tabDescription%>
				</span>
				<ul class="tab-lists">
					<ul class="block_sep"></ul>
					<%foreach $body.coolSort.tabList as $listValue%>
						<li>
							<a href="javascript:void(0)" class="tab-item" item-index="<%$listValue.itemIndex%>"><%$listValue.sortName%></a>		
							<s class="sortsite_sep"></s>		
						</li>
					<%/foreach%>
				</ul>	
				<a class="sortsites-tabs-refresh" href="javascript:void(0)">
					<i></i>
					<span><%$body.coolSort.refreshDescription%></span>
				</a>
			</div>
		</div>
	<%/if%>	

	<div class="box-sort favsite-count <%if !empty($body.embedlv2sortsite) && $body.embedlv2sortsite.isHidden !== "true"%><%if $head.dir=='rtl' || !empty($head.sideBeLeft)%>s-mlm<%else%>s-mrm<%/if%><%/if%>" monkey="sortsites" <%if !empty($body.embedlv2sortsite.defaultShow) && $body.embedlv2sortsite.defaultShow !== "home"%>style="display:none;"<%/if%>>

		<%assign var=sortIndex value=-1%>
		<%assign var=logIndex value=0%>

		<%foreach $body.coolSort.list as $listValue%>
			<%if empty($listValue.isHidden)%>

				<%$logIndex = $logIndex +1%>
				<%if !empty($listValue.bigSize)%>
					<%$sortIndex = $sortIndex + 2%>
				<%else%>
					<%$sortIndex = $sortIndex + 1%>
				<%/if%>

				<div class="<%if empty($listValue.bigSize)%>l-g1-4<%else%>l-g1-2 box-onesort-big<%/if%>">

					<dl class="<%if !empty($body.embedlv2sortsite) && $body.embedlv2sortsite.isHidden !== "true"%><%else%><%if $head.dir=='rtl' || !empty($head.sideBeLeft)%>s-mlm<%else%>s-mrm<%/if%><%/if%> s-mtm s-pbs sortsite" log-mod="sortsites" log-index="<%$logIndex%>">
						<%if $sortIndex > 7%>
						<textarea class="g-area-lazyload" style="visibility: hidden;">
						<%/if%>
						<dt class="s-mbs<%if !empty($listValue.class)%> <%$listValue.class%><%/if%><%if $sortIndex%4 == 3%><%if $head.dir=="rtl"%> dt-left<%else%> dt-right<%/if%><%/if%>" <%if !empty($listValue.apiCategory)%>apiCategory="<%$listValue.apiCategory%>" apiNum = "<%$listValue.num%>"<%/if%>>
							<a href="<%$listValue.sortUrl%><%*if !empty($root.urlparam)%>?<%http_build_query($root.urlparam)%><%/if*%>"<%if !empty($listValue.style)%> style="<%$listValue.style%>"<%/if%> <%if !empty($listValue.offerid)%> log-oid="<%$listValue.offerid%>"<%/if%> log-index="0">
								<i class="more-content">&gt;</i>
								<%if !empty($listValue.sortIco)%>
								<i class="i-pre-sprites <%$listValue.sortIco%>"<%if !empty($listValue.SortIconUrl)%> style="background:url(<%$listValue.SortIconUrl%>) no-repeat left top"<%/if%>></i>
								<%/if%>
								<%$listValue.sortName%>
							</a>
						</dt>

						<%foreach $listValue.links as $value%>
							<dd class="<%if !empty($value.class)%><%$value.class%><%/if%><%if $sortIndex%4 == 0 || (!empty($listValue.bigSize) && $sortIndex%4 == 1)%><%if $head.dir=="rtl"%> dd-right<%else%> dd-left<%/if%><%/if%>">
								<a href="<%$value.url%>"<%if !empty($value.style) || !empty($value.styles)%> class="have-pre-icon" style="<%if !empty($body.embedlv2sortsite) && $body.embedlv2sortsite.isHidden !== "true"%><%$value.styles%><%else%><%$value.style%><%/if%>"<%/if%> log-index="<%$value@iteration%>" <%if !empty($value.offerid)%> log-oid="<%$value.offerid%>"<%/if%>>
									<span class="link-name"<%if $head.dir=='rtl'%> dir="rtl"<%/if%>><%$value.name%></span>
									<%if !empty($value.ico)%>
									<i class="<%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%>></i>
									<%/if%>
									<%if !empty($value.confAbleIcoType)%>
										<span class="<%$value.confAbleIcoType%> cf">
											<em></em><span><%$value.confAbleIcoText%></span><i></i>
										</span>
									<%/if%>
									<%if !empty($listValue.bigSize)%>
										<span class="link-description"<%if $head.dir=='rtl'%> dir="rtl"<%/if%>><%$value.description%></span>
									<%/if%>
								</a>
							</dd>
						<%/foreach%>
					<%if $sortIndex > 7%>
						</textarea>
					<%/if%>
					</dl>
					<%if $sortIndex > 7%>
						<textarea class="g-area-lazyload" style="visibility: hidden;">
					<%/if%>
					<%if !empty($listValue.bigSize)%>
						<a href="<%$listValue.bigSortIconLangdingpage%>" class="hist-block_remove i-sort-big<%if !empty($listValue.bigSortIconClass)%> <%$listValue.bigSortIconClass%>"<%else%>" style="background-image:url(<%$listValue.bigSortIconUrl%>);width:<%$listValue.bigSortIconWidth%>px;height:<%$listValue.bigSortIconHeight%>px;"<%/if%>>
						</a>
					<%/if%>

					<%if $sortIndex > 7%>
						</textarea>
					<%/if%>

				</div>
			<%/if%>
		<%/foreach%>

	</div>

	<%script%>
		conf.sortsite = {
			show:"<%$body.coolSort.showBubble%>",
			paddingTop:"<%$body.coolSort.paddingTop%>",
			paddingTop1:"<%$body.coolSort.paddingTop1%>",
			newHeader:"<%$body.headerTest.widget%>",
			isCeiling:"<%$body.headerTest.isCeiling%>",
			ceilingMore:"<%$body.headerTest.ceilingMore%>",
			apiIntervention:"<%$body.coolSort.apiIntervention%>" || ""
		};
		require.async('home:widget/sortsite/sortsite-async.js');
	<%/script%>
