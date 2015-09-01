

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/sortsite/ltr/ltr.css"%> <%else%> <%require name="home:widget/sortsite/rtl/rtl.css"%> <%/if%>


	<div class="box-sort favsite-count" monkey="sortsites">
		<%foreach $body.coolSort.list as $listValue%>
			<div class="l-g1-4">
				<%if $listValue@index > 7%>
					<textarea class="g-area-lazyload hide">
				<%/if%>
				<dl class="<%if $head.dir=='rtl'%>s-mlm<%else%>s-mrm<%/if%> s-mtm s-pbs sortsite" log-mod="sortsite" log-index="<%$listValue@iteration%>">
					<dt class="s-mbs<%if !empty($listValue.class)%> <%$listValue.class%><%/if%>">
						<a href="<%$listValue.sortUrl%><%*if !empty($root.urlparam)%>?<%http_build_query($root.urlparam)%><%/if*%>"<%if !empty($listValue.style)%> style="<%$listValue.style%>"<%/if%>><i class="arrow_r"></i><%if !empty($listValue.sortIco)%><i class="i-pre-sprites <%$listValue.sortIco%>"<%if !empty($listValue.SortIconUrl)%> style="background:url(<%$listValue.SortIconUrl%>) no-repeat left top"<%/if%>></i><%/if%><%$listValue.sortName%></a>
					</dt>
					<%foreach $listValue.links as $value%>
						<dd<%if !empty($value.class)%> class="<%$value.class%>"<%/if%>>
							<a href="<%$value.url%>"<%if !empty($value.style)%> style="<%$value.style%>"<%/if%> log-index="<%$value@iteration%>"><%$value.name%><%if !empty($value.ico)%><i class="<%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%>></i><%/if%></a>
						</dd>
					<%/foreach%>
				</dl>
				<%if $listValue@index > 7%>
				</textarea>
				<%/if%>
			</div>
		<%/foreach%>
	</div>
	<%script%>
		require.async('home:widget/sortsite/sortsite.js');
	<%/script%>
