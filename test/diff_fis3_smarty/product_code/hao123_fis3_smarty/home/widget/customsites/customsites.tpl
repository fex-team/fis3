<%*   声明对ltr/rtl的css依赖    *%>

<%if $head.dir=='ltr'%>
	<%* inline 自定义区首屏样式 *%>
	<%style%>
		@import url('/widget/customsites/ltr/ltr.css?__inline');
	<%/style%>
	<%require name="home:widget/customsites/ltr/ltr.more.css"%>
	<%if !empty($head.splitHotsite) %>
		<%* inline 自定义区首屏抽样样式 *%>
		<%style%>
			@import url('/widget/customsites/small-ltr/small-ltr.css?__inline');
		<%/style%>
	<%/if%>
	<%if !empty($head.flowLayout) %>
		<%* inline 自定义区首屏两种布局样式 *%>
		<%style%>
			@import url('/widget/customsites/flow/ltr/ltr.flow.css?__inline');
		<%/style%>
	<%/if%>
<%else%>
	<%style%>
		@import url('/widget/customsites/rtl/rtl.css?__inline');
	<%/style%>
	<%require name="home:widget/customsites/rtl/rtl.more.css"%>
	<%if !empty($head.splitHotsite) %>
		<%* inline 自定义区首屏抽样样式 *%>
		<%style%>
			@import url('/widget/customsites/small-rtl/small-rtl.css?__inline');
		<%/style%>
	<%/if%>
	<%if !empty($head.flowLayout) %>
		<%* inline 自定义区首屏两种布局样式 *%>
		<%style%>
			@import url('/widget/customsites/flow/rtl/rtl.flow.css?__inline');
		<%/style%>
	<%/if%>
<%/if%>

<div class="hotsite-custom <%if !empty($head.sideBeLeft) && !empty($head.splitHotsite)%> s-mlm<%/if%>" log-mod="customsites">
	<div class="hotsite-custom_bar" id="custom_bar" >
		<a href="javascript:void(0)" hidefocus="true" tabindex="-1" onclick="return false;"></a>
	</div>
	<div class="hotsite-custom_list cf" id="custom_list">
                <span class="custom_item add-btn" id="add-btn">
                 	<i class="add-btn-ico"></i>
                 	<span class="add-btn-txt"><%$body.customSite.addbtnTitle%></span>
                </span>
		<form action="" id="customsite-con" class="box-prompt">
			<div class="box-prompt-inner">
				<label for="website-address"><%$body.customSite.webAddress%></label>
				<input type="text" id="website-address"/>
				<label for="website-name"><%$body.customSite.webName%></label>
				<input type="text" id="website-name"/>
				<div class="btn-con">
					<span class="mod-btn_normal" id="del-btn-ok"><%$body.customSite.btnOk%></span>
					<span class="mod-btn_cancel" id="del-btn-cancel"><%$body.customSite.btnCan%></span>
				</div>
			</div>
		</form>
	</div>
</div>

<%script%>

	<%*自定义网站*%>
	conf.customSite={
		tipContent:"<%$body.customSite.tipContent%>",
		btnOk:"<%$body.customSite.btnOk%>",
		btnCan:"<%$body.customSite.btnCan%>",
		defaultIcon:"<%$body.customSite.defaultIcon%>",
		suggestUrl:"<%$body.customSite.suggestUrl%>",
		showContent:"<%$body.customSite.showContent%>"
	};

	require.async('home:widget/customsites/customsites-async.js');
<%/script%>
