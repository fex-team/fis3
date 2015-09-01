<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/bottom-ecommerce/ltr/ltr.css"%> <%else%> <%require name="home:widget/bottom-ecommerce/rtl/rtl.css"%> <%/if%>

	<div class="e-searchbox">
		<form class="seller-form" action="" <%if !empty($body.bottomEcommerce.hideform)%>style="display:none;"<%/if%>>
			<span class="seller-input">
				<span class="i-search"></span>
				<input type="text" class="seller-inputtext" name="" autocomplete="off" pl="<%$body.bottomEcommerce.searchTips%>"/>
				<span class="form-params"></span>
			</span>
			<input class="seller-submit ui-btn ui-btn-l" value="<%$body.bottomEcommerce.btnText%>" type="submit">
		</form>
		<div class="e-seller">
			<span class="seller-title"> </span>
			<a href="" class="seller-link"><img class="seller-img" src=""/></a>
		</div>
	</div>
	<div class="frame frame-right">
		<div class="e-goodslist">
			<%foreach $body.bottomEcommerce.tabList as $value%>
				<div class="e-goodslist-con e-goodslist-<%$value.id%>" hasloaded=""></div>	
			<%/foreach%>	 
		</div>
		<div class="e-sellers cf">
			<%foreach $body.bottomEcommerce.tabList as $value%>
				<span class="e-sellerstab <%$value.class%>" tab-id="<%$value.id%>" style="width:<%100/$value@total%>%">
					<span class="border-right"></span>
					<%$value.name%>
					<span class="border-bottom"></span>
					<span class="tab-arrow">
						<b class="ui-arrow ui-arrow-b ui-bubble_out"></b>
						<b class="ui-arrow ui-arrow-b ui-bubble_in"></b>
					</span>
				</span>
			<%/foreach%>	
		</div>
	</div>

<%script%>
	conf.bottomEcommerce = {
		list : <%json_encode($body.bottomEcommerce.tabList)%>,
		duration:"<%$body.bottomEcommerce.autoDuration%>"
	};
	require.async("home:widget/bottom-ecommerce/bottom-ecommerce-async.js", function (bottomEcommerce) {
			bottomEcommerce();
	});
<%/script%>