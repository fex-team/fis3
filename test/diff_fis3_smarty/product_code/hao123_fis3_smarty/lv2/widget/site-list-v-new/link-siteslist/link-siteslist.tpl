
<%foreach $body.sitesList as $linksValue%>
	<dl class="box-lv2 s-mbl favsite-count">
		<dt><%$linksValue.name%></dt>
		<dd<%if isset($linksValue.columnNum) && !empty($linksValue.columnNum)%> class="column-<%$linksValue.columnNum%>"<%/if%>>
			<%foreach $linksValue.links as $value%>
				<span<%if !empty($value.class)%> class="<%$value.class%>"<%/if%>>
							<a href="<%$value.url%>"<%if !empty($value.style)%> style="<%$value.style%>"<%/if%>><%$value.name%><%if !empty($value.ico)%><i class="<%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%>></i><%/if%></a>
						</span>
			<%/foreach%>
		</dd>
	</dl>
<%/foreach%>

