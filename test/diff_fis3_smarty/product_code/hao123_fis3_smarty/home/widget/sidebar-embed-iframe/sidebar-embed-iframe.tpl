<%if $head.dir=='ltr'%>
	<%require name="home:widget/sidebar-embed-iframe/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/sidebar-embed-iframe/rtl/rtl.css"%>
<%/if%>

<div class="mod-sidebar-iframe" id="<%if $root.urlparam['appType']%>sidebarEmbedIframe<%$root.urlparam['appType']%><%else%><%$body.sidebarIframe[$widget_id].modId%><%/if%>" log-mod="sidebar-iframe" style="" data-type="<%$list_id%>">
	<div class="loading"></div>
</div>

<%script%>
	conf = conf || {};
	conf.sidebarIframe = <%json_encode($body.sidebarIframe)%>;

	require.async("flat-home:widget/sidebar-embed-iframe/sidebar-embed-iframe-async.js", function( SidebarEmbedIframe ){
		new SidebarEmbedIframe( "<%$root.urlparam['appType']%>" || "<%$widget_id%>" <%if $root.urlparam['appType']%>, true<%/if%> );
	});

<%/script%>
