<%style%>
<%if $head.dir=='ltr'%>
@import url('/widget/history/ltr/ltr.css?__inline');
<%else%>
@import url('/widget/history/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%>
	<%require name="home:widget/history/ltr/ltr.more.css"%>
	<%if !empty($head.splitHotsite) %>
		<%require name="home:widget/history/small-ltr/small-ltr.css"%>
	<%/if%>
	<%if !empty($head.flowLayout) %>
		<%* 两种布局样式 *%>
		<%require name="home:widget/history/flow/ltr/ltr.flow.css"%>
	<%/if%>
<%else%>
	<%require name="home:widget/history/rtl/rtl.more.css"%>
	<%if !empty($head.splitHotsite) %>
		<%require name="home:widget/history/small-rtl/small-rtl.css"%>
	<%/if%>
	<%if !empty($head.flowLayout) %>
		<%* 两种布局样式 *%>
		<%require name="home:widget/history/flow/rtl/rtl.flow.css"%>
	<%/if%>
<%/if%>


		<div id="history" class="hotsite-hist_wrap hotsite-ele favsite-count" log-mod="historysites">
			<div class="hotsite-hist">
				<div class="hotsite-hist_bg" id="historyBg">
					<i></i>
					<span><%$body.history.defaultText%></span>
				</div>
			</div>
		</div>
		<%script%>
			window.conf || (window.conf = {});
			<%if !empty($head.splitHotsite) %>
			conf.history = {
				maxBlock: 9,
				eleWidth: 708,
				animeSpeed: 500
			};
			<%else%>
			conf.history = {
				maxBlock: 10,
				eleWidth: 958,
				animeSpeed: 500
			};
			<%/if%>
			require.async(["common:widget/ui/jquery/jquery.js"], function ($) {
				var $window = $(window);
				$window.one("hotsite.history", function () {
					require.async("home:widget/history/history-c.js", function () {
						Gl.history.bindEvent();
					});
				}).load(function(){
					$window.trigger("hotsite.history");
				});

				$("#historyTab").one("mouseenter", function () {
					$window.trigger("hotsite.history");
				});
		});

		<%/script%>
