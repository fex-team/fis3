<%if $modIndex!=1%>
<textarea style="display:none;">
<%/if%>

<%if $head.dir=='ltr'%>
	<%require name="home:widget/recommand/layout2/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/recommand/layout2/rtl/rtl.css"%>
<%/if%>

<div class="layout2-big">
	<a href="<%$mod.banner[0].landingpage%>" class="big"  data-sort="<%$mod.type%>-banner1">
		<img src='<%$mod.banner[0].imgSrc%>' width="238" height="184" style="display:block;"/>
		<p class="des"><%$mod.banner[0].description%></p>
	</a>
</div>

<div class="layout2-small cf">
	<%foreach $mod.items as $item%>
	<a href="<%$item.landingpage%>" data-sort="<%$mod.type%>-small<%$item@index+1%>">
		<img src="<%$item.imgSrc%>" width="73" height="73" style="display:block;">
		<div class="mask"></div>
	</a>
	<%/foreach%>
</div>

<a href="<%$mod.moreLandingpage%>" class="layout2-more" data-sort="<%$mod.type%>-more"><%$mod.moreTitle%><i class="arrow">&rsaquo;</i></a>

<%script%>
	require.async( ["home:widget/recommand/layout2/layout2-async.js","common:widget/ui/jquery/jquery.js"], function( Layout2, $ ){
		conf = conf || {};
		conf.recommand = conf.recommand || {};
		conf.recommand.childModule = conf.recommand.childModule || {};
		
		$( "#" + conf.recommand.id ).one( "recommand_<%$mod.type%>", function(){
			new Layout2( "<%$mod.type%>" );
		} );

		conf.recommand.childModule.<%$mod.type%> = "true";
	} );
<%/script%>

<%if $modIndex!==1%>
</textarea>
<%/if%>