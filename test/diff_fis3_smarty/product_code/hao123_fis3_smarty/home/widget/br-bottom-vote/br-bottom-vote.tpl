

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/br-bottom-vote/ltr/ltr.css"%> <%else%> <%require name="home:widget/br-bottom-vote/rtl/rtl.css"%> <%/if%>
<div id="brBottomVote" class="mod-br-bottom-vote bottomContentItem" log-mod="bottom-vote">
	<div class="votePage">
		<div class="voteReview">
			<a href="<%$body.brBottomVote.url%>" title="<%$body.brBottomVote.review|default:''%>" <%if !empty($body.brBottomVote.hide)%>style="cursor: default;" onclick="return !1;"<%/if%>><img src="<%$body.brBottomVote.src%>" /></a>
		</div>
		<div class="voteVote">
			<div class="voteTitle">
				<span class="voteTitle-title"><%$body.brBottomVote.title%></span>
				<span class="voteTitle-check"><%$body.brBottomVote.check%></span>
			</div>
			<div>
				<%foreach $body.brBottomVoteList as $bottomVoteValue%>
					<span class="votes player<%$bottomVoteValue.playerIdentity%>" title="<%$bottomVoteValue.title%>">
						<i class="voteRadio"  index="<%$bottomVoteValue@index+1%>"></i>
						<i class="<%$bottomVoteValue.playerIdentity%> bottomVoteIcon"></i>
						<span><%$bottomVoteValue.playerName%></span>
					</span>
				<%/foreach%>	
				<div class="voteBtnContatiner">
					<button><%$body.brBottomVote.vote%></button>
				</div>			
			</div>
		</div>
	</div>

	<div class="resultPage">
		<ul class="resultList">	
		</ul>
		<span href="#" class="backToVote"><%$body.brBottomVote.back%></span>
	</div>
</div>

<%script%>
	conf.brBottomVote = { vid:"<%$body.brBottomVote.vid%>",list:<%json_encode($body.brBottomVoteList)%> };
	require.async('home:widget/br-bottom-vote/br-bottom-vote-async.js',function(brBottomVote){
		brBottomVote.init();
	});	
<%/script%>