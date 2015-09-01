<%widget name="lv2:widget/backtop/`$head.dir`/`$head.dir`.tpl"%>
<div id="backTop">
	<a href="#top" onClick="return false" target="_self" hidefocus="ture"></a>
</div>
<%script%>
	require.async('lv2:widget/backtop/backtop.js',function(backtop){
		backtop();
	})
<%/script%>