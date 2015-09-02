
<%widget name="lv2:widget/site-list-v-new/ico-siteslist/`$head.dir`/`$head.dir`.tpl"%>

<%foreach $data as $linksValue%>
	<dl class="box-lv2 s-mbl ico-siteslist favsite-count">
		<dt><%$linksValue.name%></dt>
		<dd<%if isset($linksValue.columnNum) && !empty($linksValue.columnNum)%> class="column-<%$linksValue.columnNum%>"<%/if%>>
			<%foreach $linksValue.links as $value%>
				<span<%if !empty($value.class)%> class="<%$value.class%>"<%/if%>>
					<%*猜测对应的icon地址*%>
					<%$faviconUrl=parse_url($value.url)%>
					<%$faviconUrl="<%$faviconUrl.scheme%>://<%$faviconUrl.host%>"%>
					<a href="<%$value.url%>"<%if !empty($value.style)%> style="<%$value.style%>"<%/if%>><img onerror="this.src='/static/web/tw/img/defautlico.png';this.onerror=null;" src="<%$faviconUrl%>/favicon.ico" height='16' width='16' class="favicon-img"><span style="display:inline-block;cursor:pointer;"><%$value.name%></span></a>
				</span>
			<%/foreach%>
		</dd>
	</dl>
<%/foreach%>

