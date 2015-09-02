<%if $modIndex!=1%>
<textarea style="display:none;">
<%/if%>

<%if $head.dir=='ltr'%>
	<%require name="home:widget/recommand/football/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/recommand/football/rtl/rtl.css"%>
<%/if%>

<div class="football-title">
	<%$mod.footballTitle%> <%$mod.round%>
</div>
<div class="football-info">
	<ul class="football-info-ul"></ul>
</div>
<div class="football-more">
	<a href="<%$mod.moreLink%>" data-sort="<%$mod.type%>-btn">
		<%$mod.moreText%>
	</a>
</div>

<%script%>
	require.async( ["common:widget/ui/jquery/jquery.js", "home:widget/recommand/football/football-async.js"], function( $, Football ){
		conf = conf || {};
		conf.recommand = conf.recommand || {};
		conf.recommand.childModule = conf.recommand.childModule || {};

		$( "#" + conf.recommand.id ).one( "recommand_<%$mod.type%>", function(){
			( new Football( "<%$mod.type%>" ) ).init();
		} );

		conf.recommand.childModule.<%$mod.type%> = "true";
	} );
<%/script%>

<%if $modIndex!==1%>
</textarea>
<%/if%>