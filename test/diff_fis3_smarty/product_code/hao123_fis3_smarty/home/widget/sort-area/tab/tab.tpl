<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%>
	<%require name="home:widget/sort-area/tab/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/sort-area/tab/rtl/rtl.css"%>
<%/if%>
<ul class="tabs cf" style="visibility:hidden;z-index:1">
	<%foreach $body.sortAreaTab.tabs as $tab%>
	<li class="tab-item <%$tab.id%><%if $tab@first%> current first-tab<%elseif $tab@last%> last-tab<%/if%>" data-id="<%$tab.id%>" style=";z-index:<%$tab@total - $tab@index%>;<%if $tab@first%>width:<%$body.sortAreaTab.fisrtTabWidth|default:9%>%; *width:<%($body.sortAreaTab.fisrtTabWidth|default:9-0.2)%>%;
			<%else%>width:<%(100-$body.sortAreaTab.fisrtTabWidth|default:9)/($tab@total-1)%>%;
		<%/if%>">
		<div class="tab <%if $tab@first%>tab-first<%elseif $tab@last%>tab-last<%/if%>">
			<i class="icon" <%if empty($tab.name)%>style="margin:0px;"<%/if%><%if !empty($tab.spcIco)%>style="width:42px; height:42px; position:absolute; top:-14px; z-index:3; <%$tab.spcIco%>"<%/if%>></i>
			<span class="text" <%if !empty($tab.spcIco)%>style="<%if $head.dir=="ltr"%>margin-left: 42px;<%else%>margin-right: 42px;<%/if%>"<%/if%>><%$tab.name%></span>
		<%if !$tab@first%>
		</div>
		<div class="border"></div>
		<%/if%>
		<em class="arrow <%if $tab@last%>tab-last-arrow<%/if%>"></em>
	</li>
	<%/foreach%>
</ul>