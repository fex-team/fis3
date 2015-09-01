<%style%>
<%if $head.dir=='ltr'%>
	@import url('/widget/sort-area/container/ltr/ltr.css?__inline');
<%else%>
	@import url('/widget/sort-area/container/rtl/rtl.css?__inline');
<%/if%>
<%/style%>
<div class="container">
	<%foreach $body.sortAreaTab.tabs as $tab%>
	<div class="content <%$tab.id%><%if !empty($tab.tpl)%> renderred<%/if%>" data-id="<%$tab.id%>">
		<%if !empty($tab.tpl)%>
		<%widget name="home:widget/sort-area/`$tab.tpl`/`$tab.tpl`.tpl"%>
		<%/if%>
	</div>
	<%/foreach%>
	<div class="loading" style="display:none;">
		<div class="ui-o"></div>
		<p><%$body.sortAreaContainer.loadingText%></p>
	</div>
</div>