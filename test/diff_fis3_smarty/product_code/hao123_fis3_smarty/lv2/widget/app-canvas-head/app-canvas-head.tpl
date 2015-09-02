
<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="lv2:widget/app-canvas-head/ltr/ltr.css"%> <%else%> <%require name="lv2:widget/app-canvas-head/rtl/rtl.css"%> <%/if%>
<div class="userbar-wrap">
	<div class="userbar l-wrap">
		<div class="userbar-logo">
			<a href="<%$body.logo.url%>">
				<img src="<%$body.logo.src%>" alt="<%$body.logo.indexTitle%>" title="<%$body.logo.indexTitle%>">
			</a>
			<span class="userbar-logoSlogan"<%if !empty($body.logo.sloganSize)%> style="font-size:<%$body.logo.sloganSize%>"<%/if%>><%$body.logo.slogan%></span>
		</div>
	</div>
</div>
