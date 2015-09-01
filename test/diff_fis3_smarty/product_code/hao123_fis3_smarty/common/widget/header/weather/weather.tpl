
<%widget name="common:widget/header/weather/`$head.dir`/`$head.dir`.tpl"%>
<%script%>
	//conf.weather
	conf.weather = {
		prefixUrl: "<%$body.weather.prefixUrl%>",
		country: "<%$country%>",
		defaultCity: "<%$body.weather.accuDefaultCity%>",
		smallIconPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/weather/weather_icon_small",	
		bigIconPath: "<%if !empty($head.cdn)%><%$head.cdn%><%/if%>/resource/fe/weather/weather_icon_big",
		isHeaderTest: "<%$body.headerTest.widget%>",
		testSmallIcon: "<%$body.headerTest.weather.smallIconPath%>",
		testBigIcon: "<%$body.headerTest.weather.bigIconPath%>",
		testDefaultIcon: "<%$body.headerTest.weather.defaultIcon%>",
		testWidth: "<%$body.headerTest.weather.width%>",
		testSwitch: "<%$body.headerTest.weather.remindSwitch%>",
		dateFormat: "<%$body.weather.dateFormat%>",
		connector: "<%$body.weather.connector%>",
		humidity: "<%$body.weather.humidity%>",
		remindSwitch: "<%$body.weather.remindSwitch%>",
		userFrom: "<%$body.weather.userFrom%>",
		testUserFrom:"<%$body.headerTest.weather.testUserFrom%>",
		dataLength: 5,
		dataRef: function(data) {
			return data;
		},
		tips: {
			"click": '<%$body.weather.clickText%>',
			"loading": '<%$body.weather.loadingText%>',
			"loadError": '<%$body.weather.loadError%>',
			"nojs": '<%$body.weather.noJS%>',	
			"nocookie": '<%$body.weather.noCookie%>'
		},
		dataGroup: {
			"noScript": '<%$body.weather.noScript%>',
			"selectCity": '<%$body.weather.selectCity%>',
			"area": '<%$body.weather.area%>',
			"city": '<%$body.weather.city%>',
			"okBtn": '<%$body.weather.okBtn%>',
			"cancelBtn": '<%$body.weather.cancelBtn%>',
			"moreDays": '<%$body.weather.moreDays%>'
		}
	};
<%/script%>
<%widget name="common:widget/header/weather/`$sysInfo.country`/`$sysInfo.country`.tpl" country=$sysInfo.country%>
