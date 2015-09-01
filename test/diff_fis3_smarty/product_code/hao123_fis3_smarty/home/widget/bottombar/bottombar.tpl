

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/bottombar/ltr/ltr.css"%> <%else%> <%require name="home:widget/bottombar/rtl/rtl.css"%> <%/if%>


	<div class="l-g favsite-count box-border toolbar-v<%if $head.dir=='rtl'%> toolbar-v-rtl<%/if%>" monkey="bottombar" log-mod="sortsites-bottom">
		<%foreach $body.bottomSort.list as $listValue name=botSort%>
			<div class="l-g1-4">
				<dl class="box-bot s-mls s-mrm">
					<dt class="toolbar_menu t<%if !empty($listValue.class)%> <%$listValue.class%><%/if%>">
						<a href="<%$listValue.titleUrl%>"<%if !empty($listValue.style)%> style="<%$listValue.style%>"<%/if%> <%if !empty($listValue.offerid)%> log-oid="<%$listValue.offerid%>"<%/if%>  ><%if !empty($listValue.titleIco)%><i class="i-pre-sprites <%$listValue.titleIco%>"<%if !empty($listValue.titleIconUrl)%> style="background:url(<%$listValue.titleIconUrl%>) no-repeat left top"<%/if%>></i><%/if%><%$listValue.title%></a>
					</dt>
					<%foreach $listValue.links as $value name=botSortList%>
						<%if !empty($body.bottomSort.showPic)%>
							<%if $smarty.foreach.botSortList.first%>
								<dd class="img"><a href="<%$value.url%>" <%if !empty($value.offerid)%> log-oid="<%$value.offerid%>"<%/if%>  ><i class="i-toolbar i-toolbar-<%$smarty.foreach.botSortList.index%>"><%$smarty.foreach.botSortList.index + 1%></i><img src="<%$value.ico_url%>" alt="<%$value.name%>" width=215 height=60></a></dd>
							<%else%>
								<dd<%if !empty($value.class)%> class="<%$value.class%>"<%/if%>>
									<a href="<%$value.url%>"<%if !empty($value.style)%> style="<%$value.style%>"<%/if%> <%if !empty($value.offerid)%> log-oid="<%$value.offerid%>"<%/if%>  ><i class="i-toolbar i-toolbar-<%$smarty.foreach.botSortList.index%>"><%$smarty.foreach.botSortList.index + 1%></i><%$value.name%><%if !empty($value.ico)%><i class="<%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%> ></i><%/if%><em><%$value.ico_url%></em></a>
								</dd>
							<%/if%>
						<%else%>
							<%if $value@index < 6%>
								<dd<%if !empty($value.class)%> class="<%$value.class%>"<%/if%>>
									<a href="<%$value.url%>"<%if !empty($value.style)%> style="<%$value.style%>"<%/if%> <%if !empty($value.offerid)%> log-oid="<%$value.offerid%>"<%/if%>  ><i class="i-toolbar i-toolbar-<%$smarty.foreach.botSortList.index%>"><%$smarty.foreach.botSortList.index + 1%></i><%$value.name%><%if !empty($value.ico)%><i class="<%$value.ico%>"<%if !empty($value.ico_url)%> style="background:url(<%$value.ico_url%>) no-repeat left top"<%/if%>></i><%/if%></a>
								</dd>
							<%/if%>
						<%/if%>
					<%/foreach%>
				</dl>
			</div>
		<%/foreach%>
	</div>
