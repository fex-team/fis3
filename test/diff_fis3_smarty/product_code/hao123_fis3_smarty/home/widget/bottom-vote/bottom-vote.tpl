

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/bottom-vote/ltr/ltr.css"%> <%else%> <%require name="home:widget/bottom-vote/rtl/rtl.css"%> <%/if%>
<div id="bottomVote" class="bottomContentItem mod-bottom-vote">
	<div class="votePage size<%$body.bottomVote.size%>">
		<div class="voteReview">
			<a href="<%$body.bottomVote.url%>" title="<%$body.bottomVote.review|default:''%>" <%if !empty($body.bottomVote.hide)%>style="cursor: default;" onclick="return !1;"<%/if%>><img src="<%$body.bottomVote.src%>" /></a>
		</div>
		<div class="voteVote">
			<div class="voteTitle">
				<span><%$body.bottomVote.title%></span>
				<span class="voteTitle-check"><%$body.bottomVote.check%></span>
			</div>
			<div>
				<%foreach $body.bottomVoteList as $bottomVoteValue%>
					<span class="votes">
						<i class="voteRadio <%if !empty($bottomVoteValue.disabled)%>disabled<%/if%>"  index="<%$bottomVoteValue@index%>"  ></i>
						<img class="bottomVoteIcon" src="<%$bottomVoteValue.iconUrl%>"></i>
						<span class="vote-title"><%$bottomVoteValue.voteName%></span>
					</span>
				<%/foreach%>	
				<div class="voteBtnContatiner">
					<button><%$body.bottomVote.vote%></button>
				</div>			
			</div>
		</div>
	</div>

	<div class="resultPage">
		<ul class="resultList">
		</ul>
		<span href="#" class="backToVote"><%$body.bottomVote.back%></span>
	</div>
</div>

<%script%>
	conf.bottomVote = { vid:"<%$body.bottomVote.vid%>",list:<%json_encode($body.bottomVoteList)%>,resultNum:"<%$body.bottomVote.resultNum%>",isSort:"<%$body.bottomVote.isSort%>",rank:"<%$body.bottomVote.rank%>",category:"<%$body.bottomVote.category%>" };
	require.async('home:widget/bottom-vote/bottom-vote-async.js',function(bottomVote){
		bottomVote.init();
	});	
<%/script%>