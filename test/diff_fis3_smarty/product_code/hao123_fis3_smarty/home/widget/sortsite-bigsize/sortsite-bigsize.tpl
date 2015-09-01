

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/sortsite-bigsize/ltr/ltr.css"%> <%else%> <%require name="home:widget/sortsite-bigsize/rtl/rtl.css"%> <%/if%>
		<div class="sortsites-tabs-container" log-mod="sortsites">
			<div class="bubble-like">	
					<%$body.coolSortTest.bubbleLike%>	
					<i></i>
				</div>
			<div class="sortsites-tabs">
				<span class="sortsites-tabs-description">
					<i></i>
					<%$body.coolSortTest.tabDescription%>
				</span>
				<ul class="tab-lists">
					<ul class="block_sep"></ul>
					<%foreach $body.coolSortTest.tabList as $listValue%>
						<li>
							<a href="javascript:void(0)" class="tab-item" item-index="<%$listValue.itemIndex%>"><%$listValue.sortName%></a>		
							<s class="sortsite_sep"></s>		
						</li>
					<%/foreach%>
				</ul>	
				<a class="sortsites-tabs-refresh" href="javascript:void(0)">
					<i></i>
					<%$body.coolSortTest.refreshDescription%>
				</a>
			</div>
		</div>
		<div class="box-sort favsite-count" monkey="sortsites">	
		<%foreach $body.coolSortTest.list as $listValue%>
			<div class="l-g1-2 box-onesort-big">
				<dl class="<%if $head.dir=='rtl'%>s-mlm<%else%>s-mrm<%/if%> s-mtm s-pbs sortsite" log-mod="sortsites" log-index="<%$listValue@iteration%>">
					<dt class="s-mbs<%if !empty($listValue.class)%> <%$listValue.class%><%/if%>">
						<a href="<%$listValue.sortUrl%><%*if !empty($root.urlparam)%>?<%http_build_query($root.urlparam)%><%/if*%>"<%if !empty($listValue.style)%> style="<%$listValue.style%>"<%/if%> <%if !empty($listValue.offerid)%> log-oid="<%$listValue.offerid%>"<%/if%>   log-index="0" ><span>&gt;</span><%if !empty($listValue.sortIco)%><i class="i-pre-sprites <%$listValue.sortIco%>"<%if !empty($listValue.SortIconUrl)%> style="background:url(<%$listValue.SortIconUrl%>) no-repeat left top"<%/if%>></i><%/if%><%$listValue.sortName%></a>
					</dt>
					<%foreach $listValue.links as $value%>
						<dd<%if !empty($value.class)%> class="<%$value.class%>"<%/if%>>
							<a href="<%$value.url%>"<%if !empty($value.style)%> style="<%$value.style%>"<%/if%> log-index="<%$value@iteration%>" <%if !empty($value.offerid)%> log-oid="<%$value.offerid%>"<%/if%>  ><%$value.name%><%if !empty($value.ico)%><i class="<%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%>></i><%/if%><span><%$value.description%></span></a>
						</dd>
					<%/foreach%>
				</dl>
				<i class="i-sort-big <%$listValue.bigSortIcon%>"></i>
			</div>
		<%/foreach%>
	</div>
	<%script%>
		require.async('home:widget/sortsite-bigsize/sortsite-bigsize.js');
	<%/script%>
