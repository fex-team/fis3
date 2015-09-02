<%strip%>
<script>
window.conf || (window.conf = {});
conf.country = "<%$sysInfo.country|default:'br'%>";
conf.host = "<%$sysInfo.host%>";
conf.pageType = /^index/.test("<%$head.pageType%>") ? "index" : "<%$head.pageType%>";
conf.moreText = "<%$head.moreText|default:'MORE'%>";
conf.cdn = "<%$head.cdn|default:''%>";
conf.apiUrlPrefix = "<%$head.apiUrlPrefix%>";
conf.uploadUrlPrefix = "<%$head.uploadUrlPrefix%>";
conf.fbAppId = "<%$head.fbAppId%>";
conf.dir = "<%$head.dir%>";
conf.userip = "<%$sysInfo.userip|default:''%>";

<%* UT模块，全局的属性配置 *%>
conf.UT = {
	params: {
		country: "<%$sysInfo.country|default:''%>",
		level: "<%$head.pageLevel%>",
		page: "<%$head.pageId%>",
		type: '<%if $head.partnerIframe == "1"%>p<%/if%>click',
		tn: (location.search.match(/\btn=([\w-]+)/i) || document.cookie.match(/(?:^| )gl_tn(?:(?:=([^;]*))|;|$)/) || document.referrer.match(/\btn=([\w-]+)/i) || [0,'/'])[1],
		fr: (location.search.match(/\bfr=([\w-]+)/i) || document.cookie.match(/(?:^| )gl_fr(?:(?:=([^;]*))|;|$)/) || document.referrer.match(/\bfr=([\w-]+)/i) || [0,'/'])[1],
		guid:(location.search.match(/(^|&|\\?)guid=([^&]*)(&|$)/i) || [0,0,""])[2]
		<%if !empty($head.channel)%>
		,channel:"<%$head.channel%>"
		<%/if%>
	},
	tn: (location.search.match(/\btn=([\w-]+)/i) || [0,'/'])[1]
};
</script>
<%/strip%>