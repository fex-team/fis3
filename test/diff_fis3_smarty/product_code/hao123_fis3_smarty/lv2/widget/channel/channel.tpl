
	<%*   声明对ltr/rtl的css依赖    *%>
	<%if $head.dir=='ltr'%> <%require name="lv2:widget/channel/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/channel/rtl/rtl.css"%> <%/if%>
	
	<div class="channel-top">
		<img src="<%$body.channelPage.topImg%>"/>
		<a target="_self" href="<%$body.channelPage.url%>"></a>
	</div>
	<img src="<%$body.channelPage.centerImg%>" class="channel-center"/>
	<div class="channel-bottom">
		<img src="<%$body.channelPage.bottomImg%>"/>
	</div>
	<br/><br/>
