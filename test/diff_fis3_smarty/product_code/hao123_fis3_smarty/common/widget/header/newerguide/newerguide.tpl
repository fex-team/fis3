<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header/newerguide/ltr/ltr.css?__inline');
<%else%> 
@import url('/widget/header/newerguide/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="common:widget/header/newerguide/ltr/ltr.more.css"%> <%else%> <%require name="common:widget/header/newerguide/rtl/rtl.more.css"%> <%/if%>

<div class="newerguide-tip" id="newerguide" log-mod="newerguide">
	<p class="newerguide-content"><%$body.newerguide.text%></p>
	<span id="newerguideClose" class="newerguide-close"></span>
	<div class="guide-arrow"><div class="arrow-inner"></div></div>
</div>
<%script%>
	require.async("common:widget/ui/jquery/jquery.js", function($) {
		$(window).one("e_go.newerguide", function () {
			require.async("common:widget/header/newerguide/newerguide-async.js", function (newerguide) {
				newerguide.init({
					position: {
						<%if $head.dir=='ltr'%>left<%else%>right<%/if%>: "<%$body.newerguide.left%>px",
						top: "<%$body.newerguide.top%>px"
					},
					isShowAgainArc: "<%$body.newerguide.isShowAgainArc%>",/* 控制引导框在点击有效区域后下次是否出现 */
					isShowAgainBtn: "<%$body.newerguide.isShowAgainBtn%>"/* 控制引导框在点击关闭按钮后下次是否出现 */
				});
			});
		});

		$(function () {
			$(window).trigger("e_go.newerguide");
		});
	});
<%/script%>
