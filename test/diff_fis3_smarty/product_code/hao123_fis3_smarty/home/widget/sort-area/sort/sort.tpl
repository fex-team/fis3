<%style%>
	<%if $head.dir=='ltr'%>
		<%*****如果是tab的形式就引入新版样式*******%>
		<%if !empty($body.sortAreaTab) && empty($body.sortAreaTab.isHidden)%>
			@import url(/widget/sort-area/sort/ltr/ltr-tab.css?__inline");
		<%*****如果是没有tab的形式就引入老版样式*******%>
		<%else%>
			@import url('/widget/sort-area/sort/ltr/ltr.css?__inline');
		<%/if%>
	<%else%>
		<%if !empty($body.sortAreaTab) && empty($body.sortAreaTab.isHidden)%>
			@import url(/widget/sort-area/sort/rtl/rtl-tab.css?__inline");
		<%else%>
			@import url('/widget/sort-area/sort/rtl/rtl.css?__inline');
		<%/if%>
	<%/if%>
<%/style%>

<%if $head.dir=='ltr'%>
	<%require name="home:widget/sort-area/sort/ltr/ltr.more.css"%>
<%else%>
	<%require name="home:widget/sort-area/sort/rtl/rtl.more.css"%>
<%/if%>
	
<div class="box-sort favsite-count" monkey="sortsites">

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
		<dl class="<%if !empty($body.sortAreaTab) && $body.sortAreaTab.isHidden !== "true"%><%else%><%if $head.dir=='rtl'%>s-mlm<%else%>s-mrm<%/if%><%/if%> s-mtm s-pbs sortsite" log-mod="sortsites" log-index="<%$logIndex%>" >
			<%if $sortIndex > 7%>
			<textarea class="g-area-lazyload" style="visibility: hidden;">
				<%/if%>
				<dt class="s-mbs<%if !empty($listValue.class)%> <%$listValue.class%><%/if%><%if $sortIndex%4 == 3%><%if $head.dir=="rtl"%> dt-left<%else%> dt-right<%/if%><%/if%>" <%if !empty($listValue.apiCategory)%>apiCategory="<%$listValue.apiCategory%>" apiNum = "<%$listValue.num%>"<%/if%>>
					<a href="<%$listValue.sortUrl%><%*if !empty($root.urlparam)%>?<%http_build_query($root.urlparam)%><%/if*%>"<%if !empty($listValue.style)%> style="<%$listValue.style%>"<%/if%> <%if !empty($listValue.offerid)%> log-oid="<%$listValue.offerid%>"<%/if%> log-index="0" data-sort="<%$logIndex%>"<%if $listValue.isad=="1"%> log-isad="1"<%/if%>>
						<i class="more-content">&gt;</i>
						<%if !empty($listValue.sortIco)%>
						<i class="i-pre-sprites <%$listValue.sortIco%>"<%if !empty($listValue.SortIconUrl)%> style="background:url(<%$listValue.SortIconUrl%>) no-repeat left top"<%/if%>></i>
						<%/if%>
						<%$listValue.sortName%>
					</a>
				</dt>
				<%foreach $listValue.links as $value%>
				<dd class="<%if !empty($value.class)%><%$value.class%><%/if%><%if $sortIndex%4 == 0 || (!empty($listValue.bigSize) && $sortIndex%4 == 1)%><%if $head.dir=="rtl"%> dd-right<%else%> dd-left<%/if%><%/if%>">
					<a href="<%$value.url%>"<%if !empty($value.style) || !empty($value.styles)%> class="have-pre-icon" style="<%if !empty($body.sortAreaTab) && $body.sortAreaTab.isHidden !== "true"%><%$value.styles%><%else%><%$value.style%><%/if%>"<%/if%> log-index="<%$value@iteration%>" <%if !empty($value.offerid)%> log-oid="<%$value.offerid%>"<%/if%><%if $value.isad=="1"%>log-isad="1"<%/if%>>
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
			<a href="<%$listValue.bigSortIconLangdingpage%>" class="hist-block_remove i-sort-big<%if !empty($listValue.bigSortIconClass)%> <%$listValue.bigSortIconClass%>"<%else%>" style="background-image:url(<%$listValue.bigSortIconUrl%>);width:<%$listValue.bigSortIconWidth%>px;height:<%$listValue.bigSortIconHeight%>px;"<%/if%>></a>
			<%/if%>
		<%if $sortIndex > 7%>
		</textarea>
		<%/if%>
		</div>
	<%/if%>
	<%/foreach%>
</div>

<%script%>
	conf.sortArea = conf.sortArea || {};
	conf.sortArea["apiIntervention"] = "<%$body.coolSort.apiIntervention%>" || "";
	require.async('home:widget/sort-area/sort/sort-async.js');

	conf.sortArea.clildModuleReady = conf.sortArea.clildModuleReady || {};
	conf.sortArea.clildModuleReady["<%$tab.id%>"] = "true";
<%/script%>
