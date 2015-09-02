
<div class="l-wrap s-mtl app-list-top"<%if $body.appRecmmondTop.isHidden == 'true' %> style="display:none;"<%/if%>>
	<%foreach $body.extAppMod.appList as $appItem%>
	<span>
		<a class="a-link" href="<%$appItem.url%>">
			<img src="<%$appItem.logo_m%>" alt="icon"/>	
			<span class="a-name"><%$appItem.name%></span>
		</a>
	</span>
	<%/foreach%>
</div>
	<%script%>
		require.async('common:widget/ui/jquery/jquery.js',function($){
			$(".app-list-top span").on("mouseenter mouseleave", function(){
				$(this).toggleClass("item-hover");
			});
		});
	<%/script%>
