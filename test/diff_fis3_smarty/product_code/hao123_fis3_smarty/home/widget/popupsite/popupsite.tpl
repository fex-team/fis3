
<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
<%require name="home:widget/popupsite/ltr/ltr.css"%> 
<%else%> 
<%require name="home:widget/popupsite/rtl/rtl.css"%> 
<%/if%>
<%script%>
	conf.popupSite = <%json_encode($body.popupSite)%> ;

	require.async(["common:widget/ui/jquery/jquery.js"], function($) {
		var $window = $(window);
		var REMIND = conf.popupSite.newSiteRemind;

		$(function() {
			if (REMIND.isHidden === "0") {
				(function(content) { // 在下拉框显示CMS更新提醒
					$("#add-btn").css("position", "relative").append("<i class='popup-site_remind'>" + content + "</i>");
				})(REMIND.content);
			}
		});

		// 鼠标滑过按钮或者onload之后加载JS文件，只加载一次
		$window.one("hotsite.popupsite", function() {
			require.async("home:widget/popupsite/popupsite-c.js");
		}).load(function() {
			$window.trigger("hotsite.popupsite");
		});

		$("#add-btn").one("mouseenter", function() {
			$window.trigger("hotsite.popupsite");
		});
	});
<%/script%>
