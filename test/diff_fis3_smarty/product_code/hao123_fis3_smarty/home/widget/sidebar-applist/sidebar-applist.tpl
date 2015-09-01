<%if $head.dir=='ltr'%> 
	<%require name="home:widget/sidebar-applist/ltr/ltr.css"%>
<%else%> 
	<%require name="home:widget/sidebar-applist/rtl/rtl.css"%> 	
<%/if%>

<div class="mod-sidebar-applist" log-mod="sidebar-applist">
	
</div>	

<%script%>
	require.async("home:widget/sidebar-applist/sidebar-applist-async.js");	
<%/script%>	