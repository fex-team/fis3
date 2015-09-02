<%script%>
	require.async("common:widget/ui/jquery/jquery.js", function($) {
		$(window).one("e_go.weather", function () {
			require.async("common:widget/ui/weather/weather.js", function (Gl) {
				Gl.weather.init(__uri('./weather-city.json'));
			});
		});

		$(function () {
			$(window).trigger("e_go.weather");
		});

		$("#weather").one("mouseenter", function () {
			$(window).trigger("e_go.weather");
		});
	});
<%/script%>
<%require name="common:widget/ui/weather/`$country`/`$country`.js" async="true" %>