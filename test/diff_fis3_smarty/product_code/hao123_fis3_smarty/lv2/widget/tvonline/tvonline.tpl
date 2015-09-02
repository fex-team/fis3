<%if $head.dir=='ltr'%> <%require name="lv2:widget/tvonline/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/tvonline/rtl/rtl.css"%> <%/if%>
<%require name="common:widget/ui/text-overflow/ltr/ltr.css"%>
<div class="mod-tvonline" log-mod="tvonline">
	<div class="head">
		<div class="head-wrap">
			<h1 class="h1"><%$body.tvonline.topList.title%></h1>
			<ul class="head-list">
				<%foreach $body.tvonline.topList.list as $value1%>
					<li class="head-item">
						<a class="head-link" href="<%$value1.link%>">
							<img class="head-img" src="<%$value1.src%>"/>
							<span class="head-title text-overflow"><%$value1.title%></span>
							<span class="grey"></span>
						</a>											
					</li>
				<%/foreach%>
			</ul>
		</div>	
	</div>
	<div class="content-wrap">
		<div class="content">
			<%foreach $body.tvonline.contentList as $value2%>
				<%if empty($value2.isHidden)%>
					<div class="content-con <%$value2.size%>">
						<span class="mark"></span>
						<h2 class="h2"><%$value2.title%></h2>			
						<ul class="con-list">
							<%foreach $value2.list as $value3%>
								<li class="con-item">
									<a class="con-link" href="<%$value3.link%>">
										<img class="con-img" src="<%$value3.src%>"/>
										<span class="con-title text-overflow"><%$value3.title%></span>
										<span class="grey"></span>
									</a>														
								</li>
							<%/foreach%>	
						</ul>				
					</div>
				<%/if%>
			<%/foreach%>
		</div>
	</div>	
</div>	
<%script%>
	require.async('lv2:widget/tvonline/tvonline-async.js');
<%/script%>
