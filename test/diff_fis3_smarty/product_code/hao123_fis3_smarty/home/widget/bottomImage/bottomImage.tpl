

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/bottomImage/ltr/ltr.css"%> <%else%> <%require name="home:widget/bottomImage/rtl/rtl.css"%> <%/if%>

	<%foreach $body.bottomImage as $value%>
		<div class="imageSort bottomContentItem" id="<%$value.id%>" imageData="<%$value.url%>" nums="<%$value.nums%>" image-type="<%$value.type%>">
			<span class="bottomImagePre imageSwitch"></span>
			<span class="bottomImageNext imageSwitch"></span>
			<div class="imageContainer">
				<span class="loadMessage"><%$value.load%></span>
				<ul class="ul-list"></ul>
			</div>
			
		</div>
	<%/foreach%>	
	


<%script%>
	require.async(['common:widget/ui/jquery/jquery.js','home:widget/bottomImage/bottomImage-async.js'],function($,bottomImage){
		Gl.bottomImage.init($(".imageSort:first").attr("id"));
	});	
<%/script%>