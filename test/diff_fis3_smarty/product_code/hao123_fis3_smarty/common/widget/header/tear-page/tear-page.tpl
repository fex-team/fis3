<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header/tear-page/ltr/ltr.css?__inline');
<%else%> 
@import url('/widget/header/tear-page/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="common:widget/header/tear-page/ltr/ltr.more.css"%> <%else%> <%require name="common:widget/header/tear-page/rtl/rtl.more.css"%> <%/if%>

<%assign var="tearSkin" value=$body.tearPage.skin%>

<a class="tear-page hide" href="<%$body.tearPage.url%>">
	<textarea>
		<img src="<%$body.tearPage.closeImgSrc%>" data-close-src="<%$body.tearPage.closeImgSrc%>" data-open-src="<%$body.tearPage.openImgSrc%>" height="50" <%if empty($tearSkin.isHidden) && !empty($tearSkin.bgRestoreSrc)%>data-restore-src="<%$tearSkin.bgRestoreSrc%>"<%/if%>>
		<i class="i-tear-page"></i>
		<i class="i-tear-page-close hide"></i>

		<%if empty($tearSkin.isHidden)%>
		<span class="tear-page_btn" id="tearBtn">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
		<%/if%>
	</textarea>
</a>

<%script%>
	conf.tearPage = {
		passQueryParam: "<%$body.tearPage.passQueryParam%>",
		hasBg: "<%$tearSkin.initBgImg%>",
		bgImg: "<%$tearSkin.image%>",
		width: "<%$tearSkin.width%>",
		<%if !empty($tearSkin.timeout)%>
		timeout: <%$tearSkin.timeout%>,
		<%/if%>
		useSkin: "<%empty($tearSkin.isHidden)%>",
		modId: "<%$tearSkin.modId%>",
		parentSelector: "<%$tearPage.parentSelector%>"
		<%if empty($tearSkin.isHidden) && !empty($tearSkin.clickArea)%>
		,clickWidth: <%$tearSkin.clickArea.width%>,
		clickHeight: <%$tearSkin.clickArea.height%>,
		landingpage: "<%$tearSkin.clickArea.landingpage%>"
		<%/if%>
	};
	require.async("common:widget/ui/jquery/jquery.js", function($) {
		$(window).one("e_go.tearpage", function () {
			require.async("common:widget/header/tear-page/tear-page-async.js");
		});
		$(function () {
			$(window).trigger("e_go.tearpage");
		});
		$(".tear-page").one("mouseenter", function () {
			$(window).trigger("e_go.tearpage");
		});
	});
<%/script%>

