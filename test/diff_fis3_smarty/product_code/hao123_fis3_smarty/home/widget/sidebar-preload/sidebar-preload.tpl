<%script%>
	;(function () {
		window.hao123 || (window.hao123 = {});
		var script = document.createElement("script");
		hao123.country = conf.country;
		hao123.appModule = conf.pageType;
		hao123.host = "";
		hao123.mid = "<%$mid%>";
		script.type = "text/javascript";
		script.async = true;
		script.src = "/static304/sidebar-base.js";
		var s = document.getElementsByTagName("script")[0];
		s.parentNode.insertBefore(script, s);
	})();
<%/script%>