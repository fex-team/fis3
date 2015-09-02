<%script%>
require.async("common:widget/ui/weather/weather_flat.js", function (Gl) {
	Gl.weather.init(__uri('./weather-city.json'));
});
<%/script%>
<%require name="common:widget/ui/weather/`$country`/`$country`_flat.js" async="true" %>