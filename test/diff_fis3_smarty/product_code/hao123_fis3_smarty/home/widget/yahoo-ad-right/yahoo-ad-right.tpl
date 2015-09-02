<style>
.mod-yahoo-ad-right .ad-img{display: block}
</style>
<div class="mod-yahoo-ad-right <%$body.yahooAdRight.class%>"  style="<%$body.yahooAdRight.style%>" log-mod="yahoo-ad-right">
	<%assign var="i" value="<%math equation=rand(1,10)%>"%> 
	<%assign var="j" value="<%$body.yahooAdRight.iframePercent%>"%> 
	<%assign var="q" value="<%$body.yahooAdRight.imgPercent%>"%> 
	<%assign var="z" value="<%$body.yahooAdRight.adPercent%>"%> 
	<%section name="iframeL" loop=$j%> 
		<%if $i == $smarty.section.iframeL.index+1%>
			<iframe src="<%$body.yahooAdRight.src%>" width="<%$body.yahooAdRight.width%>" height="<%$body.yahooAdRight.height%>" allowtransparency="true" scrolling="no" frameborder="0">
		</iframe>
		<%/if%>
	<%/section%>
	<%section name="imgL" loop=$q%>
		<%if $i == $smarty.section.imgL.index+$j+1%>
			<a href="<%$body.yahooAdRight.adLink%>" class="ad-img">
				<img src="<%$body.yahooAdRight.adSrc%>" width="<%$body.yahooAdRight.width%>" height="<%$body.yahooAdRight.height%>">
			</a>
		<%/if%>
	<%/section%>
	<%section name="adL" loop=$z%>
		<%if $i == $smarty.section.adL.index+$j+$q+1%>
			<script type="text/javascript">rakuten_design="slide";rakuten_affiliateId="1183889c.75e4569e.1183889d.31dae294";rakuten_items="ranking";rakuten_genreId=0;rakuten_size="300x250";rakuten_target="_blank";rakuten_theme="gray";rakuten_border="on";rakuten_auto_mode="on";rakuten_genre_title="off";rakuten_recommend="on";rakuten_pointbackId="_RTmtlk20011685";</script><script type="text/javascript" src="http://xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js"></script>
		<%/if%>
	<%/section%>
</div>
