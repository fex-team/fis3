<style>.w1020 .banner-frame-wrap{margin-left: 30px;}</style>
<div class="banner-frame-wrap <%$body.bannerFrame.class%>"  style="<%$body.bannerFrame.style%>">
	<textarea style="display:none;">
		<iframe src="<%$body.bannerFrame.src%>" width="<%$body.bannerFrame.width%>" height="<%$body.bannerFrame.height%>" allowtransparency="true" scrolling="no" frameborder="0">
		</iframe>
	</textarea>
</div>

<%script%>
require.async("common:widget/ui/jquery/jquery.js", function($){
	$(function(){
		var wrap = $(".banner-frame-wrap");
		wrap.html($("textarea", wrap).text());
	});
});
<%/script%>
