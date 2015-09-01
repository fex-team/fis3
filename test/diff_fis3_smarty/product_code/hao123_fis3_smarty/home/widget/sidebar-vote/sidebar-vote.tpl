<%if $head.dir=="ltr"%>
	<%require name="home:widget/sidebar-vote/ltr/ltr.css"%>
<%else%>
	<%require name="home:widget/sidebar-vote/rtl/rtl.css"%>
<%/if%>

<div class="mod-sidebar-vote" id="sidebarVote" log-mod="sidebar-vote">
	<ul class="tabs cf">
		<%foreach $body.sidebarVote.items as $item%>
		<li class="tab <%$item.type%> <%if $item@first%>current<%/if%>" style="width:<%100/$item@total%>%" data-type="<%$item.type%>">
			<%$item.name%>
		</li>
		<%/foreach%>
	</ul>
	<div class="vote-container">
		<%foreach $body.sidebarVote.items as $item%>
		<div class="content <%$item.type%> <%if $item@first%>current<%/if%>" data-type="<%$item.type%>">
		</div>
		<%/foreach%>
		<div class="ui-o" style="display: none;"></div>
	</div>
</div>

<%script%>
	conf.sidebarVote = <%json_encode($body.sidebarVote)%>;
	conf.sidebarVote.id = "sidebarVote";

	require.async( ["home:widget/sidebar-vote/sidebar-vote-async.js"], function( SidebarVote ){
		new SidebarVote( conf.sidebarVote );
	} );
<%/script%>
