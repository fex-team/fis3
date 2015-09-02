<%*侧边栏静态按概率随机展现大广告*%>
<style>
.mod-big-side-ad .ad-img{display: block}
</style>
<div class="mod-big-side-ad <%$body.$mod_name.class%>"  style="<%$body.$mod_name.style%>" log-mod="yahoo-ad-right">
	<%assign var="ratioTotal" value="0"%>
	<%foreach $body.$mod_name.ad_group as $item%>
		<%$ratioTotal = $ratioTotal + $item.ratio%>
	<%/foreach%>
	<%*生成随机的命中index*%>
	<%assign var="randomId" value="<%rand(1,$ratioTotal)%>"%>
	<%*已被占用的index最大值*%>
	<%assign var="startId" value="0"%>

	<%foreach $body.$mod_name.ad_group as $item%>

		<%*单个广告的占比，取值范围[0,10]*%>
		<%assign var="ratio" value="<%$item.ratio%>"%>

		<%*iframe类型广告：接收iframe的src*%>
		<%if $item.type == "iframe"%>
			<%section name="iframeL" loop=$ratio%>
				<%if $randomId == $smarty.section.iframeL.index+$startId+1%>
					<iframe frameborder="no" scrolling="no" src="<%$item.src%>" width="<%$body.$mod_name.width%>" height="<%$body.$mod_name.height%>" allowtransparency="true"></iframe>
				<%/if%>
			<%/section%>
			<%*匹配后修改已被占用的index最大值*%>
			<%$startId = $startId + $ratio%>

		<%*图片类型广告：接收图片src和对应url*%>
		<%elseif $item.type == "image"%>
			<%section name="imgL" loop=$ratio%>
				<%if $randomId == $smarty.section.imgL.index+$startId+1%>
					<a href="<%$item.url%>" class="ad-img">
						<img src="<%$item.src%>" width="<%$body.$mod_name.width%>" height="<%$body.$mod_name.height%>"/>
					</a>
				<%/if%>
			<%/section%>
			<%*匹配后修改已被占用的index最大值*%>
			<%$startId = $startId + $ratio%>

		<%*js类型广告：接收一段html或js代码*%>
		<%elseif $item.type == "js"%>
			<%section name="adL" loop=$ratio%>
				<%if $randomId == $smarty.section.adL.index+$startId+1%>
					<%$item.content%>
				<%/if%>
			<%/section%>
			<%*匹配后修改已被占用的index最大值*%>
			<%$startId = $startId + $ratio%>
		<%/if%>

	<%/foreach%>

</div>
