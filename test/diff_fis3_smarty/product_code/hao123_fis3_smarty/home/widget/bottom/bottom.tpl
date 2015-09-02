

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/bottom/ltr/ltr.css"%> <%else%> <%require name="home:widget/bottom/rtl/rtl.css"%> <%/if%>
	
		<div id="bottomTabs">
			<%foreach $body.bottomTabs as $tabsValue%>
				<a href="javascript:void(0)" tabid="<%$tabsValue.id%>" mle="<%$tabsValue.mle%>" class="bottomTabs"><%$tabsValue.title%><i class="triangle"></i></a>	
				
			<%/foreach%>
			
		</div>
		<div id="bottomContent">
		<%if !empty($body.bottomContent)%>
			<%$bottomContent=explode(",",$body.bottomContent)%>
			<%foreach $bottomContent as $mod%>
				<%widget name="home:widget/`$mod`/`$mod`.tpl"%>
			<%/foreach%>
		<%/if%>
				
								
		</div>
		
		<div id="bottomLinks" class="favsite-count">
			<%foreach $body.bottomLinks.list as $listValue%>
				<dl class="box-bot s-mls s-mrm">
					<dt class="toolbar_menu t<%if !empty($listValue.class)%> <%$listValue.class%><%/if%>">
							<a href="<%$listValue.titleUrl%>"<%if !empty($listValue.style)%> style="<%$listValue.style%>"<%/if%> <%if !empty($listValue.offerid)%> log-oid="<%$listValue.offerid%>"<%/if%>  ><%if !empty($listValue.titleIco)%><%/if%><%$listValue.title%></a>
					</dt>
					<%foreach $listValue.links as $value%>
						<dd class="bottom_links-dd">
							<a href="<%$value.url%>"<%if !empty($value.offerid)%> log-oid="<%$value.offerid%>"<%/if%>  ><%$value.name%></a>
						</dd>					
					<%/foreach%>
				</dl>
			<%/foreach%>	
		</div>
	
	<%script%>
		
		require.async('home:widget/bottom/bottom-async.js');
	<%/script%>