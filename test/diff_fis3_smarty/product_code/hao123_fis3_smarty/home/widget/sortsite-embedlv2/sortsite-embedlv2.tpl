<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/sortsite-embedlv2/ltr/ltr.css"%> <%else%> <%require name="home:widget/sortsite-embedlv2/rtl/rtl.css"%> <%/if%>
	<div class="box-sort favsite-count" monkey="sortsites">

		<%assign var=sortIndex value=-1%>
		<%assign var=logIndex value=-1%>

		<%foreach $body.coolSort.list as $listValue%>
			<%if empty($listValue.isHidden)%>

				<%$logIndex = $logIndex +1%>
				<%if !empty($listValue.bigSize)%>
					<%$sortIndex = $sortIndex + 2%>
				<%else%>
					<%$sortIndex = $sortIndex + 1%>
				<%/if%>

				<div class="<%if empty($listValue.bigSize)%>l-g1-4<%else%>l-g1-2 box-onesort-big<%/if%>">

					<%if $sortIndex > 7%>
						<textarea class="g-area-lazyload" style="visibility: hidden;">
					<%/if%>

					<dl class="<%if $head.dir=='rtl'%>s-mlm<%else%>s-mrm<%/if%> s-mtm s-pbs sortsite" log-mod="sortsites" log-index="<%$logIndex%>">
						<dt class="s-mbs<%if !empty($listValue.class)%> <%$listValue.class%><%/if%><%if $sortIndex%4 == 3%> dt-left<%/if%>">
							<a href="<%$listValue.sortUrl%><%*if !empty($root.urlparam)%>?<%http_build_query($root.urlparam)%><%/if*%>"<%if !empty($listValue.style)%> style="<%$listValue.style%>"<%/if%> <%if !empty($listValue.offerid)%> log-oid="<%$listValue.offerid%>"<%/if%>  log-index="0">
								<span>&gt;</span>
								<%if !empty($listValue.sortIco)%>
								<i class="i-pre-sprites <%$listValue.sortIco%>"<%if !empty($listValue.SortIconUrl)%> style="background:url(<%$listValue.SortIconUrl%>) no-repeat left top"<%/if%>></i>
								<%/if%>
								<%$listValue.sortName%>
							</a>
						</dt>

						<%foreach $listValue.links as $value%>
							<dd class="<%if !empty($value.class)%><%$value.class%><%/if%><%if $sortIndex%4 == 0%> dd-right<%/if%>">
								<a href="<%$value.url%>"<%if !empty($value.style) || !empty($value.styles)%> class="have-pre-icon" style="<%if !empty($value.styles)%><%$value.styles%><%else%><%$value.style%><%/if%>"<%/if%> log-index="<%$value@iteration%>" <%if !empty($value.offerid)%> log-oid="<%$value.offerid%>"<%/if%>>
									<span class="link-name"<%if $head.dir=='rtl'%> dir="rtl"<%/if%>><%$value.name%></span>
									<%if !empty($value.ico)%>
									<i class="<%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%>></i>
									<%/if%>
									<%if !empty($listValue.bigSize)%>
										<span class="link-description"<%if $head.dir=='rtl'%> dir="rtl"<%/if%>><%$value.description%></span>
									<%/if%>
								</a>
							</dd>
						<%/foreach%>

					</dl>

					<%if !empty($listValue.bigSize)%>
						<i class="i-sort-big<%if !empty($listValue.bigSortIcon.class)%> <%$listValue.bigSortIcon.class%>"<%else%>" style="background-image:url(<%$listValue.bigSortIcon.url%>);width:<%$listValue.bigSortIcon.width%>px;height:<%$listValue.bigSortIcon.height%>px;"<%/if%>>
						</i>
					<%/if%>

					<%if $sortIndex > 7%>
						</textarea>
					<%/if%>

				</div>
			<%/if%>
		<%/foreach%>

	</div>
	<*script*>
		require.async('home:widget/sortsite-embedlv2/sortsite-embedlv2-async.js');
	<*/script*>
