<%if $head.dir=='ltr'%> <%require name="home:widget/hotsite-newtab/ltr/ltr.css"%> <%else%> <%require name="home:widget/hotsite-newtab/rtl/rtl.css"%> <%/if%>

<div class="mod-hotsite-newtab favsite-count" log-mod="hotsite-newtab">
	<div class="hotsite-newtab" style="display:none;">
		<%foreach $body.hotSitesNewtab.links as $hotSiteCon%>
			<span<%if !empty($hotSiteCon.class)%> class="<%$hotSiteCon.class%>"<%/if%><%if isset($hotSiteCon.tn)%> data-tn="<%$hotSiteCon.tn%>"<%/if%><%if isset($hotSiteCon.position)%> data-pos="<%$hotSiteCon.position%>"<%/if%>>
	  
				<a class="hotsite_link" href="<%$hotSiteCon.url%>"<%if !empty($hotSiteCon.style)%> style="<%$hotSiteCon.style%>"<%/if%>  log-index="<%$hotSiteCon@iteration%>" <%if !empty($hotSiteCon.offerid)%> log-oid="<%$hotSiteCon.offerid%>"<%/if%> >
					<i class="i-hot-sprites <%$hotSiteCon.ico|default:''%>"<%if !empty($hotSiteCon.ico_url)%> style="background:url(<%$hotSiteCon.ico_url%>) no-repeat left top"<%/if%>></i>
				        <span class="span-hot-name"><%$hotSiteCon.name%>
					        <%if !empty($hotSiteCon.morelinks)%>
						        <i class="triangle more_trigger"></i>
					        <%/if%>
	                    </span>
				</a>
				<%if !empty($hotSiteCon.morelinks)%>
					<ul class="more_links">
						<%foreach $hotSiteCon.morelinks as $link%>
							<li>
								<a href="<%$link.url%>" data-sort="hotsitemore" data-val="<%$link.url%>" <%if !empty($link.offerid)%> log-oid="<%$link.offerid%>"<%/if%> >
									<img class="site-icon" src="/static/web/common/img/gut.gif" <%if !empty($link.iconUrl)%>customsrc="<%$link.iconUrl%>"<%/if%> onerror="this.src='<%$body.customSite.defaultIcon%>';this.onerror=null;"/>
									<%$link.name%>
								</a>
							</li>
						<%/foreach%>
					</ul>
				<%/if%>
	            </span>
		<%/foreach%>
		<span class="description"><%$body.hotSitesNewtab.description%></span>
	</div>
</div>	
<%script%>		
	require.async('home:widget/hotsite-newtab/hotsite-newtab-async.js');		
<%/script%>