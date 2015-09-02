
<%script%>
	require.async("common:widget/ui/jquery/jquery.js", function ($) {
	$(window).load(function(){var e="<%$sysInfo.userip%>".split("."),t="",n=$.cookie("BAIDUID")?$.cookie("BAIDUID").substr(0,32):null,r=new Image;if(e.length===4&&n){for(var i in e){var s=parseInt(e[i]);s<16?t=t.concat("0",s.toString(16)):t=t.concat(s.toString(16))}r.src="http://"+t+n+".hao123.galileo.jomodns.com/telescope.gif"}});
	});
<%/script%>
