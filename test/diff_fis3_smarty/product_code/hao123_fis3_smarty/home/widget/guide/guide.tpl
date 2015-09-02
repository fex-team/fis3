<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/guide/ltr/ltr.css"%> <%else%> <%require name="home:widget/guide/rtl/rtl.css"%> <%/if%>

<%script%>
	require.async(["common:widget/ui/jquery/jquery.js", "home:widget/guide/guide-async.js"], function($, Guider){
		// 1/16抽样 末尾为"B"
		//if($.cookie("BAIDUID")[31] == "B"){
			var options = {
				data: <%json_encode($body.guide.frames)%>,
				preloadImg: <%json_encode($body.guide.preloadImg)%>,
				buttons: {
					next: "<%$body.guide.buttons.next%>",
					start: "<%$body.guide.buttons.start%>",
					close: "<%$body.guide.buttons.close%>"
				},
				interval: <%$body.guide.interval%>,
				fadeoutTime: <%$body.guide.fadeoutTime%>,
				slideTime: <%$body.guide.slideTime%>
			};
			var guider = new Guider(options);
			guider.init();
		//}
	});
<%/script%>
