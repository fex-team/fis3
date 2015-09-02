
<%widget name="lv2:widget/nav-list-v/`$head.dir`/`$head.dir`.tpl"%>
<div class="nav-lv2 cf favsite-count" id="navList">
	<ul class="nav-lv2_list">
		<%foreach $body.sitesNav.links as $value%>
			<li class="l-g1-8<%if !empty($value.class)%> <%$value.class%><%/if%>">
				<a href="<%$value.url%>"<%if !empty($value.style)%> style="<%$value.style%>"<%/if%>><%if !empty($value.ico)%><i class="i-pre-sprites <%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%>></i><%/if%><%$value.name%></a>
			</li>
		<%/foreach%>
		<li class="nav-lv2_more l-g0" id="navMore">
			<a href="#" onClick="return false" hidefocus="true" id="navMoreExpand">
				<p><span>+ </span><%$body.sitesNav.expand%></p>
			</a>
			<a href="#" onClick="return false" hidefocus="true" id="navMoreContract">
				<p><span>- </span><%$body.sitesNav.contract%></p>
			</a>
			<ul class="nav-lv2_more-content" id="navMoreContent">
				<%foreach $body.sitesNav.moreLinks as $value%>
					<li<%if !empty($value.class)%> class="<%$value.class%>"<%/if%>>
						<a href="<%$value.url%>"<%if !empty($value.style)%> style="<%$value.style%>"<%/if%>><%if !empty($value.ico)%><i class="i-pre-sprites <%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%>></i><%/if%><%$value.name%></a>
					</li>
				<%/foreach%>
			</ul>
		</li>
	</ul>
</div>
<%script%>
	require.async('lv2:widget/nav-list-v/nav-list-v.js',function(navList){
		navList();
	});
<%/script%>

