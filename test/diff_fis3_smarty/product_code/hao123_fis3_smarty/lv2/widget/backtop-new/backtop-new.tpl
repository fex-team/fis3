<%widget name="lv2:widget/backtop-new/`$head.dir`/`$head.dir`.tpl"%>
<div id="backTop">
	<a href="#top" onClick="return false" target="_self" hidefocus="ture"></a>
</div>
<%script%>
	require.async('lv2:widget/backtop-new/backtop-new.js',function(backtop){
		backtop();
	})
<%/script%>
