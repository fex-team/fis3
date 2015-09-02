
<%widget name="lv2:widget/site-list-h/img-h-siteslist/`$head.dir`/`$head.dir`.tpl"%>

<%foreach $data as $linksValue%>
	<dl class="box-lv2 s-mbm img-h-siteslist favsite-count">
		<dt><%$linksValue.name%></dt>
		<dd>
			<%foreach $linksValue.links as $value%>
				<a href="<%$value.url%>"<%if !empty($value.style)%> style="<%$value.style%>"<%/if%>><div class="img-con"><img src="<%$value.ico_url%>"><div class="img-mask"></div></div><%$value.name%></a>
			<%/foreach%>
		</dd>
	</dl>
<%/foreach%>

