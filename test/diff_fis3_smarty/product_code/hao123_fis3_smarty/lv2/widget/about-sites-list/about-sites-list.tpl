

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="lv2:widget/about-sites-list/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/about-sites-list/rtl/rtl.css"%> <%/if%>

<div id="tabContent">
	<%foreach $body.tabContent.tabList as $listValue%>		
		<%if empty($listValue.isHidden) && $listValue.isHidden != "1"%>
			<%if in_array($listValue.id,array("friendlink","how","uninstall"))%>
				<div class="box-<%$listValue.id%> about" id="tab-<%$listValue.id%>">
			<%else%>
				<dl class="box-<%$listValue.id%> about box-lv2 s-mbm" id="tab-<%$listValue.id%>">
			<%/if%>	
					<%if $listValue.id == "about"%><%*isset($listValue.aid)%>-<%empty($listValue.aid)*%>			
						<dt><%$listValue.name%></dt>
						<%foreach $listValue.list as $value%>
							<dd>
								<img class="<%if $head.dir=='ltr'%>fl s-mrm<%else%>fr s-mlm<%/if%>" src="<%$value.picUrl%>"/>
								<div class="mod">
									<p class="title"><%$value.subName%></p>
									<p class="desc"><%$value.desc%></p>
								</div>
							</dd>
						<%/foreach%>				
					<%elseif $listValue.id == "friendlink"%>
						<%foreach $listValue.linkList as $value%>
							<%if empty($value.isHidden) && $value.isHidden != "1"%>
								<dl class="box-<%$value.id%> box-lv2 s-mbm" id="<%$value.id%>">	
									<dt><%$value.subName%></dt>
									<dd class="fl-<%$value.id%>">
										<%if $value.id == "imgLink"%>
											<%strip%>
											<%foreach $value.list as $link%>									
												<span>
							                        <a href="<%$link.url%>" title="<%$link.title|default:$link.name%>" target="_blank">
							        					<img src="<%$link.picUrl%>"/>
							                            <%$link.name%>
							                        </a>
							                    </span>								
											<%/foreach%>
											<%/strip%>
										<%elseif $value.id == "textLink"%>
											<%foreach $value.list as $link%>									
												<span>
													<a href="<%$link.url%>" title="<%$link.title|default:$link.name%>" <%if !empty($link.style)%>style="<%$link.style%>"<%/if%>><%$link.name%><%if !empty($link.ico)%><i class="<%$link.ico%>"<%if !empty($link.ico_url)%> style="background:url(<%$link.ico_url%>) no-repeat left top"<%/if%>></i><%/if%></a>	                        
							                    </span>
											<%/foreach%>
										<%elseif $value.id == "howToLink"%>
											<%$html.friendLink%>
										<%/if%>
									</dd>
								</dl>
							<%/if%>						
						<%/foreach%>
					<%else%>
						<%$html.<%$listValue.id%>%>					
					<%/if%>

			<%if in_array($listValue.id,array("friendlink","how","uninstall"))%>
				</div>
			<%else%>
				</dl>
			<%/if%>			
		<%/if%>
	<%/foreach%>
	
</div>
