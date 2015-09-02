<%*   声明对ltr/rtl的css依赖    *%>

<%if $head.dir=='ltr'%>
	<%* inline 热区首屏样式 *%>
	<%style%>
		@import url('/widget/hot-site-metro/ltr/ltr.css?__inline');
	<%/style%>
	<%require name="home:widget/hot-site-metro/ltr/ltr.more.css"%>
	<%if !empty($head.splitHotsite) %>
		<%* inline 热区首屏抽样样式 *%>
		<%style%>
			@import url('/widget/hot-site-metro/small-ltr/small-ltr.css?__inline');
		<%/style%>
	<%/if%>
<%else%>
	<%style%>
		@import url('/widget/hot-site-metro/rtl/rtl.css?__inline');
	<%/style%>
	<%require name="home:widget/hot-site-metro/rtl/rtl.more.css"%>
	<%if !empty($head.splitHotsite) %>
		<%* inline 热区首屏抽样样式 *%>
		<%style%>
			@import url('/widget/hot-site-metro/small-rtl/small-rtl.css?__inline');
		<%/style%>
	<%/if%>
<%/if%>


	<%if $head.dir=='ltr'%>
		<%widget name="home:widget/hot-site-metro/game-history/game-history.tpl"%>
	<%/if%>
	<div class="hotsite_b">
		<div class="hotsite_wrap<%if !empty($head.splitHotsite)%> hotsite_wrap__s<%/if%>" monkey="hotsitesMetro">
			<%if !empty($body.history.show)%>
				<div class="hotsite-tabs metro-hotsite-tabs">
					<a href="javascript:void(0)" class="hotsite-tabs_btn cur" id="hotsiteTab" hidefocus="true"  log-mod="hotsitesMetro"><i class="i-hotsite"></i><%$body.history.hotTab%></a>
					<a href="javascript:void(0)" class="hotsite-tabs_btn" id="historyTab" hidefocus="true"  log-mod="historysites"><i class="i-history"></i><%$body.history.historyTab%>
						<%if empty($body.history.bubbleHidden)%>
							<i class="icon-new_red"></i>
						<%/if%>
					</a>
					<%if !empty($body.notepad) && empty($body.notepad.isHidden)%><%widget name="home:widget/notepad/notepad.tpl"%><%/if%>
				</div>
			<%/if%>
			<div class="hotsite-container favsite-count" id="hotsiteContainer">
				<div class="hotsite hotsite-ele cur" id="hotsite" log-mod="hotsitesMetro">
					<%foreach $body.hotSites.links as $hotSiteCon%>
						<div class="hotsite-metro i-hot-sprites <%$hotSiteCon.ico|default:''%> <%$hotSiteCon.hoverItem|default:''%>Metro <%if !empty($head.splitHotsite) %>smallmetro<%/if%>" <%if !empty($hotSiteCon.hoverItem)%>hoverItem="<%$hotSiteCon.hoverItem%>"<%/if%> <%if !empty($hotSiteCon.ico_url)%> style="background:url(<%$hotSiteCon.ico_url%>) no-repeat left top"<%/if%>>	
							<a class="backlink" href="<%$hotSiteCon.url%>"><span style="display:none"><%$hotSiteCon.name%></span></a>
						</div>
					<%/foreach%>
				</div>
				<%if !empty($body.history.show)%>
					<%widget name="home:widget/history/history.tpl"%>
				<%/if%>
			</div>
		</div>
		<div class="hotsite-custom metro-hotsite-custom" log-mod="customsites">
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
	</div>
	<%script%>

		<%*自定义网站*%>
		conf.customSite={
			tipContent:"<%$body.customSite.tipContent%>",
			btnOk:"<%$body.customSite.btnOk%>",
			btnCan:"<%$body.customSite.btnCan%>",
			defaultIcon:"<%$body.customSite.defaultIcon%>",
			suggestUrl:"<%$body.customSite.suggestUrl%>"
		};
		conf.metro =  <%json_encode($body.hotSites.links)%> ;

		require.async('home:widget/hot-site-metro/hot-site.js');
	<%/script%>
