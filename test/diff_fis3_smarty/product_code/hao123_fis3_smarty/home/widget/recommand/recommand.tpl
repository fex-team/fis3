<%if $head.dir=='ltr'%>
	<%require name="home:widget/recommand/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/recommand/rtl/rtl.css"%>
<%/if%>

<div id="recommand" class="mod-recommand" log-mod="recommand" style="visibility:hidden; min-height:376px;">
	<ul class="tabs cf">
		<%foreach $body.recommand.mods as $mod%>
		<li style="width:<%100/$mod@total%>%">
			<span class="tab <%$mod.type%><%if $mod@first%> cur<%/if%><%if $mod@last%> last<%/if%>" data-type="<%$mod.type%>">
				<%$mod.tabText%>
			</span>
			<%if !empty($mod.showHotIcon)%><i class="icon-hot"></i><%/if%>
		</li>
		<%/foreach%>
	</ul>
	<div class="container">
		<%foreach $body.recommand.mods as $mod%>
		<div class="content <%$mod.type%><%if $mod@first && empty($mod.useAjax)%> hasRenderred<%/if%>" style="display:none;" data-type="<%$mod.type%>" log-mod="recommand-<%$mod.type%>">
			<%if empty($mod.useAjax)%>
				<%widget name="home:widget/recommand/`$mod.tpl`/`$mod.tpl`.tpl" modIndex=<%$mod@first%>%>
			<%/if%>
		</div>
		<%/foreach%>
	    <div class="ui-o" style="display:none;"></div>
	</div>
</div>

<%script%>
	conf = conf || {};
	conf.recommand = {
		id : "recommand",
		options : {},
		childModule : {}
	};

	<%foreach $body.recommand.mods as $mod%>
		conf.recommand.options["<%$mod.type%>"] = <%json_encode($mod)%>;
	<%/foreach%>

	require.async( "home:widget/recommand/recommand-async.js", function( Recommand ){
		new Recommand();
	} );
<%/script%>