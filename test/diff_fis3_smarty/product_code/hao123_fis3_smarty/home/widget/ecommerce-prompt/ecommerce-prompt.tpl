<%if $head.dir=='ltr'%> <%require name="home:widget/ecommerce-prompt/ltr/ltr.css"%> <%else%> <%require name="home:widget/ecommerce-prompt/rtl/rtl.css"%>
 <%/if%>
	<div id="ecommercePrompt" class="mod-ecommerce-prompt" log-mod="ecommerce-prompt" style="display:none;">
		<ul class="ep-goods-list">
		</ul>
		<div class="position:relative"><span class="ep-i-close"></span></div>
	</div>
<%script%>
	conf.ecommercePrompt = <%json_encode($body.ecommercePrompt)%>;
	require.async('home:widget/ecommerce-prompt/ecommerce-prompt-async.js',function(ecommercePrompt){
		ecommercePrompt();
	});
<%/script%>